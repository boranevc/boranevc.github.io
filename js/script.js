// ===== Year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Theme toggle =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  localStorage.setItem('cv-theme', theme);
}

const savedTheme = localStorage.getItem('cv-theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

// ===== Nav drawer (glass, left side) =====
const navToggle = document.getElementById('navToggle');
const navClose = document.getElementById('navClose');
const navLinksEl = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function openDrawer() {
  navLinksEl.classList.add('open');
  navOverlay.classList.add('show');
}
function closeDrawer() {
  navLinksEl.classList.remove('open');
  navOverlay.classList.remove('show');
}
navToggle.addEventListener('click', openDrawer);
navClose.addEventListener('click', closeDrawer);
navOverlay.addEventListener('click', closeDrawer);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDrawer();
});
navLinksEl.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

// ===== Active nav link on scroll =====
const sections = document.querySelectorAll('main section[id], header#home');
const navLinkEls = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

sections.forEach(sec => navObserver.observe(sec));

// ===== Scroll reveal =====
// Uses a manual bounding-rect check (rather than relying solely on
// IntersectionObserver) so fast/large scroll jumps (scrollbar drags,
// fast wheel flicks) can't skip an element's reveal entirely.
const revealEls = document.querySelectorAll('.reveal');

function checkReveals() {
  const vh = window.innerHeight;
  revealEls.forEach(el => {
    if (el.classList.contains('in-view')) return;
    if (el.getBoundingClientRect().top < vh * 0.92) {
      el.classList.add('in-view');
    }
  });
}
checkReveals();
window.addEventListener('scroll', () => requestAnimationFrame(checkReveals), { passive: true });
window.addEventListener('resize', checkReveals);

// ===== Scroll progress bar =====
const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}
updateProgress();
window.addEventListener('scroll', updateProgress, { passive: true });

// ===== Back to top =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 500);
}, { passive: true });
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Typed role effect =====
const roles = ['Bilgisayar Programcısı', 'Web Programcısı', 'Yazılım Geliştiricisi', '.NET & C# Geliştiricisi'];
const typedEl = document.getElementById('typedRole');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 45 : 85);
}
typeLoop();

// ===== Animated counters =====
const counters = document.querySelectorAll('.counter');

function checkCounters() {
  const vh = window.innerHeight;
  counters.forEach(c => {
    if (c.dataset.done) return;
    if (c.getBoundingClientRect().top < vh * 0.92) {
      c.dataset.done = '1';
      animateCounter(c);
    }
  });
}
checkCounters();
window.addEventListener('scroll', () => requestAnimationFrame(checkCounters), { passive: true });
window.addEventListener('resize', checkCounters);

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);
  const duration = 1400;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = decimals > 0 ? value.toFixed(decimals) : Math.round(value);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = decimals > 0 ? target.toFixed(decimals) : target;
  }
  requestAnimationFrame(step);
}
