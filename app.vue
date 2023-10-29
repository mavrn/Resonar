<script setup lang="ts">
import type { Auth } from 'firebase/auth';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { FirebaseStorage } from 'firebase/storage';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDocs, collection, getDoc, doc } from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
} from 'firebase/storage';

const searchTerm = ref('');
const filterSettings = ref(Filter);
const sorting = ref('relevance');
const router = useRouter();
const db = useFirestore();
const index = ref([]);

const userProfile = ref<DocumentData | null>(null);

let auth: Auth;

const albums = ref<QueryDocumentSnapshot[]>([]);
const isLoggedIn = ref(false);

const fetchIndexJson = async () => {
  const requestOptions = {
    method: 'GET',
    headers: new Headers({}),
  };
  const storage = useFirebaseStorage();
  const jsonRef = storageRef(storage, 'index.json');
  const url = await new Promise((resolve, reject) => {
    const storageUrl = useStorageFileUrl(jsonRef);
    storageUrl
      .refresh()
      .then(() => {
        resolve(storageUrl.url.value);
      })
      .catch(reject);
  });
  if (url) {
    const request = new Request(url, requestOptions);
    const response = await fetch(request);
    const json = await response.json();
    return json;
  }
};

onMounted(() => {
  const indexProbe = localStorage.getItem('index');
  if (indexProbe) {
    console.log('Found index in local storage.');
    index.value = JSON.parse(indexProbe);
  } else {
    console.log('Didnt find index in local storage.');
    fetchIndexJson().then((response) => {
      index.value = response;
      localStorage.setItem('index', JSON.stringify(response));
    });
  }

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

const handleSortingChange = (newSorting: string) => {
  sorting.value = newSorting;
  console.log("Sorting changed to", newSorting);
}

const handleFilterChange = (newFilter: typeof Filter) => {};

const handleSignOut = async () => {
  signOut(auth);
};
</script>

<template>
  <div class="header-fixed">
    <div class="wrapper">
      <TopBar
        :onSearchValueChange="handleSearchValueChange"
        :isLoggedIn="isLoggedIn"
        :handleSignOut="handleSignOut"
        :loggedInUser="userProfile?.value"
        :handleSortingChange="handleSortingChange"
        :handleFilterChange="handleFilterChange"
      />
      <NuxtPage
        :loggedInUser="userProfile"
        :searchValue="searchTerm"
        :index="index"
        :sorting="sorting"
      ></NuxtPage>
    </div>
  </div>
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
  @media (min-width: 1025px) {
    display: flex;
  }
}

.show-bigger-than-lg-block {
  display: none;
  @media (min-width: 1025px) {
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
  @media (min-width: 769px) {
    display: flex;
  }
}

.show-bigger-than-md-block {
  display: none;
  @media (min-width: 769px) {
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
  @media (min-width: 501px) {
    display: flex;
  }
}

.show-bigger-than-sm-block {
  display: none;
  @media (min-width: 501px) {
    display: block;
  }
}

.show-smaller-than-sm-flex {
  display: none;
  @media (max-width: 500px) {
    display: flex;
  }
}

.show-smaller-than-sm-block {
  display: none;
  @media (max-width: 500px) {
    display: block;
  }
}

.show-between-sm-md {
  display: none;
  @media (min-width: 501px) and (max-width: 768px) {
    display:flex
  }
}

.secondary-button {
  background: transparent;
  color: black;
}
</style>
