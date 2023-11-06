<script setup lang="ts">
import { useFilteringStore } from '../store/filtering';
import { useUserStore } from '~/store/currentUser';

const props = defineProps({
  searchValue: String,
  handleSignOut: Function,
  handleSortingChange: Function,
  remoteIndexLoaded: Boolean,
});
const emits = defineEmits(['update:searchValue']);
const { currentUser } = storeToRefs(useUserStore());

const sorting = ref('Popular');
const sortingOrder = ref(-1);
const showFilterMenu = ref(false);
const { filtering } = storeToRefs(useFilteringStore());

const computedSearchValue = computed({
  get: () => props.searchValue,
  set: (value) => {
    emits('update:searchValue', value);
  },
});

function toCamelCase(inputString: string) {
  return inputString
    .replace(/\s(.)/g, (_, match) => match.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, (match) => match.toLowerCase());
}

function onSortingChange(newSorting: string) {
  sorting.value = newSorting;
  newSorting = toCamelCase(newSorting);
  props.handleSortingChange?.(newSorting, sortingOrder);
}

function onSortingOrderChange() {
  sortingOrder.value = -sortingOrder.value;
  props.handleSortingChange?.(toCamelCase(sorting.value), sortingOrder.value);
}
</script>
<template>
  <Transition mode="out-in">
    <div v-if="showFilterMenu" class="filter-overlay">
      <FilterMenu :filtering="filtering"></FilterMenu>
    </div>
  </Transition>
  <div class="show-smaller-than-lg-flex header-logo-sm-container">
    <NuxtLink to="/">
      <img class="header-logo-sm" src="../assets/sonar-logo.png" alt="Logo"
    /></NuxtLink>
    <div v-if="!currentUser" class="header-main-user show-smaller-than-sm-flex">
      <NuxtLink to="/login"
        ><Button class="topbar-button secondary-button"
          ><i class="material-icons text-white">login</i>
        </Button>
      </NuxtLink>
    </div>
    <div v-else class="header-main-user show-smaller-than-sm-flex">
      <NuxtLink :to="'/user/' + currentUser.username"
        ><Button class="topbar-button secondary-button"
          ><i class="material-icons text-white">person</i></Button
        >
      </NuxtLink>
    </div>
  </div>
  <header>
    <div class="inner">
      <div class="header-main">
        <NuxtLink class="show-bigger-than-lg-flex" to="/">
          <img class="header-logo" src="../assets/sonar-logo.png" alt="Logo" />
        </NuxtLink>
        <div class="header-search">
          <div class="search-bar-field">
            <div class="search-bar">
              <div class="placeholder-logo">
                <i class="material-icons text-white">search</i>
              </div>
              <input
                class="search-input"
                type="text"
                v-model="computedSearchValue"
                placeholder="Search"
              />
            </div>
            <div class="show-bigger-than-lg-block">
              <div class="filter-separator">IN</div>
              <div class="filter-dropdown">
                <svg class="expand-arrow" width="12" viewBox="0 0 20 20">
                  <use href="../assets/expand.svg#arrow"></use>
                </svg>
                <div class="dropdown-selected">
                  {{ toTitleCase(filtering.type) }}
                </div>
                <div class="filter-dropdown-options">
                  <div class="filter-type-field">
                    <div
                      class="filter-dropdown-option"
                      @click="filtering.type = 'all'"
                    >
                      All
                    </div>
                    <div
                      class="filter-dropdown-option"
                      @click="filtering.type = 'releases'"
                    >
                      Releases
                    </div>
                    <div
                      class="filter-dropdown-option is-child"
                      @click="filtering.type = 'albums'"
                    >
                      Albums
                    </div>
                    <div
                      class="filter-dropdown-option is-child"
                      @click="filtering.type = 'singles'"
                    >
                      Singles
                    </div>
                    <div
                      class="filter-dropdown-option"
                      @click="filtering.type = 'artists'"
                    >
                      Artists
                    </div>
                    <div
                      class="filter-dropdown-option"
                      @click="filtering.type = 'users'"
                    >
                      Users
                    </div>
                  </div>

                  <div class="filter-combi-field">
                    <div class="range-display">
                      Rating: {{ filtering.ratingRange[0] }} -
                      {{ filtering.ratingRange[1] }}
                    </div>
                    <Slider
                      range
                      class="filter-slider"
                      v-model="filtering.ratingRange"
                      :min="0"
                      :max="10"
                      :step="0.1"
                    />
                    <div class="range-display">
                      Year: {{ filtering.yearRange[0] }} -
                      {{ filtering.yearRange[1] }}
                    </div>
                    <Slider
                      range
                      class="filter-slider"
                      v-model="filtering.yearRange"
                      :min="1950"
                      :max="2023"
                      :step="1"
                    />
                    <div class="button-field">
                      <button
                        v-if="currentUser"
                        :class="{
                          'filter-active-button': filtering.inRated,
                          'filter-passive-button': !filtering.inRated,
                        }"
                        @click="filtering.inRated = !filtering.inRated"
                      >
                        In your Rated
                      </button>
                      <button
                        v-if="currentUser"
                        :class="{
                          'filter-active-button': filtering.inBookmarks,
                          'filter-passive-button': !filtering.inBookmarks,
                        }"
                        @click="filtering.inBookmarks = !filtering.inBookmarks"
                      >
                        In your Bookmarks
                      </button>
                    </div>
                    <div class="filter-genre-field">
                      <GenreFilter
                        class="genre-filter"
                        v-model="filtering.genres"
                      ></GenreFilter>
                    </div>
                  </div>
                </div>
              </div>
              <div class="sorting-separator">SORTED BY</div>
              <button class="order-button" @click="onSortingOrderChange">
                <svg
                  :class="{ 'order-arrow': true, down: sortingOrder == -1 }"
                  viewBox="0 0 20 20"
                >
                  <use href="../assets/arrow.svg#arrow"></use>
                </svg>
              </button>
              <div class="sorting-dropdown">
                <svg class="expand-arrow" width="12" viewBox="0 0 20 20">
                  <use href="../assets/expand.svg#arrow"></use>
                </svg>
                <div class="dropdown-selected">{{ sorting }}</div>
                <div class="sorting-dropdown-options">
                  <div
                    class="sorting-dropdown-option"
                    @click="onSortingChange('Popular')"
                  >
                    Popular
                  </div>
                  <div
                    class="sorting-dropdown-option"
                    @click="onSortingChange('Release Date')"
                  >
                    Release Date
                  </div>
                  <div
                    class="sorting-dropdown-option"
                    @click="onSortingChange('Rating')"
                    v-if="remoteIndexLoaded"
                  >
                    Rating
                  </div>
                  <div
                    v-if="currentUser"
                    class="sorting-dropdown-option"
                    @click="onSortingChange('Your Rating')"
                  >
                    Your Rating
                  </div>
                  <div
                    class="sorting-dropdown-option"
                    @click="onSortingChange('Alphabetical')"
                  >
                    Alphabetical
                  </div>
                </div>
              </div>
            </div>

            <div class="show-smaller-than-lg-block filter-field">
              <Button
                class="filter-button secondary-button"
                @click="showFilterMenu = !showFilterMenu"
              >
                <i class="material-icons text-white">tune</i>
              </Button>
            </div>
          </div>
        </div>
        <div v-if="!currentUser" class="header-right-login">
          <div class="header-main-user show-bigger-than-md-flex">
            <NuxtLink to="/login"
              ><Button class="topbar-button secondary-button">Log In</Button>
            </NuxtLink>
            <NuxtLink to="/register"
              ><Button class="topbar-button">Sign Up</Button>
            </NuxtLink>
          </div>
          <div class="header-main-user show-between-sm-md">
            <NuxtLink to="/login"
              ><Button class="topbar-button"
                ><i class="material-icons text-white">login</i>
              </Button>
            </NuxtLink>
          </div>
        </div>
        <div v-if="currentUser" class="header-right-login">
          <div class="header-main-user show-bigger-than-md-flex">
            <NuxtLink v-if="currentUser" :to="'/user/' + currentUser.username"
              ><Button class="topbar-button"
                ><i class="material-icons text-white">person</i>
                <span>{{ currentUser.username }}</span></Button
              >
            </NuxtLink>
            <Button
              class="topbar-button secondary-button"
              @click="handleSignOut?.()"
            >
              Sign Out
            </Button>
          </div>
          <div class="header-main-user show-between-sm-md">
            <NuxtLink v-if="currentUser" :to="'/user/' + currentUser.username"
              ><Button class="topbar-button"
                ><i class="material-icons text-white">person</i></Button
              >
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.filter-overlay {
  z-index: 3;
  position: fixed;
  top: 140px;
  left: 10%;
  height: 70vh;
  width: 80vw;
  background-color: black;
  opacity: 96%;
  border: 1px solid white;
  box-shadow: azure;
  padding: 20px;
  border-radius: 20px;
  @media (min-width: 1101px) {
    display: none;
  }
  @media (max-width: 400px) {
    width: 90vw;
    left: 5%;
  }
}

