<template>
  <div class="attribute-wrapper">
    <p v-if="user?.bio && user?.bio != ''" class="user-bio-wrapper">
      <i class="material-icons">edit</i>
      <span class="attribute-content">{{ user?.bio }}</span>
    </p>
    <p class="user-attribute">
      <i class="material-icons">person</i
      ><span class="attribute-name">Username</span
      ><span class="attribute-content">{{ user?.username }}</span>
    </p>
    <p class="user-attribute">
      <i class="material-icons">calendar_month</i
      ><span class="attribute-name">Member since </span
      ><span class="attribute-content">{{ user?.created }}</span>
    </p>
    <p class="user-attribute">
      <i class="material-icons">star</i
      ><span class="attribute-name">Releases rated</span
      ><span class="attribute-content">{{ user?.ratings.length }}</span>
    </p>
    <p class="user-attribute">
      <i class="material-icons">hotel_class</i
      ><span class="attribute-name">Ø Rating</span
      ><span class="attribute-content">{{ user?.getAverageRating() }}</span>
    </p>
    <p class="user-attribute">
      <i class="material-icons">forum</i
      ><span class="attribute-name">Times commented</span
      ><span class="attribute-content">{{ user?.comments.length }}</span>
    </p>
    <p class="user-attribute">
      <i class="material-icons">location_on</i
      ><span class="attribute-name">Location</span
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
  width: clamp(300px, 80%, 400px);
  padding-left: 15px;
  padding-right: 15px;
}
.user-attribute {
  display: flex;
  align-items: center;
  font-size: 20px;
  padding-top: 12px;
  justify-content: space-between;
}

i {
  opacity: 0.4;
}
.attribute-name {
  padding-left: 10px;
  text-align: left;
  flex: 1;
  font-size: 17px;
  opacity: 0.6;
}

.user-bio-wrapper {
  display: flex;
  flex-direction: column;
  gap: 9px;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.attribute-content {
  justify-self: right;
  flex: 0 0 auto;
}
</style>
