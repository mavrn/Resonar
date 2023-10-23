<script setup>
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDocs, collection } from 'firebase/firestore';

const albums = ref([]);
const isLoggedIn = ref(false);
const searchTerm = ref('');
const router = useRouter();
const db = useFirestore();
let auth;

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
  <div class="p-4 bg-gray-700 min-h-screen">
    <span>{{ searchTerm }}</span
    ><NuxtPage></NuxtPage>
  </div>
</template>