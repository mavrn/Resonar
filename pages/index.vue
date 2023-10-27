<template>
  <ResultsGrid :results="resultList" />
</template>

<script setup>
import { getDoc } from 'firebase/firestore';

const resultList = ref([]);
const refreshKey = ref(0);
const props = defineProps({
  searchValue: String,
  isLoggedIn: Boolean,
});

const updateResults = async (searchValue) => {
  resultList.value = [];
  const qs = await searchForTerm(searchValue);
  qs.docs.forEach(async (doc) => {
    const relSnapshot = await getDoc(doc.data().reference);
    const release = new Album(relSnapshot);
    await release.resolve()
    resultList.value.push(release);
  });
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
