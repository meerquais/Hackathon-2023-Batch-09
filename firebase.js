  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
  import { getAuth, signInWithEmailAndPassword ,onAuthStateChanged,GoogleAuthProvider,signInWithPopup, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
  import { getDatabase  } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
  import { getFirestore, collection,where, addDoc, doc, updateDoc,deleteDoc,onSnapshot,getDocs, setDoc, getDoc, serverTimestamp ,query , orderBy } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
  import { getStorage,uploadBytesResumable , ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
  // TODO: Add SDKs for Firebase products that you want to use
  
  const firebaseConfig = {
    apiKey: "AIzaSyA9D_PzOnEkaCpV9HkT8_-R3qre8HK6cKs",
    authDomain: "chat-app-5de95.firebaseapp.com",
    projectId: "chat-app-5de95",
    storageBucket: "chat-app-5de95.appspot.com",
    messagingSenderId: "311367448039",
    appId: "1:311367448039:web:e6e702d97af6a075dcb942"
  };

    // Initialize Firebase
    // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  
  export {  db,uploadBytesResumable ,GoogleAuthProvider
    ,query , orderBy,onAuthStateChanged,signInWithPopup,
    onSnapshot,deleteDoc,where,
    serverTimestamp ,
    getDatabase,
    auth,
    storage,
    app,
    signInWithEmailAndPassword,
    getAuth,
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    setDoc,
    getDoc,
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    createUserWithEmailAndPassword
     };