import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

const app= firebase.initializeApp({
    apiKey: "AIzaSyAKXvBb5NSpfhQ9cSEBB5ioyHbLiWNUaQk",
    authDomain: "teams-clone-6eba8.firebaseapp.com",
    projectId: "teams-clone-6eba8",
    storageBucket: "teams-clone-6eba8.appspot.com",
    messagingSenderId: "640620991302",
    appId: "1:640620991302:web:1509153b63108df6018b47"
})

export const db = app.firestore();
export const auth = app.auth();
export default firebase;