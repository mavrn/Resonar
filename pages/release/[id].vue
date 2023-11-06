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
        <p class="title">{{ release.name }}</p>
      </div>
      <div class="info-row">
        <p class="descriptor">Artist</p>
        <p>{{ release.artist?.name }}</p>
      </div>
      <div class="info-row">
        <p class="descriptor">Type</p>
        <p>{{ toTitleCase(release.type) }}</p>
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
      <div v-if="!isRating" class="score">{{ release.rating }}</div>
      <Knob
        v-else
        v-model="roundedRating"
        :min="0"
        :max="10"
        :step="0.1"
        :size="190"
      ></Knob>
      <div class="score-buttons">
        <button
          v-if="currentUser && !isRating && userRating === undefined"
          class="add-rating-button"
          @click="isRating = !isRating"
        >
          <i class="material-icons plus-icon">add</i>
        </button>
        <button
          v-if="isRating"
          class="add-rating-button red"
          @click="isRating = false"
        >
          <i class="material-icons plus-icon">close</i>
        </button>
        <button
          v-if="currentUser && isRating"
          class="add-rating-button green"
          @click="addRating()"
        >
          <i class="material-icons plus-icon">check</i>
        </button>
        <button
          v-if="userRating != undefined"
          class="user-rating-button"
          @click="removeRating"
        >
          <span class="user-rating">{{ userRating }}</span>
          <i class="material-icons user-rating-delete-icon">close</i>
        </button>
      </div>
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
      <div v-if="currentUser" class="add-comment-container">
        <textarea
          class="add-comment-input"
          v-model="commentInput"
          placeholder="Add a comment"
        ></textarea>
        <button class="add-comment-button" @click="addComment">Post</button>
      </div>
      <div
        class="comment-wrapper"
        v-for="comment in release.comments"
        :key="comment.uid"
      >
        <div class="comment">
          <div class="comment-card">
            <div class="comment-content">
              <NuxtLink
                class="comment-avatar"
                :to="'/user/' + comment.user.username"
              >
                <img class="avatar" :src="comment.picture" />
              </NuxtLink>
              <div class="comment-main">
                <div class="comment-top-row">
                  <NuxtLink
                    class="comment-username"
                    :to="'/user/' + comment.user.username"
                    >{{ comment.user.username }}</NuxtLink
                  ><span class="comment-time">{{
                    getTimeDescriptor(comment.created)
                  }}</span>
                  <div v-if="comment.rating != undefined" class="comment-score">
                    {{ comment.rating }}
                  </div>
                </div>
                <p class="comment-text">
                  {{ comment.content }}
                </p>
              </div>
            </div>
            <div v-if="isReplyingTo != comment.uid" class="comment-footer">
              <a
                v-if="currentUser"
                @click="
                  isReplyingTo = comment.uid;
                  isReplyingToParent = comment.uid;
                "
                class="footer-link"
                >Reply</a
              >
              <a
                v-if="currentUser?.uid == comment.user.uid"
                @click="removeComment(comment.uid)"
                class="footer-link"
                >Delete</a
              >
            </div>
            <div v-else class="reply-footer">
              <input
                class="reply-input"
                :placeholder="'@' + comment.user.username"
                v-model="replyInput"
              />
              <button class="reply-button" @click="addReply()">
                <i class="material-icons">check</i>
              </button>
              <button class="reply-button" @click="isReplyingTo = null">
                <i class="material-icons">close</i>
              </button>
            </div>
          </div>
        </div>
        <div class="reply" v-for="reply in comment.replies">
          <div class="comment-card">
            <div class="comment-content">
              <NuxtLink
                class="comment-avatar"
                :to="'/user/' + reply.user.username"
              >
                <img class="avatar" :src="reply.picture" />
              </NuxtLink>
              <div class="comment-main">
                <div class="comment-top-row">
                  <NuxtLink
                    class="comment-username"
                    :to="'/user/' + reply.user.username"
                    >{{ reply.user.username }}</NuxtLink
                  ><span class="comment-time">{{
                    getTimeDescriptor(reply.created)
                  }}</span>
                  <div v-if="reply.rating != undefined" class="comment-score">
                    {{ reply.rating }}
                  </div>
                </div>
                <p class="comment-text">
                  {{ reply.content }}
                </p>
              </div>
            </div>
            <div v-if="isReplyingTo != reply.uid" class="comment-footer">
              <a
                v-if="currentUser"
                @click="
                  isReplyingTo = reply.uid;
                  isReplyingToParent = comment.uid;
                "
                class="footer-link"
                >Reply</a
              >
              <a
                v-if="currentUser?.uid == reply.user.uid"
                @click="removeReply(reply.uid, comment.uid)"
                class="footer-link"
                >Delete</a
              >
            </div>
            <div v-else class="reply-footer">
              <input
                class="reply-input"
                :placeholder="'@' + reply.user.username"
                v-model="replyInput"
              />
              <button class="reply-button" @click="addReply()">
                <i class="material-icons">check</i>
              </button>
              <button
                class="reply-button"
                @click="
                  isReplyingTo = null;
                  isReplyingToParent = null;
                "
              >
                <i class="material-icons">close</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { doc, getDoc } from 'firebase/firestore';
