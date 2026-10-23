import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "lostandfound-802fc.firebaseapp.com",
  projectId: "lostandfound-802fc",
  storageBucket: "lostandfound-802fc.firebasestorage.app",
  messagingSenderId: "924299139438",
  appId: "1:924299139438:web:adf7404320ae3a57d9497f",
  measurementId: "G-BDYH1F9KG9",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});