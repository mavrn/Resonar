import 'firebase/firestore';
import { useFirebaseApp } from 'vuefire';
import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: 'sonar0.firebaseapp.com',
  projectId: 'sonar0',
  storageBucket: 'sonar0.appspot.com',
  messagingSenderId: '1096856922094',
  appId: '1:1096856922094:web:9df9aea96f320e132e90ff',
  measurementId: 'G-JFRVL2QV3C',
};

// Initialize Firebase app if not already initialized

initializeApp(firebaseConfig)
