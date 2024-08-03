import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  projectId: "notifications",
};

initializeApp(firebaseConfig);

const db = getFirestore();

if (window.location.hostname.includes("localhost")) {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

export { db };
