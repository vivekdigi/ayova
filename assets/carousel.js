/* ==========================================================================
   AYOVA VANILLA JAVASCRIPT CAROUSEL CONTROLLER
   Supports: Touch swipe, Mouse drag, prev/next controls, dots, responsive items
   ========================================================================== */

class AyovaCarousel {
  constructor(element, options = {}) {
    this.container = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.container) return;
    if (this.container._ayovaCarousel) return this.container._ayovaCarousel;
    this.container._ayovaCarousel = this;

    this.section = this.container.closest('section') || this.container;
    this.track = this.container.querySelector('.ayova-carousel-track');
    if (!this.track) return;

    // Filter to only actual slide elements, ignoring <style>, <script>, etc.
    const children = Array.from(this.track.children || []);
    this.slides = children.filter(child => {
      const tag = child.tagName.toLowerCase();
      return tag !== 'style' && tag !== 'script' && tag !== 'template';
    });
    if (this.slides.length === 0) return;

    const outer = this.container.closest('.ayova-carousel-outer');
    this.prevBtn = this.container.querySelector('[data-carousel-prev]') || outer?.querySelector('[data-carousel-prev]') || this.section.querySelector('[data-carousel-prev]');
    this.nextBtn = this.container.querySelector('[data-carousel-next]') || outer?.querySelector('[data-carousel-next]') || this.section.querySelector('[data-carousel-next]');
    this.dotsContainer = this.container.querySelector('[data-carousel-dots]') ||
      this.container.parentElement?.querySelector('[data-carousel-dots]') ||
      this.section?.querySelector('[data-carousel-dots]') ||
      this.container.closest('section, .shopify-section, main')?.querySelector('[data-carousel-dots]');

    this.currentIndex = 0;
    this.customItems = this.container.getAttribute('data-items-per-view') || this.section.getAttribute('data-items-per-view');
    this.gap = parseInt(options.gap || this.container.getAttribute('data-gap') || 20);
    this.autoPlay = options.autoPlay || this.container.hasAttribute('data-autoplay');
    this.autoPlayInterval = parseInt(this.container.getAttribute('data-autoplay-interval') || options.autoPlayInterval || 3500);
    this.autoPlayDirection = 1;
    this.timer = null;
    this.resumeTimer = null;

