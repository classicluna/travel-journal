import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDmY8xzFFyV3CqpA3HCcUXnm2gsi56T098',
  authDomain: 'travel-journal-fdc34.firebaseapp.com',
  projectId: 'travel-journal-fdc34',
  storageBucket: 'travel-journal-fdc34.appspot.com',
  messagingSenderId: '660706813139',
  appId: '1:660706813139:web:9ec315a7d1c07cbc002026',
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = getStorage(app);
