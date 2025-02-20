
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD9ACQayvI1ckpHrQysZB48ZwQECON31C4",
  authDomain: "taskmanagement-35d7b.firebaseapp.com",
  projectId: "taskmanagement-35d7b",
  storageBucket: "taskmanagement-35d7b.firebasestorage.app",
  messagingSenderId: "743369708172",
  appId: "1:743369708172:web:51db160b97028c124f21a9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();