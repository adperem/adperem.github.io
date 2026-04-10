// ── Mobile Navigation ───────────────────────────

(function () {
  var toggle = document.querySelector('.nav-toggle');
  var mobile = document.getElementById('nav-mobile');
  if (!toggle || !mobile) return;

  toggle.addEventListener('click', function () {
    var open = mobile.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });
})();

// ── Tag Filter (Blog Page) ─────────────────────

(function () {
  var bar = document.getElementById('filter-bar');
  var list = document.getElementById('post-list');
  if (!bar || !list) return;

  var buttons = bar.querySelectorAll('.tag');
  var rows = list.querySelectorAll('.post-row');

  bar.addEventListener('click', function (e) {
    var btn = e.target.closest('.tag');
    if (!btn) return;

    var filter = btn.getAttribute('data-filter');

    buttons.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');

    rows.forEach(function (row) {
      if (filter === 'all') {
        row.style.display = '';
      } else {
        var cats = (row.getAttribute('data-categories') || '').split(' ');
        row.style.display = cats.indexOf(filter) !== -1 ? '' : 'none';
      }
    });
  });
})();

// ── Reading Progress Bar ────────────────────────

(function () {
  var bar = document.getElementById('reading-progress');
  if (!bar) return;

  var ticking = false;

  function update() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();

// ── Table of Contents (Post Pages) ──────────────

(function () {
  var tocList = document.getElementById('toc-list');
  var postBody = document.getElementById('post-body');
  if (!tocList || !postBody) return;

  var headings = postBody.querySelectorAll('h2, h3');
  if (headings.length === 0) return;

  headings.forEach(function (h, i) {
    if (!h.id) {
      h.id = 'heading-' + i;
    }

    var li = document.createElement('li');
    li.className = 'toc__item';

    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.className = 'toc__link';
    if (h.tagName === 'H3') {
      a.className += ' toc__link--h3';
    }
    a.textContent = h.textContent;
    li.appendChild(a);
    tocList.appendChild(li);
  });

  // Active state tracking
  var links = tocList.querySelectorAll('.toc__link');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        links.forEach(function (l) { l.classList.remove('is-active'); });
        var active = tocList.querySelector('a[href="#' + entry.target.id + '"]');
        if (active) active.classList.add('is-active');
      }
    });
  }, { rootMargin: '-80px 0px -70% 0px' });

  headings.forEach(function (h) { observer.observe(h); });
})();

// ── Copy Button for Code Blocks ─────────────────

(function () {
  var blocks = document.querySelectorAll('div.highlight');

  blocks.forEach(function (block) {
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code to clipboard');

    btn.addEventListener('click', function () {
      var code = block.querySelector('code');
      if (!code) return;

      navigator.clipboard.writeText(code.textContent).then(function () {
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
      });
    });

    block.style.position = 'relative';
    block.appendChild(btn);
  });
})();

// ── Fade-Up Animation on Scroll ─────────────────

(function () {
  var elements = document.querySelectorAll('.fade-up');
  if (elements.length === 0) return;

  // Stagger initial visible elements
  var delay = 0;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        delay += 60;
        setTimeout(function () {
          el.classList.add('is-visible');
        }, delay);
        observer.unobserve(el);
      }
    });

    // Reset delay after a batch
    setTimeout(function () { delay = 0; }, 400);
  }, { threshold: 0.1 });

  elements.forEach(function (el) { observer.observe(el); });
})();
