if(!customElements.get('richtext-animation')) {
  customElements.define(
    'richtext-animation',
    class RichtextAnimation extends HTMLElement {
      constructor() {
        super();
        this.startTime = null;
        this.isAnimating = false;
        this.richtextParent = this.parentElement;
        this.richtextHeading = this.querySelector('[data-blur-strength]');
        this.animateBlocks = this.querySelectorAll('[data-animation="PopInCircle"]');
        this.scrollHandler = this.updateVisibility.bind(this);
      }

      connectedCallback() {
        window.addEventListener('scroll', this.scrollHandler);
      }

      disconnectedCallback() {
        window.removeEventListener('scroll', this.scrollHandler);
      }

      updateVisibility() {
        const parentRect = this.richtextParent.getBoundingClientRect();
        if (parentRect.top <= 0 && !this.isAnimating) {
          this.startAnimation();
        }
      }

      startAnimation() {
        this.isAnimating = true;
        this.startTime = performance.now();
        this.animateStarts = parseInt(this.dataset.animateStartPx);
      
        const runAnimation = (timestamp) => {
          const elapsedTime = timestamp - this.startTime;
      
          this.animateBlocks.forEach((block, index) => {
            const rect = block.getBoundingClientRect();
            const parentTopPosition = this.richtextParent.getBoundingClientRect().top;
            const blockHeight = rect.height;
            const blockWidth = rect.width;
            const blockHeightRadius = 0.5 * blockHeight;
            const blockWidthRadius = 0.5 * blockWidth;
            const blockAnimateStart = (index * blockHeight) + this.animateStarts;
            const blockAnimateEnd = ((index + 1) * blockHeight) + this.animateStarts;
            const blockAnimateMiddle = blockAnimateEnd - blockHeightRadius;
      
            if (parentTopPosition < 0) {
              const windowMedia = window.matchMedia('(orientation: landscape)');
              const windowMobileMedia = window.matchMedia('(max-width: 749px)');
              const parentTopPositionValue = Math.abs(parentTopPosition);
              let visibilityPercent = 0;
              if (parentTopPositionValue >= blockAnimateStart && parentTopPositionValue < blockAnimateMiddle) {
                visibilityPercent = ((parentTopPositionValue - blockAnimateStart) / (blockAnimateMiddle - blockAnimateStart)) * 100;
              } else if (parentTopPositionValue >= blockAnimateMiddle && parentTopPositionValue < blockAnimateEnd) {
                visibilityPercent = ((blockAnimateEnd - parentTopPositionValue) / (blockAnimateEnd - blockAnimateMiddle)) * 100;
              }

              let animateRadius = blockHeight > blockWidth ? blockWidthRadius : blockHeightRadius;
              if(windowMobileMedia.matches) {
                animateRadius = blockWidth;
              }
              const animateCircle = (visibilityPercent / 100) * animateRadius;
              if(parentTopPositionValue >= blockAnimateStart && parentTopPositionValue < blockAnimateEnd) {
                const animateBlurStrength = (visibilityPercent / 100) * parseInt(this.richtextHeading.dataset.blurStrength);
                this.richtextHeading.style.setProperty('--heading-blur-strength', `${animateBlurStrength.toFixed(2)}px`);
              }
              if(windowMedia.matches) {
                block.style.clipPath = `circle(${animateCircle.toFixed(2)}px at 50% 60%)`;
              } else {
                block.style.clipPath = windowMobileMedia.matches ? `circle(${animateCircle.toFixed(2)}px at 100% 65%)` : `circle(${animateCircle.toFixed(2)}px at 75% 65%)`;
              }
              if(this.animateStarts > 0) {
                if(parentTopPositionValue > this.animateStarts) {
                  this.richtextParent.classList.add('animate-richtext');
                  this.richtextParent.classList.add('animating-circle');
                  if(parentTopPositionValue > ((this.animateBlocks.length + 1)*blockHeight)) {
                    this.richtextParent.classList.remove('animating-circle');
                  }
                } else {
                  this.richtextParent.classList.remove('animate-richtext');
                  this.richtextParent.classList.remove('animating-circle');
                }
              } else {
                this.richtextParent.classList.add('animate-richtext');
                this.richtextParent.classList.add('animating-circle');
                if(parentTopPositionValue > ((this.animateBlocks.length)*blockHeight)) {
                  this.richtextParent.classList.remove('animating-circle');
                }
              }
            } else {
              block.style.clipPath = `circle(0 at center)`;
              if(this.animateStarts > 0) return;
              this.richtextParent.classList.remove('animate-richtext');
              this.richtextParent.classList.remove('animating-circle');
            }
          });
          
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
  );
}
