
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyDqKQCR8cUTo9LrGBVNb-7oFkgURR9MNbc",
  authDomain: "loopnet-70266.firebaseapp.com",
  projectId: "loopnet-70266",
  storageBucket: "loopnet-70266.appspot.com",
  messagingSenderId: "902375893933",
  appId: "1:902375893933:web:b7ebc0068553754b018f24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()

export const provider = new GoogleAuthProvider()

export default app;
