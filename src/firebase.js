import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyApLP6peaA4UhhWyFO6YjwN8j0lJAfbdU4',
  authDomain: 'travel-journal-f9922.firebaseapp.com',
  projectId: 'travel-journal-f9922',
  storageBucket: 'travel-journal-f9922.appspot.com',
  messagingSenderId: '281704219329',
  appId: '1:281704219329:web:71361faea12daa53cd4a40',
  measurementId: 'G-SKSYVNHH0G',
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = getStorage(app);
