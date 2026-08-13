import { getAuth, signOut, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { initializeApp } 
  from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, increment } 
  from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = { /* your Firebase config */ };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const pointsDisplay = document.getElementById("points");
const claimSeriesBtn = document.getElementById("claimSeriesBtn");
const convertBtn = document.getElementById("convertBtn");

// Protect page
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    pointsDisplay.textContent = snap.exists() ? snap.data().points : 0;
  }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => window.location.href = "index.html");
});

// Earn points after 5 seconds
const watchTime = 5000;
setTimeout(() => {
  claimSeriesBtn.disabled = false;
  alert("You can now claim your point!");
}, watchTime);

claimSeriesBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, { points: increment(1) });
  const updatedSnap = await getDoc(userRef);
  pointsDisplay.textContent = updatedSnap.data().points;
  alert("You earned 1 point!");
  claimSeriesBtn.disabled = true;
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
    alert("You converted 10 points into a reward!");
  } else {
    alert("Not enough points to convert.");
  }
});
