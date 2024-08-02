import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

const emulatorMode = window.location.hostname === "localhost:5001";

const fullConfig = import.meta.env.VITE_FIREBASE_CONFIG_FULL;
const firebaseConfig = fullConfig
  ? JSON.parse(fullConfig)
  : {
      apiKey: import.meta.env.VITE_apiKey,
      authDomain: import.meta.env.VITE_authDomain,
      databaseURL: !emulatorMode
        ? import.meta.env.VITE_databaseURL
        : "localhost:9000",
      projectId: import.meta.env.VITE_projectId,
      storageBucket: import.meta.env.VITE_storageBucket,
      messagingSenderId: import.meta.env.VITE_messagingSenderId,
      appId: import.meta.env.VITE_appId,
      measurementId: import.meta.env.VITE_measurementId,
    };
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const functions = getFunctions(app, "europe-west1");
export const storage = getStorage(app);

if (emulatorMode) {
  connectDatabaseEmulator(database, "localhost", 9000);
  connectFunctionsEmulator(functions, "localhost", 5001);
}
