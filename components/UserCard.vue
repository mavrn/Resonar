<template>
  <div class="user-card">
    <figure>
      <NuxtLink :to="'/user/' + user?.username" class="figure-link">
        <img v-if="imageData" :src="imageData" alt="" class="figure-image" />
        <Skeleton v-else alt="" class="skeleton" />
      </NuxtLink>
    </figure>
    <div class="user-info-wrapper">
      <div class="user-info-row-1">
        <div class="user-info-row-1-left">
          <strong>
            <NuxtLink class="title" :to="'/user/' + user?.uid">{{
              user?.username
            }}</NuxtLink></strong
          >
        </div>
      </div>
      <div class="user-info-row-2">
        <img
          v-if="isDarkMode"
          class="type-icon"
          src="../assets/person-dm.png"
        />
        <img v-else class="type-icon" src="../assets/person-lm.png" />
        <span>User</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  user: User,
  isDarkMode: Boolean,
});
const imageData = ref<string | null>(null);
onMounted(async () => {
  imageData.value = await loadImage(props.user?.picture);
});
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
  cursor: pointer;
}

.user-card {
  font-size: 15px;
  transition: all 0.3s;
}

Figure {
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  display: block;
  transition: all 0.3s;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
}

Figure:hover {
  opacity: 85%;
  transform: scale(1.01);
}

.figure-link {
  display: block;
  color: black;
}

.figure-image {
  aspect-ratio: 1;
  width: 100%;
  height: auto;
  object-fit: cover;
  border: none;
  display: block;
}

.user-info-row-1 {
  display: flex;
  padding-top: 4px;
}

.user-info-row-1-left {
  flex: 1;
  display: flex;
  align-items: flex-end;
  padding-left: 5px;
  font-size: 18px;
}
.user-info-row-2 {
  display: flex;
  align-items: center;
  padding-left: 4px;
  font-size: 13px;
  opacity: 60%;
  gap: 4px;
}

.type-icon {
  width: 13px;
  height: 13px;
}

.skeleton {
  aspect-ratio: 1;
  width: 100% !important;
  height: auto !important;
  object-fit: cover;
  border: none;
  display: block;
}
</style>
