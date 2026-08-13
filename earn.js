import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } 
  from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const db = getFirestore(app);
const pointsDisplay = document.getElementById("points");
const claimSeriesBtn = document.getElementById("claimSeriesBtn");

// 5 seconds watch time for testing
const watchTime = 5000;

setTimeout(() => {
  claimSeriesBtn.disabled = false;
  alert("You have watched for 5 seconds! You can now claim your point.");
}, watchTime);

claimSeriesBtn.addEventListener("click", async () => {
  if (!claimSeriesBtn.disabled) {
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);

    // Ensure document exists
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, { points: 0 });
    }

    // Increment points in Firestore
    await updateDoc(userRef, {
      points: increment(1)
    });

    // Refresh display
    const updatedSnap = await getDoc(userRef);
    pointsDisplay.textContent = updatedSnap.data().points;

    alert("You earned 1 point!");
    claimSeriesBtn.disabled = true;

    // Reset timer for next claim
    setTimeout(() => {
      claimSeriesBtn.disabled = false;
      alert("Another 5 seconds completed! You can claim again.");
    }, watchTime);
  }
});
