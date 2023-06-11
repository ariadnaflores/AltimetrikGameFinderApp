// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD2XYPe5hhzcPN5J5ftURsr-SSrnvBaCKQ",
    authDomain: "gamefinder-app.firebaseapp.com",
    databaseURL: "https://gamefinder-app-default-rtdb.firebaseio.com",
    projectId: "gamefinder-app",
    storageBucket: "gamefinder-app.appspot.com",
    messagingSenderId: "1099225983986",
    appId: "1:1099225983986:web:3fbb8bc3b622a91cd4996b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Exporta la base de datos si necesitas acceder a ella desde otros scripts
export { database };