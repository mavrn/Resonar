<script>
import { ref, watch } from "vue";

export default {
  name: "TopBar",
  props: { onSearchValueChange: Function },
  setup() {
    const searchValue = ref("");
    return {
      searchValue,
    };
  },
};
</script>

<template>
  <div class="bg-gray-900 text-white p-4 flex items-center max-h-30">
    <div class="w-1/6">
      <img class="h-16" src="../assets/sonar-logo.png" alt="Logo" />
    </div>
    <div class="w-4/6">
      <input
        type="text"
        v-model="searchValue"
        @input="onSearchValueChange(searchValue)"
        class="w-full bg-gray-800 text-white p-2 rounded h-12 focus:outline-none"
        placeholder="Search..."
      />
    </div>
    <div class="w-1/6 flex space-x-2 justify-end">
      <button class="bg-gray-700 p-2 rounded hover:opacity-70 cursor-pointer">
        Log In
      </button>
      <button class="hover:opacity-70 bg-gray-700 p-2 rounded cursor-pointer">
        Sign Up
      </button>
      <img
        src="../assets/sidebar.png"
        alt="Toggle Sidebar"
        class="hover:opacity-70 cursor-pointer h-10 w-10"
      />
    </div>
  </div>
</template>
