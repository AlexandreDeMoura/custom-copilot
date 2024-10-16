import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA8cyn0CUBNLxerONJqpqYDklNufm8PMNo",
    authDomain: "custom-copilot.firebaseapp.com",
    projectId: "custom-copilot",
    storageBucket: "custom-copilot.appspot.com",
    messagingSenderId: "285171374085",
    appId: "1:285171374085:web:a43323db954d252a64646c",
    measurementId: "G-6Y2H0FW7FM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { auth, googleProvider, analytics };
