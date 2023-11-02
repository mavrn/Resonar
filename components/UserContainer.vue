<template>
  <UserActivity
    v-if="selectedComponent == 'User Activity'"
    :user="user"
  ></UserActivity>
  <UserInfo v-if="selectedComponent == 'User Info'" :user="user"></UserInfo>
  <UserSettings
    v-if="selectedComponent == 'Account Settings'"
    :user="user"
  ></UserSettings>
  <UserRatings
    v-if="selectedComponent == 'Rated Releases'"
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
