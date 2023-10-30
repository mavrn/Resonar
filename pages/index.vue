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
  filtering: Filter,
  initialLoadReady: Boolean,
});
const emits = defineEmits(['update:searchValue', 'update:initialLoadReady']);
const db = getFirestore();
const route = useRoute();

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
  console.debug('Resolve called while loadedresults is', loadedResults.value);
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
  console.debug('Accepted.');
  processing.value = true;
  const limitedResults = results.value.slice(
    loadedResults.value,
    loadedResults.value + limit
  );
  const currLoaded = loadedResults.value;
  limitedResults.forEach(async (reference, index) => {
    const [collectionPath, documentId] = reference.split('/');
    const documentRef = doc(db, collectionPath, documentId);
    console.debug('Getting doc', documentId);
    const relSnapshot = await getDoc(documentRef);
    const release = new Album(relSnapshot);
    await release.resolve();
    loadedResults.value += 1;
    results.value[currLoaded + index] = release;
    console.debug('Done, populated index', currLoaded + index);
    processing.value = false;
    emits('update:initialLoadReady', true);
  });
};

const updateResultsUnl = async (searchValue, index, sorting, filtering) => {
  loadedResults.value = 0;
  results.value = getResults(index, searchValue, sorting, filtering);
  resolveResults();
};

const updateResults = debounce(updateResultsUnl, 150);

watch(
  () => props.searchValue,
  () => {
    updateResults(
      props.searchValue,
      props.index,
      props.sorting,
      props.filtering
    );
  }
);

watch(
  () => props.index,
  () => {
    updateResults(
      props.searchValue,
      props.index,
      props.sorting,
      props.filtering
    );
  }
);

watch(
  () => props.sorting,
  () => {
    updateResults(
      props.searchValue,
      props.index,
      props.sorting,
      props.filtering
    );
  }
);

watch(props.filtering, () => {
  updateResults(props.searchValue, props.index, props.sorting, props.filtering);
});

onMounted(() => {
  const param = route.query.search;
  if (param) {
    emits('update:searchValue', param);
  }
  updateResults(props.searchValue, props.index, props.sorting, props.filtering);
});
</script>

<style scoped></style>
