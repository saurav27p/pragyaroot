(function () {

  var COMPONENTS_BASE = 'components/';
  var COMPONENT_NAMES = ['header', 'sidebar', 'drawer', 'search', 'footer', 'back-to-top'];

  function loadComponent(name) {
    return fetch(COMPONENTS_BASE + name + '.html')
      .then(function (r) {
        if (!r.ok) throw new Error('missing ' + name);
        return r.text();
      })
      .then(function (html) {
        var slots = document.querySelectorAll('[data-component="' + name + '"]');
        slots.forEach(function (slot) {
          slot.outerHTML = html;
        });
      })
      .catch(function () {});
  }

  function getStoredTheme() {
    try { return localStorage.getItem('pragyaroot-theme'); }
    catch (e) { return null; }
  }

  function storeTheme(value) {
    try { localStorage.setItem('pragyaroot-theme', value); } catch (e) {}
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var btn = document.getElementById('themeToggleTop');
    if (btn) {
      btn.setAttribute('data-tip', theme === 'dark' ? 'Switch to light' : 'Switch to dark');
    }
  }

  function initTheme() {
    var stored = getStoredTheme();
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('#themeToggleTop, #themeToggle');
      if (!btn) return;
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      storeTheme(next);
    });
  }

  function getStoredCollapsed() {
    try { return localStorage.getItem('pragyaroot-sidebar-collapsed') === 'true'; }
    catch (e) { return false; }
  }

  function storeCollapsed(value) {
    try { localStorage.setItem('pragyaroot-sidebar-collapsed', value); } catch (e) {}
  }

  function applyCollapsed(collapsed) {
    var sidebar = document.getElementById('sidebar');
    var main = document.querySelector('.main');
    var icon = document.getElementById('collapseIcon');
    var btn = document.getElementById('collapseBtn');
    if (!sidebar) return;

    if (collapsed) {
      sidebar.classList.add('collapsed');
      if (main) main.classList.add('collapsed');
      if (icon) icon.className = 'fa-solid fa-angles-right';
      if (btn) {
        btn.setAttribute('data-tip', 'Expand sidebar');
        btn.setAttribute('aria-label', 'Expand sidebar');
      }
    } else {
      sidebar.classList.remove('collapsed');
      if (main) main.classList.remove('collapsed');
      if (icon) icon.className = 'fa-solid fa-angles-left';
      if (btn) {
        btn.setAttribute('data-tip', 'Collapse sidebar');
        btn.setAttribute('aria-label', 'Collapse sidebar');
      }
    }
  }

  function initCollapse() {
    if (window.innerWidth > 860 && getStoredCollapsed()) {
      applyCollapsed(true);
    }
    document.addEventListener('click', function (e) {
      if (!e.target.closest('#collapseBtn')) return;
      var sidebar = document.getElementById('sidebar');
      if (!sidebar) return;
      var next = !sidebar.classList.contains('collapsed');
      applyCollapsed(next);
      storeCollapsed(next);
    });
  }

  function openDrawer() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('overlay');
    var btn = document.getElementById('mobileMenuBtn');
    if (sidebar) sidebar.classList.add('mobile-open');
    if (overlay) overlay.classList.add('open');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('overlay');
    var btn = document.getElementById('mobileMenuBtn');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function initDrawer() {
    document.addEventListener('click', function (e) {
      if (e.target.closest('#mobileMenuBtn')) {
        openDrawer();
        return;
      }
      if (e.target.closest('#overlay')) {
        closeDrawer();
        return;
      }
      var navItem = e.target.closest('.nav-item, .nav-group');
      if (navItem && window.innerWidth <= 860) {
        if (navItem.classList.contains('nav-item')) closeDrawer();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeDrawer();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  function initNavGroups() {
    document.addEventListener('click', function (e) {
      var group = e.target.closest('.nav-group');
      if (!group) return;
      var key = group.getAttribute('data-group');
      var sub = document.querySelector('.nav-sub[data-sub="' + key + '"]');
      if (!sub) return;
      var open = sub.getAttribute('data-open') === 'true';
      sub.setAttribute('data-open', open ? 'false' : 'true');
      group.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  }

  function autoExpandCurrent() {
    var path = window.location.pathname;

    var subjectsPaths = ['/subjects/nepali', '/subjects/english'];
    var grammarPaths = ['/grammar/english', '/grammar/nepali', '/grammar'];

    if (subjectsPaths.some(function (p) { return path.indexOf(p) === 0; })) {
      var sub = document.querySelector('.nav-sub[data-sub="subjects"]');
      var grp = document.querySelector('.nav-group[data-group="subjects"]');
      if (sub) sub.setAttribute('data-open', 'true');
      if (grp) grp.setAttribute('aria-expanded', 'true');
    }

    if (grammarPaths.some(function (p) { return path.indexOf(p) === 0; })) {
      var sub2 = document.querySelector('.nav-sub[data-sub="grammar"]');
      var grp2 = document.querySelector('.nav-group[data-group="grammar"]');
      if (sub2) sub2.setAttribute('data-open', 'true');
      if (grp2) grp2.setAttribute('aria-expanded', 'true');
    }
  }

  function markActive() {
    var path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';

    document.querySelectorAll('.nav-item[data-nav]').forEach(function (item) {
      item.classList.remove('active');
    });

    var match = null;

    if (path === '/' || path === '/pragyaroot' || path === '/pragyaroot/index') {
      match = 'home';
    } else if (path.indexOf('/subjects/nepali') !== -1) {
      match = 'nepali';
    } else if (path.indexOf('/subjects/english') !== -1) {
      match = 'english';
    } else if (path.indexOf('/grammar/english') !== -1) {
      match = 'grammar-english';
    } else if (path.indexOf('/grammar/nepali') !== -1) {
      match = 'grammar-nepali';
    }

    if (match) {
      var item = document.querySelector('.nav-item[data-nav="' + match + '"]');
      if (item) item.classList.add('active');
    }
  }

  var searchIndex = null;
  var searchLoading = null;

  function loadSearchIndex() {
    if (searchIndex) return Promise.resolve(searchIndex);
    if (searchLoading) return searchLoading;
    searchLoading = fetch('search-index.json')
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (data) {
        searchIndex = Array.isArray(data) ? data : [];
        return searchIndex;
      })
      .catch(function () {
        searchIndex = [];
        return searchIndex;
      });
    return searchLoading;
  }

  function runSearch(query, limit) {
    if (!query || !searchIndex) return [];
    var q = query.toLowerCase().trim();
    if (!q) return [];

    var results = [];
    for (var i = 0; i < searchIndex.length; i++) {
      var item = searchIndex[i];
      var hay = (
        (item.title || '') + ' ' +
        (item.keywords || '') + ' ' +
        (item.subject || '') + ' ' +
        (item.type || '') + ' ' +
        (item.snippet || '')
      ).toLowerCase();

      if (hay.indexOf(q) !== -1) {
        results.push(item);
        if (results.length >= (limit || 8)) break;
      }
    }
    return results;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderResult(item) {
    var a = document.createElement('a');
    a.className = 'search-result';
    a.href = item.url || '#';
    a.setAttribute('role', 'option');
    a.innerHTML =
      '<div class="search-result__title">' + escapeHtml(item.title || '') + '</div>' +
      '<div class="search-result__meta">' + escapeHtml(item.subject || '') + ' · ' + escapeHtml(item.type || '') + '</div>' +
      (item.snippet ? '<div class="search-result__snippet">' + escapeHtml(item.snippet) + '</div>' : '');
    return a;
  }

  function renderResults(container, results, query) {
    container.innerHTML = '';
    if (!query) return;
    if (!results.length) {
      var empty = document.createElement('div');
      empty.className = 'search-no-results';
      empty.textContent = 'No results for "' + query + '"';
      container.appendChild(empty);
      return;
    }
    results.forEach(function (item) {
      container.appendChild(renderResult(item));
    });
  }

  function initSearch() {
    loadSearchIndex();

    var input = document.getElementById('searchInput');
    var results = document.getElementById('searchResults');
    var panel = document.getElementById('searchPanel');
    var panelInput = document.getElementById('searchPanelInput');
    var panelResults = document.getElementById('searchPanelResults');
    var panelClose = document.getElementById('searchPanelClose');
    var mobileBtn = document.getElementById('mobileSearchBtn');

    if (input && results) {
      input.addEventListener('input', function () {
        var q = input.value.trim();
        if (!q) {
          results.hidden = true;
          results.innerHTML = '';
          return;
        }
        var matches = runSearch(q);
        renderResults(results, matches, q);
        results.hidden = false;
      });

      input.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          input.value = '';
          results.hidden = true;
        }
      });

      document.addEventListener('click', function (e) {
        if (!e.target.closest('.search-wrap')) {
          results.hidden = true;
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === '/' && document.activeElement !== input && window.innerWidth > 860) {
          e.preventDefault();
          input.focus();
        }
      });
    }

    if (mobileBtn && panel && panelInput) {
      mobileBtn.addEventListener('click', function () {
        panel.hidden = false;
        setTimeout(function () { panelInput.focus(); }, 40);
        document.body.style.overflow = 'hidden';
      });
    }

    if (panelClose) {
      panelClose.addEventListener('click', closePanel);
    }

    function closePanel() {
      if (panel) panel.hidden = true;
      if (panelInput) panelInput.value = '';
      if (panelResults) {
        panelResults.innerHTML =
          '<div class="search-empty" id="searchEmpty">' +
          '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>' +
          '<p>Start typing to search across grammar, notes and solutions.</p>' +
          '</div>';
      }
      document.body.style.overflow = '';
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel && !panel.hidden) closePanel();
    });

    if (panelInput && panelResults) {
      panelInput.addEventListener('input', function () {
        var q = panelInput.value.trim();
        if (!q) {
          panelResults.innerHTML =
            '<div class="search-empty">' +
            '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>' +
            '<p>Start typing to search across grammar, notes and solutions.</p>' +
            '</div>';
          return;
        }
        var matches = runSearch(q, 12);
        renderResults(panelResults, matches, q);
      });
    }
  }

  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    function onScroll() {
      if (window.scrollY > 400) btn.classList.add('visible');
      else btn.classList.remove('visible');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function init() {
    initTheme();
    initCollapse();
    initDrawer();
    initNavGroups();
    markActive();
    autoExpandCurrent();
    initBackToTop();
    initSearch();
  }

  Promise.all(COMPONENT_NAMES.map(loadComponent)).then(init);
})();
