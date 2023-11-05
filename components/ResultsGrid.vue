<template>
  <div class="block" ref="scroller">
    <div class="inner">
      <ul class="grid-releases">
        <li
          v-for="i in Math.max(
            0,
            Math.min(loadedResults + 5, results.length)
          )"
          :key="i"
          class="release-item col-3"
        >
          <ReleaseCard
            v-if="results[i - 1] && results[i - 1] instanceof Release"
            :release="results[i - 1]"
          />
          <ArtistCard
            v-else-if="results[i - 1] && results[i - 1] instanceof Artist"
            :artist="results[i - 1]"
          ></ArtistCard>
          <Skeleton v-else class="skeleton" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  results: Object,
  update: Function,
  loadedResults: Number,
});

const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

function handleScroll() {
  const loadingThreshold = window.innerWidth < 600 ? 55 : 70;
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight || document.body.scrollHeight;
  const clientHeight =
    document.documentElement.clientHeight || document.body.clientHeight;

  const percentageScrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
  if (percentageScrolled > loadingThreshold) {
    props.update();
  }
}
const handleDebouncedScroll = debounce(handleScroll, 100);

onMounted(() => {
  window.addEventListener('scroll', handleDebouncedScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleDebouncedScroll);
});
</script>

<style scoped>
Section {
  flex: 1;
  display: block;
}

.block {
  margin-top: clamp(0px, 3vw, 10px);
}

.inner {
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
}

.grid-releases {
  --minthumb: 300px;
  @media (max-width: 480px) {
    --minthumb: 200px;
  }
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--minthumb), 1fr));
  grid-auto-flow: row dense;
  grid-gap: 20px 30px;
  padding-bottom: 30px;
}

.release-item {
  list-style: none;
  display: list-item;
  text-align: center;
}

.skeleton {
  width: 100%;
  padding-top: 100%;
  position: relative;
}
</style>
