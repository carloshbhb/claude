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
