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

const signIn = async () => {
  signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
      console.log('Successfully signed in!');
      router.push('./');
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

const signInRedirect = async () => {
  signInWithRedirect(getAuth(), new GoogleAuthProvider()).catch((error) => {
    console.error('Failed signinRedirect', error);
    errMsg.value = 'Failed Redirect.';
  });
};
</script>

<template>
  <div class="flex h-[70vh] justify-center items-center">
    <div
      class="w-[30vw] min-w-[300px] h-[50vh] bg-primarylight space-y-4 flex flex-col items-center justify-center text-white rounded-xl"
    >
      <h1 class="text-4xl">Sign In</h1>
      <form
        class="items-center flex-col flex w-[100%]"
        @submit.prevent="signIn"
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
        <p v-if="errMsg" class="p-0 m-0 text-red">{{ errMsg }}</p>
        <v-btn variant="tonal" class="mt-5 text-subtitle-1" type="submit"
          >Sign In</v-btn
        >
        <p class="text-xl py-3">Or</p>
        <v-btn
          variant="tonal"
          class="mb-5 text-subtitle-1"
          @click="signInRedirect"
        >
          Sign in With Google
        </v-btn>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
