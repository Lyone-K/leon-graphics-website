// --- FIREBASE IMPORTS ---
import { initializeApp } 
  from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } 
  from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// --- FIREBASE CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyAI1renRwVxkIz9Zd2Oi7l09CDkcoT5Lj0",
  authDomain: "leon-graphics-ratings-v2.firebaseapp.com",
  projectId: "leon-graphics-ratings-v2",
  storageBucket: "leon-graphics-ratings-v2.firebasestorage.app",
  messagingSenderId: "601026583913",
  appId: "1:601026583913:web:3d5700e72e4ec1f7a931f8",
  measurementId: "G-B2RQKW50HQ"
};

// ✅ Initialize Firebase FIRST
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- AUTHENTICATION ---
signInAnonymously(auth)
  .then(() => console.log("✅ Signed in anonymously"))
  .catch((error) => console.error("❌ Auth error:", error));

// --- WAIT FOR AUTH ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User authenticated:", user.uid);
    initRatingSystem();
  }
});

// --- RATING SYSTEM ---
function initRatingSystem() {
  const stars = document.querySelectorAll('#stars span');
  const message = document.getElementById('rating-message');
  const avgDisplay = document.getElementById('average-rating');

  stars.forEach(star => {
    star.addEventListener('click', async () => {
      const value = parseInt(star.getAttribute('data-value'));
      message.textContent = `You rated this ${value} stars!`;

      try {
        await addDoc(collection(db, "ratings"), {
          rating: value,
          timestamp: new Date(),
          user: auth.currentUser?.uid || "anonymous"
        });
        await updateAverage();
      } catch (error) {
        console.error("Error saving rating:", error);
      }

      stars.forEach(s => s.classList.remove('active'));
      for (let i = 0; i < value; i++) {
        stars[i].classList.add('active');
      }
    });
  });

   async function updateAverage() {
    const snapshot = await getDocs(collection(db, "ratings"));
    if (snapshot.empty) {
      avgDisplay.textContent = "Average Rating: --";
      return;
    }
    let total = 0;
    snapshot.forEach(doc => total += doc.data().rating);
    const avg = (total / snapshot.size).toFixed(1);
    avgDisplay.textContent = `Average Rating: ${avg} ⭐`;
  }
  
  updateAverage();
}

// --- MOBILE MENU TOGGLE ---
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuToggle.classList.toggle('active');
});

// --- FADE-IN EFFECT ---
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

// === 3D Showcase Script ===
const projects = [
  {
    title: "Modern Logo Design",
    desc: "A sleek and dynamic logo crafted for a digital brand identity.",
    image: "images/project1.png"
  },
  {
    title: "Creative Poster Art",
    desc: "Vibrant and bold poster visuals blending typography and texture.",
    image: "images/project2.png"
  },
  {
    title: "Website Interface",
    desc: "Clean and responsive web interface for a creative agency.",
    image: "images/project3.png"
  }
];

let current = 0;
const titleEl = document.getElementById("project-title");
const descEl = document.getElementById("project-desc");
const imageEl = document.getElementById("project-image");

document.getElementById("next-btn").addEventListener("click", () => {
  current = (current + 1) % projects.length;
  updateShowcase();
});

document.getElementById("prev-btn").addEventListener("click", () => {
  current = (current - 1 + projects.length) % projects.length;
  updateShowcase();
});

function updateShowcase() {
  imageEl.classList.add("fade-out");
  setTimeout(() => {
    titleEl.textContent = projects[current].title;
    descEl.textContent = projects[current].desc;
    imageEl.src = projects[current].image;
    imageEl.classList.remove("fade-out");
  }, 500);
}

// === Scroll Reactive Motion ===
window.addEventListener('scroll', () => {
  const image = document.querySelector('.floating-image');
  const scrollY = window.scrollY;
  const section = document.querySelector('.showcase');
  const sectionTop = section.offsetTop;
  const sectionHeight = section.offsetHeight;

  // Only activate effect when section is in view
  if (scrollY + window.innerHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
    const relativeY = (scrollY - sectionTop) / sectionHeight; // 0 → 1
    const moveY = relativeY * 40 - 20; // Float up and down (-20px to +20px)
    const rotateZ = relativeY * 6 - 3; // Gentle rotation (-3deg to +3deg)
    const scale = 1 + Math.sin(relativeY * Math.PI) * 0.05; // Slight breathing scale

    image.style.transform = `translateY(${moveY}px) rotate(${rotateZ}deg) scale(${scale})`;
  }
});

// === Background Parallax ===
window.addEventListener('scroll', () => {
  const bg = document.querySelector('.showcase-bg');
  const scrollY = window.scrollY;
  bg.style.transform = `translateY(${scrollY * 0.2}px) scale(1.05)`;
});

