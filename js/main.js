/**
 * Mahendra Yadav | Portfolio Interactions
 * Minimalist, performant, dependency-free JavaScript.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCopyEmail();
  initMobileNav();
  initScrollSpy();
  initDynamicPosts();
  initScrollAnimations();
  initScrollProgress();
});

/* --------------------------------------------------------------------------
   5. Scroll Animation Observer
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = document.querySelectorAll('section');
  if (prefersReducedMotion || !sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;

    if (inView) {
      // Already on screen: reveal instantly, no transition, no flash.
      section.classList.add('fade-in-section', 'visible');
    } else {
      section.classList.add('fade-in-section');
      observer.observe(section);
    }
  });
}

/* --------------------------------------------------------------------------
   6. Scroll Progress Indicator
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(progress, 100)}%`;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
}

/* --------------------------------------------------------------------------
   1. Dark / Light Theme Setup
   -------------------------------------------------------------------------- */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
  });
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;

  if (theme === 'light') {
    // Moon icon to switch to dark
    icon.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  } else {
    // Sun icon to switch to light
    icon.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  }
}

/* --------------------------------------------------------------------------
   2. Copy Email with Minimal Toast
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-trigger');
  const toast = document.getElementById('copy-toast');
  const email = 'mahendra.k12@gmail.com';

  if (!copyBtn || !toast) return;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(email).then(() => {
      toast.classList.add('visible');
      setTimeout(() => {
        toast.classList.remove('visible');
      }, 2200);
    }).catch(err => {
      console.error('Clipboard copy failed:', err);
    });
  });
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const header = document.querySelector('.site-header');
  const links = document.querySelectorAll('.nav-menu a');

  if (!toggle || !header) return;

  toggle.addEventListener('click', () => {
    header.classList.toggle('mobile-expanded');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('mobile-expanded');
    });
  });
}

/* --------------------------------------------------------------------------
   4. ScrollSpy for Navigation Links
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-menu a[href^="#"]');

  if (!sections.length || !links.length) return;

  const setActive = () => {
    // Highlight the last linked section whose top has passed the viewport marker.
    // Sections without a nav link (e.g. key stats, "Now") keep the previous one active
    // instead of blanking the nav.
    const scrollPos = window.scrollY + 120;
    let currentId = '';

    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) {
        currentId = sec.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  window.addEventListener('resize', setActive, { passive: true });
  setActive();
}

/* --------------------------------------------------------------------------
   5. Dynamic Blog Posts Loader (Auto-syncs from posts/posts.json)
   -------------------------------------------------------------------------- */
async function initDynamicPosts() {
  const listEl = document.getElementById('writing-posts-list');
  if (!listEl) return;

  try {
    const res = await fetch('posts/posts.json');
    if (!res.ok) return;
    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) return;

    listEl.innerHTML = posts.map(p => `
      <a href="post.html?id=${encodeURIComponent(p.slug)}" class="writing-item">
        <div class="writing-header">
          <h3 class="writing-title">${p.title}</h3>
          <span class="writing-meta">${p.date} &bull; ${p.readTime}</span>
        </div>
        <p class="writing-excerpt">${p.excerpt}</p>
        <div class="tags-row">
          ${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </a>
    `).join('');
  } catch (err) {
    // Graceful fallback to static pre-rendered HTML in index.html
    console.debug('Using pre-rendered posts list.');
  }
}

