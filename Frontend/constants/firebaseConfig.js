import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCZ7mB-9MFf195Y56FgpRUHUxV6H765gpo",
  authDomain: "csg3101-service-providing-app.firebaseapp.com",
  projectId: "csg3101-service-providing-app",
  storageBucket: "csg3101-service-providing-app.firebasestorage.app",
  messagingSenderId: "208758525655",
  appId: "1:208758525655:web:0c9acb920892a9333bea92",
  measurementId: "G-970315G4RV"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };