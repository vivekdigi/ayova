/**
 * AYOVA Theme JavaScript
 * Mobile menu, search overlay, cart AJAX, FAQ accordion, sticky header, product gallery
 */

(function() {
  'use strict';

  /* ── Mobile Menu ──────────────────────────────────────────────── */
  function initMobileMenu() {
    const toggle = document.querySelector('[data-mobile-menu-toggle]');
    const drawer = document.querySelector('[data-mobile-menu]');
    const overlay = document.querySelector('[data-mobile-overlay]');
    const close = document.querySelector('[data-mobile-menu-close]');

    if (!toggle || !drawer) return;

    function openMenu() {
      drawer.classList.add('active');
      if (overlay) overlay.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      drawer.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', openMenu);
    if (close) close.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && drawer.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  /* ── Rich Search Panel ─────────────────────────────────────────── */
  function initSearch() {
    var toggleBtn = document.querySelector('[data-search-toggle]');
    var overlay = document.querySelector('[data-search-overlay]');
    var closeBtns = document.querySelectorAll('[data-search-close]');
    var searchInput = document.getElementById('searchPanelInput');
    var clearBtn = document.getElementById('searchClearBtn');
    var liveResults = document.getElementById('searchLiveResults');
    var resultsGrid = document.getElementById('searchResultsGrid');
    var popularSection = document.getElementById('searchPopular');
    var searchDebounce;

    if (!toggleBtn || !overlay) return;

    function openSearch() {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (searchInput) setTimeout(function() { searchInput.focus(); }, 120);
    }

    function closeSearch() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      if (searchInput) searchInput.value = '';
      if (clearBtn) clearBtn.classList.remove('visible');
      if (liveResults) liveResults.style.display = 'none';
      if (popularSection) popularSection.style.display = 'block';
    }

    toggleBtn.addEventListener('click', openSearch);

    closeBtns.forEach(function(btn) {
      btn.addEventListener('click', closeSearch);
    });

    // Close on backdrop click (clicking the dark overlay itself, not the panel)
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeSearch();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeSearch();
      }
    });

    // Clear button
    if (clearBtn && searchInput) {
      clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        clearBtn.classList.remove('visible');
        if (liveResults) liveResults.style.display = 'none';
        if (popularSection) popularSection.style.display = 'block';
        searchInput.focus();
      });
    }

    // Live search
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        var q = this.value.trim();
        if (clearBtn) clearBtn.classList.toggle('visible', q.length > 0);

        clearTimeout(searchDebounce);

        if (q.length < 2) {
          if (liveResults) liveResults.style.display = 'none';
          if (popularSection) popularSection.style.display = 'block';
          return;
        }

        var apiQuery = q.split(/\s+/).join(' AND ');

        searchDebounce = setTimeout(function() {
          fetch('/search/suggest.json?q=' + encodeURIComponent(apiQuery) + '&resources[type]=product&resources[limit]=8&resources[options][fields]=title,variants.title')
            .then(function(res) { return res.json(); })
            .then(function(data) {
              var products = data.resources && data.resources.results && data.resources.results.products || [];
              if (products.length > 0) {
                var html = products.map(function(p) {
                  var img = p.featured_image && p.featured_image.url ? '<img src="' + p.featured_image.url + '" alt="' + (p.title || '') + '" loading="lazy">' : '';
                  return '<a href="' + p.url + '" class="search-pop-card">' +
                    '<div class="search-pop-img">' + img + '</div>' +
                    '<div class="search-pop-info">' +
                      '<span class="search-pop-cat">' + (p.product_type || 'PRODUCT') + '</span>' +
                      '<span class="search-pop-name">' + p.title + '</span>' +
                      '<span class="search-pop-price">' + (p.price ? Number(p.price).toLocaleString('en-IN', {style:'currency', currency:'INR', maximumFractionDigits:0}) : '') + '</span>' +
                      '<div class="search-pop-stars">★★★★★</div>' +
                    '</div>' +
                    '<span class="search-pop-btn">VIEW PRODUCT →</span>' +
                  '</a>';
                }).join('');
                if (resultsGrid) resultsGrid.innerHTML = html;
                if (liveResults) liveResults.style.display = 'block';
                if (popularSection) popularSection.style.display = 'none';
              } else {
                if (resultsGrid) resultsGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:32px;color:#7A857F;">No products found for "<strong>' + q + '</strong>". <a href="/search?q=' + encodeURIComponent(q) + '&type=product" style="color:#D35F3C;">See all results →</a></div>';
                if (liveResults) liveResults.style.display = 'block';
                if (popularSection) popularSection.style.display = 'none';
              }
            })
            .catch(function() {});
        }, 300);
      });
    }
  }

  /* ── Cart AJAX ────────────────────────────────────────────────── */
  function initCartAjax() {
    document.addEventListener('submit', function(e) {
      var form = e.target;
      if (form.action && form.action.includes('/cart/add')) {
        e.preventDefault();
        var formData = new FormData(form);
        
        fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
          updateCartCount();
          var btn = form.querySelector('button[type="submit"]');
          if (btn) {
            var original = btn.textContent;
            btn.textContent = '✓ Added!';
            btn.style.backgroundColor = '#2F5D50';
            setTimeout(function() {
              btn.textContent = original;
              btn.style.backgroundColor = '';
            }, 1500);
          }
        })
        .catch(function(err) {
          console.error('Cart error:', err);
        });
      }
    });
  }

  function updateCartCount() {
    fetch('/cart.js')
      .then(function(res) { return res.json(); })
      .then(function(cart) {
        var badges = document.querySelectorAll('[data-cart-count]');
        badges.forEach(function(badge) {
          badge.textContent = cart.item_count;
        });
      });
  }

  /* ── Product Gallery ──────────────────────────────────────────── */
  function initProductGallery() {
    var thumbs = document.querySelectorAll('.gallery-thumbs .thumb');
    var mainImg = document.getElementById('mainProductImg');
    if (!mainImg || thumbs.length === 0) return;

    thumbs.forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        // Get full-size URL from data attribute or src
        var fullSrc = this.dataset.full || this.src;
        mainImg.src = fullSrc;
        // Update active state
        thumbs.forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
      });
    });
  }

  /* ── Product Variant Selector ─────────────────────────────────── */
  function initVariantSelector() {
    document.querySelectorAll('.variant-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var siblings = this.parentElement.querySelectorAll('.variant-btn');
        siblings.forEach(function(s) { s.classList.remove('active'); });
        this.classList.add('active');

        // Update hidden variant ID if data-variant-id is present
        var variantId = this.dataset.variantId;
        if (variantId) {
          var form = this.closest('form');
          if (form) {
            var input = form.querySelector('input[name="id"]');
            if (input) input.value = variantId;
          }
        }
      });
    });
  }

  /* ── Quantity Selector ────────────────────────────────────────── */
  function initQuantitySelector() {
    document.querySelectorAll('.quantity-selector').forEach(function(selector) {
      var minus = selector.querySelector('[data-qty-minus]');
      var plus = selector.querySelector('[data-qty-plus]');
      var input = selector.querySelector('input');

      if (!minus || !plus || !input) return;

      minus.addEventListener('click', function() {
        var val = parseInt(input.value) || 1;
        if (val > 1) input.value = val - 1;
        input.dispatchEvent(new Event('change'));
      });

      plus.addEventListener('click', function() {
        var val = parseInt(input.value) || 1;
        input.value = val + 1;
        input.dispatchEvent(new Event('change'));
      });
    });
  }

  /* ── FAQ Accordion ────────────────────────────────────────────── */
  function initFaqAccordion() {
    document.querySelectorAll('.faq-question').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var item = this.closest('.faq-item');
        var isOpen = item.classList.contains('active');
        
        // Close all
        document.querySelectorAll('.faq-item').forEach(function(i) {
          i.classList.remove('active');
        });
        
        // Toggle current
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    });
  }

  /* ── Product Tabs ─────────────────────────────────────────────── */
  function initProductTabs() {
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var tabId = this.dataset.tab;
        var container = this.closest('.product-tabs');
        if (!container) return;

        // Deactivate all
        container.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
        container.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });

        // Activate selected
        this.classList.add('active');
        var content = container.querySelector('[data-tab-content="' + tabId + '"]');
        if (content) content.classList.add('active');
      });
    });
  }

  /* ── Sticky Header Shadow ─────────────────────────────────────── */
  function initStickyHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;

    var lastScroll = 0;
    window.addEventListener('scroll', function() {
      var scrollY = window.scrollY;
      if (scrollY > 10) {
        header.style.boxShadow = '0 2px 12px rgba(20,36,28,0.08)';
      } else {
        header.style.boxShadow = 'none';
      }
      lastScroll = scrollY;
    }, { passive: true });
  }

  /* ── Cart Page Quantity Updates ────────────────────────────────── */
  function initCartQuantity() {
    document.querySelectorAll('[data-cart-qty-change]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var line = this.dataset.line;
        var qty = parseInt(this.dataset.qty) || 0;
        
        fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ line: parseInt(line), quantity: qty })
        })
        .then(function(res) { return res.json(); })
        .then(function() { location.reload(); })
        .catch(function(err) { console.error(err); });
      });
    });
  }

  /* ── Initialize All ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSearch();
    initCartAjax();
    initProductGallery();
    initVariantSelector();
    initQuantitySelector();
    initFaqAccordion();
    initProductTabs();
    initStickyHeader();
    initCartQuantity();
  });

})();
