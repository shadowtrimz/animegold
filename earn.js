import { getAuth, signOut, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { initializeApp } 
  from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } 
  from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

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

// Protect earn page
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    // Load points from Firestore when user logs in
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, { points: 0 });
      pointsDisplay.textContent = 0;
    } else {
      pointsDisplay.textContent = snap.data().points;
    }
  }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => window.location.href = "index.html");
});

// Points system
const pointsDisplay = document.getElementById("points");
const claimSeriesBtn = document.getElementById("claimSeriesBtn");

// 1 hour watch time (3600000 ms)
const watchTime = 5000;

setTimeout(() => {
  claimSeriesBtn.disabled = false;
  alert("You have watched for 1 hour! You can now claim your point.");
}, watchTime);

claimSeriesBtn.addEventListener("click", async () => {
  if (!claimSeriesBtn.disabled) {
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);

    // Increment points in Firestore
    await updateDoc(userRef, {
      points: increment(1)
    });

    // Refresh display
    const updatedSnap = await getDoc(userRef);
    pointsDisplay.textContent = updatedSnap.data().points;

    alert("You earned 1 point!");
    claimSeriesBtn.disabled = true;

    // Reset timer for next hour
    setTimeout(() => {
      claimSeriesBtn.disabled = false;
      alert("Another hour completed! You can claim again.");
    }, watchTime);
  }
});
