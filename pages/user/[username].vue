<script setup>
import { getDoc } from 'firebase/firestore';
const db = useFirestore();
const routedUser = useRoute().params.username;
const foundUser = ref(null);
const likedReleasesNames = ref([]);

onMounted(async () => {
  await getUser(routedUser).then((user) => {
    foundUser.value = user;
    user.likedReleases.forEach((reference) => {
      getDoc(reference).then((albumSnapshot) => {
        console.log('sddf');
        likedReleasesNames.push(albumSnapshot.data().name);
      });
    });
  });
});
</script>

<template>
  <div
    v-if="foundUser"
    class="text-3xl flex h-[88vh] justify-center items-center"
  >
    <div
      class="w-[90vw] min-w-[300px] h-[90%] bg-primarylight p-16 text-white rounded-xl grid grid-rows-1 grid-cols-2"
    >
      <div class="w-96 h-96 overflow-hidden flex items-center justify-center">
        <img
          class="w-full h-full rounded-full object-cover"
          :src="foundUser['profilePicture']"
        /><img />
      </div>
      <div>
        <div>Username: {{ foundUser.username }}</div>
        <div>Email: {{ foundUser.email }}</div>
        <div>Liked Releases: {{ likedReleasesNames[0] }}</div>
      </div>
    </div>
  </div>
  <div v-if="!foundUser" class="flex flex-col items-center text-3xl">
    404 User Not Found
  </div>
</template>
