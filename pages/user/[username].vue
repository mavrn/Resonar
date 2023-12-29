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

//Resolves the User Profile by its routed username
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

watch(currentUser, () => {
  isLoggedInUser.value = currentUser.value.uid == foundUser.value?.uid;
  if (isLoggedInUser.value) {
    menuOptions.value.push({
      name: 'Account',
      icon: 'settings',
    });
  }
});
</script>

<template>
  <div class="profile-wrapper-sm">
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
</style>
