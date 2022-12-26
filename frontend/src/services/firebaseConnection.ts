import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import {
    API_KEY_FIREBASE,
    AUTH_DOMAIN_FIREBASE,
    PROJECT_ID_FIREBASE,
    STORAGE_BUCKET_FIREBASE,
    MESSAGING_SENDER_ID_FIREBASE,
    APP_ID_FIREBASE,
    MEASUREMENT_ID_FIREBASE
} from '@env';

const firebaseConfig = {
    apiKey: API_KEY_FIREBASE,
    authDomain: AUTH_DOMAIN_FIREBASE,
    projectId: PROJECT_ID_FIREBASE,
    storageBucket: STORAGE_BUCKET_FIREBASE,
    messagingSenderId: MESSAGING_SENDER_ID_FIREBASE,
    appId: APP_ID_FIREBASE,
    measurementId: MEASUREMENT_ID_FIREBASE
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db }
