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

// --- FIREBASE SETUP ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import { getDatabase, ref, push, get, child } 
  from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

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
const analytics = getAnalytics(app);
const db = getDatabase(app);

// --- RATING SYSTEM ---
document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll("#stars span");
  const msg = document.getElementById("rating-message");
  const avgDisplay = document.getElementById("average-rating");

  stars.forEach(star => {
    star.addEventListener("click", async () => {
      const value = parseInt(star.getAttribute("data-value"));

      stars.forEach(s => s.classList.remove("active"));
      for (let i = 0; i < value; i++) {
        stars[i].classList.add("active");
      }

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
});
</script>
