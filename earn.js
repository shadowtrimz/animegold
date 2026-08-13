import { initializeApp } 
  from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, increment } 
  from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// 🔹 Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const pointsDisplay = document.getElementById("points");
const claimSeriesBtn = document.getElementById("claimSeriesBtn");
const convertBtn = document.getElementById("convertBtn");
const logoutBtn = document.getElementById("logoutBtn");

// 🔹 Protect page: only logged-in users can see it
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      pointsDisplay.textContent = snap.data().points;
    } else {
      // Initialize user points if not found
      await updateDoc(userRef, { points: 0 });
      pointsDisplay.textContent = 0;
    }
  }
});

// 🔹 Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => window.location.href = "index.html");
});

// 🔹 Earn points after 5 seconds of watch time
const watchTime = 5000;
setTimeout(() => {
  claimSeriesBtn.disabled = false;
}, watchTime);

claimSeriesBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, { points: increment(1) });
  const updatedSnap = await getDoc(userRef);
  pointsDisplay.textContent = updatedSnap.data().points;
  claimSeriesBtn.disabled = true;
  alert("You earned 1 point!");
});

// 🔹 Convert points into rewards
convertBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  const currentPoints = snap.data().points;

  if (currentPoints >= 10) {
    await updateDoc(userRef, { points: currentPoints - 10 });
    pointsDisplay.textContent = currentPoints - 10;
    alert("You converted 10 points into a reward!");
  } else {
    alert("Not enough points to convert.");
  }
});