    this.init();
  }

  calculateItemsPerView() {
    const width = window.innerWidth;
    const target = this.customItems ? parseInt(this.customItems) : 4;

    if (target === 1) return 1;

    if (width < 640) {
      return 1;
    } else if (width < 900) {
      return Math.min(2, target);
    } else if (width < 1200) {
      return Math.min(3, target);
    } else if (width < 1400) {
      return Math.min(4, target);
    }
    return target;
  }

  init() {
    this.track.style.gap = `${this.gap}px`;
    this.updateSlideWidths();
    this.createDots();
    this.bindEvents();
    this.update();

    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }

  updateSlideWidths() {
    const computedStyle = window.getComputedStyle(this.container);
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
    const availableWidth = this.container.clientWidth - paddingLeft - paddingRight;
    this.itemsPerView = this.calculateItemsPerView();

    // Ensure track gap matches this.gap
    this.track.style.gap = `${this.gap}px`;

    if (this.itemsPerView === 1) {
      // Single slide view (hero banner): must cover exactly 100% full screen with zero buffer gap
      const slideWidth = availableWidth;
      this.slides.forEach(slide => {
        slide.style.width = `${slideWidth}px`;
        slide.style.minWidth = `${slideWidth}px`;
        slide.style.maxWidth = `${slideWidth}px`;
        slide.style.flex = `0 0 ${slideWidth}px`;
        slide.style.boxSizing = 'border-box';
      });
    } else {
      // Calculate width taking gap into account
      const totalGapsWidth = Math.max(0, (this.itemsPerView - 1) * this.gap);
      // 6px safety buffer to ensure subpixel rounding, device pixel ratio scaling, and card borders never get clipped by overflow:hidden
      const slideWidth = Math.max(120, Math.floor((availableWidth - totalGapsWidth - 6) / this.itemsPerView));

      this.slides.forEach(slide => {
        slide.style.width = `${slideWidth}px`;
        slide.style.minWidth = '';
        slide.style.maxWidth = '';
        slide.style.flex = `0 0 ${slideWidth}px`;
      });
    }

    this.maxIndex = Math.max(0, this.slides.length - this.itemsPerView);
  }

  createDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    const totalDots = this.maxIndex + 1;
    if (totalDots <= 1) {
      this.dotsContainer.style.display = 'none';
      return;
    }

    this.dotsContainer.style.display = 'flex';
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('div');
      dot.classList.add('ayova-carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => this.goTo(i));
      this.dotsContainer.appendChild(dot);
    }
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prev();
        this.autoPlayDirection = 1;
        if (this.autoPlay) {
          this.stopAutoPlay();
          clearTimeout(this.resumeTimer);
          this.resumeTimer = setTimeout(() => this.startAutoPlay(), 4000);
        }
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.next();
        if (this.currentIndex >= this.maxIndex) {
          this.autoPlayDirection = -1;
        }
        if (this.autoPlay) {
          this.stopAutoPlay();
          clearTimeout(this.resumeTimer);
          this.resumeTimer = setTimeout(() => this.startAutoPlay(), 4000);
        }
      });
    }

    // Pause on hover
    this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.container.addEventListener('mouseleave', () => {
      if (this.autoPlay) this.startAutoPlay();
    });

    let resizeTimeout;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.updateSlideWidths();
        this.createDots();
        this.goTo(Math.min(this.currentIndex, this.maxIndex));
      }, 50);
    };
    window.addEventListener('resize', onResize);

    // Re-evaluate on window load (when all assets, stylesheets & scrollbars settle)
    window.addEventListener('load', () => {
      this.updateSlideWidths();
      this.update();
    });

    // Re-evaluate when web fonts finish loading
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        this.updateSlideWidths();
        this.update();
      });
    }

    // Use ResizeObserver for accurate sizing whenever container dimensions change
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateSlideWidths();
        this.update();
      });
      this.resizeObserver.observe(this.container);
    }

    // Touch & Mouse Drag Support
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;

    const getPositionX = (e) => e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;

    const touchStart = (e) => {
      isDragging = true;
      startX = getPositionX(e);
      this.stopAutoPlay();
      this.track.style.transition = 'none';
    };

    const touchMove = (e) => {
      if (!isDragging) return;
      const currentX = getPositionX(e);
      const diffX = currentX - startX;
      const slideWidth = this.itemsPerView === 1 ? this.container.clientWidth : (parseFloat(this.slides[0].style.width) || 300);
      const baseMove = -(slideWidth + this.gap) * this.currentIndex;
      currentTranslate = baseMove + diffX;
      this.track.style.transform = `translateX(${currentTranslate}px)`;
    };

    const touchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      this.track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
      const slideWidth = this.itemsPerView === 1 ? this.container.clientWidth : (parseFloat(this.slides[0].style.width) || 300);
      const baseMove = -(slideWidth + this.gap) * this.currentIndex;
      const movedBy = currentTranslate - baseMove;

      if (movedBy < -50) {
        this.next();
      } else if (movedBy > 50) {
        this.prev();
      } else {
        this.update();
      }

      if (this.autoPlay) {
        clearTimeout(this.resumeTimer);
        this.resumeTimer = setTimeout(() => this.startAutoPlay(), 3500);
      }
    };

    this.track.addEventListener('touchstart', touchStart, { passive: true });
    this.track.addEventListener('touchmove', touchMove, { passive: true });
    this.track.addEventListener('touchend', touchEnd, { passive: true });

    this.track.addEventListener('mousedown', touchStart);
    this.track.addEventListener('mousemove', touchMove);
    this.track.addEventListener('mouseup', touchEnd);
    this.track.addEventListener('mouseleave', () => { if (isDragging) touchEnd(); });
  }

  goTo(index) {
    this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
    this.update();
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.update();
    }
  }

  next() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
      this.update();
    }
  }

  update() {
    if (!this.slides[0]) return;

    // Clamp currentIndex safely
    this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.maxIndex));

    const slideWidth = this.itemsPerView === 1 ? this.container.clientWidth : (parseFloat(this.slides[0].style.width) || 300);
    const moveX = (slideWidth + this.gap) * this.currentIndex;
    this.track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    this.track.style.transform = `translateX(-${moveX}px)`;

    // Update Buttons
    const atStart = this.currentIndex <= 0;
    const atEnd = this.currentIndex >= this.maxIndex;
    const noScroll = this.maxIndex <= 0;

    if (this.prevBtn) {
      this.prevBtn.disabled = atStart || noScroll;
      this.prevBtn.style.opacity = (atStart || noScroll) ? '0.35' : '1';
      this.prevBtn.style.pointerEvents = (atStart || noScroll) ? 'none' : 'auto';
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = atEnd || noScroll;
      this.nextBtn.style.opacity = (atEnd || noScroll) ? '0.35' : '1';
      this.nextBtn.style.pointerEvents = (atEnd || noScroll) ? 'none' : 'auto';
    }

    // Update Dots
    if (this.dotsContainer) {
      const dots = Array.from(this.dotsContainer.children);
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === this.currentIndex);
      });
    }
  }

  startAutoPlay() {
    this.stopAutoPlay();
    if (this.autoPlayDirection === undefined) {
      this.autoPlayDirection = 1;
    }

    this.timer = setInterval(() => {
      if (this.maxIndex <= 0) return;

      if (this.itemsPerView === 1) {
        // Single slide banners loop
        if (this.currentIndex < this.maxIndex) {
          this.next();
        } else {
          this.goTo(0);
        }
      } else {
        // Multi-slide carousels: ping-pong left to right, then right to left
        if (this.autoPlayDirection === 1) {
          if (this.currentIndex < this.maxIndex) {
            this.next();
          } else {
            this.autoPlayDirection = -1;
            this.prev();
          }
        } else {
          if (this.currentIndex > 0) {
            this.prev();
          } else {
            this.autoPlayDirection = 1;
            this.next();
          }
        }
      }
    }, this.autoPlayInterval);
  }

  stopAutoPlay() {
    if (this.timer) clearInterval(this.timer);
  }
}

// Auto Initialize all carousels with [data-ayova-carousel] attribute
function initAllAyovaCarousels() {
  document.querySelectorAll('[data-ayova-carousel]').forEach(el => {
    if (!el._ayovaCarousel) {
      el._ayovaCarousel = new AyovaCarousel(el);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllAyovaCarousels);
} else {
  initAllAyovaCarousels();
}

window.AyovaCarousel = AyovaCarousel;