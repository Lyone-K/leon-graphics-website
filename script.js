// --- FIREBASE IMPORTS (must be at top) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import { getDatabase, ref, push, get, child } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// --- FIREBASE SETUP ---
const firebaseConfig = {
  apiKey: "AIzaSyDUvD2-sAkgl4fHXOxRQ_hrQBOFR4Munek",
  authDomain: "leon-graphics-ratings.firebaseapp.com",
  projectId: "leon-graphics-ratings",
  databaseURL: "https://leon-graphics-ratings-default-rtdb.firebaseio.com/",
  storageBucket: "leon-graphics-ratings.appspot.com",
  messagingSenderId: "139896290133",
  appId: "1:139896290133:web:8f3f4862a7c90484cb4ddc",
  measurementId: "G-GJR7W3B1MZ"
};

const app = initializeApp(firebaseConfig);
let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  console.warn("Analytics not available in this environment:", e);
}
const db = getDatabase(app);
const auth = getAuth();

// --- SIGN IN ANONYMOUSLY ---
signInAnonymously(auth)
  .then(() => console.log("✅ Signed in anonymously"))
  .catch((error) => console.error("Auth error:", error));

// --- ON AUTH STATE READY ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User authenticated:", user.uid);
    initRatingSystem();
  } else {
    console.warn("User not authenticated yet");
  }
});

// --- RATING SYSTEM ---
function initRatingSystem() {
  const stars = document.querySelectorAll("#stars span");
  const msg = document.getElementById("rating-message");
  const avgDisplay = document.getElementById("average-rating");

  stars.forEach(star => {
    star.addEventListener("click", async () => {
      const value = parseInt(star.getAttribute("data-value"));

      // Visual star highlight
      stars.forEach(s => s.classList.remove("active"));
      for (let i = 0; i < value; i++) stars[i].classList.add("active");

      // Save rating to database (now secure)
      await push(ref(db, "ratings"), value);
      msg.textContent = `Thanks for rating ${value} ⭐`;
      updateAverage();
    });
  });

  async function updateAverage() {
    const snapshot = await get(child(ref(db), "ratings"));
    if (snapshot.exists()) {
      const ratings = Object.values(snapshot.val());
      const avg = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
      avgDisplay.textContent = `Average Rating: ${avg} ⭐`;
    }
  }

  updateAverage();
}

// --- MENU TOGGLE ---
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuToggle.classList.toggle('active');
});

// --- FADE-IN ON SCROLL ---
const fadeElements = document.querySelectorAll('.fade-in');
const appearOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px'
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('appear');
    observer.unobserve(entry.target);
  });
}, appearOptions);

fadeElements.forEach(el => {
  appearOnScroll.observe(el);
});
