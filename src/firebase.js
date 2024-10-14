import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDU5CvUlbiPoxSGXdzq3q6-ZaBv0pN_kSg",
  authDomain: "videodevtycoon.firebaseapp.com",
  databaseURL: "https://videodevtycoon-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "videodevtycoon",
  storageBucket: "videodevtycoon.appspot.com",
  messagingSenderId: "283130645061",
  appId: "1:283130645061:web:8ac58669a9d1a0cc39b12c",
  measurementId: "G-5BP22KR7BS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };
