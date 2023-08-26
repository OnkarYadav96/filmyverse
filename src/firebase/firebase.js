// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {getFirestore,collection} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDK_16pSBRFdUXh2YhSCrSzTXLHZz6ze20",
  authDomain: "filmyverse-ab920.firebaseapp.com",
  projectId: "filmyverse-ab920",
  storageBucket: "filmyverse-ab920.appspot.com",
  messagingSenderId: "485238794225",
  appId: "1:485238794225:web:ee5726d55aa57dc72c8650"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);

//Give referance to Movies Collections
export const moviesRef=collection(db,"movies");
export const reviewRef = collection(db,"reviews");
export const usersRef = collection(db,"users");


export default app;