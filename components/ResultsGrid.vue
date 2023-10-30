<template>
  <div class="block" ref="scroller">
    <div class="inner">
      <ul class="grid-releases">
        <li v-for="i in Math.max(0, Math.min(loadedResults + 5, results.length -1))" :key="i" class="release-item col-3">
          <LazyResultCard
            v-if="results[i] && results[i] instanceof Album"
            :release="results[i]"
          />
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
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight || document.body.scrollHeight;
  const clientHeight =
    document.documentElement.clientHeight || document.body.clientHeight;

  const percentageScrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
  if (percentageScrolled > 80) {
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
