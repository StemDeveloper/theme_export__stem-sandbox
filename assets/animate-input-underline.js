if (!customElements.get('animate-input-underline')) {
  customElements.define(
    'animate-input-underline',
    class AnimateInputUnderline extends HTMLElement {
      constructor() {
        super();
        this.inputFields = this.querySelectorAll('.field');
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
          root: null,
          threshold: [0, 0.01, 0.5, 1]
        });
        this.scrollHandler = this.updateVisibility.bind(this);
      }

      connectedCallback() {
        this.observer.observe(this);
      }

      disconnectedCallback() {
        this.observer.disconnect();
        window.removeEventListener('scroll', this.scrollHandler);
      }

      handleIntersection(entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            window.addEventListener('scroll', this.scrollHandler);
            this.updateVisibility();
          } else {
            window.removeEventListener('scroll', this.scrollHandler);
          }
        });
      }

      updateVisibility() {
        const rect = this.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        const elementHeight = rect.height;
        const elementTop = rect.top;
        const elementBottom = rect.bottom;
      
        const visibleTop = Math.max(elementTop, 0);
        const visibleBottom = Math.min(elementBottom, viewportHeight);
      
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const percentageVisible = (visibleHeight / elementHeight) * 100;
      
        if (elementTop < 0) return;
        this.style.setProperty('--input-underline-percentage', `${percentageVisible.toFixed(2)}%`);
      
        if (percentageVisible >= 100) {
          window.removeEventListener('scroll', this.scrollHandler);
        }
      }
      
    }
  );
}
