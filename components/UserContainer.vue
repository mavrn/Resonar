<template>
  <UserActivity
    v-if="selectedComponent == 'Activity'"
    :user="user"
  ></UserActivity>
  <UserInfo v-if="selectedComponent == 'Info'" :user="user"></UserInfo>
  <UserSettings
    v-if="selectedComponent == 'Account Settings'"
    :user="user"
  ></UserSettings>
  <UserRatings
    v-if="selectedComponent == 'Ratings'"
    :user="user"
  ></UserRatings>
</template>

<script setup lang="ts">
defineProps({
  user: User,
  selectedComponent: String,
});
</script>

<style scoped></style>
