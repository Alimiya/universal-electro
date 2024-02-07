var admin = require('firebase-admin')

var serviceAccount = require('./pfiles/serviceAccessKey.json')

const {initializeApp} = require('firebase/app')
const fauth = require('firebase/auth');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const firebaseConfig = {
    apiKey: "AIzaSyDoOnSE-0UMFiJPn0O48vg8NnU0Qtsa62c",
    authDomain: "universal-electro.firebaseapp.com",
    projectId: "universal-electro",
    storageBucket: "universal-electro.appspot.com",
    messagingSenderId: "650550519143",
    appId: "1:650550519143:web:0a9730876473838a087bc2"
};

const app = initializeApp(firebaseConfig);
const fdb = admin.firestore();

module.exports = {fdb, fauth}