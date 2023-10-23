import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";

import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgV1C1nyvG2eJ13tGs1CwDJh_dcaGWTXc",
  authDomain: "sonar0.firebaseapp.com",
  projectId: "sonar0",
  storageBucket: "sonar0.appspot.com",
  messagingSenderId: "1096856922094",
  appId: "1:1096856922094:web:9df9aea96f320e132e90ff",
  measurementId: "G-JFRVL2QV3C",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const createdApp = createApp(App);
createdApp.use(router);

createdApp.mount("#app");
export { db };
