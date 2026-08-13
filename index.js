import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore, doc, setDoc } 
  from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYrkIW7QvwJJN3DsfbXu7PW-oQoIdrDx0",
  authDomain: "animegold-24f7b.firebaseapp.com",
  projectId: "animegold-24f7b",
  storageBucket: "animegold-24f7b.firebasestorage.app",
  messagingSenderId: "985670643758",
  appId: "1:985670643758:web:12375774edc9dd02a92fbf",
  measurementId: "G-S3F2WP5L3W"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "earn.html";
  } catch (error) {
    alert(error.message);
  }
});

// Signup
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      points: 0
    });

    window.location.href = "earn.html";
  } catch (error) {
    alert(error.message);
  }
});
