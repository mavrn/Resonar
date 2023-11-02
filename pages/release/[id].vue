<template>
  <NotFound v-if="release == undefined" element="Album" />
  <div v-else class="release-wrapper">
    <div class="cover-container">
      <img class="cover" :src="release.cover" />
      <div v-if="release.spotify || release.apple" class="links">
        <a
          v-if="release.spotify"
          class="link-button"
          :href="release.spotify"
          target="_blank"
          ><img src="../../assets/spotify.png"
        /></a>
        <a
          v-if="release.apple"
          class="link-button"
          :href="release.applie"
          target="_blank"
          ><img src="../../assets/spotify.png"
        /></a>
      </div>
    </div>
    <div class="info">
      <div class="info-row">
        <p class="title">{{ release.title }}</p>
      </div>
      <div class="info-row">
        <p class="descriptor">Artist</p>
        <p>{{ release.artist?.name }}</p>
      </div>
      <div class="info-row">
        <p class="descriptor">Type</p>
        <p>Album</p>
      </div>
      <div class="info-row">
        <p class="descriptor">Genres</p>
        <p>Rock</p>
      </div>
      <div class="info-row">
        <p class="descriptor">Date</p>
        <p>{{ release.date }}</p>
      </div>
    </div>
    <div class="score-container">
      <div class="score">{{ release.rating }}</div>
    </div>
    <div class="tracklist">
      <div class="tracklist-container">
        <div v-for="track in release.tracklist" class="track">
          <span>{{ track.index }} {{ track.title }}</span>
          <span>{{ track.duration }}</span>
        </div>
      </div>
    </div>
    <div class="comment-container">
      <div v-for="comment in release.comments" class="comment">
        <div class="comment-start">
          <img :src="comment.user.picture" class="comment-avatar" />
          <div class="user-info">
            <p class="username">
              {{ comment.user.username }}
            </p>
            <p>
              {{
                comment.created.toLocaleDateString(undefined, {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              }}
            </p>
          </div>
          <div class="comment-content">
            {{ comment.content }}
          </div>
        </div>
        <div class="comment-score">8.0</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { doc, getDoc } from 'firebase/firestore';

const props = defineProps({
  loggedInUser: Object,
  db: Object,
});

const routedRelease = useRoute().params.id;
let release = ref(null);

onMounted(async () => {
  const releaseDocument = doc(props.db, '/albums', routedRelease);
  const snapshot = await getDoc(releaseDocument);
  if (snapshot) {
    release.value = new Album(snapshot);
    await release.value.resolveArtist();
    await release.value.resolveComments(props.db);
    await release.value.resolveTracklist(props.db);
    console.log(release.value);
  } else {
    release.value = undefined;
  }
});
</script>

<style scoped>
.release-wrapper {
  padding: 30px;
  display: grid;
  grid-template-columns: 0.5fr 1fr 0.5fr;
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
}

.cover-container {
  grid-area: 1 / 1 / 2 / 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.links {
  display: block;
  padding: 20px;
}

.link-button {
  width: 20px;
  size: 20px;
  border: 2px solid black;
  border-radius: var(--border-radius);
  background: transparent;
}

.cover {
  height: 350px;
  width: auto;
  border-radius: var(--border-radius);
  aspect-ratio: 1;
}

.info {
  grid-area: 1 / 2 / 2 / 3;
  font-size: 20px;
  padding: 50px;
  padding-left: 70px;
  display: flex;
  flex-direction: column;
  gap: 10px; /* Adjust the gap as needed */
}

.info-row {
  display: flex;
  align-items: center;
}

.descriptor {
  width: 80px; /* Adjust the width as needed */
  padding-right: 10px; /* Adjust the padding as needed */
  text-align: left;
  opacity: 70%;
  font-size: 15px;
}

.score-container {
  grid-area: 1 / 3 / 2 / 4;
  display: flex;
  align-items: center;
  justify-content: center;
}
.score {
  height: 150px;
  width: 150px;
  border-radius: 50%;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
}

.title {
  font-size: 30px;
  font-weight: 800;
  padding-bottom: 20px;
}

.tracklist {
  grid-area: 2 / 1 / 3 / 2;
}

.tracklist-container {
  margin-top: 40px;
  border: 2px solid black;
  border-radius: var(--border-radius);
  padding-left: 10px;
  padding-right: 10px;
}

.track {
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: left;
  display: flex;
  justify-content: space-between;
}

.comment-container {
  grid-area: 2 / 2 / 3 / 4;
  margin-top: 30px;
  margin-left: 40px;
}

.comment {
  padding-left: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  padding-bottom: 10px;
}
.comment-avatar {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius);
}

.comment-start {
  display: flex;
  justify-content: center;
  align-items: center;
}
.user-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
}

.comment-content {
  padding-left: 20px;
}
.username {
  font-size: 18px;
  font-weight: 700;
}

.comment-score {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  border-style: solid;
  border-width: 2px;
  border-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  margin-right: 20px;
  @media (max-width: 600px) {
    display: none;
  }
}
</style>
