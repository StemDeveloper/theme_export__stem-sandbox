if(!customElements.get('hero-arrow')) {
  customElements.define(
    'hero-arrow',
    class HeroArrow extends HTMLElement {
      constructor() {
        super();
        this.startTime = null;
        this.isAnimating = false;
        this.handleScroll = this.startAnimation.bind(this);
        window.addEventListener('scroll', this.handleScroll);
      }

      startAnimation() {
        this.isAnimating = true;
        this.startTime = performance.now();

        const runAnimation = (timestamp) => {
          const elapsedTime = timestamp - this.startTime;
          const scrolledPx = window.scrollY;
          const heroParent = this.closest('.shopify-section');

          if(scrolledPx > parseInt(this.dataset.animationDelay)) {
            if(!heroParent.classList.contains('remove-hero-arrow')) heroParent.classList.add('remove-hero-arrow');
          }
          
          if (elapsedTime < 1000) {
            requestAnimationFrame(runAnimation);
          } else {
            this.isAnimating = false;
            this.startTime = null;
          }
        };
      
        requestAnimationFrame(runAnimation);
      }
    }
  )
}