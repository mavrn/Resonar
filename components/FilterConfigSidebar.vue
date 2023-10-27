<script setup lang="ts">
const yearRange = ref([2000, 2023]);
const selectedGenres = ref([]);
const ratingRange = ref([0, 10]);
</script>

<template>
  <div class="p-5 w-full text-center">
    <h2 class="text-3xl">Filters</h2>
    <p class="text-center py-3">Year Range</p>
    <div class="py-2">
      <Slider :min="2000" :max="2023" :step="1" range v-model="yearRange">
      </Slider>
    </div>
    <p class="text-center py-3">{{ yearRange[0] }} - {{ yearRange[1] }}</p>
    <span class="p-float-label py-3">
      <MultiSelect
        id="genre-selector"
        class="w-full rounded-lg"
        display="chip"
        filter
        v-model="selectedGenres"
        :options="[
          'Pop',
          'Rock',
          'Electronic',
          'Hip-Hop',
          'Country',
          'Jazz',
          'R&B',
          'Classical',
          'Reggae',
          'Blues',
          'Folk',
          'Metal',
          'Punk',
          'Alternative',
          'Dance',
          'Soul',
          'Disco',
          'Funk',
          'Gospel',
        ]"
      >
      </MultiSelect>
      <label for="genreSelector">Genres</label>
    </span>

    <p class="text-center py-3">Rating Range</p>
    <div class="py-2">
      <Slider :min="0" :max="10" :step="0.1" range v-model="ratingRange">
      </Slider>
    </div>
    <p class="text-center py-3">{{ ratingRange[0] }} - {{ ratingRange[1] }}</p>
  </div>
</template>


<style scoped>




</style>