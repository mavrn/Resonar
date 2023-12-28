<template>
  <div class="artist-card">
    <figure>
      <NuxtLink :to="'/artist/' + artist?.uid" class="figure-link">
        <img :src="artist?.avatar" alt="" class="figure-image" />
      </NuxtLink>
    </figure>
    <div class="artist-info-wrapper">
      <div class="artist-info-row-1">
        <div class="artist-info-row-1-left">
          <strong>
            <NuxtLink class="title" :to="'/artist/' + artist?.uid">{{
              artist?.name
            }}</NuxtLink></strong
          >
        </div>
      </div>
      <div class="artist-info-row-2">
        <img class="type-icon" :src="getPicName('mic', isDarkMode)" />
        <span>Artist</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Artist } from '#imports';
defineProps({
  artist: Artist,
  isDarkMode: Boolean,
});
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
  cursor: pointer;
}

.artist-card {
  font-size: 15px;
  transition: all 0.3s;
}

Figure {
  border-radius: 45%;
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

.artist-info-row-1 {
  display: flex;
  padding-top: 4px;
}

.artist-info-row-1-left {
  flex: 1;
  display: flex;
  align-items: flex-end;
  padding-left: 5px;
  font-size: 18px;
}
.artist-info-row-2 {
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
</style>
