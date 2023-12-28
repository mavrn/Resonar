<script setup>
import { useUserStore } from '~/store/currentUser';
const { currentUser } = storeToRefs(useUserStore());

const db = useFirestore();
const routedUser = useRoute().params.username;
const foundUser = ref(null);
const isLoggedInUser = ref(false);
const menuOptions = ref([
  { name: 'Info', icon: 'info' },
  {
    name: 'Activity',
    icon: 'forum',
  },
  {
    name: 'Ratings',
    icon: 'star',
  },
]);

const selectedOption = ref('Info');
const imageSrc = ref('');

onMounted(async () => {
  getUser(db, routedUser).then(async (user) => {
    if (!user) {
      foundUser.value = false;
    } else {
      foundUser.value = new User(user);
      await foundUser.value.resolve(db);
      isLoggedInUser.value = currentUser.value?.uid == foundUser.value?.uid;
      if (isLoggedInUser.value) {
        menuOptions.value.push({
          name: 'Account',
          icon: 'settings',
        });
      }
      imageSrc.value = await loadImage(foundUser.value.picture);
    }
  });
});
</script>

<template>
  <div class="profile-wrapper show-bigger-than-lg-flex">
    <div v-if="foundUser" class="profile-container">
      <div class="user-info">
        <div class="avatar-wrapper">
          <img v-if="imageSrc" class="avatar" :src="imageSrc" />
          <Skeleton v-else class="skeleton" />
        </div>
        <div class="username">
          {{ foundUser.username }}
        </div>
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
        <img v-if="imageSrc" class="avatar-sm" :src="imageSrc" />
        <Skeleton v-else class="skeleton-sm" />
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
    <NotFound v-if="foundUser == false" element="User" />
  </div>
</template>

<style scoped>
.profile-wrapper {
  justify-content: center;
}

.profile-wrapper-sm {
  padding: 20px;
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
  display: flex;
  flex-direction: column;
  gap: 50px;
  justify-content: center;
  align-items: center;
  padding: 20px;
  max-width: 800px;
  border-radius: var(--border-radius);
}

.avatar-wrapper {
  overflow: hidden;
  justify-content: center;
}
.avatar {
  aspect-ratio: 1;
  border-radius: 50%;
  object-fit: cover;
  height: 200px;
}
.user-info {
  align-items: center;
  gap: 30px;
}

.menu-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.menu-button {
  display: flex;
  justify-content: center;
  width: 160px;
  padding-left: 5px;
  padding-right: 5px;
}

.menu-box {
  display: flex;
  justify-content: center;
  height: 100%;
  min-width: 400px;
  grid-area: 3 / 1 / 4 / 3;
}

.skeleton {
  width: 200px !important;
  height: 200px !important;
  border-radius: 50%;
  position: relative;
}

.skeleton-sm {
  aspect-ratio: 1;
  width: 200px !important;
  height: 200px !important;
  border-radius: 50%;
  position: relative;
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
  @media (max-width: 790px) {
    width: 16vw;
    height: 40px;
    position: sticky;
  }
}

.menu-button-content-md {
  display: none;
  @media (min-width: 791px) {
    display: block;
  }
}

.menu-button-content-sm {
  display: none;
  @media (max-width: 790px) {
    display: block;
  }
}

.menu-box-sm {
  width: 75vw;
  border-radius: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
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

.flex {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
