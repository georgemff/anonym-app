import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/functions';
// import 'firebase/messaging';
export const firebaseConfig = {
  apiKey: "AIzaSyABOEFzCH4f4JmnWBuAnOhLVmwNU8pgqbU",
  authDomain: "anonymapp-8e15d.firebaseapp.com",
  databaseURL: "https://anonymapp-8e15d.firebaseio.com",
  projectId: "anonymapp-8e15d",
  storageBucket: "anonymapp-8e15d.appspot.com",
  messagingSenderId: "779623741394",
  appId: "1:779623741394:web:9235aef12b085361d13a0b",
  measurementId: "G-9C3Q57V3KR"
};

const initializeFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
}
initializeFirebase();

const db = firebase.firestore();

// export const messagging = firebase.messaging();
export const auth = firebase.auth();
export const helloWorldFn = firebase.functions().httpsCallable('helloWorld');
export const getUserName = firebase.functions().httpsCallable('getUserName');
export const storageRef = firebase.storage().ref();
export const avatarsRef = storageRef.child('avatars')
export const posts = db.collection('posts');
export const users = db.collection('users');
export const comments = db.collection('comments');
export const notificationTokens = db.collection('notificationTokens');
export const postReacts = db.collection('postReacts');
