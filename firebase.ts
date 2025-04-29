import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCW7Uap0iicy4OFRK1PaY2D0QvgPSMYfrY",
    authDomain: "query-pdf-ai.firebaseapp.com",
    projectId: "query-pdf-ai",
    storageBucket: "query-pdf-ai.firebasestorage.app",
    messagingSenderId: "471078476964",
    appId: "1:471078476964:web:1c3662a8ff93b80fd25a31"
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore(app);
  const storage = getStorage(app);

  export { db, storage };