<template>
  <ResultsGrid
    :results="results"
    :update="resolveResults"
    :loadedResults="loadedResults"
  />
</template>

<script setup>
import { getDoc, doc } from 'firebase/firestore';
import { useFilteringStore } from '../store/filtering';

const db = useFirestore();
const filteringStore = useFilteringStore();
const { filtering } = filteringStore;

const limit = 20;
const results = ref([]);
const loadedResults = ref(0);
const processing = ref(false);
const props = defineProps({
  searchValue: String,
  index: Array,
  sorting: Object,
  remoteIndexLoaded: Boolean,
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
      let newItem;
      if (result.type == 'artist') {
        newItem = new Artist();
        newItem.resolveAllLocal(documentId, result.picture, result.name);
      } else if (result.type == 'user') {
        newItem = new User();
        newItem.resolveAllLocal(documentId, result.name, result.picture);
      } else {
        newItem = new Release();
        newItem.resolveAllLocal(
          documentId,
          result.artist,
          result.name,
          result.cover,
          result.year,
          result.rating,
          result.type
        );
        newItem.resolveArtist();
      }

      loadedResults.value += 1;
      results.value[currLoaded + index] = newItem;
      console.debug('Done, populated index', currLoaded + index);
      processing.value = false;
    });
  } else {
    limitedResults.forEach(async (result, index) => {
      const [collectionPath, documentId] = result.reference.split('/');
      const documentRef = doc(db, collectionPath, documentId);
      console.debug('Getting Doc', documentId);
      const relSnapshot = await getDoc(documentRef);
      let newItem;
      if (result.type == 'artist') {
        newItem = new Artist(relSnapshot);
      } else if (result.type == 'user') {
        newItem = new User();
        newItem.resolveAllLocal(documentId, result.name, result.picture);
      } else {
        newItem = new Release(relSnapshot);
        newItem.resolveArtistLocal(result.artist);
        newItem.resolveArtist();
      }
      loadedResults.value += 1;
      results.value[currLoaded + index] = newItem;
      console.debug('Done, populated index', currLoaded + index);
      processing.value = false;
    });
  }
};

const updateResultsUnl = async (searchValue, index, sorting) => {
  loadedResults.value = 0;
  results.value = getResults(index, searchValue, sorting, filtering);
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

watch(filtering, () => {
  updateResults(props.searchValue, props.index, props.sorting);
});

const probeConnection = async () => {
  const exampleDoc = doc(db, 'users', 'LYe0RNkQj3QYj2ojlpcYHryd4h43');
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
  updateResults(props.searchValue, props.index, props.sorting);
});
</script>

<style scoped></style>
