<template>
  <div class="not-found-wrapper">
    <p class="not-found-main">404</p>
    <p class="not-found-sub">{{ element }} Not Found</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
    element: String
})
</script>

<style scoped>
.not-found-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.not-found-main {
  padding-top: 100px;
  padding-bottom: 60px;
  font-size: 200px;
}
</style>
