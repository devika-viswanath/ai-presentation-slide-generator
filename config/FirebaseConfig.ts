// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ai-ppt-generator-b75ac.firebaseapp.com",
  projectId: "ai-ppt-generator-b75ac",
  storageBucket: "ai-ppt-generator-b75ac.firebasestorage.app",
  messagingSenderId: "336499128590",
  appId: "1:336499128590:web:c3bf7d4117274cbafc7f5f",
  measurementId: "G-0YCLVCR4ZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseDb = getFirestore(app);
// Initialize the Gemini Developer API backend service
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create a `GenerativeModel` instance with a model that supports your use case
export const GeminiAiModel = getGenerativeModel(ai, { model: "gemini-2.5-flash" });
