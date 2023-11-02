<template>
  <div class="attribute-wrapper">
    <p class="user-attribute">
      <i class="material-icons">person</i
      ><span class="attribute-name">Username: </span
      ><span class="attribute-content">{{ user?.username }}</span>
    </p>
    <p class="user-attribute">
      <i class="material-icons">calendar_month</i
      ><span class="attribute-name">Created: </span
      ><span class="attribute-content">{{ user?.created }}</span>
    </p>
    <p class="user-attribute">
      <i class="material-icons">star</i
      ><span class="attribute-name">Releases rated: </span
      ><span class="attribute-content">{{ user?.ratings.length }}</span>
    </p>
    <p class="user-attribute">
      <i class="material-icons">hotel_class</i
      ><span class="attribute-name">Average Rating: </span
      ><span class="attribute-content">{{ user?.getAverageRating() }}</span>
    </p>
    <p class="user-attribute">
      <i class="material-icons">forum</i
      ><span class="attribute-name">Comments made: </span
      ><span class="attribute-content">{{ user?.comments.length }}</span>
    </p>
    <p class="user-attribute">
      <i class="material-icons">location_on</i
      ><span class="attribute-name">Location: </span
      ><span class="attribute-content">{{ user?.location }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  user: User,
});
</script>

<style scoped>
.attribute-wrapper {
  padding-left: 20px;
}
.user-attribute {
  display: flex;
  align-items: center;
  font-size: 18px;
  padding-top: 10px;
}

.attribute-name {
  padding-left: 10px;
}

.attribute-content {
  padding-left: 10px;
}
</style>
