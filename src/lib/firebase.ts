// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9_B6TPeF__SaWc16dxkXJizI900aAFXk",
  authDomain: "ecommerce-site-425508.firebaseapp.com",
  projectId: "ecommerce-site-425508",
  storageBucket: "ecommerce-site-425508.appspot.com",
  messagingSenderId: "181260961100",
  appId: "1:181260961100:web:991aff45ba4a845b06bbe9",
  measurementId: "G-Y229BHQ9VJ",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

export default firebaseApp;
