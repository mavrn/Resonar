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
      router.push('./');
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
  <div class="flex h-[70vh] justify-center items-center">
    <div
      class="w-[30vw] min-w-[300px] h-[50vh] bg-primarylight space-y-4 flex flex-col items-center justify-center text-white rounded-xl"
    >
      <h1 class="text-4xl">Create an Account</h1>
      <form
        class="items-center flex-col flex w-[100%]"
        @submit.prevent="register"
      >
        <v-text-field
          class="mx-auto min-w-[100px] w-[50%]"
          label="E-Mail"
          type="text"
          hide-details="auto"
          v-model="email"
        />
        <v-text-field
          class="mx-auto min-w-[100px] w-[50%]"
          hide-details="auto"
          type="Password"
          label="Password"
          v-model="password"
        />
        <v-btn variant="tonal" class="mt-5 text-subtitle-1" type="submit"
          >Register</v-btn
        >
        <p class="text-xl py-3">Or</p>
        <v-btn
          variant="tonal"
          class="mb-5 text-subtitle-1"
          @click="signInWithGoogle"
        >
          Register With Google
        </v-btn>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