import { useUserStore } from '../../store/currentUser';

const db = useFirestore();
const { currentUser } = storeToRefs(useUserStore());
const routedRelease = useRoute().params.id;
let release = ref(null);
const isRating = ref(false);
const userRating = ref(null);
const selectedRating = ref(5);
const commentInput = ref('');
const isReplyingTo = ref(null);
const isReplyingToParent = ref(null);
const replyInput = ref('');
const roundedRating = computed({
  get: () => selectedRating.value,
  set: (value) => (selectedRating.value = parseFloat(value.toFixed(1))),
});

function setUserRating() {
  let newUserRating = undefined;
  if (currentUser.value) {
    for (const rating of currentUser.value.ratings) {
      if (rating.release.uid == release.value.uid) {
        newUserRating = rating.rating;
      }
    }
  }
  userRating.value = newUserRating;
}

onMounted(async () => {
  const releaseDocument = doc(db, '/albums', routedRelease);
  const snapshot = await getDoc(releaseDocument);
  if (snapshot) {
    release.value = new Release(snapshot);
    await release.value.resolveArtist();
    await release.value.resolveTracklist(db);
    setUserRating();
    release.value.resolveComments(db);
  } else {
    release.value = undefined;
  }
});

watch(
  () => currentUser.value,
  () => {
    setUserRating();
  }
);

async function addRating() {
  isRating.value = false;
  userRating.value = selectedRating.value;
  currentUser.value.ratings.push({
    rating: userRating.value,
    release: release.value,
    created: new Date(),
  });
  release.value.rating = await currentUser.value.addRating(
    db,
    release.value,
    selectedRating.value
  );
}

async function addComment() {
  const newComment = await release.value.addComment(
    db,
    commentInput.value,
    currentUser.value
  );
  release.value.comments.unshift(newComment);
  commentInput.value = '';
}

async function addReply() {
  const commentIndex = release.value.comments.findIndex(
    (comment) => comment.uid == isReplyingToParent.value
  );
  const newComment = await release.value.addReply(
    db,
    isReplyingToParent.value,
    replyInput.value,
    currentUser.value
  );
  release.value.comments[commentIndex].replies.push(newComment);
  isReplyingToParent.value = null;
  isReplyingTo.value = null;
  replyInput.value = '';
}

async function removeRating() {
  currentUser.value.ratings = currentUser.value.ratings.filter(
    (rating) => rating.release.uid !== release.value.uid
  );
  userRating.value = undefined;
  release.value.rating = await currentUser.value.removeRating(
    db,
    release.value
  );
}

async function removeComment(commentID) {
  release.value.comments = release.value.comments.filter(
    (comment) => comment.uid !== commentID
  );
  release.value.removeComment(db, commentID);
}

async function removeReply(replyID, parentID) {
  const commentIndex = release.value.comments.findIndex(
    (comment) => comment.uid == parentID
  );
  release.value.comments[commentIndex].replies = release.value.comments[
    commentIndex
  ].replies.filter((reply) => reply.uid !== replyID);
  release.value.removeReply(db, replyID, parentID);
}
</script>

<style scoped>
.release-wrapper {
  padding: 30px;
  display: grid;
  grid-template-columns: 0.5fr 1fr 0.5fr;
  grid-template-rows: 1fr min-content;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 0.8fr 0.6fr 0.6fr min-content;
    padding: 10px;
    padding-top: 36px;
  }
}

.cover-container {
  grid-area: 1 / 1 / 2 / 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 900px) {
    grid-area: 1 / 1 / 2 / 2;
  }
}

.info {
  grid-area: 1 / 2 / 2 / 3;
  font-size: 20px;
  padding: 50px;
  padding-left: 70px;
  display: flex;
  flex-direction: column;
  gap: 10px; /* Adjust the gap as needed */
  @media (max-width: 900px) {
    grid-area: 2 / 1 / 3 / 2;
    padding: 0;
    justify-content: center;
    padding-left: 5px;
    padding-right: 5px;
  }
}
.score-container {
  grid-area: 1 / 3 / 2 / 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 900px) {
    grid-area: 3 / 1 / 4 / 2;
  }
}
.tracklist {
  grid-area: 2 / 1 / 3 / 2;
  @media (max-width: 900px) {
    grid-area: 4 / 1 / 5 / 2;
  }
}
.comment-container {
  grid-area: 2 / 2 / 3 / 4;
  margin-top: 30px;
  margin-left: 2rem;
  width: 95%;
  @media (max-width: 900px) {
    grid-area: 5 / 1 / 6 / 2;
    margin-left: 0;
    width: 100%;
  }
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
  box-shadow: 0 0 30px rgba(0, 0, 0, 1);
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

.user-rating-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px double black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  margin-top: 10px;
  background: transparent;
  position: relative;
  transition: all 0.3s;
  animation: pulse 0.6s 1;
}

