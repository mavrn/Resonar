<script setup>
import { getAuth, updateCurrentUser } from 'firebase/auth';
import { ref as storageRef, uploadBytes } from 'firebase/storage';

const location = ref('');
const bio = ref('');
const fileUpload = ref(null);

const { db } = defineProps({ db: Object });

let currentUser = null;
onMounted(() => {
  currentUser = getAuth().currentUser;
  console.log(currentUser);
});

const submit = async () => {
  if (!fileUpload.value) return;

  const files = fileUpload.value.files;
  if (files.length === 0) {
    console.log('No file selected for upload.');
    return;
  }

  const storage = useFirebaseStorage();

  const file = files[0];
  const fileEnding = file.name.split('.')[1];
  const fileName = currentUser.uid + '.' + fileEnding;
  const imageRef = storageRef(storage, '/images/' + fileName);
  uploadBytes(imageRef, file)
    .then((snapshot) => {
      console.log('Image uploaded successfully:', snapshot.ref.fullPath);
    })
    .catch((error) => {
      console.error('Image upload error:', error);
    });
  updateUser(db, currentUser.uid, {
    location: location.value,
    bio: bio.value,
    picture: fileName,
  });
  navigateTo('/');
};
</script>

<template>
  <div class="wrapper">
    <div class="card">
      <h1>Complete your Profile</h1>
      <form @submit.prevent="complete">
        <div class="input-field p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="material-icons">location_on</i>
          </span>
          <InputText placeholder="Location" v-model="location" type="text" />
        </div>

        <div class="input-field p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="material-icons">mail</i>
          </span>
          <FileUpload
            mode="basic"
            ref="fileUpload"
            name="demo[]"
            accept="image/*"
            chooseLabel="Browse"
            class="upload"
          />
        </div>

        <div class="input-field p-inputgroup" style="padding-bottom: 20px">
          <span class="p-inputgroup-addon">
            <i class="material-icons">import_contacts</i>
          </span>
          <InputText placeholder="Bio" v-model="bio" />
        </div>

        <Button class="login-button" type="submit" @click="submit"
          >Submit</Button
        >
      </form>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  height: 70vh;
  justify-content: center;
  align-items: center;
}

.card {
  width: 30vw;
  min-width: 300px;
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

form {
  flex-direction: column;
  align-items: center;
  display: flex;
  width: 100%;
  gap: 5px;
}

.input-field {
  margin-left: auto;
  margin-right: auto;
  min-width: 300px;
  width: 70%;
}

.upload {
  width: 200px;
}
</style>
