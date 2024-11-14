// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA9Rzf5S0WIwt4F2quWmPUXyVjVybMw6hE",
    authDomain: "test-2b59a.firebaseapp.com",
    projectId: "test-2b59a",
    storageBucket: "test-2b59a.firebasestorage.app",
    messagingSenderId: "348553854930",
    appId: "1:348553854930:web:96fb34820b806a69d0920b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export { firebase }