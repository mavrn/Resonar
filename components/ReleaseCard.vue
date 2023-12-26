<template>
  <div class="release-card">
    <figure>
      <NuxtLink :to="'/release/' + release?.uid" class="figure-link">
        <img :src="release?.cover" alt="" class="figure-image" ref="image" />
      </NuxtLink>
    </figure>
    <div class="release-info-wrapper">
      <div class="release-info-row-1">
        <strong>
          <NuxtLink :to="'/release/' + release?.uid"
            ><span class="title">{{ release?.name }}</span></NuxtLink
          ></strong
        >
      </div>
      <div class="release-info-row-2">
        <NuxtLink class="artist-name" :to="'/artist/' + release?.artist?.uid">{{
          release?.artist?.name
        }}</NuxtLink>
      </div>
      <div class="release-info-row-3">
        <img
          v-if="release?.type === 'album'"
          class="type-icon"
          src="../assets/album.png"
        />
        <img v-else class="type-icon" src="../assets/single.png" />
        <span
          >{{ toTitleCase(release?.type) }} |
          {{
            release && release.genres && release.genres[0]
              ? release.genres[0]
              : 'N/A'
          }}
          | {{ getYear(release?.date) }}</span
        >
      </div>
      <div class="release-info-col-1">
        <div class="rating-container">
          {{ release?.rating.toFixed(1) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Timestamp } from 'firebase/firestore';

const image = ref<null | HTMLElement>(null);

function getYear(date: number | Timestamp | Date) {
  if (typeof date === 'number') {
    return date;
  } else if (date instanceof Date) {
    return date.getFullYear();
  } else if (date instanceof Timestamp) {
    return date.toDate().getFullYear();
  } else {
    return '';
  }
}

const updateWidth = () => {
  if (image.value) {
    document.documentElement.style.setProperty(
      '--image-width',
      `${image.value.offsetWidth * 0.8}px`
    );
  }
};

onMounted(() => {
  updateWidth();
  window.addEventListener('resize', updateWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWidth);
});

const props = defineProps({
  release: Object,
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
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
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

.release-info-wrapper {
  display: grid;
  grid-template-columns: 1fr 0.2fr;
  grid-template-rows: 1fr 0.9fr 0.3fr;
  max-width: 100%;
}

.release-info-row-1 {
  grid-area: 1 / 1 / 2 / 2;
  display: flex;
  padding-top: 4px;
  padding-left: 5px;
  font-size: 18px;
  max-width: 100%;
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  max-width: var(--image-width);
}

.release-info-row-2 {
  grid-area: 2 / 1 / 3 / 2;
  display: flex;
  flex: 1;
  display: flex;
  align-items: center;
  padding-left: 1px;
  font-size: 16px;
}

.release-info-row-3 {
  padding-left: 6px;
  padding-right: 10px;
  grid-area: 3 / 1 / 4 / 2;
  display: flex;
  font-size: 13px;
  align-items: center;
  opacity: 60%;
  gap: 3px;
}

.release-info-col-1 {
  grid-area: 1 / 2 / 4 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.type-icon {
  width: 13px;
  height: 13px;
}

.artist-name {
  padding-left: 4px;
}

.rating-container {
  height: 45px;
  width: 45px;
  border-radius: 50%;
  border-style: solid;
  border-width: 2px;
  border-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}
</style>
