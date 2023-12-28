<template>
  <div class="flex">
    <div class="card">
      <h2>Edit your Profile</h2>
      <form @submit.prevent="complete">
        <div class="input-field p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="material-icons">person</i>
          </span>
          <InputText
            placeholder="Username"
            v-model="updatedUser.username"
            type="text"
          />
        </div>
        <div class="input-field p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="material-icons">location_on</i>
          </span>
          <InputText
            placeholder="Location"
            v-model="updatedUser.location"
            type="text"
          />
        </div>

        <div class="input-field p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="material-icons">import_contacts</i>
          </span>
          <InputText placeholder="Bio" v-model="updatedUser.bio" />
        </div>
        <div class="upload-wrapper">
          <i class="material-icons image-ico">image</i>
          <div class="limiter">
            <FileUpload
              mode="basic"
              ref="fileUpload"
              name="demo[]"
              accept="image/*"
              chooseLabel="Browse"
              class="upload secondary-button"
            />
          </div>
          <Button
            class="big-rm-button secondary-button"
            @click="removePicture()"
            >Remove Picture</Button
          >
          <Button
            class="secondary-button small-rm-button"
            @click="removePicture()"
            ><i class="material-icons">delete</i></Button
          >
        </div>
        <Button
          v-if="submitLoadingState === 'idle'"
          class="login-button"
          type="submit"
          @click="submitUser"
          >Submit</Button
        >
        <div
          v-else-if="submitLoadingState === 'loading'"
          class="submit-placeholder"
        >
          <img
            src="../assets/loading.gif"
            class="loading-gif"
            alt="Loading Animation"
          />
        </div>
        <div
          v-else-if="submitLoadingState === 'done'"
          class="submit-placeholder"
        >
          <i class="material-icons">done</i>
        </div>
      </form>
      <Button class="sign-out-button secondary-button" @click="handleSignOut()"
        >Sign out</Button
      >
    </div>
  </div>
</template>

<script setup>
import { getAuth, signOut } from 'firebase/auth';
import { ref as storageRef, uploadBytes } from 'firebase/storage';

const props = defineProps({ user: User });
const db = useFirestore();
const router = useRouter();
const auth = getAuth();
const submitLoadingState = ref('idle');
const fileUpload = ref(null);
const errMsg = ref('');
const updatedUser = ref({
  picture: props.user?.picture,
  username: props.user?.username,
  location: props.user?.location,
  bio: props.user?.bio,
});

function removePicture() {
  fileUpload.files = [];
  updatedUser.value.picture = 'avatar.jpg';
}
async function submitUser() {
  submitLoadingState.value = 'loading';
  const files = fileUpload.value.files;
  if (files.length != 0) {
    const storage = useFirebaseStorage();
    const file = files[0];
    const fileEnding = file.name.split('.')[1];
    const fileName = props.user.uid + '.' + fileEnding;
    const imageRef = storageRef(storage, '/images/' + fileName);
    const snapshot = await uploadBytes(imageRef, file);
    console.debug('Image uploaded successfully:', snapshot.ref.fullPath);
    updatedUser.value.picture = fileName;
  }

  if (props.user && props.user.uid) {
    await updateUser(db, props.user.uid, updatedUser.value);
    submitLoadingState.value = 'done';
    props.user.username = updatedUser.value.username;
    props.user.location = updatedUser.value.location;
    props.user.bio = updatedUser.value.bio;
    props.user.picture = updatedUser.value.picture;
    router.push('./' + updatedUser.value.username);
  }
}
function handleSignOut() {
  signOut(auth);
  router.push('../');
}
</script>

<style scoped>
.card {
  width: 30vw;
  min-width: 300px;
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

form {
  flex-direction: column;
  align-items: center;
  display: flex;
  width: 100%;
  gap: 5px;
  margin-top: 10px;
}

.input-field {
  margin-left: auto;
  margin-right: auto;
  min-width: 300px;
  width: 70%;
}

.upload {
  scale: 80%;
}

.image-ico {
  font-size: 28px;
  margin-right: 15px;
  opacity: 0.7;
}

.limiter {
  max-width: 150px;
  overflow: hidden;
}
.upload-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 300px;
  width: 70%;
  margin-left: 20px;
  margin-bottom: 20px;
}

.big-rm-button {
  margin-left: 10px;
  display: none;
  font-size: 12px;
  @media (min-width: 1101px) {
    display: block;
  }
}

.small-rm-button {
  padding: 10px;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  display: flex;
  @media (min-width: 1101px) {
    display: none;
  }
}

.submit-placeholder {
  border-radius: 5px;
  border: 2px solid black;
  background-color: transparent;
  color: black;
  width: 93px;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-gif {
  width: 30px;
  height: 30px;
}
</style>
