<script setup lang="ts">
const props = defineProps({
  onSearchValueChange: Function,
  handleSignOut: Function,
  isLoggedIn: Boolean,
  loggedInUser: Object,
});

const searchValue = ref('');
</script>
<template>
  <header>
    <div class="inner">
      <div class="header-main">
        <NuxtLink class="show-bigger-than-sm-flex" to="/">
          <img class="header-logo" src="../assets/sonar-logo.png" alt="Logo" />
        </NuxtLink>
        <div class="header-search">
          <div class="search-bar-field">
            <div class="search-bar">
              <input
                class="search-input"
                type="text"
                @input="onSearchValueChange?.(searchValue)"
                v-model="searchValue"
                placeholder="Search..."
              />
            </div>
            <div class="show-bigger-than-lg-block">
              <div class="search-in-seperator">IN</div>
              <div class="search-dropdown">
                <svg class="ico-svg" width="12" viewBox="0 0 20 20">
                  <use href="../assets/expand.svg#arrow"></use>
                </svg>
                <div class="dropdown-selected">Tracks</div>
                <div class="dropdown-options"></div>
              </div>
              <div class="search-in-seperator">WITH FILTER</div>
              <div class="search-dropdown">
                <svg class="ico-svg" width="12" viewBox="0 0 20 20">
                  <use href="../assets/expand.svg#arrow"></use>
                </svg>
                <div class="dropdown-selected">All</div>
                <div class="dropdown-options"></div>
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
          <div class="header-main-user show-smaller-than-md-flex">
            <Button @click="buildIndex()"></Button>
            <!--<NuxtLink to="/login"-->
            <!--  ><Button class="topbar-button"-->
            <!--    ><i class="material-icons text-white">login</i>-->
            <!--  </Button>-->
            <!--</NuxtLink>-->
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
          <div class="header-main-user show-smaller-than-md-flex">
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
  margin: 0 20px;
  font-size: 11px;
}

.search-dropdown {
  position: relative;
  display: inline-flex;
  width: 125px;
  cursor: pointer;
  border-radius: 26px;
}

.ico-svg {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 2;
  transition: transform 0.3s;
  display: inline-block;
  height: auto;
  fill: black;
}

.dropdown-selected {
  position: relative;
  display: flex;
  align-items: center;
  padding-right: 25px;
  font-weight: 500;
  z-index: 2;
}
.dropdown-options {
  position: absolute;
  top: calc(100% - 40px);
  width: calc(100% + 28px);
  padding: 40px 0 10px 0;
  background: var(--bg-secondary);
  border-radius: var(--rounded-normal);
  color: var(--color-white);
  transform: translateX(-8px);
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}

.dropdown-option {
  display: block;
  padding: 2px 24px;
  color: var(--color-white);
  transition: all 0.3s;
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
</style>
