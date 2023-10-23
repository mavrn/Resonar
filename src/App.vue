<script setup>
import {
  QueryDocumentSnapshot,
  collection,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from './main';
import { ref, onMounted } from 'vue';
import { default as TopBar } from './components/TopBar.vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import router from './router';
const searchTerm = ref('');

const albums = ref([]);
const isLoggedIn = ref(false);

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, 'albums'));
  querySnapshot.forEach((doc) => {
    albums.value.push(doc.id);
  });
});

let auth;
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

const handleSearchValueChange = (newVal) => {
  searchTerm.value = newVal;
};
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
  <div class="p-4 bg-gray-700 min-h-screen"><router-view></router-view></div>
</template>
