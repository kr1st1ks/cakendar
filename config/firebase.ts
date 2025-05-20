import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Вставьте свои данные из Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyDWZRDUqsmLWhU3qCh2Tx_BlBL6KcGWdQQ",
    authDomain: "calendar-aip-kr.firebaseapp.com",
    projectId: "calendar-aip-kr",
    storageBucket: "calendar-aip-kr.firebasestorage.app",
    messagingSenderId: "605058461907",
    appId: "1:605058461907:web:5f2cffab92fac7cb05e426",
    measurementId: "G-L6R2H6XHLG"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);