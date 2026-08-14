/* ==========================================================================
   AYOVA THEME INTERACTION & DRAWER LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileToggle = document.querySelector('[data-mobile-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });
  }

  // Quick Add to Cart with Shopify Cart API Support
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const variantId = btn.getAttribute('data-variant-id');
      const originalText = btn.innerHTML;

      btn.innerText = 'Adding...';
      btn.disabled = true;

      try {
        if (variantId) {
          await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: variantId, quantity: 1 })
          });
        }
      } catch (err) {
        console.log('Cart API simulation fallback');
      }

      btn.innerText = 'Added ✓';
      btn.classList.add('btn-added');

      // Update Cart Count Badges
      const cartBadges = document.querySelectorAll('[data-cart-count]');
      cartBadges.forEach(badge => {
        const currentCount = parseInt(badge.innerText || '0', 10);
        badge.innerText = currentCount + 1;
      });

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('btn-added');
        btn.disabled = false;
      }, 1800);
    });
  });
});

