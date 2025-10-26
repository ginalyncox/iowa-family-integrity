// ======================================================
//  Iowa Family Integrity — Site Script
// ======================================================

// Confirmation in dev console (non-intrusive)
console.log("%c✅ Iowa Family Integrity site scripts loaded successfully!", "color:#155e3b;font-weight:bold;");

/* ======================================================
   Load partials (nav.html)
   ------------------------------------------------------ */
(function includePartials(){
  const host = document.querySelectorAll("[data-include]");
  host.forEach(async el=>{
    const url = el.getAttribute("data-include");
    try{
      const res = await fetch(url, {cache:"no-cache"});
      el.innerHTML = await res.text();
      // Mark current page in nav
      const p = location.pathname.split("/").pop() || "index.html";
      el.querySelectorAll('.nav a').forEach(a=>{
        const target = a.getAttribute("href");
        if ((target === p) || (target === "#" && p === "index.html")) {
          a.setAttribute("aria-current","page");
        }
      });
    }catch(e){ console.warn("Include failed for", url, e); }
  });
})();

/* ======================================================
   Scrollspy for Table of Contents
   ------------------------------------------------------ */
(function scrollSpy(){
  const tocLinks = Array.from(document.querySelectorAll('.toc a[href^="#"]'));
  if (!tocLinks.length) return;

  const map = new Map();
  tocLinks.forEach(a=>{
    const id = decodeURIComponent(a.getAttribute("href").slice(1));
    const el = document.getElementById(id);
    if (el) map.set(el, a);
  });

  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const a = map.get(entry.target);
      if (!a) return;
      if (entry.isIntersecting){
        tocLinks.forEach(x=>x.classList.remove('active'));
        a.classList.add('active');
        // Update hash without jump
        history.replaceState(null, "", "#"+entry.target.id);
      }
    });
  }, { rootMargin:"-40% 0px -55% 0px", threshold:0.01 });

  map.forEach((a, el)=> io.observe(el));
})();