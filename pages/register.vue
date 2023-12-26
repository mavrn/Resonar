<script setup>
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const db = useFirestore();
const email = ref('');
const username = ref('');
const errMsg = ref();
const password = ref('');
const auth = getAuth();
const register = async () => {
  if (await getUser(db, username.value)) {
    errMsg.value = 'Username taken.';
    return;
  }
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(async (userCredentials) => {
      console.debug('Successfully registered!');
      await createUser(
        db,
        username.value,
        email.value,
        userCredentials.user.uid
      );
      navigateTo('/onboarding');
    })
    .catch((error) => {
      console.debug(error.code);
      errMsg.value = error.message;
    });
};
const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
    .then(async (userCredentials) => {
      console.log(userCredentials);
      await createUser(
        db,
        userCredentials.user.displayName,
        userCredentials.user.email,
        userCredentials.user.uid
      );
      await updateUser(db, userCredentials.user.uid, {
        picture: userCredentials.user.photoURL,
      });
      console.debug('Successfully registered!');
      navigateTo('/onboarding');
    })
    .catch((error) => {
      console.debug(error.code);
      errMsg.value = error.message;
    });
};
</script>

<template>
  <div class="wrapper">
    <div class="card">
      <h1>Create an Account</h1>
      <form @submit.prevent="register">
        <div class="input-field p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="material-icons">person</i>
          </span>
          <InputText placeholder="Username" v-model="username" type="text" />
        </div>
        <div class="input-field p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="material-icons">mail</i>
          </span>
          <InputText placeholder="E-Mail" v-model="email" type="text" />
        </div>

        <div class="input-field p-inputgroup" style="padding-bottom: 20px">
          <span class="p-inputgroup-addon">
            <i class="material-icons">key</i>
          </span>
          <InputText
            placeholder="Password"
            v-model="password"
            type="password"
          />
        </div>
        <p v-if="errMsg" class="error-message">{{ errMsg }}</p>
        <Button class="login-button" type="submit">Register</Button>
        <p class="text-divider">OR</p>
        <Button
          class="secondary-button google-button"
          @click="signInWithGoogle"
        >
          <img class="google-logo" src="../assets/google.svg" />
          Register With Google
        </Button>
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

.text-divider {
  font-size: 12px;
}
.google-button {
  padding: 7px;
}
.google-logo {
  height: 30px;
  width: auto;
  padding-right: 5px;
  padding-top: 2px;
}

.error-message {
  color: red;
  padding-bottom: 15px;
}
</style>
