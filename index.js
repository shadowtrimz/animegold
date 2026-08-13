import { getAuth, createUserWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore, doc, setDoc } 
  from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { initializeApp } 
  from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

const firebaseConfig = { /* your Firebase config */ };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Signup form
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 🔹 Create Firestore document with starting points
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      points: 0
    });

    window.location.href = "earn.html"; // go straight to dashboard/earn
  } catch (error) {
    alert(error.message);
  }
});
