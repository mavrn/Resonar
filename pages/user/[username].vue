<script setup>
import { getDoc } from 'firebase/firestore';

const props = defineProps({
  loggedInUser: Object | null,
});

const db = useFirestore();
const routedUser = useRoute().params.username;
const foundUser = ref(null);
const isLoggedInUser = ref(false);
const followedUser = ref(false);
const selectedTab = ref('Rated Releases');
const likedReleases = ref([]);

onMounted(async () => {
  await getUser(routedUser).then(async (user) => {
    if (!user) {
      return;
    }
    foundUser.value = user.data();
    isLoggedInUser.value = props.loggedInUser
      ? user.id == props.loggedInUser?.value?.id
      : false;
    for (const reference of user.data().likedReleases) {
      const albumSnapshot = await getDoc(reference);
      const release = new Release(albumSnapshot);
      await release.resolve();
      likedReleases.value.push(release);
    }
    console.log(likedReleases);
  });
});
</script>

<template>
  <div class="profile-wrapper">
    <div v-if="foundUser" class="profile-card">
      <div class="heading-wrapper">
        <div class="heading-container">
          <h1 class="heading">{{ foundUser.username }}</h1>
        </div>
      </div>
      <div class="user-card">
        <div class="avatar-wrapper">
          <img class="avatar" :src="foundUser['profilePicture']" /><img />
        </div>
        <Button
          v-if="!isLoggedInUser && !followedUser"
          class="secondary-button"
          label="Follow"
        />
        <Button v-if="!isLoggedInUser && followedUser" label="Followed" />
        <Button v-if="isLoggedInUser" label="Account Settings"></Button>
      </div>
      <div class="rated-releases">
        <DataView :value="likedReleases" paginator :rows="10"></DataView>
        <ul>
          <li v-for="(release, index) in likedReleases" :key="index">
            <div class="release-card">
              <h3>{{ release.title }}</h3>
              <p>{{}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="!foundUser" class="user-not-found-wrapper">
      <p class="user-not-found-main">404</p>
      <p class="user-not-found-sub">User Not Found</p>
    </div>
  </div>
</template>

<style scoped>
.profile-wrapper {
  padding: 50px;
}
.profile-card {
  display: grid;
  align-items: center;
  grid-template-rows: 1 1;
  grid-template-columns: 2fr 5fr;
  grid-column-gap: 10px;
  grid-row-gap: 50px;
}

.heading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-area: 1 / 1 / 2 / 3;
}

.heading-container {
  padding: 10px;
  border-width: 1px;
  border-radius: 10px;
  border-color: black;
  border-style: solid;
}
.heading {
  font-size: 40px;
}

.user-card {
  padding-right: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  grid-area: 2 / 1 / 3 / 2;
  gap: 20px;
}

.avatar-wrapper {
  width: 300px;
  height: 300px;
  overflow: hidden;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.rated-releases {
  background-color: aliceblue;
  grid-area: 2 / 2 / 3 / 3;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}

.user-not-found-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.user-not-found-main {
  padding-top: 100px;
  padding-bottom: 60px;
  font-size: 200px;
}
</style>
