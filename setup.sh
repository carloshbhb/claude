#!/bin/bash

mkdir -p data pages

cat > topbar.js << 'TOPBAR'
document.write(`
<div style="background:var(--blue-light);color:var(--blue-dark);border-bottom:1px solid var(--blue-mid);text-align:center;padding:11px 16px;font-family:'Syne',sans-serif;font-size:.82rem;font-weight:700;letter-spacing:.03em;">
🔥 Galaxy Fit3 com 43% de desconto e frete grátis — oferta por tempo limitado
</div>
<nav style="background:#fff;border-bottom:1px solid var(--border);padding:12px 0;position:sticky;top:0;z-index:100;box-shadow:0 2px 8px rgba(0,0,0,.04);">
  <div style="width:min(1100px,calc(100% - 32px));margin:0 auto;display:flex;align-items:center;justify-content:space-between;">
    <a href="/" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
      <svg width="28" height="28" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="9" fill="#1428A0"/><polygon points="8,10 14.5,10 18,22 21.5,10 28,10 19.5,27 16.5,27" fill="#4285F4"/></svg>
      <span style="font-family:'Syne',sans-serif;font-weight:800;font-size:1rem;color:var(--navy);">vetor.blog</span>
    </a>
    <div style="display:flex;gap:20px;align-items:center;">
      <a href="/" style="font-size:.85rem;color:var(--text2);text-decoration:none;font-weight:500;">Home</a>
      <a href="/smartbands" style="font-size:.85rem;color:var(--text2);text-decoration:none;font-weight:500;">Smartbands</a>
      <a href="/smartwatches" style="font-size:.85rem;color:var(--text2);text-decoration:none;font-weight:500;">Smartwatches</a>
      <a href="/fones" style="font-size:.85rem;color:var(--text2);text-decoration:none;font-weight:500;">Fones</a>
    </div>
  </div>
</nav>
`);
TOPBAR

cat > main.js << 'MAINJS'
document.addEventListener('DOMContentLoaded', function() {
  var headings = document.querySelectorAll('.article-body h2[id]');
  var links = document.querySelectorAll('.toc-list a');
  if (!headings.length || !links.length) return;
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        links.forEach(function(l) { l.classList.remove('active'); });
        var active = document.querySelector('.toc-list a[href="#' + e.target.id + '"]');
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-10% 0px -80% 0px', threshold: 0 });
  headings.forEach(function(h) { io.observe(h); });

  document.querySelectorAll('details').forEach(function(d) {
    d.addEventListener('toggle', function() {
      if (d.open) {
        document.querySelectorAll('details').forEach(function(other) {
          if (other !== d) other.open = false;
        });
      }
    });
  });

  var bars = document.querySelectorAll('.bar-fill');
  var barIO = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.style.width = e.target.style.width; barIO.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  bars.forEach(function(b) { barIO.observe(b); });
});
MAINJS

echo "topbar e main criados"
