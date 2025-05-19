import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyDudCiLk-5snt7bXPUCKTGfNW0FR6DIPPc",
  authDomain: "helloapp-8f0ac.firebaseapp.com",
  databaseURL: "https://helloapp-8f0ac-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "helloapp-8f0ac",
  storageBucket: "helloapp-8f0ac.firebasestorage.app",
  messagingSenderId: "4644371365",
  appId: "1:4644371365:web:89d1e7d4e7685cc566064c",
  measurementId: "G-VD45YP8P63",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, updateDoc };
