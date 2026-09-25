/* ─── app.js — Ankit Ghosh Portfolio ─── */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHangingIDCard();
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

/* ════════════════════════════════════════════
   INTERACTIVE HANGING ID CARD PHYSICS
   ════════════════════════════════════════════ */
function initHangingIDCard() {
  const wrapper = document.getElementById('id-card-wrapper');
  const anchor = document.getElementById('lanyard-anchor');
  const svgStrap = document.getElementById('lanyard-strap');
  const svgInner = document.getElementById('lanyard-inner-line');
  const cardContainer = document.getElementById('id-card-container');
  const card3d = document.getElementById('id-card-3d');
  
  if (!wrapper || !cardContainer || !card3d || !svgStrap) return;

  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let dragTimeStart = 0;

  // Physics state
  const restLength = 60;
  let anchorPos = { x: 250, y: 15 };
  let cardPos = { x: 250, y: anchorPos.y + restLength };
  let vel = { x: 0, y: 0 };
  let angleZ = 0;
  let rotY = 0;
  let rotYVel = 0;
  let rotX = 0;
  let ambientTime = Math.random() * 100;

  function updateAnchorPosition() {
    const rect = wrapper.getBoundingClientRect();
    if (!rect.width) return;
    const anchorRect = anchor.getBoundingClientRect();
    anchorPos.x = anchorRect.left - rect.left + anchorRect.width / 2;
    anchorPos.y = anchorRect.top - rect.top + anchorRect.height / 2;
  }

  updateAnchorPosition();
  window.addEventListener('resize', updateAnchorPosition);

  // Pointer interactions
  function onPointerDown(e) {
    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    dragStartX = clientX;
    dragStartY = clientY;
    lastPointerX = clientX;
    lastPointerY = clientY;
    dragTimeStart = performance.now();
    vel = { x: 0, y: 0 };
    cardContainer.style.cursor = 'grabbing';
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const wrapperRect = wrapper.getBoundingClientRect();
    const targetX = clientX - wrapperRect.left;
    const targetY = clientY - wrapperRect.top;

    const dx = clientX - lastPointerX;
    const dy = clientY - lastPointerY;

    // Direct responsive drag tracking
    cardPos.x += (targetX - cardPos.x) * 0.5;
    cardPos.y += (targetY - cardPos.y) * 0.5;

    vel.x = dx;
    vel.y = dy;

    // Spin accumulation on fast drag
    rotYVel += dx * 0.75;

    lastPointerX = clientX;
    lastPointerY = clientY;
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    cardContainer.style.cursor = 'grab';

    const duration = performance.now() - dragTimeStart;
    const distMoved = Math.hypot(lastPointerX - dragStartX, lastPointerY - dragStartY);

    // Click/Tap flip or Flick spin
    if (duration < 250 && distMoved < 8) {
      rotYVel += 180;
    } else if (Math.abs(vel.x) > 4) {
      rotYVel += Math.sign(vel.x) * (Math.abs(vel.x) * 5);
    }
  }

  cardContainer.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  cardContainer.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // Main physics loop
  function physicsLoop() {
    updateAnchorPosition();

    if (!isDragging) {
      const targetY = anchorPos.y + restLength;
      const dx = cardPos.x - anchorPos.x;
      const dy = cardPos.y - targetY;

      const k = 0.05; // spring stiffness
      const damping = 0.92; // friction damping
      const gravity = 0.35; // gravity

      const fx = -k * dx;
      const fy = -k * dy + gravity;

      vel.x = (vel.x + fx) * damping;
      vel.y = (vel.y + fy) * damping;

      cardPos.x += vel.x;
      cardPos.y += vel.y;

      // 3D rotation decay
      rotY += rotYVel;
      rotYVel *= 0.93;

      // Z-axis pendulum angle & X-axis tilt
      const targetAngleZ = Math.atan2(cardPos.x - anchorPos.x, Math.max(50, cardPos.y - anchorPos.y)) * (180 / Math.PI);
      angleZ += (targetAngleZ - angleZ) * 0.15;

      const targetRotX = Math.min(20, Math.max(-20, vel.y * 1.2));
      rotX += (targetRotX - rotX) * 0.15;

      // Gentle ambient idle swing when still
      if (Math.abs(vel.x) < 0.15 && Math.abs(rotYVel) < 0.2 && Math.abs(dx) < 3) {
        ambientTime += 0.025;
        cardPos.x = anchorPos.x + Math.sin(ambientTime) * 6;
        angleZ = Math.sin(ambientTime) * 2.5;
      }
    } else {
      rotY += rotYVel;
      rotYVel *= 0.92;

      const targetAngleZ = Math.atan2(cardPos.x - anchorPos.x, Math.max(40, cardPos.y - anchorPos.y)) * (180 / Math.PI);
      angleZ += (targetAngleZ - angleZ) * 0.25;
      rotX = Math.min(25, Math.max(-25, vel.y * 1.5));
    }

    // Apply 3D transforms
    const cardWidth = cardContainer.offsetWidth || 300;
    const leftOffset = cardPos.x - cardWidth / 2;
    const topOffset = cardPos.y;

    cardContainer.style.transform = `translate3d(${leftOffset}px, ${topOffset}px, 0px) rotateZ(${angleZ}deg) rotateX(${rotX}deg)`;
    card3d.style.transform = `rotateY(${rotY}deg)`;

    // Draw flexible Lanyard cable path
    const clipHoleX = cardPos.x;
    const clipHoleY = cardPos.y + 16;

    const midX = (anchorPos.x + clipHoleX) / 2;
    const midY = (anchorPos.y + clipHoleY) / 2 + Math.max(0, 15 - Math.hypot(clipHoleX - anchorPos.x, clipHoleY - anchorPos.y) * 0.08);

    const pathD = `M ${anchorPos.x} ${anchorPos.y} Q ${midX} ${midY}, ${clipHoleX} ${clipHoleY}`;
    svgStrap.setAttribute('d', pathD);
    if (svgInner) svgInner.setAttribute('d', pathD);

    requestAnimationFrame(physicsLoop);
  }

  requestAnimationFrame(physicsLoop);
}

