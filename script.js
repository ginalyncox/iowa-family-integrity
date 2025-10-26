/* Shared behavior: nav include, scroll-compact header, a11y polish */
(function () {
  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));

  document.documentElement.classList.add('js');

  async function loadNav() {
    const navHost = $('#site-nav'); if (!navHost) return;
    navHost.classList.add('nav-fade');
    try {
      const r = await fetch('nav.html', {cache:'no-store'});
      navHost.innerHTML = r.ok ? await r.text() : `
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="Full_Initiative.html">Initiative</a></li>
          <li><a href="press.html">Press</a></li>
          <li><a href="resources.html">Resources</a></li>
        </ul>`;
    } catch {
      navHost.innerHTML = `
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="Full_Initiative.html">Initiative</a></li>
          <li><a href="press.html">Press</a></li>
          <li><a href="resources.html">Resources</a></li>
        </ul>`;
    }
    const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    $$('#site-nav a').forEach(a => {
      const href = (a.getAttribute('href')||'').toLowerCase();
      if (href === here) a.setAttribute('aria-current','page'), a.classList.add('active');
    });
    requestAnimationFrame(()=>navHost.classList.add('visible'));
  }

  function stampYear() {
    const y = $('#yr'); if (y) y.textContent = new Date().getFullYear();
  }

  function watchScroll() {
    const onScroll = () => {
      if (window.scrollY > 10) document.body.classList.add('scrolled');
      else document.body.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
  }

  function enableSmoothScroll() {
    document.addEventListener('click', (e) => {
      const l = e.target.closest('a[href^="#"]');
      if (!l) return;
      const id = l.getAttribute('href').slice(1);
      if (!id) return;
      const t = document.getElementById(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({behavior:'smooth', block:'start'});
      history.replaceState(null, '', `#${id}`);
    });
  }

  function init() {
    loadNav();
    stampYear();
    watchScroll();
    enableSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else {
    init();
  }
})();
