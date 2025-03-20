import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore, collection} from 'firebase/firestore';
import {getFunctions, httpsCallable} from 'firebase/functions';
import { getStorage, ref } from "firebase/storage";

// import auth from '@react-native-firebase/auth';
// import functions from '@react-native-firebase/functions';


// import 'firebase/messaging';
export const firebaseConfig = {
  apiKey: "AIzaSyABOEFzCH4f4JmnWBuAnOhLVmwNU8pgqbU",
  authDomain: "anonymapp-8e15d.firebaseapp.com",
  databaseURL: "https://anonymapp-8e15d.firebaseio.com",
  projectId: "anonymapp-8e15d",
  storageBucket: "anonymapp-8e15d.appspot.com",
  messagingSenderId: "779623741394",
  appId: "1:779623741394:web:6014b7cac0d640c2d13a0b",
  measurementId: "G-SW5TFB0CCZ"
};

const app = initializeApp(firebaseConfig);
console.log(app.name)
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);



// export const messagging = firebase.messaging();
export const auth = getAuth(app);

export const queryComments = httpsCallable(functions, 'queryComments');
export const queryPosts = httpsCallable(functions, 'queryPosts');
export const queryUserPosts = httpsCallable(functions, 'queryUserPosts');
export const storageRef = ref(storage);
export const avatarsRef = ref(storage, 'avatars');
export const posts = collection(db, 'posts');
export const users = collection(db, 'users');
export const comments = collection(db, 'comments');
export const notificationTokens = collection(db, 'notificationTokens');
export const postReactions = collection(db, 'postReactions');
export const commentReactions = collection(db, 'commentReactions');
export const notifications = collection(db, 'notifications');
