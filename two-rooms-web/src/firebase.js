import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyAyw0XWuqerU7QbNBPkOV5apauGPLUnQ9g",
    authDomain: "tworooms-66ba8.firebaseapp.com",
    databaseURL: "https://tworooms-66ba8.firebaseio.com",
    projectId: "tworooms-66ba8",
    storageBucket: "tworooms-66ba8.appspot.com",
    messagingSenderId: "841434482898",
    appId: "1:841434482898:web:e3687c753aa9edbb81050b",
    measurementId: "G-1NG0PG6FB8"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth;
export const db = firebase.firestore();

export function logInWithToken(token) {
    return auth().signInWithCustomToken(token)
}

export function logOut() {
    return auth().signOut();
}