<script setup lang="ts">
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getDocs, collection } from 'firebase/firestore';

const albums: Ref<string[]> = ref([]);
const isLoggedIn = ref(false);
const searchTerm = ref('');
const filterSettings = ref(Filter);
const sorting = ref('popular');
const router = useRouter();
const db = useFirestore();
let auth: Auth;

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, 'albums'));
  querySnapshot.forEach((doc) => {
    albums.value.push(doc.id);
  });
});

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  });
});

const handleSearchValueChange = (newQuery: string) => {
  searchTerm.value = newQuery;
  router.replace({ query: { search: encodeURIComponent(searchTerm.value) } });
};

const handleSetFilter = (newFilter: typeof Filter) => {};

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push('/');
  });
};
</script>

<template>
  <TopBar
    :onSearchValueChange="handleSearchValueChange"
    :isLoggedIn="isLoggedIn"
    :handleSignOut="handleSignOut"
  />
  <div class="p-2 flex space-x-2 bg-gray-700 min-h-screen">
    <NuxtPage></NuxtPage>
  </div>
</template>
