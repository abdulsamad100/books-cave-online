import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDJ7W7ijO8fEYhc-ARSWuOtvuCtYe6wToY",
    authDomain: "online-library-55b75.firebaseapp.com",
    projectId: "online-library-55b75",
    storageBucket: "online-library-55b75.firebasestorage.app",
    messagingSenderId: "486473258684",
    appId: "1:486473258684:web:7692df315cb4e20b0ea2b9",
    measurementId: "G-83TTKVFRVH"
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export const auth = getAuth(app);