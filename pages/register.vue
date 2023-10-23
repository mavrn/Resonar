<template>
  <h1 class="text-white">Create an Account</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p><button class="bg-white" @click="register">Submit</button></p>
  <p>
    <button class="bg-white" @click="signInWithGoogle">
      Sign Up With Google
    </button>
  </p>
</template>

<script setup>
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const router = useRouter();
const email = ref('');
const password = ref('');
const register = () => {
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
      console.log('Successfully registered!');
      router.push('/');
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
      router.push('/');
    })
    .catch((error) => {
      console.log(error.code);
      alert(error.message);
    });
};
</script>

<style lang="scss" scoped></style>
