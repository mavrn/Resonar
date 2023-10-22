<script setup>
import {
  QueryDocumentSnapshot,
  collection,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "./main";
import { ref, onMounted } from "vue";
import { default as TopBar } from "./components/TopBar.vue";
const searchTerm = ref("");

const albums = ref([]);

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, "albums"));
  querySnapshot.forEach((doc) => {
    albums.value.push(doc.id);
  });
});

const handleSearchValueChange = (newVal) => {
  searchTerm.value = newVal;
};
</script>

<template>
  <TopBar :onSearchValueChange="handleSearchValueChange" />
  <div class="p-4 bg-gray-700 min-h-screen">
    <span>{{ searchTerm }}</span>
  </div>
</template>
