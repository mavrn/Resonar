<script setup lang="ts">
import {
  getAuth,
  getRedirectResult,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth';

const router = useRouter();
const email = ref('');
const password = ref('');
const errMsg = ref();
const db = useFirestore();

function isValidEmail(email: string) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

const signIn = async () => {
  let emailToSearch = email.value;
  if (!isValidEmail(email.value)) {
    const foundUser = await getUser(db, email.value);
    if (!foundUser) {
      errMsg.value = "Couldn't find Username.";
      return;
    }
    emailToSearch = foundUser.data().email;
  }
  signInWithEmailAndPassword(getAuth(), emailToSearch, password.value)
    .then((data) => {
      console.debug('Successfully signed in!');
      router.push('./');
    })
    .catch((error) => {
      console.debug(error.code);
      switch (error.code) {
        case 'auth/invalid-email':
          errMsg.value = 'Invalid email';
          break;
        case 'auth/user-not-found':
          errMsg.value = 'User not found';
          break;
        case 'auth/wrong-password':
          errMsg.value = 'Wrong password';
          break;
        default:
          errMsg.value = 'Log-In Data is incorrect';
          break;
      }
    });
};

const signInRedirect = async () => {
  signInWithRedirect(getAuth(), new GoogleAuthProvider()).catch((error) => {
    console.error('Failed signinRedirect', error);
    errMsg.value = 'Failed Redirect.';
  });
};
</script>

<template>
  <div class="wrapper">
    <div class="card">
      <h1>Sign In</h1>
      <form @submit.prevent="signIn">
        <div class="input-field p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="material-icons">person</i>
          </span>
          <InputText
            placeholder="E-Mail or Username"
            v-model="email"
            type="text"
          />
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
        <Button class="login-button" type="submit">Sign In</Button>
        <p class="text-divider">OR</p>
        <Button class="secondary-button google-button" @click="signInRedirect">
          <img class="google-logo" src="../assets/google.svg" />
          Sign in With Google
        </Button>
        <p class="text-divider show-smaller-than-md-block">OR</p>
        <Button class="show-smaller-than-md-block">
          <NuxtLink :to="'/register'" class="register-text"
            >Register a new account</NuxtLink
          ></Button
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

.text-divider {
  font-size: 12px;
  margin-top: 3px;
  margin-bottom: 3px;
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
.register-text {
  color: white;
  text-decoration: none;
}
</style>
