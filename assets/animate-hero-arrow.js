if(!customElements.get('hero-arrow')) {
  customElements.define(
    'hero-arrow',
    class HeroArrow extends HTMLElement {
      constructor() {
        super();
        this.startTime = null;
        this.isAnimating = false;
        this.handleScroll = this.startAnimation.bind(this);
        this.addEventListener('click', this.scrollTo.bind(this));
        window.addEventListener('scroll', this.handleScroll);
      }

      scrollTo() {
        const announcementHeight = getComputedStyle(this.closest('html')).getPropertyValue('--announcement-height')?.trim();
        const scrollExtra = announcementHeight && announcementHeight !== undefined && announcementHeight !== null && announcementHeight !== '' ? parseFloat(announcementHeight) : 0;
        const scrollPosition = parseInt(this.dataset.animationDelay) > 0 ? parseInt(this.dataset.animationDelay) + scrollExtra : window.innerHeight / 2;
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
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
          } else {
            if(heroParent.classList.contains('remove-hero-arrow')) heroParent.classList.remove('remove-hero-arrow');
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