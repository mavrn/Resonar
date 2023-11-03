<template>
  <div class="release-card">
    <figure>
      <NuxtLink :to="'/release/' + release?.uid" class="figure-link">
        <img :src="release?.cover" alt="" class="figure-image" />
      </NuxtLink>
    </figure>
    <div class="release-info-wrapper">
      <div class="release-info-row-1">
        <div class="release-info-row-1-left">
          <strong>
            <NuxtLink class="title" :to="'/release/' + release?.uid">{{
              release?.title
            }}</NuxtLink></strong
          >
        </div>
      </div>
      <div class="release-info-row-2">
        <div class="release-info-row-2-left">
          <NuxtLink
            class="artist-name"
            :to="'/artist/' + release?.artist?.uid"
            >{{ release?.artist?.name }}</NuxtLink
          >
        </div>
      </div>
      <div class="release-info-row-3">
        <img class="type-icon" src="../assets/album.png" />
        <span>Album | Rock</span>
      </div>
      <div class="release-info-col-1">
        <div class="rating-container">
          {{ release?.rating }}
        </div>
      </div>
      <div class="release-info-row-4">
        <span>{{ release?.date }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  release: Album,
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
  transition: all 0.3s;
}

Figure {
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  display: block;
  transition: all 0.3s;
}

Figure:hover {
  opacity: 85%;
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
  display: grid;
  grid-template-columns: 1fr 0.2fr;
  grid-template-rows: 1fr 0.9fr 0.3fr;
}

.release-info-row-1 {
  grid-area: 1 / 1 / 2 / 2;
  display: flex;
  padding-top: 4px;
}

.release-info-row-1-left {
  flex: 1;
  display: flex;
  align-items: flex-end;
  padding-left: 5px;
  font-size: 18px;
}
.release-info-row-2 {
  grid-area: 2 / 1 / 3 / 2;
  display: flex;
}

.release-info-row-3 {
  padding-left: 8px;
  padding-right: 10px;
  grid-area: 3 / 1 / 4 / 2;
  display: flex;
  font-size: 13px;
  align-items: center;
  opacity: 60%;
  gap: 3px;
}

.release-info-col-1 {
  grid-area: 1 / 2 / 3 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.release-info-row-4 {
  grid-area: 3 / 2 / 4 / 3;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  font-size: 13px;
  opacity: 60%;
}

.release-info-row-2-left {
  flex: 1;
  display: flex;
  align-items: center;
  padding-left: 1px;
  font-size: 16px;
}

.type-icon {
  width: 13px;
  height: 13px;
}

.artist-name {
  padding-left: 4px;
}

.rating-container {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  border-style: solid;
  border-width: 2px;
  border-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 17px;
}
</style>
