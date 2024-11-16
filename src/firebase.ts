import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, listAll } from "firebase/storage";
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {

  apiKey: "AIzaSyBzaoJoqBT74L0tcZTRKX_MT0o425bnTcw",

  authDomain: "testing-erp-54092.firebaseapp.com",

  projectId: "testing-erp-54092",

  storageBucket: "testing-erp-54092.appspot.com",

  messagingSenderId: "633055448503",

  appId: "1:633055448503:web:978f8d20b66aa34911ac32",

  measurementId: "G-WJ5V7RL6KZ"

};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);


