<script setup lang="ts">
const yearRange = ref([2000, 2023]);
const selectedGenres = ref([]);
const ratingRange = ref([0, 10]);
</script>

<template>
  <div class="p-4 text-white align-items-center">
    <h2 class="text-lg">Filters</h2>
    <label class="">Year Range</label>
    <v-range-slider
      class="pt-8"
      thumb-label="always"
      :min="2000"
      :max="2023"
      :step="1"
      strict
      v-model="yearRange"
    >
      <template v-slot:thumb-label="{ modelValue }">
        {{ modelValue }}
      </template>
    </v-range-slider>
    <v-autocomplete
      class=""
      chips
      multiple
      label="Genre"
      v-model="selectedGenres"
      :items="[
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
      variant="outlined"
    ></v-autocomplete>
    <div class="">
      <label class="block font-medium mb-2">Rating Range</label>
      <v-range-slider
        class="pt-8"
        thumb-label="always"
        :min="0"
        :max="10"
        :step="0.1"
        strict
        v-model="ratingRange"
        ><template v-slot:thumb-label="{ modelValue }">
          {{ modelValue }}
        </template>
      </v-range-slider>
    </div>
  </div>
</template>

<style scoped>
:deep(.v-slider-thumb__label) {
  padding: 2px;
  height: auto;
  width: auto;
  min-width: 0;
}
</style>
