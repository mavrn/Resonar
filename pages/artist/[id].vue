<template>
  <NotFound v-if="artist == undefined" element="Album" />
  <div v-else class="wrapper">
    <div class="main-grid">
      <div class="info-row">
        <div class="avatar-wrapper">
          <img :src="artist?.avatar" alt="" class="avatar" />
        </div>
        <div class="info">{{ artist?.name }}</div>
      </div>
      <div class="discography-grid">
        <ResultsGrid
          :results="releases"
          :loaded-results="releases.length"
          :update="() => {}"
        ></ResultsGrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import { doc, getDoc } from 'firebase/firestore';
import { useUserStore } from '../../store/currentUser';

const props = defineProps({ index: Array });

const db = useFirestore();
const routedArtist = useRoute().params.id;
const artist = ref(null);
const releases = ref([]);

onMounted(async () => {
  const artistDocument = doc(db, '/artists', routedArtist);
  const snapshot = await getDoc(artistDocument);
  if (snapshot) {
    artist.value = new Artist(snapshot);
    releases.value = getResultsByArtist(props.index, artist.value.name);
    releases.value.forEach(async (release, index) => {
      const [collectionPath, documentId] = release.reference.split('/');
      const documentRef = doc(db, collectionPath, documentId);
      const relSnapshot = await getDoc(documentRef);
      const newRelease = new Release(relSnapshot);
      newRelease.resolveArtistLocal(release.artist);
      newRelease.resolveArtist();
      releases.value[index] = newRelease;
    });
  } else {
    artist.value = undefined;
  }
});
</script>

<style scoped>
.main-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 0.6fr 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.info-row {
  grid-area: 1 / 2 / 2 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 30px;
}

.info {
  margin-top: 20px;
  font-size: 30px;
  font-weight: 600;
}
.avatar-wrapper {
  border-radius: 45%;
  overflow: hidden;
  position: relative;
  display: block;
  transition: all 0.3s;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
  height: 300px;
  width: 300px;
}

.avatar {
  aspect-ratio: 1;
  width: 100%;
  height: auto;
  object-fit: cover;
  border: none;
  display: block;
}

.discography-grid {
  grid-area: 2 / 1 / 3 / 4;
  display: flex;
  justify-content: center;
}
</style>
