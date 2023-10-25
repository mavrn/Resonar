<script setup>
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const email = ref('');
const password = ref('');
const register = () => {
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
      console.log('Successfully registered!');
    })
    .catch((error) => {
      console.log(error.code);
      alert(error.message);
    });
};
const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
    .then((data) => {
      console.log('Successfully registered!');
    })
    .catch((error) => {
      console.log(error.code);
      alert(error.message);
    });
};
</script>

<template>
  <div class="text-white pt-6 space-y-4 flex flex-col items-center">
    <h1 class="text-4xl">Create an Account</h1>
    <v-form class="items-center flex-col flex" @submit.prevent="register">
      <v-text-field
        class="text-white mx-auto"
        label="E-Mail"
        type="text"
        hide-details="auto"
        v-model="email"
        style="width: 30vw"
      />
      <v-text-field
        class="text-white mx-auto"
        hide-details="auto"
        type="Password"
        label="Password"
        v-model="password"
        style="width: 30vw"
      />
      <v-btn variant="tonal" class="mt-5 text-subtitle-1" type="submit"
        >Register</v-btn
      >
      <p class="text-xl py-3">Or</p>
      <v-btn
        variant="tonal"
        class="mt-5 text-subtitle-1"
        @click="signInWithGoogle"
      >
        Register With Google
      </v-btn>
    </v-form>
  </div>
</template>

<style lang="scss" scoped></style>
