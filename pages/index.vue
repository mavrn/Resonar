<template>
  <ResultsGrid
    :results="results"
    :update="resolveResults"
    :loadedResults="loadedResults"
  />
</template>

<script setup>
import { getDoc, doc, getFirestore } from 'firebase/firestore';

const limit = 12;
const results = ref([]);
const loadedResults = ref(0);
const processing = ref(false);
const props = defineProps({
  searchValue: String,
  isLoggedIn: Boolean,
  index: Array,
  sorting: Object,
});
const db = getFirestore();

const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const resolveResults = async () => {
  console.debug('resolve called while loadedresults', loadedResults.value);
  if (processing.value) {
    console.debug('Rejected. Reason: Still preprocessing.');
    return;
  }
  if (loadedResults.value == results.value.length) {
    console.debug('Rejected. Reason: All results loaded already.');
    return;
  }
  if (loadedResults.value % limit != 0) {
    console.debug('Rejected. Reason: Still processing some docs.');
    return;
  }
  console.debug('accepted.');
  processing.value = true;
  const limitedResults = results.value.slice(
    loadedResults.value,
    loadedResults.value + limit
  );
  const currLoaded = loadedResults.value;
  limitedResults.forEach(async (reference, index) => {
    const [collectionPath, documentId] = reference.split('/');
    const documentRef = doc(db, collectionPath, documentId);
    console.debug('getting doc...');
    const relSnapshot = await getDoc(documentRef);
    console.debug('making album...');
    const release = new Album(relSnapshot);
    console.debug('resolving artist...');
    await release.resolve();
    loadedResults.value += 1;
    results.value[currLoaded + index] = release;
    console.debug('Done, populated index', currLoaded + index);
    processing.value = false;
  });
};

const updateResultsUnl = async (searchValue, index, sorting) => {
  loadedResults.value = 0;
  results.value = getResults(index, searchValue, sorting);
  resolveResults();
};

const updateResults = debounce(updateResultsUnl, 150);

watch(
  () => props.searchValue,
  () => {
    updateResults(props.searchValue, props.index, props.sorting);
  }
);

watch(
  () => props.index,
  () => {
    updateResults(props.searchValue, props.index, props.sorting);
  }
);

watch(
  () => props.sorting,
  () => {
    updateResults(props.searchValue, props.index, props.sorting);
  }
);

onMounted(() => {
  updateResults(props.searchValue, props.index, props.sorting);
});
</script>

<style scoped></style>
