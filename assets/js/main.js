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
        track('copy_code_block', {
          page_path: location.pathname,
          code_length: code.textContent.length,
          language: (code.className.match(/language-(\w+)/) || [])[1] || 'unknown'
        });
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

// ── Analytics helper ────────────────────────────
// Safe wrapper so events become no-ops when GA hasn't loaded
// (offline, dev environment, ad-blocker).
function track(name, params) {
  if (typeof window.gtag !== 'function') return;
  try { window.gtag('event', name, params || {}); } catch (e) {}
}

// ── External link tracking ──────────────────────

(function () {
  var host = location.hostname;
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var url;
    try { url = new URL(a.href, location.href); } catch (_) { return; }
    if (url.hostname && url.hostname !== host) {
      track('click_external_link', {
        link_url: url.href,
        link_domain: url.hostname,
        link_text: (a.textContent || '').trim().slice(0, 80),
        page_path: location.pathname
      });
    } else if (a.matches('.related__item, .post-row, a[href^="/posts/"], a[href^="/guides/"]')) {
      track('click_internal_link', {
        link_url: url.pathname,
        page_path: location.pathname,
        component: a.matches('.related__item') ? 'related'
                 : a.matches('.post-row')      ? 'post-row'
                 : 'inline'
      });
    }
  }, true);
})();

// ── Scroll depth (50%, 90%) ─────────────────────

(function () {
  if (!document.body) return;
  var fired = { 50: false, 90: false };
  var ticking = false;
  function check() {
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH <= 0) { ticking = false; return; }
    var pct = Math.round((window.scrollY / docH) * 100);
    [50, 90].forEach(function (m) {
      if (!fired[m] && pct >= m) {
        fired[m] = true;
        track('scroll_depth', { percent: m, page_path: location.pathname });
      }
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(check); ticking = true; }
  }, { passive: true });
})();

// ── Read-complete signal (post pages only) ──────
// Fires when the user has spent >= 30s on the post AND scrolled past 90%.
// Strong dwell-time signal that beats scroll-only metrics.

(function () {
  var body = document.getElementById('post-body');
  if (!body) return;
  var start = Date.now();
  var deepScroll = false;
  var sent = false;
  function maybeFire() {
    if (sent) return;
    var seconds = Math.round((Date.now() - start) / 1000);
    if (deepScroll && seconds >= 30) {
      sent = true;
      track('read_complete', {
        page_path: location.pathname,
        time_on_page_s: seconds
      });
    }
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH > 0 && (window.scrollY / docH) >= 0.9) deepScroll = true;
      maybeFire();
      ticking = false;
    });
  }, { passive: true });
  // Time-only path: keep checking while the tab is alive
  setInterval(maybeFire, 5000);
})();

// ── Web Vitals reporting (RUM) ──────────────────
// Lab data lives in Lighthouse CI. This reports real-user metrics:
// LCP, CLS, INP, FCP, TTFB to GA4 as web_vital events.

(function () {
  if (typeof PerformanceObserver === 'undefined') return;

  function send(name, value, id) {
    track('web_vital', {
      metric_name: name,
      metric_value: Math.round(name === 'CLS' ? value * 1000 : value),
      metric_id: id || (Date.now() + '-' + Math.random().toString(36).slice(2, 8)),
      metric_rating: rate(name, value),
      page_path: location.pathname
    });
  }

  function rate(name, v) {
    // Web Vitals thresholds (as of 2026).
    var t = { LCP: [2500, 4000], CLS: [0.1, 0.25], INP: [200, 500],
              FCP: [1800, 3000], TTFB: [800, 1800] }[name];
    if (!t) return 'unknown';
    return v <= t[0] ? 'good' : v <= t[1] ? 'needs-improvement' : 'poor';
  }

  // LCP
  try {
    var lcpValue = 0;
    new PerformanceObserver(function (list) {
      var entries = list.getEntries();
      var last = entries[entries.length - 1];
      if (last) lcpValue = last.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden' && lcpValue) send('LCP', lcpValue);
    }, { once: true });
  } catch (_) {}

  // CLS
  try {
    var clsValue = 0, clsEntries = [];
    new PerformanceObserver(function (list) {
      list.getEntries().forEach(function (e) {
        if (!e.hadRecentInput) {
          clsEntries.push(e);
          clsValue += e.value;
        }
      });
    }).observe({ type: 'layout-shift', buffered: true });
    addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') send('CLS', clsValue);
    }, { once: true });
  } catch (_) {}

  // INP — uses event timing API (Chromium-based browsers)
  try {
    var maxDuration = 0;
    new PerformanceObserver(function (list) {
      list.getEntries().forEach(function (e) {
        if (e.duration > maxDuration) maxDuration = e.duration;
      });
    }).observe({ type: 'event', buffered: true, durationThreshold: 40 });
    addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden' && maxDuration) send('INP', maxDuration);
    }, { once: true });
  } catch (_) {}

  // FCP
  try {
    new PerformanceObserver(function (list) {
      list.getEntries().forEach(function (e) {
        if (e.name === 'first-contentful-paint') send('FCP', e.startTime);
      });
    }).observe({ type: 'paint', buffered: true });
  } catch (_) {}

  // TTFB
  try {
    var nav = performance.getEntriesByType('navigation')[0];
    if (nav) send('TTFB', nav.responseStart);
  } catch (_) {}
})();
