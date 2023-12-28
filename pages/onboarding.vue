<script setup>
import { getAuth, updateCurrentUser } from 'firebase/auth';
import { ref as storageRef, uploadBytes } from 'firebase/storage';
import { useUserStore } from '../store/currentUser';

const userStore = useUserStore();
const db = useFirestore();
const location = ref('');
const bio = ref('');
const fileUpload = ref(null);

const hasPicture = async (user) => {
  console.log(user);
  const foundUser = await getUser(db, user.username);
  console.log('haspic found user', foundUser);
  return Boolean(foundUser.data().picture);
};

const submit = async () => {
  if (!fileUpload.value) return;
  const currentUser = userStore.currentUser;
  const files = fileUpload.value.files;
  let fileName;
  if (!(await hasPicture(currentUser))) {
    if (files.length === 0) {
      console.log('Reverted to default avatar.');
      fileName = 'avatar.jpg';
    } else {
      const storage = useFirebaseStorage();

      const file = files[0];
      const fileEnding = file.name.split('.')[1];
      fileName = currentUser.uid + '.' + fileEnding;
      const imageRef = storageRef(storage, '/images/' + fileName);
      uploadBytes(imageRef, file)
        .then((snapshot) => {
          console.debug('Image uploaded successfully:', snapshot.ref.fullPath);
        })
        .catch((error) => {
          console.error('Image upload error:', error);
        });
    }
  }
  console.log('updating user uid', currentUser.uid, 'with', location, bio);
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
            <i class="material-icons">import_contacts</i>
          </span>
          <InputText placeholder="Bio" v-model="bio" />
        </div>
        <div class="upload-wrapper">
            <i class="material-icons image-ico">image</i>
          <FileUpload
            mode="basic"
            ref="fileUpload"
            name="demo[]"
            accept="image/*"
            chooseLabel="Browse"
            class="upload secondary-button"
          />
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
  scale: 80%;
}

.image-ico {
  font-size: 28px;
  margin-right: 15px;
  opacity: 0.7;
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
</style>
