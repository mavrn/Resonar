<template>
  <ResultsGrid
    :results="results"
    :update="resolveResults"
    :loadedResults="loadedResults"
  />
</template>

<script setup>
import { getDoc, doc } from 'firebase/firestore';

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
  remoteIndexLoaded: Boolean,
  db: Object,
});
const emits = defineEmits(['update:searchValue']);
const route = useRoute();
const connectionIsReady = ref(false);

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
  let local;
  if (!props.remoteIndexLoaded) {
    console.debug(
      'Showing local results. Reason: Index not yet fetched from remote.'
    );
    local = true;
  } else if (!connectionIsReady.value) {
    console.debug(
      'Showing local results. Reason: Firebase connection still initializing.'
    );
    local = true;
  } else {
    console.debug('Showing remote results.');
    local = false;
  }
  processing.value = true;
  const limitedResults = results.value.slice(
    loadedResults.value,
    loadedResults.value + limit
  );
  const currLoaded = loadedResults.value;
  if (local) {
    limitedResults.forEach(async (result, index) => {
      const [collectionPath, documentId] = result.reference.split('/');
      console.debug('Getting Release locally', documentId);
      const release = new Album();
      release.resolveLocal(
        documentId,
        result.artist,
        result.name,
        result.cover,
        result.year,
        result.score
      );
      loadedResults.value += 1;
      results.value[currLoaded + index] = release;
      console.debug('Done, populated index', currLoaded + index);
      processing.value = false;
    });
  } else {
    limitedResults.forEach(async (result, index) => {
      const [collectionPath, documentId] = result.reference.split('/');
      const documentRef = doc(props.db, collectionPath, documentId);
      console.debug('Getting Doc', documentId);
      const relSnapshot = await getDoc(documentRef);
      const release = new Album(relSnapshot);
      release.resolveArtistLocal(result.artist);
      loadedResults.value += 1;
      results.value[currLoaded + index] = release;
      console.debug('Done, populated index', currLoaded + index);
      processing.value = false;
    });
  }
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

const probeConnection = async () => {
  const exampleDoc = doc(props.db, 'users', 'LYe0RNkQj3QYj2ojlpcYHryd4h43');
  getDoc(exampleDoc).then(() => {
    connectionIsReady.value = true;
    console.debug('Firebase initialized.');
  });
};

onMounted(() => {
  probeConnection();
  const param = route.query.search;
  if (param) {
    emits('update:searchValue', param);
  }
  updateResults(props.searchValue, props.index, props.sorting, props.filtering);
});
</script>

<style scoped></style>
