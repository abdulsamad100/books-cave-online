import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FB_apiKey,
    authDomain: import.meta.env.VITE_FB_authDomain,
    projectId: import.meta.env.VITE_FB_projectId,
    storageBucket: import.meta.env.VITE_FB_storageBucket,
    messagingSenderId: import.meta.env.VITE_FB_messagingSenderId,
    appId: import.meta.env.VITE_FB_appId,
    measurementId: import.meta.env.VITE_FB_measurementId,
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export const auth = getAuth(app);