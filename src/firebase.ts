import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, listAll } from "firebase/storage";
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyAeyO1d8aw92E8NKoVp_Mv3VKCqLWEVtsw",
  authDomain: "erp-system-2109c.firebaseapp.com",
  projectId: "erp-system-2109c",
  storageBucket: "erp-system-2109c.appspot.com",
  messagingSenderId: "242437276043",
  appId: "1:242437276043:web:d66197c6f039d0d9d0ef8e",
  measurementId: "G-VT9YL1HS5V"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);


