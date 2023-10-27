<template>
  <div class="release-card">
    <figure>
      <NuxtLink :to="'/album/' + release?.uid" class="figure-link">
        <img :src="release?.cover" alt="" class="figure-image" />
      </NuxtLink>
    </figure>
    <div class="release-info-wrapper">
      <div class="release-info-left">
        <div class="release-info-row">
          <strong>
            <NuxtLink class="title" :to="'/album/' + release?.uid">{{
              release?.title
            }}</NuxtLink></strong
          >
          <small v-if="!isTooLong" class="seperator">by</small>
          <strong>
            <NuxtLink
              v-if="!isTooLong"
              class="artist"
              :to="'/artist/' + release?.artist?.uid"
              >{{ release?.artist?.name }}</NuxtLink
            ></strong
          >
        </div>
      </div>
      <div class="release-info-right">
        <div class="rating-container">
          <span class="rating">{{ release?.score }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  release: Album,
});

const isTooLong = ref(false);

onMounted(() => {
  if (props.release && props.release.artist) {
    isTooLong.value =
      (props.release.title + props.release.artist.name).length > 30;
  }
});
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
  cursor: pointer;
}

.release-card {
  font-size: 15px;
}

Figure {
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  display: block;
  transition: all 0.3s;
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

.release-info-wrapper {
  display: flex;
  flex-wrap: wrap;
  padding-top: 16px;
}

.release-info-left {
  flex: 1;
  display: flex;
  align-items: center;
  padding-left: 5px;
}

.release-info-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nowrap {
  white-space: nowrap;
}
.release-info-right {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
  padding-left: 20px;
}

.rating-container {
  height: 35px;
  width: 35px;
  border-radius: 50%;
  border-style: solid;
  border-width: 2px;
  border-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
}

.rating {
  font-size: 14px;
}
</style>
