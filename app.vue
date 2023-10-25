<script setup lang="ts">
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { getDocs, collection, getDoc, doc } from 'firebase/firestore';

const searchTerm = ref('');
const filterSettings = ref(Filter);
const sorting = ref('popular');
const router = useRouter();
const db = useFirestore();

let auth: Auth;

const albums = ref<QueryDocumentSnapshot[]>([]);
const isLoggedIn = ref(false);

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      router.push('./');
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

const handleSignOut = async () => {
  signOut(auth);
};
</script>

<template>
  <TopBar
    :onSearchValueChange="handleSearchValueChange"
    :isLoggedIn="isLoggedIn"
    :handleSignOut="handleSignOut"
  />
  <div class="p-2 space-x-2 bg-gray-700 min-h-screen">
    <NuxtPage></NuxtPage>
  </div>
</template>
