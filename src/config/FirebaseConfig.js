import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCVkUs8MCX9HGHDblW9MixX6-YOugNqR4A",
  authDomain: "social-media-76c0d.firebaseapp.com",
  projectId: "social-media-76c0d",
  storageBucket: "social-media-76c0d.appspot.com",
  messagingSenderId: "1016142057105",
  appId: "1:1016142057105:web:f85b51eba59d5372bb3930",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { app, auth, db, storage };
