<template>
  <section>
    <div class="block">
      <div class="inner">
        <ul class="grid-releases">
          <li
            v-if="isLoading"
            class="release-item col-3"
            v-for="i in results.length"
            :key="i"
          >
            <Skeleton class="skeleton"></Skeleton>
          </li>
          <li
            v-if="!isLoading"
            v-for="(album, index) in results"
            :key="index"
            class="release-item col-3"
          >
            <LazyResultCard :release="album" />
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  results: Object,
  isLoading: Boolean,
});
</script>

<style scoped>
@media (max-width: 1023px) {
  .grid-releases {
    --minthumb: 320px;
  }

  .grid-releases.is-double {
    grid-column: auto;
  }
}

Section {
  flex: 1;
  display: block;
}

.block {
  margin-top: clamp(20px, 3vw, 50px);
  margin-bottom: clamp(50px, 20vw, 200px);
}

.inner {
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
}

.grid-releases {
  --minthumb: 350px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--minthumb), 1fr));
  grid-auto-flow: row dense;
  grid-gap: 30px 20px;
  padding-bottom: 30px;
}

.release-item {
  list-style: none;
  display: list-item;
  text-align: center;
}

.skeleton {
  width: 100%;
  padding-top: 100%; /* 1:1 aspect ratio (height is the same as width) */
  position: relative; /* Important for the aspect ratio to work */
}
</style>
