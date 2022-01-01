import app from 'firebase/compat/app';
import 'firebase/compat/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAOurihty-b-IEM4R3K59QxAZ0NN-ZTtp0",
    authDomain: "job-listing-fbffc.firebaseapp.com",
    projectId: "job-listing-fbffc",
    storageBucket: "job-listing-fbffc.appspot.com",
    messagingSenderId: "322653073647",
    appId: "1:322653073647:web:9040b748beb022f2bd6b1a"
  };
  // Initialize Firebase
  //const app = initializeApp(firebaseConfig);
  const firebase = app.initializeApp(firebaseConfig);
  const firestore= firebase.firestore();

  export {firebase, firestore, app};