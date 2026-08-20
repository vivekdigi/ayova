/* ==========================================================================
   AYOVA VANILLA JAVASCRIPT CAROUSEL CONTROLLER
   Supports: Touch swipe, Mouse drag, prev/next controls, dots, responsive items
   ========================================================================== */

class AyovaCarousel {
  constructor(element, options = {}) {
    this.container = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.container) return;

    this.section = this.container.closest('section') || this.container;
    this.track = this.container.querySelector('.ayova-carousel-track');
    this.slides = Array.from(this.track?.children || []);
    if (!this.track || this.slides.length === 0) return;

    this.prevBtn = this.container.querySelector('[data-carousel-prev]') || this.section.querySelector('[data-carousel-prev]');
    this.nextBtn = this.container.querySelector('[data-carousel-next]') || this.section.querySelector('[data-carousel-next]');
    this.dotsContainer = this.container.querySelector('[data-carousel-dots]') || this.section.querySelector('[data-carousel-dots]');

    this.currentIndex = 0;
    this.customItems = this.container.getAttribute('data-items-per-view') || this.section.getAttribute('data-items-per-view');
    this.gap = parseInt(options.gap || this.container.getAttribute('data-gap') || 20);
    this.autoPlay = options.autoPlay || this.container.hasAttribute('data-autoplay');
    this.autoPlayInterval = parseInt(options.autoPlayInterval || 4500);
    this.timer = null;

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
    this.updateSlideWidths();
    this.createDots();
    this.bindEvents();
    this.update();

    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }

  updateSlideWidths() {
    const containerWidth = this.container.getBoundingClientRect().width;
    this.itemsPerView = this.calculateItemsPerView();
    
    // Calculate width taking gap into account
    const totalGapsWidth = Math.max(0, (this.itemsPerView - 1) * this.gap);
    const slideWidth = Math.max(120, (containerWidth - totalGapsWidth) / this.itemsPerView);

    this.slides.forEach(slide => {
      slide.style.width = `${slideWidth}px`;
    });

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
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.updateSlideWidths();
        this.createDots();
        this.goTo(Math.min(this.currentIndex, this.maxIndex));
      }, 100);
    });

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
      const slideWidth = parseFloat(this.slides[0].style.width) || 300;
      const baseMove = -(slideWidth + this.gap) * this.currentIndex;
      currentTranslate = baseMove + diffX;
      this.track.style.transform = `translateX(${currentTranslate}px)`;
    };

    const touchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      this.track.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      const slideWidth = parseFloat(this.slides[0].style.width) || 300;
      const baseMove = -(slideWidth + this.gap) * this.currentIndex;
      const movedBy = currentTranslate - baseMove;

      if (movedBy < -50) {
        this.next();
      } else if (movedBy > 50) {
        this.prev();
      } else {
        this.update();
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
    } else {
      this.currentIndex = this.maxIndex;
    }
    this.update();
  }

  next() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.update();
  }

  update() {
    if (!this.slides[0]) return;
    const slideWidth = parseFloat(this.slides[0].style.width) || 300;
    const moveX = (slideWidth + this.gap) * this.currentIndex;
    this.track.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    this.track.style.transform = `translateX(-${moveX}px)`;

    // Update Buttons
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentIndex === 0;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentIndex === this.maxIndex;
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
    this.timer = setInterval(() => this.next(), this.autoPlayInterval);
  }

  stopAutoPlay() {
    if (this.timer) clearInterval(this.timer);
  }
}

// Auto Initialize all carousels with [data-ayova-carousel] attribute
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-ayova-carousel]').forEach(el => {
    new AyovaCarousel(el);
  });
});

