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

const pointsDisplay = document.getElementById("points");
const claimSeriesBtn = document.getElementById("claimSeriesBtn");

// Protect earn page
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    // Load points from Firestore
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, { points: 0 });
      pointsDisplay.textContent = 0;
    } else {
      pointsDisplay.textContent = snap.data().points;
    }

    // Start timer only after user is confirmed
    const watchTime = 5000; // 5 seconds for testing
    setTimeout(() => {
      console.log("Timer finished, enabling button");
      claimSeriesBtn.disabled = false;
      alert("You have watched for 5 seconds! You can now claim your point.");
    }, watchTime);

    // Claim points logic
    claimSeriesBtn.addEventListener("click", async () => {
      if (!claimSeriesBtn.disabled) {
        console.log("Claim button clicked for UID:", user.uid);

        await updateDoc(userRef, { points: increment(1) });

        const updatedSnap = await getDoc(userRef);
        pointsDisplay.textContent = updatedSnap.data().points;
        console.log("Updated points:", updatedSnap.data().points);

        alert("You earned 1 point!");
        claimSeriesBtn.disabled = true;

        // Reset timer for next claim
        setTimeout(() => {
          claimSeriesBtn.disabled = false;
          alert("Another 5 seconds completed! You can claim again.");
        }, watchTime);
      }
    });
  }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => window.location.href = "index.html");
});
