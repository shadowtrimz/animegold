import { getAuth, signOut, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

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

// Protect earn page
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "index.html";
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => window.location.href = "index.html");
});

// Points system
let points = 0;
const pointsDisplay = document.getElementById("points");
const claimSeriesBtn = document.getElementById("claimSeriesBtn");

// 1 hour watch time (3600000 ms)
const watchTime = 3600000;

setTimeout(() => {
  claimSeriesBtn.disabled = false;
  alert("You have watched for 1 hour! You can now claim your point.");
}, watchTime);

claimSeriesBtn.addEventListener("click", () => {
  if (!claimSeriesBtn.disabled) {
    points += 1;
    pointsDisplay.textContent = points;
    alert("You earned 1 point!");
    claimSeriesBtn.disabled = true;

    // Reset timer for next hour
    setTimeout(() => {
      claimSeriesBtn.disabled = false;
      alert("Another hour completed! You can claim again.");
    }, watchTime);
  }
});
