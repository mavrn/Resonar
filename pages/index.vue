<template>
  <ResultsGrid :results="resultList" />
</template>

<script setup>
import { getDoc } from 'firebase/firestore';

const resultList = ref([]);
const props = defineProps({
  searchValue: String,
  isLoggedIn: Boolean,
});

const updateResults = async (searchValue) => {
  resultList.value = [];
  const qs = await searchForTerm(searchValue);
  await Promise.all(
    qs.docs.map(async (doc) => {
      const relSnapshot = await getDoc(doc.data().reference);
      const release = new Album(relSnapshot);
      resultList.value.push(await release.resolve());
    })
  );
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
