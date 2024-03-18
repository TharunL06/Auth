// firebase configuration

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Web app firbase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCAICLBkW46oq6SiKeQtafiEZiY2Xz9Ax0",
  authDomain: "test2-b3d98.firebaseapp.com",
  projectId: "test2-b3d98",
  storageBucket: "test2-b3d98.appspot.com",
  messagingSenderId: "1034010996321",
  appId: "1:1034010996321:web:60304a9ed7cf0e68ec0420",
  measurementId: "G-NMSEQ363HC"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase}