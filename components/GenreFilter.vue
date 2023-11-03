<template>
  <div>
    <textarea
      rows="1"
      class="genre-input"
      ref="textarea"
      v-model="genreQuery"
      @input="atInput()"
      placeholder="Search for Genres..."
    />
    <div
      v-for="suggestion in genreSuggestions"
      class="suggestion"
      @click="addToQuery(suggestion)"
    >
      {{ suggestion }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFilteringStore } from '../store/filtering';
const { filtering } = storeToRefs(useFilteringStore());

const genreQuery = ref('');
const genreSuggestions = ref<string[]>([]);
const textarea = ref<HTMLElement | null>(null);

const genres = [
  'Rock',
  'Pop',
  'Hip-Hop',
  'Jazz',
  'Country',
  'Electronic',
  'Classical',
  'R&B',
  'Reggae',
  'Blues',
  'Funk',
  'Soul',
  'Metal',
  'Punk',
  'Indie',
  'Alternative',
  'Rap',
  'EDM',
  'Dance',
  'Gospel',
];

function toTitleCase(inputString: string) {
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

const addToQuery = (suggestion: string) => {
  let query = genreQuery.value.split(',');
  query[query.length - 1] = suggestion;
  query = query.map((str) => str.trim());
  genreQuery.value = query.join(', ') + ',';
  atInput();
};

const atInput = () => {
  resizeArea();
  const queryGenres = genreQuery.value.split(',');
  const selectedGenres = [];
  for (const selectedGenre of queryGenres) {
    if (selectedGenre.length != 0) selectedGenres.push(selectedGenre.trim());
  }
  console.log(selectedGenres);
  filtering.value.genres = selectedGenres;
  const query = queryGenres[queryGenres.length - 1].toLowerCase();
  genreSuggestions.value = [];
  for (let genre of genres) {
    genre = genre.toLowerCase();
    if (genre.includes(query) && genreSuggestions.value.length < 3) {
      genreSuggestions.value.push(toTitleCase(genre));
    }
  }
};
function resizeArea() {
  if (textarea.value) {
    let initialHeight;
    if (window.innerWidth < 1100) {
      initialHeight = 30;
    } else {
      initialHeight = 10;
    }
    textarea.value.style.height = '35px';
    textarea.value.style.height =
      textarea.value.scrollHeight + initialHeight + 'px';
  }
}
</script>

<style scoped>
.genre-input {
  width: 100%;
  background: transparent;
  border: 1px solid white;
  border-radius: var(--border-radius);
  height: auto;
  min-height: 30px;
  color: white;
  padding-left: 5px;
  overflow: hidden;
  @media (max-width: 1100px) {
    font-size: 18px;
    height: 70px;
  }
}

.genre-input::placeholder {
  color: white;
  opacity: 80%;
}

.suggestion {
  @media (max-width: 1100px) {
    color: white;
    font-size: 17px;
    padding-top: 10px;
  }
}
</style>
