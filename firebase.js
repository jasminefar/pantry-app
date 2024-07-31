// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {getAnalytics} from 'firebase/analytics'
import {getFirestore} from 'firebase/firestore'
// import {firebase} from 'firebase/app'
// import firebaseConfig from "./config/firebaseConfig";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRU9H85e5NbQVaJnnfgkZX-IRUJYKRuMI",
  authDomain: "pantry-tracker-13892.firebaseapp.com",
  projectId: "pantry-tracker-13892",
  storageBucket: "pantry-tracker-13892.appspot.com",
  messagingSenderId: "591832323976",
  appId: "1:591832323976:web:92d241cf2d1017b2a90c3d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore};