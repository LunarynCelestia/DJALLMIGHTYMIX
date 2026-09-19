// Page loading screen: shown instantly on click, hidden once the destination page fully loads
(function pageLoader(){
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  // Hide once this page (including images/iframes) has finished loading
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 200);
  });

  function currentFile(){
    const p = window.location.pathname.split('/').pop();
    return p === '' ? 'index.html' : p;
  }

  // Show it again right when someone clicks a link that leaves this page
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || link.target === '_blank') return;

    const destFile = href.split('#')[0];
    const goingToDifferentDoc = destFile !== '' && destFile !== currentFile();
    if (!goingToDifferentDoc) return; // same-page anchor — let it scroll normally

    e.preventDefault();
    loader.classList.remove('hidden');
    setTimeout(() => { window.location.href = href; }, 250);
  });
})();

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navList = document.getElementById('navList');
if (menuToggle && navList) {
  menuToggle.addEventListener('click', () => navList.classList.toggle('open'));
  navList.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navList.classList.remove('open'))
  );
}

// Highlight the current page/section in the nav
(function highlightActiveNav(){
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const hash = window.location.hash;
  const navLinks = document.querySelectorAll('nav a');

  function setActiveByHash(){
    navLinks.forEach(a => {
      const href = a.getAttribute('href') || '';
      a.classList.toggle('active', href === (path + hash) || (hash && href.endsWith(hash)) );
    });
  }

  if (path === 'about.html') {
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === 'about.html'));
    return;
  }

  // index.html: track scroll position between #home and #contact
  const sections = ['home', 'contact'].map(id => document.getElementById(id)).filter(Boolean);
  if (sections.length) {
    window.addEventListener('scroll', () => {
      let current = 'home';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
      });
      navLinks.forEach(a => {
        const href = a.getAttribute('href') || '';
        a.classList.toggle('active', href === '#' + current || href === 'index.html#' + current || (current === 'home' && (href === 'index.html' || href === '#home')));
      });
    });
  } else {
    setActiveByHash();
  }
})();
