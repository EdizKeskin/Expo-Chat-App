import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// add firebase config
const firebaseConfig = {
  apiKey: Constants.manifest.extra.google.apiKey,
  authDomain: Constants.manifest.extra.google.authDomain,
  projectId: Constants.manifest.extra.google.projectId,
  storageBucket: Constants.manifest.extra.google.storageBucket,
  messagingSenderId: Constants.manifest.extra.google.messagingSenderId,
  appId: Constants.manifest.extra.google.appId,
  measurementId: Constants.manifest.extra.google.measurementId,
};

// initialize firebase
const app = initializeApp(firebaseConfig);

// initialize auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
