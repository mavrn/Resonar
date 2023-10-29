<template>
  <ResultsGrid :results="results" :isLoading="isLoading" />
</template>

<script setup>
import { getDoc, doc, getFirestore } from 'firebase/firestore';

const results = ref([]);
const isLoading = ref(false);
const props = defineProps({
  searchValue: String,
  isLoggedIn: Boolean,
  index: Array,
  sorting: String,
});
const db = getFirestore();

const updateResultsOld = async (searchValue) => {
  const levels = [0, 1, 2, 3];
  results.value.clear();
  for (const level of levels) {
    const qs = await searchForTerm(searchValue, level);
    qs.docs.forEach(async (doc) => {
      const relSnapshot = await getDoc(doc.data().reference);
      const release = new Album(relSnapshot);
      await release.resolve();
      results.value.set(release.uid, release);
    });
  }
};

const updateResultsUnl = async (searchValue, index, sorting) => {
  results.value = [];
  const response = getResults(index, searchValue, {
    field: sorting,
    order: 'desc',
  });
  response.forEach(async (reference, index) => {
    const [collectionPath, documentId] = reference.split('/');
    const documentRef = doc(db, collectionPath, documentId);
    const relSnapshot = await getDoc(documentRef);
    const release = new Album(relSnapshot);
    await release.resolve();
    console.log(index);
    results.value[index] = release;
    //results.value.push(release);
  });
};

const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    isLoading.value = true;
    timeoutId = setTimeout(() => {
      func(...args);
      isLoading.value = false;
    }, delay);
  };
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
  console.log('f', props.searchValue, props.index);
  updateResults(props.searchValue, props.index);
});
</script>

<style scoped></style>
~/composables/getResults
