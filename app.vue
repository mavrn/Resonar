<script setup lang="ts">
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { getDocs, collection, getDoc, doc } from 'firebase/firestore';

const searchTerm = ref('');
const filterSettings = ref(Filter);
const sorting = ref('popular');
const router = useRouter();
const db = useFirestore();
const userProfile = ref<DocumentData | null>(null);

let auth: Auth;

const albums = ref<QueryDocumentSnapshot[]>([]);
const isLoggedIn = ref(false);

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      userProfile.value = useDocument(doc(collection(db, 'users'), user.uid));
    } else {
      isLoggedIn.value = false;
    }
  });
});

const handleSearchValueChange = (newQuery: string) => {
  searchTerm.value = newQuery;
  router.push({
    path: '/',
    query: { search: encodeURIComponent(searchTerm.value) },
  });
};

const handleSetFilter = (newFilter: typeof Filter) => {};

const handleSignOut = async () => {
  signOut(auth);
};
</script>

<template>
  <body class="header-fixed">
    <div class="wrapper">
      <TopBar
        :onSearchValueChange="handleSearchValueChange"
        :isLoggedIn="isLoggedIn"
        :handleSignOut="handleSignOut"
        :loggedInUser="userProfile?.value"
      />
      <NuxtPage
        :loggedInUser="userProfile"
        :searchValue="searchTerm"
      ></NuxtPage>
    </div>
  </body>
</template>

<style scoped>
body {
  margin: auto;
  font-weight: 300;
  background: var(--primary-bg);
  color: var(--primary);
  line-height: 200%;
}
.header-fixed {
  margin: auto;
  color: var(--primary);
  display: block;
}

.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: inherit;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
}

.show-bigger-than-lg-flex {
  display: none;
  @media (min-width: 1024px) {
    display: flex;
  }
}

.show-bigger-than-lg-block {
  display: none;
  @media (min-width: 1024px) {
    display: block;
  }
}

.show-smaller-than-lg-flex {
  display: none;
  @media (max-width: 1024px) {
    display: flex;
  }
}

.show-smaller-than-lg-block {
  display: none;
  @media (max-width: 1024px) {
    display: block;
  }
}

.show-bigger-than-md-flex {
  display: none;
  @media (min-width: 768px) {
    display: flex;
  }
}

.show-bigger-than-md-block {
  display: none;
  @media (min-width: 768px) {
    display: block;
  }
}

.show-smaller-than-md-flex {
  display: none;
  @media (max-width: 768px) {
    display: flex;
  }
}

.show-smaller-than-md-block {
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
}

.show-bigger-than-sm-flex {
  display: none;
  @media (min-width: 640px) {
    display: flex;
  }
}

.show-bigger-than-sm-block {
  display: none;
  @media (min-width: 640px) {
    display: block;
  }
}

.show-smaller-than-sm-flex {
  display: none;
  @media (max-width: 640px) {
    display: flex;
  }
}

.show-smaller-than-sm-block {
  display: none;
  @media (max-width: 640px) {
    display: block;
  }
}

.secondary-button {
  background: transparent;
  color: black;
}
</style>
