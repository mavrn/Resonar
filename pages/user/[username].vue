<script setup>
import { getDoc } from 'firebase/firestore';

const props = defineProps({
  loggedInUser: Object,
  db: Object,
});

const routedUser = useRoute().params.username;
const foundUser = ref(null);
const isLoggedInUser = ref(false);
const menuOptions = ref([
  { name: 'User Info', icon: 'info' },
  {
    name: 'User Activity',
    icon: 'forum',
  },
  {
    name: 'Rated Releases',
    icon: 'star',
  },
  {
    name: 'Account Settings',
    icon: 'settings',
  },
]);
const selectedOption = ref('User Info');
onMounted(async () => {
  getUser(props.db, routedUser).then(async (user) => {
    if (!user) {
      foundUser.value = undefined;
    } else {
      foundUser.value = new User(user);
      foundUser.value.resolve(props.db);
      isLoggedInUser.value = props.loggedInUser
        ? user.id == props.loggedInUser?.value?.id
        : false;
    }
  });
});
</script>

<template>
  <div class="profile-wrapper show-bigger-than-lg-block">
    <div v-if="foundUser" class="profile-container">
      <div class="avatar-wrapper">
        <img class="avatar" :src="foundUser.picture" /><img />
      </div>
      <div class="menu-wrapper">
        <Button
          v-for="option in menuOptions"
          :class="{
            'menu-button': true,
            'secondary-button': option.name != selectedOption,
          }"
          @click="selectedOption = option.name"
        >
          <span>{{ option.name }}</span>
        </Button>
      </div>
      <div class="menu-box">
        <p class="username">{{ foundUser.username }}</p>
        <UserContainer
          :user="foundUser"
          :selectedComponent="selectedOption"
        ></UserContainer>
      </div>
    </div>

    <NotFound v-if="foundUser == false" element="User" />
  </div>
  <div class="profile-wrapper-sm show-smaller-than-lg-flex">
    <div v-if="foundUser" class="profile-container-sm">
      <div class="avatar-wrapper-sm">
        <img class="avatar-sm" :src="foundUser.picture" /><img />
      </div>
      <p class="username">{{ foundUser.username }}</p>
      <div class="menu-wrapper-sm">
        <Button
          v-for="option in menuOptions"
          :class="{
            'menu-button-sm': true,
            'secondary-button': option.name != selectedOption,
          }"
          @click="selectedOption = option.name"
        >
          <span class="menu-button-content-md">{{ option.name }}</span>
          <i class="material-icons menu-button-content-sm">{{ option.icon }}</i>
        </Button>
      </div>
      <div class="menu-box-sm">
        <UserContainer
          :user="foundUser"
          :selectedComponent="selectedOption"
        ></UserContainer>
      </div>
    </div>

    <NotFound v-if="foundUser == undefined" element="User" />
  </div>
</template>

<style scoped>
.profile-wrapper {
  padding: 100px;
  padding-left: 100px;
  padding-right: 100px;
}

.profile-wrapper-sm {
  padding: 50px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 400px) {
    padding-left: 10px;
    padding-right: 10px;
  }
}

.profile-container-sm {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.profile-container {
  display: grid;
  grid-template-columns: 0.4fr 1fr;
  grid-template-rows: 0.9fr 0.1fr;
  grid-row-gap: 10px;
}

.avatar-wrapper {
  grid-area: 1 / 1 / 2 / 2;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  aspect-ratio: 1;
}

.avatar {
  aspect-ratio: 1;
  width: clamp(200px, 80%, 100%);
  height: clamp(200px, 80%, 100%);
  border-radius: 50%;
  object-fit: cover;
}

.avatar-wrapper-sm {
  overflow: hidden;
  display: flex;
  aspect-ratio: 1;
}

.avatar-sm {
  aspect-ratio: 1;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
}

.menu-wrapper-sm {
  display: block;
  padding-bottom: 20px;
  padding-top: 20px;
}
.menu-button-sm {
  justify-content: center;
  width: 160px;
  padding-left: 5px;
  padding-right: 5px;
  margin-left: 4px;
  margin-right: 4px;
  @media (max-width: 774px) {
    width: 16vw;
    height: 40px;
    position: sticky;
  }
}

.menu-button-content-md {
  display: none;
  @media (min-width: 775px) {
    display: block;
  }
}

.menu-button-content-sm {
  display: none;
  @media (max-width: 774px) {
    display: block;
  }
}

.menu-wrapper {
  grid-area: 2 / 1 / 3 / 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

.menu-link {
  text-decoration: none;
}
.menu-button {
  display: flex;
  justify-content: center;
  width: 160px;
  padding-left: 5px;
  padding-right: 5px;
}

.menu-box {
  height: 100%;
  width: 100%;
  outline: 1px solid black;
  border-radius: 10px;
  grid-area: 1 / 2 / 3 / 3;
}

.menu-box-sm {
  width: 75vw;
  outline: 1px solid black;
  border-radius: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  @media (max-width: 550px) {
    width: 90vw;
  }
}

.username {
  font-size: 27px;
  padding-top: 10px;
  text-align: center;
  font-weight: 600;
}
</style>
