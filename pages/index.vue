<template>
  <div
    v-if="results.length == 0 && doneFlag && remoteIndexLoaded"
    class="not-found-text"
  >
    No results found.
  </div>
  <Loading v-else-if="loadedResults == 0" />
  <ResultsGrid
    v-else
    :results="results"
    :update="resolveResults"
    :loadedResults="loadedResults"
    :isDarkMode="isDarkMode"
  />
</template>

<script setup>
import { getDoc, doc } from 'firebase/firestore';
import { useFilteringStore } from '../store/filtering';

const db = useFirestore();
const filteringStore = useFilteringStore();
import { useUserStore } from '../store/currentUser';
const { filtering } = filteringStore;

const { currentUser } = storeToRefs(useUserStore());
const limit = 20;
const results = ref([]);
const loadedResults = ref(0);
const processing = ref(false);
const doneFlag = ref(false);
const props = defineProps({
  searchValue: String,
  index: Array,
  remoteIndexLoaded: Boolean,
  isDarkMode: Boolean,
});
const emits = defineEmits(['update:searchValue']);
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

/**
 * Resolves all results until a certain limit. Called on infinite scroll.
 * Some functions in this functions are not strictly necessary anymore, as results are exclusively resolved locally now.
 * Previously, each result would be fetched from the DB before displaying.
 */
const resolveResults = async () => {
  doneFlag.value = false;
  console.debug('Resolve called while loadedresults is', loadedResults.value);
  //some checks to ensure this function is not called too often or in a faulty way
  if (processing.value) {
    console.debug('Rejected. Reason: Still preprocessing.');
    return;
  }
  if (loadedResults.value == results.value.length) {
    console.debug('Rejected. Reason: All results loaded already.');
    doneFlag.value = true;
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
  limitedResults.forEach((result, index) => {
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
        result.type,
        result.genres,
        result.artistName
      );
    }
    loadedResults.value += 1;
    doneFlag.value = true;
    results.value[currLoaded + index] = newItem;
    console.debug('Done, populated index', currLoaded + index);
    processing.value = false;
  });
};

/**
 * Update function, called any filter options or query changes. Filters and displays index.
 * @param {String} searchValue Search query
 * @param {Object[]} index Search index
 */
const updateResultsUnl = async (searchValue, index) => {
  loadedResults.value = 0;
  if (index.length == 0) {
    return;
  }
  results.value = await getResults(
    db,
    index,
    searchValue,
    filtering,
    currentUser.value
  );
  resolveResults();
};

const updateResults = debounce(updateResultsUnl, 150);


//all watchers for updating the results list
watch(
  () => props.searchValue,
  () => {
    updateResults(props.searchValue, props.index);
  }
);

watch(
  () => props.index,
  () => {
    updateResults(props.searchValue, props.index);
  }
);

watch(filtering, () => {
  updateResults(props.searchValue, props.index);
});

onMounted(() => {
  const param = route.query.search;
  if (param) {
    emits('update:searchValue', param);
  }
  updateResults(props.searchValue, props.index, props.sorting);
});
</script>

<style scoped>
.not-found-text {
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 100px;
}
</style>
