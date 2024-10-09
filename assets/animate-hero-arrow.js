if(!customElements.get('hero-arrow')) {
  customElements.define(
    'hero-arrow',
    class HeroArrow extends HTMLElement {
      constructor() {
        super();
        this.startTime = null;
        this.isAnimating = false;
        this.animatePulseOnLoad = true;
        this.heroParent = this.closest('.shopify-section');
        this.handleScroll = this.startAnimation.bind(this);
        this.addEventListener('click', this.scrollTo.bind(this));
        this.handleScroll();
      }

      scrollTo() {
        const scrollTo = parseInt(this.dataset.animationDelay);
        if(scrollTo <= 0) return;
        const announcementHeight = getComputedStyle(this.closest('html')).getPropertyValue('--announcement-height')?.trim();
        const scrollExtra = announcementHeight && announcementHeight !== undefined && announcementHeight !== null && announcementHeight !== '' ? parseFloat(announcementHeight) : 0;
        const scrollPosition = scrollTo > 0 ? scrollTo + scrollExtra : window.innerHeight / 2;
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

          if(this.animatePulseOnLoad) {
            this.heroParent.classList.add('hero-arrow-loaded');
          }

          if(scrolledPx > parseInt(this.dataset.animationDelay)) {
            if(!this.heroParent.classList.contains('remove-hero-arrow') && !this.heroParent.classList.contains('hero-arrow-loaded')) {
              this.heroParent.classList.add('remove-hero-arrow');
            };
          } else {
            if(this.heroParent.classList.contains('remove-hero-arrow')) this.heroParent.classList.remove('remove-hero-arrow');
          }

          if(elapsedTime > 2000) {
            this.animatePulseOnLoad = false;
            this.heroParent.classList.remove('hero-arrow-loaded');
          }
          
          requestAnimationFrame(runAnimation);
        };
      
        requestAnimationFrame(runAnimation);
      }
    }
  )
}