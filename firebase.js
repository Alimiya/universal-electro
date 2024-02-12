const admin = require('firebase-admin');
const serviceAccount = require("./pfiles/serviceAccessKey.json");
const fauth = require('firebase/auth');
const { initializeApp } = require('firebase/app')



const firebaseConfig = {
    apiKey: "AIzaSyDoOnSE-0UMFiJPn0O48vg8NnU0Qtsa62c",
    authDomain: "universal-electro.firebaseapp.com",
    projectId: "universal-electro",
    storageBucket: "universal-electro.appspot.com",
    messagingSenderId: "650550519143",
    appId: "1:650550519143:web:0a9730876473838a087bc2"
};

const app = initializeApp(firebaseConfig);

const admin_app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const fdb = admin.firestore();
const admin_fauth = admin.auth();
const storage = admin.storage().bucket('gs://universal-electro.appspot.com');

module.exports = {fdb, admin_fauth, fauth, storage}