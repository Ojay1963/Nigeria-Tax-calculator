// js/script.js — hamburger + basic interactions

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const siteNav = document.getElementById('site-nav');

  if (hamburger && siteNav) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      siteNav.classList.toggle('open');
      // simple toggle for nav on small screens
      if (siteNav.style.display === 'block') {
        siteNav.style.display = '';
      } else {
        siteNav.style.display = 'block';
      }
    });
  }

  // Smooth scroll for internal anchors (if used)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      e.preventDefault();
      const id = this.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
});