.v-enter-active {
  transition: opacity 0.4s ease-out;
}

.v-leave-active {
  transition: opacity 0.4s ease-in;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

header {
  position: sticky;
  top: 0;
  background-color: transparent;
  display: block;
  text-align: start;
  line-height: 200%;
  font-size: 16px;
  z-index: 10;
}

.inner {
  width: 100%;
  margin: 0 auto;
  padding: 0 30px 0 30px;
  @media (max-width: 1200px) {
    padding: 0 0px 0 8px;
  }
}

.header-main {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 90px;
  font-size: 14px;
}

.header-logo {
  height: 35px;
  width: auto;
  display: block;
}

.header-logo-sm {
  height: 35px;
  width: auto;
}

.header-logo-sm-container {
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  padding-left: 40px;
  padding-right: 40px;
  @media (min-width: 501px) {
    justify-content: center;
  }
}

.header-search {
  position: relative;
  flex: 1;
  margin-left: 12px;
  z-index: 3;
}

.search-bar-field {
  position: relative;
  display: flex;
  align-items: center;
  height: 56px;
  background: #e5e4e4;
  border-radius: var(--border-radius);
  z-index: 1;
  padding-right: 20px;
}
.search-bar {
  display: flex;
  flex: 1;
  height: 100%;
  background: transparent;
}

.search-input {
  position: relative;
  flex: 1;
  height: 100%;
  background: transparent;
  border: none;
  padding-left: 10px;
}

.search-input:focus {
  border: none;
  outline: none;
}

.filter-button {
  height: 42px;
  padding-left: 10px;
  padding-right: 10px;
  border: none;
}

.order-arrow {
  height: auto;
  width: 15px;
  transition: transform 0.3s;
}

.order-arrow.down {
  transform: scaleY(-1) translateY(-4px);
  transition: transform 0.3s;
}

.order-button:hover {
  fill: gray;
}

.genre-filter {
  width: 100%;
}
.order-button {
  position: relative;
  align-items: center;
  font-size: 11px;
  width: 17px;
  border: none;
  background: none;
  margin-right: 10px;
}

.sorting-separator {
  display: inline-flex;
  align-items: center;
  margin: 0 10px;
  font-size: 11px;
}
.filter-separator {
  display: inline-flex;
  align-items: center;
  margin: 0 10px;
  font-size: 11px;
}
.sorting-dropdown {
  position: relative;
  display: inline-flex;
  width: 125px;
  cursor: pointer;
  border: none;
  border-radius: var(--border-radius);
  background: transparent;
  user-select: none;
}

.sorting-dropdown-options {
  position: absolute;
  top: calc(100% - 43px);
  width: calc(100% + 27px);
  padding: 46px 0 10px 0;
  background: black;
  border-radius: var(--border-radius);
  color: white;
  transform: translateX(-8px);
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}

.filter-dropdown {
  position: relative;
  display: inline-flex;
  width: 200px;
  cursor: pointer;
  border: none;
  border-radius: var(--border-radius);
  background: transparent;
  user-select: none;
}

.filter-dropdown:hover .expand-arrow {
  top: calc(50% - 5px);
  fill: white;
  transform: scaleY(-1);
}
.filter-dropdown:hover .filter-dropdown-options {
  opacity: 1;
  visibility: visible;
}

.filter-dropdown:hover .dropdown-selected {
  color: white;
}
.filter-dropdown-options {
  position: absolute;
  top: calc(100% - 43px);
  width: calc(100% + 10px);
  padding: 46px 3px 3px 3px;
  background: black;
  border-radius: var(--border-radius);
  color: white;
  transform: translateX(-8px);
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}
.filter-dropdown-option {
  display: block;
  padding: 2px 24px;
  padding-left: 9px;
  color: white;
  transition: all 0.3s;
  text-decoration: none;
  border: none;
  margin: 0;
}
.filter-dropdown-option:hover {
  color: gray;
}
.is-child {
  padding-left: 20px;
}

.filter-type-field {
  margin: 2px;
}

.filter-genre-field {
  margin: 2px;
  margin-top: 5px;
  padding: 5px;
  padding-top: 10px;
}

.filter-combi-field {
  margin: 2px;
  margin-top: 10px;
  padding: 10px;
}

.filter-slider {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  padding-bottom: 4px;
  height: 2px;
}

.range-display {
  width: 100%;
  text-align: center;
  align-items: center;
}

.button-field {
  display: flex;
  padding-top: 10px;
}
.filter-active-button {
  border-radius: var(--border-radius);
  background-color: white;
  color: black;
  border: none;
  width: 40%;
  height: 40px;
  margin-left: 10px;
  margin-right: 10px;
  opacity: 80%;
}
.filter-passive-button {
  border-radius: var(--border-radius);
  background: transparent;
  color: white;
  border: 2px solid white;
  width: 40%;
  height: 40px;
  margin-left: 10px;
  margin-right: 10px;
  opacity: 80%;
}

.filter-passive-button:hover {
  opacity: 100%;
}
.filter-active-button:hover {
  opacity: 100%;
}
.sorting-dropdown-option {
  display: block;
  padding: 2px 24px;
  padding-left: 9px;
  color: white;
  transition: all 0.3s;
  text-decoration: none;
  border: none;
  margin: 0;
}

.sorting-dropdown-option:hover {
  color: gray;
}
.expand-arrow {
  position: absolute;
  top: 50%;
  right: 0;
  z-index: 2;
  transform: translateY(-50%);
  transition: transform 0.3s;
  display: inline-block;
  height: auto;
  fill: black;
}

.dropdown-selected {
  position: relative;
  display: flex;
  align-items: center;
  padding-right: 30px;
  font-weight: 500;
  z-index: 2;
}

.sorting-dropdown:hover .expand-arrow {
  top: calc(50% - 5px);
  fill: white;
  transform: scaleY(-1);
}
.sorting-dropdown:hover .sorting-dropdown-options {
  opacity: 1;
  visibility: visible;
}

.sorting-dropdown:hover .dropdown-selected {
  color: white;
}

.header-right-login {
  display: flex;
  gap: 12px;
  height: 100%;
  margin-left: 20px;
}

.header-main-user {
  align-items: center;
  gap: 16px;
}

.topbar-button {
  height: 42px;
}

.placeholder-logo {
  display: flex;
  align-items: center;
  border: none;
  background: transparent;
  padding-left: 10px;
}
</style>
