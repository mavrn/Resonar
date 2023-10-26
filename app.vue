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
const userProfile = ref<DocumentData | null>(null);

let auth: Auth;

const albums = ref<QueryDocumentSnapshot[]>([]);
const isLoggedIn = ref(false);

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      userProfile.value = useDocument(doc(collection(db, 'users'), user.uid));
    } else {
      isLoggedIn.value = false;
    }
  });
});

const handleSearchValueChange = (newQuery: string) => {
  searchTerm.value = newQuery;
  router.push({
    path: '/',
    query: { search: encodeURIComponent(searchTerm.value) },
  });
};

const handleSetFilter = (newFilter: typeof Filter) => {};

const handleSignOut = async () => {
  signOut(auth);
};

provide('handleSearchValueChange', handleSearchValueChange);
</script>

<template>
  <TopBar
    :onSearchValueChange="handleSearchValueChange"
    :isLoggedIn="isLoggedIn"
    :handleSignOut="handleSignOut"
    :user="userProfile?.value"
  />
  <NuxtPage></NuxtPage>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Agbalumo&display=swap');
</style>
