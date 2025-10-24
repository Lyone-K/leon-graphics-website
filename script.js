// --- MOBILE MENU TOGGLE ---
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuToggle.classList.toggle('active');
});

// --- FADE-IN ON SCROLL ---
const fadeElements = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.2, rootMargin: '0px 0px -50px 0px' };

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('appear');
    observer.unobserve(entry.target);
  });
}, appearOptions);

fadeElements.forEach(el => appearOnScroll.observe(el));

// --- FIREBASE SETUP ---
import { getAuth, signInAnonymously } 
  from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const auth = getAuth();
signInAnonymously(auth)
  .then(() => console.log("✅ Signed in anonymously"))
  .catch((error) => console.error("Auth error:", error));

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- STAR RATING ---
const stars = document.querySelectorAll('#stars span');
const message = document.getElementById('rating-message');
const avgDisplay = document.getElementById('average-rating');

stars.forEach(star => {
  star.addEventListener('click', async () => {
    const value = parseInt(star.getAttribute('data-value'));
    message.textContent = `You rated this ${value} stars!`;

    try {
      await addDoc(collection(db, "ratings"), { rating: value, timestamp: new Date() });
      updateAverage();
    } catch (error) {
      console.error("Error saving rating:", error);
    }

    stars.forEach(s => s.classList.remove('active'));
    star.classList.add('active');
  });
});

async function updateAverage() {
  const snapshot = await getDocs(collection(db, "ratings"));
  let total = 0;
  snapshot.forEach(doc => total += doc.data().rating);
  const avg = (total / snapshot.size).toFixed(1);
  avgDisplay.textContent = `Average Rating: ${avg}`;
}

updateAverage();


