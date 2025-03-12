import dotenv from 'dotenv';
dotenv.config();

const {
    PORT,
    HOST,
    HOST_URL,
    firebase_apiKey,
    firebase_authDomain,
    firebase_projectId,
    firebase_storageBucket,
    firebase_messagingSenderId,
    firebase_appId,
} = process.env;

export default {
    port: PORT,
    host: HOST,
    hostUrl: HOST_URL,
    firebaseConfig: {
        apiKey: firebase_apiKey,
        authDomain: firebase_authDomain,
        projectId: firebase_projectId,
        storageBucket: firebase_storageBucket,
        messagingSenderId: firebase_messagingSenderId,
        appId: firebase_appId,
    },
};
