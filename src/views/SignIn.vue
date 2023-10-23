<template>
  <h1 class="text-white">Sign In</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p v-if="errMsg">{{ errMsg }}</p>
  <p><button class="bg-white" @click="signIn">Submit</button></p>
  <p>
    <button class="bg-white" @click="signInWithGoogle">
      Log In With Google
    </button>
  </p>
</template>

<script setup>
import { ref } from 'vue';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useRouter } from 'vue-router';
import router from '../router';

const email = ref('');
const password = ref('');
const errMsg = ref();
const signIn = () => {
  signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
      console.log('Successfully registered!');
      router.push('/');
    })
    .catch((error) => {
      console.log(error.code);
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
const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
    .then((data) => {
      console.log('Successfully registered!');
      router.push('/');
    })
    .catch((error) => {
      console.log(error.code);
      alert(error.message);
    });
};
</script>

<style lang="scss" scoped></style>
