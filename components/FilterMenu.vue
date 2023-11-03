<template>
  <div class="wrapper">
    <div class="range-display">
      Rating: {{ filtering.ratingRange[0] }} -
      {{ filtering.ratingRange[1] }}
    </div>
    <Slider
      range
      class="filter-slider-sm"
      v-model="filtering.ratingRange"
      :min="0"
      :max="10"
      :step="0.1"
      :pt="{
        startHandler: { class: 'none' },
        endHandler: { class: 'none' },
        range: { class: 'range' },
      }"
    />
    <div class="range-display">
      Year: {{ filtering.yearRange[0] }} -
      {{ filtering.yearRange[1] }}
    </div>
    <Slider
      range
      class="filter-slider-sm"
      v-model="filtering.yearRange"
      :min="1950"
      :max="2023"
      :step="1"
      :pt="{
        startHandler: { class: 'none' },
        endHandler: { class: 'none' },
        range: { class: 'range' },
      }"
    />
    <Dropdown
      v-model="type"
      inputId="filtertype"
      :options="typeOptions"
      class="dropdown"
    />
    <GenreFilter class="genre-filter"></GenreFilter>
    <div class="button-field">
      <button
        :class="{
          'filter-active-button': filtering.inRated,
          'filter-passive-button': !filtering.inRated,
        }"
        @click="filtering.inRated = !filtering.inRated"
      >
        In your Rated
      </button>
      <button
        :class="{
          'filter-active-button': filtering.inBookmarks,
          'filter-passive-button': !filtering.inBookmarks,
        }"
        @click="filtering.inBookmarks = !filtering.inBookmarks"
      >
        In your Bookmarks
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFilteringStore } from '../store/filtering';
const { filtering } = storeToRefs(useFilteringStore());

const type = ref('All');
watch(
  () => type.value,
  () => {
    filtering.value.type = type.value.toLowerCase();
  }
);

const typeOptions = [
  'All',
  'Releases',
  'Albums',
  'Singles',
  'Artists',
  'Users',
];
</script>

<style scoped>
.button-field {
  display: flex;
  padding-top: 10px;
  flex-direction: column;
  align-items: center;
}

.filter-active-button {
  border-radius: var(--border-radius);
  background-color: white;
  color: black;
  border: none;
  width: 100%;
  height: 40px;
  opacity: 80%;
  padding: 10px;
  margin-top: 20px;
}
.filter-passive-button {
  border-radius: var(--border-radius);
  background: transparent;
  color: white;
  border: 2px solid white;
  width: 100%;
  height: 40px;
  opacity: 80%;
  padding: 10px;
  margin-top: 20px;
}

.range-display {
  color: white;
  width: 100%;
  text-align: center;
  align-items: center;
  padding-top: 20px;
}
.filter-slider-sm {
  max-width: 400px;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 10px;
  padding-bottom: 30px;
  height: 2px;
}

.wrapper {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dropdown {
  width: 200px;
  margin-bottom: 30px;
  margin-top: 30px;
}

.genre-filter {
  max-width: 400px;
  width: 100%;
}
</style>

<style>
.none {
  opacity: 0;
}

.range {
  border-radius: 6px;
}

.p-slider .p-slider-range {
  background: linear-gradient(
    to right,
    transparent 0px,
    transparent 2px,
    white 2px,
    white 5px,
    transparent 5px,
    transparent 6px,
    white 6px,
    white 9px,
    transparent 9px,
    transparent calc(100% - 9px),
    white calc(100% - 9px),
    white calc(100% - 6px),
    transparent calc(100% - 6px),
    transparent calc(100% - 5px),
    white calc(100% - 5px),
    white calc(100% - 2px),
    transparent calc(100% - 2px),
    transparent 100%
  );
  outline: 2px solid white;
}
</style>
