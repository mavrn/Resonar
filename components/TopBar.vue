<script setup lang="ts">
import type { DocumentData } from 'firebase/firestore';
const props = defineProps({
  onSearchValueChange: Function,
  handleSignOut: Function,
  isLoggedIn: Boolean,
  user: Object as DocumentData | null,
});
const searchValue = ref('');
</script>
<template>
  <div class="bg-primarylight text-white p-4 flex items-center h-[12vh]">
    <NuxtLink class="w-1/6" to="/">
      <img class="h-14" src="../assets/sonar-logo.png" alt="Logo" />
    </NuxtLink>
    <div class="w-4/6 flex">
      <input
        type="text"
        @input="onSearchValueChange?.(searchValue)"
        v-model="searchValue"
        class="w-full bg-white text-black p-2 rounded-lg h-12 focus:outline-none"
        placeholder="Search..."
      />
    </div>
    <div v-if="!isLoggedIn" class="w-1/6 flex space-x-2 justify-end">
      <NuxtLink
        class="bg-white p-2 rounded hover:opacity-70 cursor-pointer"
        to="/login"
      >
        Log In
      </NuxtLink>
      <NuxtLink
        class="hover:opacity-70 bg-white p-2 rounded cursor-pointer"
        to="register"
      >
        Sign Up
      </NuxtLink>
    </div>
    <div
      v-if="isLoggedIn"
      class="w-1/6 flex space-x-6 justify-end items-center"
    >
      <NuxtLink
        v-if="user"
        class="flex items-center bg-white p-2 rounded-md hover:opacity-70 space-x-2 pr-3"
        :to="'/user/' + user['username']"
        ><img class="w-5 h-5" src="../assets/user.png" /><span>{{
          user.username
        }}</span>
      </NuxtLink>
      <button
        class="bg-white p-2 rounded-md hover:opacity-70"
        @click="handleSignOut?.()"
      >
        Sign Out
      </button>
    </div>
  </div>
</template>
