<script setup>
const searchValue = ref('');
const props = defineProps({
  onSearchValueChange: Function,
  handleSignOut: Function,
  isLoggedIn: Boolean,
});
</script>

<template>
  <div class="bg-gray-900 text-white p-4 flex items-center max-h-30">
    <NuxtLink class="w-1/6" to="/">
      <img class="h-16" src="../assets/sonar-logo.png" alt="Logo" />
    </NuxtLink>
    <div class="w-4/6">
      <input
        type="text"
        v-model="searchValue"
        @input="onSearchValueChange(searchValue)"
        class="w-full bg-gray-800 text-white p-2 rounded h-12 focus:outline-none"
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
    <div v-if="isLoggedIn" class="w-1/6 flex space-x-2 justify-end">
      <button @click="handleSignOut">Sign Out</button>
      <img
        src="../assets/sidebar.png"
        alt="Toggle Sidebar"
        class="hover:opacity-70 cursor-pointer h-10 w-10"
      />
    </div>
  </div>
</template>
