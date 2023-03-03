import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyCbC1o8HAGWz0o_I7Zm6gu-wZBelQXnGio",
//   authDomain: "dumpspace-f0dc7.firebaseapp.com",
//   projectId: "dumpspace-f0dc7",
//   storageBucket: "dumpspace-f0dc7.appspot.com",
//   messagingSenderId: "292468633719",
//   appId: "1:292468633719:web:892c06a9ae59e5c0391672",
// };
const firebaseConfig = {
  apiKey: "AIzaSyAeMf_KXaP9Q6HM9PmRWPmcUe0suKWjDJc",
  authDomain: "dumpspace-7978c.firebaseapp.com",
  projectId: "dumpspace-7978c",
  storageBucket: "dumpspace-7978c.appspot.com",
  messagingSenderId: "314143753563",
  appId: "1:314143753563:web:f9dc872883fbcf921c067e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { app, auth, db, storage };
