/* ─── app.js — Ankit Ghosh Portfolio ─── */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMonitorSlider();
  initBookNav();
  initScrollAnimations();
  initMonitorScrollCapture();
});

/* ════════════════════════════════════════════
   NAV SCROLL EFFECT + HAMBURGER
   ════════════════════════════════════════════ */
function initNav() {
  const nav = document.getElementById('main-nav');
  const hamburger = document.getElementById('nav-hamburger');

  // Scroll shrink
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile hamburger
  hamburger.addEventListener('click', () => {
    const links = nav.querySelector('.nav-links');
    if (links.style.display === 'flex') {
      links.style.display = 'none';
    } else {
      links.style.display = 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '100%';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = 'rgba(247,243,236,0.98)';
      links.style.padding = '1rem 2rem';
      links.style.borderBottom = '1px solid var(--cream-darker)';
      links.style.gap = '1rem';
      links.style.zIndex = '999';
    }
  });

  // Close mobile nav on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      const links = nav.querySelector('.nav-links');
      if (window.innerWidth < 680) {
        links.style.display = 'none';
      }
    });
  });
}

/* ════════════════════════════════════════════
   MONITOR SLIDER
   ════════════════════════════════════════════ */
function initMonitorSlider() {
  const slides = document.querySelectorAll('.project-slide');
  const dots = document.querySelectorAll('.mon-dot');
  const prevBtn = document.getElementById('mon-prev');
  const nextBtn = document.getElementById('mon-next');
  let current = 0;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.idx));
    });
  });

  // Keyboard nav when monitor is focused
  document.addEventListener('keydown', (e) => {
    const monitorEl = document.getElementById('monitor-device');
    const rect = monitorEl.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'ArrowLeft') goTo(current - 1);
  });
}

/* ════════════════════════════════════════════
   MONITOR SCROLL CAPTURE (scroll inside screen = slide change)
   ════════════════════════════════════════════ */
function initMonitorScrollCapture() {
  const monitorScreen = document.getElementById('monitor-screen');
  const slides = document.querySelectorAll('.project-slide');
  const dots = document.querySelectorAll('.mon-dot');
  let current = 0;
  let locked = false;
  let lastDelta = 0;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  monitorScreen.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (locked) return;
    locked = true;
    if (e.deltaY > 0) {
      goTo(current + 1);
    } else {
      goTo(current - 1);
    }
    setTimeout(() => { locked = false; }, 700);
  }, { passive: false });

  // Touch swipe
  let touchStartX = 0;
  monitorScreen.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
  monitorScreen.addEventListener('touchend', (e) => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) {
      if (dx > 0) goTo(current + 1);
      else goTo(current - 1);
    }
  });
}

/* ════════════════════════════════════════════
   BOOK / RESEARCH PAGINATION
   ════════════════════════════════════════════ */
function initBookNav() {
  const pages = document.querySelectorAll('.book-page');
  const prevBtn = document.getElementById('book-prev');
  const nextBtn = document.getElementById('book-next');
  const curSpan = document.getElementById('book-cur');
  let current = 0;

  function goTo(idx) {
    pages[current].classList.remove('active');
    current = Math.max(0, Math.min(idx, pages.length - 1));
    pages[current].classList.add('active');
    curSpan.textContent = current + 1;
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
}

/* ════════════════════════════════════════════
   SCROLL ANIMATIONS (fade-up)
   ════════════════════════════════════════════ */
function initScrollAnimations() {
  // Add fade-up class to elements
  const targets = [
    '.tl-card',
    '.edu-card',
    '.cert-card',
    '.proj-card',
    '.about-inner',
    '.device-section-label',
    '.monitor-wrapper',
    '.mobile-wrapper',
    '.book-section',
  ];

  targets.forEach((selector, i) => {
    document.querySelectorAll(selector).forEach((el, j) => {
      el.classList.add('fade-up');
      if (j === 1) el.classList.add('delay-1');
      if (j === 2) el.classList.add('delay-2');
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

/* ════════════════════════════════════════════
   CONTACT FORM
   ════════════════════════════════════════════ */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('cf-submit');
  const success = document.getElementById('form-success');
  const name = document.getElementById('cf-name').value;
  const email = document.getElementById('cf-email').value;
  const message = document.getElementById('cf-message').value;

  // Compose mailto link
  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  window.location.href = `mailto:ankitghoshhello@gmail.com?subject=${subject}&body=${body}`;

  btn.textContent = 'Sent!';
  btn.style.background = '#3A7A4A';
  btn.style.borderColor = '#3A7A4A';
  success.style.display = 'block';

  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.style.background = '';
    btn.style.borderColor = '';
    success.style.display = 'none';
    e.target.reset();
  }, 4000);
}
