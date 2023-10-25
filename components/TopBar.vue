<script setup lang="ts">
const searchValue = ref('');
import type { DocumentData } from 'firebase/firestore';
const props = defineProps({
  onSearchValueChange: Function,
  handleSignOut: Function,
  isLoggedIn: Boolean,
  user: Object as DocumentData | null,
});
</script>
<template>
  <div class="bg-gray-900 text-white p-4 flex items-center max-h-30">
    <NuxtLink class="w-1/6" to="/">
      <img class="h-14" src="../assets/sonar-logo.png" alt="Logo" />
    </NuxtLink>
    <div class="w-4/6 flex">
      <input
        type="text"
        v-model="searchValue"
        @input="onSearchValueChange?.(searchValue)"
        class="w-full bg-gray-800 text-white p-2 rounded-lg h-12 focus:outline-none"
        placeholder="Search..."
      />
    </div>
    <div v-if="!isLoggedIn" class="w-1/6 flex space-x-2 justify-end">
      <NuxtLink
        class="bg-gray-700 p-2 rounded hover:opacity-70 cursor-pointer"
        to="/sign-in"
      >
        Log In
      </NuxtLink>
      <NuxtLink
        class="hover:opacity-70 bg-gray-700 p-2 rounded cursor-pointer"
        to="register"
      >
        Sign Up
      </NuxtLink>
      <img
        src="../assets/sidebar.png"
        alt="Toggle Sidebar"
        class="hover:opacity-70 cursor-pointer h-10 w-10"
      />
    </div>
    <div
      v-if="isLoggedIn"
      class="w-1/6 flex space-x-6 justify-end items-center"
    >
      <NuxtLink v-if="user" class="w-1/6" :to="'/user/' + user['username']">
        <img class="h-10 rounded-full" :src="user['profilePicture']" /><img
      /></NuxtLink>
      <v-btn variant="tonal" class="text-subtitle-1" @click="handleSignOut?.()"
        >Sign Out</v-btn
      >
      <img
        src="../assets/sidebar.png"
        alt="Toggle Sidebar"
        class="hover:opacity-70 cursor-pointer h-10 w-10"
      />
    </div>
  </div>
</template>
