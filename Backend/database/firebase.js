// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzYBFC6V3KJi8Q0sKAl-DYSveEde6ATrM",
  authDomain: "paperflow-fc3c3.firebaseapp.com",
  projectId: "paperflow-fc3c3",
  storageBucket: "paperflow-fc3c3.appspot.com",
  messagingSenderId: "862457245920",
  appId: "1:862457245920:web:4e870d64dff51e8d61a085",
  measurementId: "G-DVH3PZ9C9P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);