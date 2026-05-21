
/* =========================================================
   Dr. Sabir Ali Siddique — Premium Academic Website JS
   ========================================================= */
(() => {
  'use strict';
  const doc = document.documentElement;
  doc.classList.add('js-enabled');

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

  /* Theme toggle */
  const savedTheme = localStorage.getItem('sabir-site-theme');
  if (savedTheme === 'light') doc.classList.add('light-theme');
  $('.theme-toggle')?.addEventListener('click', () => {
    doc.classList.toggle('light-theme');
    localStorage.setItem('sabir-site-theme', doc.classList.contains('light-theme') ? 'light' : 'dark');
  });

  /* Progress line */
  const progress = $('.progress-line span');
  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;
    if (progress) progress.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* Mobile navigation */
  const navToggle = $('.nav-toggle');
  const nav = $('.site-nav');
  const navLinks = nav ? $$('a', nav) : [];
  navToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.textContent = open ? '×' : '☰';
  });
  navLinks.forEach(link => link.addEventListener('click', () => {
    nav?.classList.remove('open');
    if (navToggle) { navToggle.setAttribute('aria-expanded','false'); navToggle.textContent = '☰'; }
  }));

  /* Scroll-spy */
  const sections = $$('main section[id]');
  if ('IntersectionObserver' in window && sections.length) {
    const setActive = (id) => navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    const spy = new IntersectionObserver((entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-44% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => spy.observe(s));
  }

  /* Reveal */
  const revealEls = $$('.reveal, .stagger');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const obs = new IntersectionObserver((entries, observer) => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealEls.forEach(el => obs.observe(el));
    setTimeout(() => revealEls.forEach(el => el.classList.add('in')), 1600);
  } else revealEls.forEach(el => el.classList.add('in'));

  /* Publication filters */
  const searchEl = $('#pubSearch');
  const yearEl = $('#yearFilter');
  const tagEl = $('#tagFilter');
  const countEl = $('#pubCount');
  const noRes = $('#pubNoResults');
  const pubs = $$('.pub-item');
  const yearHeads = $$('.pub-year-heading');
  pubs.forEach(p => { p.dataset.search = (p.textContent || '').toLowerCase().replace(/\s+/g, ' ').trim(); });
  function filterPubs() {
    const q = (searchEl?.value || '').toLowerCase().trim();
    const y = yearEl?.value || 'all';
    const t = tagEl?.value || 'all';
    let visible = 0;
    pubs.forEach(p => {
      const okQ = !q || p.dataset.search.includes(q);
      const okY = y === 'all' || p.dataset.year === y;
      const okT = t === 'all' || (p.dataset.tags || '').split(' ').includes(t);
      const show = okQ && okY && okT;
      p.classList.toggle('hidden', !show);
      if (show) visible++;
    });
    yearHeads.forEach(h => {
      const yr = h.dataset.year;
      const total = pubs.filter(p => p.dataset.year === yr).length;
      const shown = pubs.filter(p => p.dataset.year === yr && !p.classList.contains('hidden')).length;
      h.style.display = shown ? '' : 'none';
      const cnt = h.querySelector('.ycount');
      if (cnt) cnt.textContent = shown === total ? `${total} entries` : `${shown} / ${total}`;
    });
    if (countEl) countEl.innerHTML = `<strong>${visible}</strong> of ${pubs.length} publications shown`;
    noRes?.classList.toggle('show', visible === 0);
  }
  searchEl?.addEventListener('input', filterPubs);
  yearEl?.addEventListener('change', filterPubs);
  tagEl?.addEventListener('change', filterPubs);
  filterPubs();

  /* Command palette */
  const palette = $('.command-palette');
  const commandInput = $('#commandSearch');
  const commandLinks = $$('.command-list a');
  function openPalette(){ palette?.classList.add('open'); palette?.setAttribute('aria-hidden','false'); setTimeout(() => commandInput?.focus(), 30); }
  function closePalette(){ palette?.classList.remove('open'); palette?.setAttribute('aria-hidden','true'); commandInput && (commandInput.value=''); commandLinks.forEach(a => a.classList.remove('hidden')); }
  $('.command-open')?.addEventListener('click', openPalette);
  $('.command-close')?.addEventListener('click', closePalette);
  $('.command-backdrop')?.addEventListener('click', closePalette);
  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === 'k') { e.preventDefault(); openPalette(); }
    if (e.key === 'Escape') closePalette();
  });
  commandInput?.addEventListener('input', () => {
    const q = commandInput.value.toLowerCase().trim();
    commandLinks.forEach(a => {
      const hay = `${a.textContent} ${a.dataset.key || ''}`.toLowerCase();
      a.classList.toggle('hidden', q && !hay.includes(q));
    });
  });
  commandLinks.forEach(a => a.addEventListener('click', closePalette));

  /* Copy email */
  $('.copy-email')?.addEventListener('click', async (e) => {
    const email = 'sabir.siddique@iub.edu.pk';
    try {
      await navigator.clipboard.writeText(email);
      e.currentTarget.textContent = 'Copied';
      setTimeout(() => e.currentTarget.textContent = 'Copy email', 1200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });

  /* Footer year */
  const yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
