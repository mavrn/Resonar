<template>
  <ResultsGrid :results="results" />
</template>

<script setup>
import { getDoc, doc, getFirestore } from 'firebase/firestore';
import { searchForTermLocal } from '~/composables/searchForTemLocal';

const results = ref(new Map());
const props = defineProps({
  searchValue: String,
  isLoggedIn: Boolean,
  index: Array,
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

const updateResults = async (searchValue, index) => {
  results.value.clear();
  searchForTermLocal(index, searchValue).then((response) => {
    response.forEach(async (reference) => {
      console.log(reference);
      const [collectionPath, documentId] = reference.split('/');
      const documentRef = doc(db, collectionPath, documentId);
      const relSnapshot = await getDoc(documentRef);
      const release = new Album(relSnapshot);
      await release.resolve();
      results.value.set(release.uid, release);
    });
  });
};

watch(
  () => props.searchValue,
  (searchValue, old) => {
    updateResults(searchValue, props.index);
  }
);

onMounted(() => {
  updateResults(props.searchValue, props.index);
});
</script>

<style scoped></style>
