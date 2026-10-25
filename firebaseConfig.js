// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMT1AcKN7DVW7uZ0q2V1UiNFT7PbvLWm8",
  authDomain: "banco-de-dados-mobile-9a6bd.firebaseapp.com",
  projectId: "banco-de-dados-mobile-9a6bd",
  storageBucket: "banco-de-dados-mobile-9a6bd.firebasestorage.app",
  messagingSenderId: "944011789403",
  databaseURL: 'https://banco-de-dados-mobile-9a6bd-default-rtdb.firebaseio.com/',
  appId: "1:944011789403:web:1db676735fb64318976b7e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
})

export const db = getFirestore(app);