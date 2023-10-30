<script setup lang="ts">
import type { Auth } from 'firebase/auth';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDocs, collection, getDoc, doc } from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
} from 'firebase/storage';

const searchTerm = ref('');
const filterSettings = ref(Filter);
const sorting = ref({ field: 'popular', order: -1 });
const router = useRouter();
const db = useFirestore();
const index = ref<Array<{ rating: number; reference: string }>>([]);

const remoteFieldsLoaded = ref(0);
const remoteIndexLoaded = ref(false);

const userProfile = ref<DocumentData | null>(null);

let auth: Auth;

const albums = ref<QueryDocumentSnapshot[]>([]);
const isLoggedIn = ref(false);

const fetchRemoteJson = async () => {
  console.debug('Starting fetch...');
  const requestOptions = {
    method: 'GET',
    headers: new Headers({}),
  };
  const storage = useFirebaseStorage();
  const jsonRef = storageRef(storage, 'index.json');
  console.debug('Getting URL...');
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
    console.debug('Requesting JSON...');
    const response = await fetch(request);
    console.debug('Parsing JSON...');
    const json = await response.json();
    return json;
  }
};

const resolveJson = async () => {
  const indexProbe = localStorage.getItem('index');
  if (indexProbe) {
    console.debug('Found index in local storage.');
    index.value = JSON.parse(indexProbe);
    console.log(index.value);
  } else {
    console.debug('Didnt find index in local storage.');
    fetchRemoteJson().then((response) => {
      index.value = response;
    });
  }
};

const resolveJsonWithRatings = async () => {
  await resolveJson();
  console.log(
    'test rating:',
    index.value[0],
    index.value[0].rating,
    'rating' in index.value[0]
  );
  console.debug('Testing for ratings...');
  if ('rating' in index.value[0]) {
    console.debug('Ratings found!');
  } else {
    console.debug('Didnt find ratings. Fetching from remote...');
    index.value.forEach(async (element) => {
      const [collectionPath, documentId] = element.reference.split('/');
      const documentRef = doc(db, collectionPath, documentId);
      const relSnapshot = await getDoc(documentRef);
      element.rating = relSnapshot?.data?.()?.score;
      console.log(element.rating);
      remoteFieldsLoaded.value += 1;
    });
  }
};

onMounted(() => {
  resolveJsonWithRatings();
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

watch(
  () => searchTerm.value,
  () => {
    router.push({
      path: '/',
      query: { search: encodeURIComponent(searchTerm.value) },
    });
  }
);

watch(
  () => remoteFieldsLoaded.value,
  () => {
    if (remoteFieldsLoaded.value == index.value.length) {
      remoteIndexLoaded.value = true;
      console.debug('Saving JSON...');
      localStorage.setItem('index', JSON.stringify(index.value));
      console.debug('Done!');
    }
  }
);

const handleSortingChange = (newSorting: string, order: number) => {
  sorting.value = { field: newSorting, order: order };
  console.debug('Sorting changed to', sorting.value);
};

const handleFilterChange = (newFilter: typeof Filter) => {};

const handleSignOut = async () => {
  signOut(auth);
};
</script>

<template>
  <div class="header-fixed">
    <div class="wrapper">
      <TopBar
        v-model:search-value="searchTerm"
        :isLoggedIn="isLoggedIn"
        :handleSignOut="handleSignOut"
        :loggedInUser="userProfile?.value"
        :handleSortingChange="handleSortingChange"
        :handleFilterChange="handleFilterChange"
        :remoteIndexLoaded="remoteIndexLoaded"
      />
      <NuxtPage
        :loggedInUser="userProfile"
        v-model:searchValue="searchTerm"
        :index="index"
        :sorting="sorting"
        :remoteIndexLoaded="remoteIndexLoaded"
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
    display: flex;
  }
}

.secondary-button {
  background: transparent;
  color: black;
}
</style>
