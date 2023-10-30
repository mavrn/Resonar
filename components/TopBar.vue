<script setup lang="ts">
import { orderBy } from 'firebase/firestore';

const props = defineProps({
  onSearchValueChange: Function,
  handleSignOut: Function,
  isLoggedIn: Boolean,
  loggedInUser: Object,
  handleSortingChange: Function,
  handleSortingOrderChange: Function,
  handleFilterChange: Function,
});

const searchValue = ref('');
const sorting = ref('Popular');
const filtering = ref(null);
const sortingOrder = ref(-1);

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
  <div class="show-smaller-than-md-flex header-logo-sm-container">
    <NuxtLink to="/">
      <img class="header-logo-sm" src="../assets/sonar-logo.png" alt="Logo"
    /></NuxtLink>
    <div v-if="!isLoggedIn" class="header-main-user show-smaller-than-sm-flex">
      <NuxtLink to="/login"
        ><Button class="topbar-button secondary-button"
          ><i class="material-icons text-white">login</i>
        </Button>
      </NuxtLink>
    </div>
    <div class="header-main-user show-smaller-than-sm-flex">
      <NuxtLink v-if="loggedInUser" :to="'/user/' + loggedInUser.username"
        ><Button class="topbar-button secondary-button"
          ><i class="material-icons text-white">person</i></Button
        >
      </NuxtLink>
    </div>
  </div>
  <header>
    <div class="inner">
      <div class="header-main">
        <NuxtLink class="show-bigger-than-md-flex" to="/">
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
                @input="onSearchValueChange?.(searchValue)"
                v-model="searchValue"
                placeholder="Search"
              />
            </div>
            <div class="show-bigger-than-lg-block">
              <div class="search-in-seperator">SORTED BY</div>
              <button class="order-button" @click="onSortingOrderChange">
                <svg
                  :class="{ 'order-arrow': true, down: sortingOrder == -1 }"
                  viewBox="0 0 20 20"
                >
                  <use href="../assets/arrow.svg#arrow"></use>
                </svg>
              </button>
              <div class="search-dropdown">
                <svg class="expand-arrow" width="12" viewBox="0 0 20 20">
                  <use href="../assets/expand.svg#arrow"></use>
                </svg>
                <div class="dropdown-selected">{{ sorting }}</div>
                <div class="dropdown-options">
                  <div
                    class="dropdown-option"
                    @click="onSortingChange('Popular')"
                  >
                    Popular
                  </div>
                  <div
                    class="dropdown-option"
                    @click="onSortingChange('Release Date')"
                  >
                    Release Date
                  </div>
                  <div
                    class="dropdown-option"
                    @click="onSortingChange('Rating')"
                  >
                    Rating
                  </div>
                  <div
                    v-if="isLoggedIn"
                    class="dropdown-option"
                    @click="onSortingChange('Your Rating')"
                  >
                    Your Rating
                  </div>
                  <div
                    class="dropdown-option"
                    @click="onSortingChange('Alphabetical')"
                  >
                    Alphabetical
                  </div>
                </div>
              </div>
            </div>
            <div class="show-smaller-than-lg-block filter-field">
              <Button class="filter-button secondary-button">
                <i class="material-icons text-white">tune</i>
              </Button>
            </div>
          </div>
        </div>
        <div v-if="!isLoggedIn" class="header-right-login">
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
        <div v-if="isLoggedIn" class="header-right-login">
          <div class="header-main-user show-bigger-than-md-flex">
            <NuxtLink v-if="loggedInUser" :to="'/user/' + loggedInUser.username"
              ><Button class="topbar-button"
                ><i class="material-icons text-white">person</i>
                <span>{{ loggedInUser.username }}</span></Button
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
            <NuxtLink v-if="loggedInUser" :to="'/user/' + loggedInUser.username"
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
header {
  position: sticky;
  top: 0;
  background-color: var(--primary-bg);
  display: block;
  text-align: start;
  line-height: 200%;
  font-size: 16px;
  z-index: 10;
}

.inner {
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  @media (max-width: 500px) {
    padding: 0 5px;
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
  gap: 20px;
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

.search-in-seperator {
  display: inline-flex;
  align-items: center;
  margin: 0 10px;
  font-size: 11px;
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

.order-button {
  position: relative;
  align-items: center;
  font-size: 11px;
  width: 17px;
  border: none;
  background: none;
  margin-right: 10px;
}

.search-dropdown {
  position: relative;
  display: inline-flex;
  width: 125px;
  cursor: pointer;
  border: none;
  border-radius: 26px;
  background: transparent;
  user-select: none;
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

.search-dropdown:hover .expand-arrow {
  top: calc(50% - 5px);
  fill: white;
  transform: scaleY(-1);
}

.dropdown-selected {
  position: relative;
  display: flex;
  align-items: center;
  padding-right: 30px;
  font-weight: 500;
  z-index: 2;
}
.dropdown-options {
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

.search-dropdown:hover .dropdown-options {
  opacity: 1;
  visibility: visible;
}

.search-dropdown:hover .dropdown-selected {
  color: white;
}

.dropdown-option {
  display: block;
  padding: 2px 24px;
  padding-left: 9px;
  color: white;
  transition: all 0.3s;
  text-decoration: none;
  border: none;
  margin: 0;
}

.dropdown-option:hover {
  color: gray;
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

.search-bar-field:focus-within {
  outline: 1px solid black;
}
</style>
