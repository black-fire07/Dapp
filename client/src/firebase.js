import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyC_y4zkUoHwucmKA3_hzxeDyCSnI3S662c",
    authDomain: "block-88ba7.firebaseapp.com",
    projectId: "block-88ba7",
    storageBucket: "block-88ba7.appspot.com",
    messagingSenderId: "764560255700",
    appId: "1:764560255700:web:d3305050817f13fb82a941",
    measurementId: "G-YQF3NCZX98"
  });

// const db = firebaseApp.firestore();
const auth = firebase.auth();
// const storage = firebase.storage();

export { auth };