.user-rating-button:before {
  content: '';
  border: 1px solid black;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  z-index: -1;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }

  100% {
    transfor: scale(1);
  }
}

.user-rating-delete-icon {
  color: white;
  display: none;
}

.user-rating-button:hover .user-rating {
  display: none;
}

.user-rating-button:hover .user-rating-delete-icon {
  display: inline;
}

.user-rating-button:hover {
  background-color: black;
  transform: scale(1.1);
}

.score-buttons {
  display: flex;
  gap: 10px;
}
.add-rating-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  background-color: transparent;
  transition: all 0.3s;
}

.add-rating-button:hover {
  color: white;
  background-color: black;
  transform: scale(1.1);
}

.green {
  background-color: transparent;
  border: 2px solid green;
}
.green:hover {
  background-color: rgba(88, 143, 86, 0.5);
}
.red {
  border: 2px solid red;
}

.red:hover {
  background-color: rgba(212, 68, 68, 0.5);
}

.title {
  font-size: 30px;
  font-weight: 800;
  padding-bottom: 20px;
}

.tracklist-container {
  margin-top: 40px;
  border: 1px solid black;
  border-radius: var(--border-radius);
  padding-left: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  padding-right: 10px;
}

.comment-content {
  display: flex;
  min-width: 100%;
}

.comment-wrapper {
  animation: slide 0.5s 1;
}

@keyframes slide {
  0% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
}

.comment-main {
  width: 100%;
}

.track {
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: left;
  display: flex;
  justify-content: space-between;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.add-comment-container {
  margin-top: 10px;
  margin-bottom: 5px;
  width: 100%;
  border: none;
  border-bottom: 2px solid black;
  display: flex;
  padding-left: 10px;
  padding-right: 20px;
}

.add-comment-container:focus-within {
  background-color: white;
  border: none;
  border: 1px solid black;
  border-radius: var(--border-radius);
  min-width: 100%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  align-items: center;
  min-height: 50px;
}

.add-comment-input {
  border: none;
  width: 100%;
  max-height: 20px;
  font-family: 'Inter', sans-serif;
}

.add-comment-input:focus {
  border: none;
  outline: none;
}

.add-comment-button {
  display: none;
  background: transparent;
  padding: 6px;
  border-radius: var(--border-radius);
  border: 1px solid black;
  min-width: 60px;
}

.add-comment-container:focus-within .add-comment-button {
  display: block;
}

.add-comment-button:focus {
  display: block;
}

.comment {
  margin-top: 10px;
}

.reply::before {
  content: '';
  background-color: black;
  position: absolute;
  min-height: 100%;
  width: 1px;
  left: -10px;
}

.reply {
  margin-left: 3.5rem;
  margin-top: 10px;
  position: relative;
}

.comment-username {
  font-size: 20px;
  padding-left: 10px;
  text-decoration: none;
  color: black;
}

.comment-time {
  font-size: 12px;
  padding-left: 5px;
}

.comment-text {
  padding-top: 10px;
  padding-left: 10px;
  width: 100%;
}

.comment-card {
  padding: 20px;
  background-color: white;
  border: 1px solid black;
  border-radius: var(--border-radius);
  min-width: 100%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.comment-footer {
  display: flex;
  font-size: 0.7rem;
  opacity: 0.6;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
}

.reply-footer {
  width: 100%;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.reply-input {
  width: 90%;
  border: none;
  border-bottom: 1px solid black;
  padding: 5px;
}

.reply-input:focus {
  outline: none;
}

.reply-button {
  border-radius: var(--border-radius);
  border: none;
  background: transparent;
}

.reply-button:hover {
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
}

.reply-input::placeholder {
  opacity: 50%;
}

.comment-top-row {
  display: flex;
  align-items: center;
}

.comment-score {
  height: 34px;
  width: 34px;
  border-radius: 50%;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  flex-shrink: 0;
  margin-left: auto;
  @media (max-width: 600px) {
    display: none;
  }
}

.footer-link {
  cursor: pointer;
  opacity: 60%;
}

.footer-link:hover {
  cursor: pointer;
  opacity: 100%;
}
</style>

<style>
.p-knob-text {
  fill: black;
  font-size: 23px;
}
</style>
