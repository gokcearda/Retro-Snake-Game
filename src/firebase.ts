import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "your api key",
  authDomain: "yourFirebaseAuthDomain.firebaseapp.com",
  databaseURL: "your firebase base url",
  projectId: "ect id",
  storageBucket: "your storage bucket url",
  messagingSenderId: "messaging sender id ",
  appId: "yout app id",
  measurementId: "your measurement id"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);