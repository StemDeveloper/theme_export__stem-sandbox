if(!customElements.get('multicard-animation')) {
  customElements.define(
    'multicard-animation',
    class MulticardAnimation extends HTMLElement {
      constructor() {
        super();
        this.startTime = null;
        this.isAnimating = false;
        this.mainBody = this.closest('body');
        this.multicardParent = this.parentElement;
        this.scrollHandler = this.updateVisibility.bind(this);
        this.updateVisibility();
      }

      connectedCallback() {
        window.addEventListener('scroll', this.scrollHandler);
      }

      disconnectedCallback() {
        window.removeEventListener('scroll', this.scrollHandler);
      }

      updateVisibility() {
        const bodyRect = this.mainBody.getBoundingClientRect();
        if(bodyRect.top <= 0 && !this.isAnimating) {
          this.startAnimation(this.animateStarts);
        }
      }

      startAnimation() {
        this.isAnimating = true;
        this.startTime = performance.now();

        const runAnimation = (timestamp) => {
          const elapsedTime = timestamp - this.startTime;
          const rect = this.mainBody.getBoundingClientRect();
          
          if(rect.top < 0) {
            this.multicardParent.classList.add('animate-multicard');
          } else {
            this.multicardParent.classList.remove('animate-multicard');
          }

          if (elapsedTime < 2000) {
            requestAnimationFrame(runAnimation);
          } else {
            this.isAnimating = false;
            this.startTime = null;
          }
        }

        requestAnimationFrame(runAnimation);
      }
    }
  )
}