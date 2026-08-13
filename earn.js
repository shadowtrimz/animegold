import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } 
  from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// Firebase config
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

const pointsDisplay = document.getElementById("points");
const claimSeriesBtn = document.getElementById("claimSeriesBtn");
const convertBtn = document.getElementById("convertBtn");
const logoutBtn = document.getElementById("logoutBtn");
const noticeBox = document.getElementById("noticeBox");

// Protect page
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      pointsDisplay.textContent = snap.data().points;
    } else {
      await setDoc(userRef, { email: user.email, points: 0 });
      pointsDisplay.textContent = 0;
    }

    // ✅ Reset claim button state each time user logs in
    claimSeriesBtn.disabled = true;
    noticeBox.textContent = "⏳ Please wait 5 seconds...";
    setTimeout(() => {
      claimSeriesBtn.disabled = false;
      noticeBox.textContent = "👉 You can now claim points!";
    }, 5000);
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => window.location.href = "index.html");
});

// Claim points (attach listener ONCE)
claimSeriesBtn.addEventListener("click", async () => {
  if (claimSeriesBtn.disabled) return; // ✅ prevent double clicks

  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);

  await updateDoc(userRef, { points: increment(1) });
  const updatedSnap = await getDoc(userRef);

  pointsDisplay.textContent = updatedSnap.data().points;

  claimSeriesBtn.disabled = true; // ✅ disable immediately
  noticeBox.textContent = "🎉 You earned 1 point!";
});

// Convert points
convertBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  const currentPoints = snap.data().points;

  if (currentPoints >= 10) {
    await updateDoc(userRef, { points: currentPoints - 10 });
    pointsDisplay.textContent = currentPoints - 10;
    noticeBox.textContent = "✅ You converted 10 points into a reward!";
  } else {
    noticeBox.textContent = "⚠️ Not enough points to convert.";
  }
});
