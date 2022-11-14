import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";


// Optionally import the services that you want to use
//import {...} from "firebase/auth";
//import {...} from "firebase/database";
//import {...} from "firebase/firestore";
//import {...} from "firebase/functions";
//import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBv-zWlaFi-17wplkRFMVxjMA-CDO63HOo",
  authDomain: "cinotinder-528af.firebaseapp.com",
  databaseURL: "https://cinotinder-528af-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cinotinder-528af",
  storageBucket: "cinotinder-528af.appspot.com",
  messagingSenderId: "1047653418999",
  appId: "1:1047653418999:web:296a9b5744e0fa085dd0f2",
  measurementId: "G-L5P3QKD2BE"
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
