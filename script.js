const themeBtn = document.getElementById('theme-btn');
const htmlEl = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';

function updateThemeIcons(theme) {
  const icon = theme === 'light' ? '🌙' : '☀️';
  themeBtn.textContent = icon;
}

if (savedTheme === 'light') {
  htmlEl.setAttribute('data-theme', 'light');
  updateThemeIcons('light');
} else {
  htmlEl.setAttribute('data-theme', 'dark');
  updateThemeIcons('dark');
}

function toggleThemeFunc() {
  const currentTheme = htmlEl.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    htmlEl.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    updateThemeIcons('light');
  } else {
    htmlEl.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    updateThemeIcons('dark');
  }
}

themeBtn.addEventListener('click', toggleThemeFunc);

/* Mobile Menu Toggle Logic */
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuOverlay = document.getElementById('menu-overlay');
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

function toggleMobileMenu() {
  mobileMenu.classList.toggle('active');
  menuOverlay.classList.toggle('active');
  const icon = menuToggle.querySelector('i');
  if (mobileMenu.classList.contains('active')) {
    icon.className = 'fa-solid fa-xmark';
  } else {
    icon.className = 'fa-solid fa-bars';
  }
}

menuToggle.addEventListener('click', toggleMobileMenu);
menuOverlay.addEventListener('click', toggleMobileMenu);
mobileNavItems.forEach(item => {
  item.addEventListener('click', toggleMobileMenu);
});

const navbar = document.getElementById('navbar');
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.pageYOffset >= sectionTop - 150) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    // نتأكد ألا نزيل كلاس الزر الخاص بالكونتاكت عن طريق الخطأ
    if(!item.classList.contains('nav-contact-btn')) {
      item.classList.remove('active');
    }
    if (item.getAttribute('href') === '#' + current) {
      item.classList.add('active');
    }
  });

  mobileNavItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === '#' + current) {
      item.classList.add('active');
    }
  });
});

const EMAILJS_SERVICE_ID  = 'service_3zbbpzc';
const EMAILJS_TEMPLATE_ID = 'template_bjfc6v8';
const EMAILJS_PUBLIC_KEY  = 'ogrxhBbvhZVWdVWH0';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

function showToast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast ' + type;
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => t.classList.remove('show'), 4000);
}

document.getElementById('hire-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const name    = document.getElementById('hm-name');
  const company = document.getElementById('hm-company');
  const email   = document.getElementById('hm-email');
  const message = document.getElementById('hm-message');
  const btn     = document.getElementById('send-btn');
  const label   = document.getElementById('send-label');

  function setErr(inputEl, errId, show) {
    inputEl.classList.toggle('error', show);
    document.getElementById(errId).classList.toggle('show', show);
  }

  setErr(name,    'err-name',    !name.value.trim());
  setErr(message, 'err-message', !message.value.trim());

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  setErr(email, 'err-email', !emailOk);

  if (!name.value.trim() || !email.value.trim() || !emailOk || !message.value.trim()) return;

  btn.disabled = true;
  label.textContent = 'Sending…';

  const params = {
    name:       name.value.trim(),
    from_name:  name.value.trim(),
    company:    company.value.trim() || '-',
    reply_to:   email.value.trim(),
    message:    message.value.trim(),
    subject:    'Hiring Inquiry from Portfolio',
  };

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
    showToast('✅ Message sent! I\'ll get back to you soon.', 'success');
    this.reset();
    ['hm-name','hm-email','hm-message'].forEach(id => {
      document.getElementById(id).classList.remove('error');
    });
    ['err-name','err-email','err-message'].forEach(id => {
      document.getElementById(id).classList.remove('show');
    });
  } catch (err) {
    console.error(err);
    showToast('❌ Failed to send. Please try again or email me directly.', 'error');
  } finally {
    btn.disabled = false;
    label.textContent = 'Send Message';
  }
});

const phrases = [
  'Software Engineer',
  'Full Stack .NET Developer',
  'Cybersecurity Enthusiast',
];
let pi = 0, ci = 0, deleting = false;
const el = document.getElementById('typing-text');
function type() {
  const phrase = phrases[pi];
  if (!deleting) {
    el.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) { deleting = true; setTimeout(type, 2200); return; }
  } else {
    el.textContent = phrase.slice(0, --ci);
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 28 : 48);
}
type();

const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

const statsObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || (target > 10 ? '+' : '');
    let current = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + suffix;
      if (current >= target) clearInterval(interval);
    }, 35);
    statsObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => statsObs.observe(el));

// ══ 3D Tilt Cards ══
function initTiltCards(selector, options = {}) {
  const maxTilt   = options.maxTilt   ?? 10;
  const lift      = options.lift      ?? 10;
  const withGlow  = options.withGlow  ?? true;

  document.querySelectorAll(selector).forEach(card => {
    const enterTransition = 'box-shadow .35s ease, border-color .35s ease, background .35s ease';
    const leaveTransition = 'transform .5s cubic-bezier(.23,1,.32,1), ' + enterTransition;

    card.style.transition = enterTransition;

    card.addEventListener('mouseenter', () => {
      card.style.transition = enterTransition;
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;

      const rotateX = ((y / rect.height) - 0.5) * -maxTilt * 2;
      const rotateY = ((x / rect.width)  - 0.5) * maxTilt * 2;

      if (withGlow) {
        card.style.setProperty('--mx', px + '%');
        card.style.setProperty('--my', py + '%');
      }
      card.style.transform =
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${lift}px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = leaveTransition;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      if (withGlow) {
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '50%');
      }
    });
  });
}

initTiltCards('.skill-group-card, .exp-card, .contact-card, .featured-card', { maxTilt: 8, lift: 10 });
initTiltCards('.photo-wrap', { maxTilt: 12, lift: 20, withGlow: false });