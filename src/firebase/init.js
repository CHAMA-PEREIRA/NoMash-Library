// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAamVWFh6fi5feduPzZuNy3Jl9dlqOUG4s",
  authDomain: "lab7-fit5032-menghao.firebaseapp.com",
  projectId: "lab7-fit5032-menghao",
  storageBucket: "lab7-fit5032-menghao.firebasestorage.app",
  messagingSenderId: "584277169174",
  appId: "1:584277169174:web:012bd00607de86a93dd137"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore()
export default db
