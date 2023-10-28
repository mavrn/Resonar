<template>
  <ResultsGrid :results="results" />
</template>

<script setup>
import { getDoc } from 'firebase/firestore';

const results = ref(new Map());
const props = defineProps({
  searchValue: String,
  isLoggedIn: Boolean,
});

const updateResults = async (searchValue) => {
  const levels = [0];
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

watch(
  () => props.searchValue,
  (searchValue, old) => {
    updateResults(searchValue);
  }
);

onMounted(() => {
  updateResults(props.searchValue);
});
</script>

<style scoped></style>
