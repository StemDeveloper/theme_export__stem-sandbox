if(!customElements.get('richtext-animation')) {
  customElements.define(
    'richtext-animation',
    class RichtextAnimation extends HTMLElement {
      constructor() {
        super();
        this.richtextParent = this.parentElement;
        this.animateStarts = parseInt(this.dataset.animateStartIndex);
        this.animateBlocks = this.querySelectorAll('[data-animation="PopInCircle"]');
        this.scrollHandler = this.updateVisibility.bind(this);
        this.startTime = null;
        this.isAnimating = false;
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
          this.startAnimation(this.animateStarts);
        }
      }

      startAnimation(animationStartindex) {
        this.isAnimating = true;
        this.startTime = performance.now();
      
        const runAnimation = (timestamp) => {
          const elapsedTime = timestamp - this.startTime;
          const viewportHeight = window.innerHeight;
          const scrollY = window.scrollY;
          const viewportCenter = scrollY + viewportHeight / 2;
          const parentTopPosition = this.richtextParent.getBoundingClientRect().top;
      
          this.animateBlocks.forEach((block, index) => {
            const rect = block.getBoundingClientRect();
            const parentTopPosition = this.richtextParent.getBoundingClientRect().top;
            const blockHeight = rect.height;
            const blockWidth = rect.width;
            const blockHeightRadius = 0.5 * blockHeight;
            const blockWidthRadius = 0.5 * blockWidth;
            const blockAnimateStart = (index + animationStartindex) * blockHeight;
            const blockAnimateEnd = (index + animationStartindex + 1) * blockHeight;
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
              if(windowMedia.matches) {
                block.style.clipPath = `circle(${animateCircle.toFixed(2)}px at 50% 60%)`;
              } else {
                block.style.clipPath = windowMobileMedia.matches ? `circle(${animateCircle.toFixed(2)}px at 100% 65%)` : `circle(${animateCircle.toFixed(2)}px at 75% 65%)`;
              }
              if(animationStartindex > 0) {
                if(parentTopPositionValue > blockHeight) {
                  this.richtextParent.classList.add('animate-richtext');
                } else {
                  this.richtextParent.classList.remove('animate-richtext');
                }
              } else {
                this.richtextParent.classList.add('animate-richtext');
              }
            } else {
              block.style.clipPath = `circle(0 at center)`;
              if(animationStartindex > 0) return;
              this.richtextParent.classList.remove('animate-richtext');
            }
          });

          if(parentTopPosition < 0) {
            this.richtextParent.classList.add('animate-richtext-heading');
          } else {
            this.richtextParent.classList.remove('animate-richtext-heading');
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
  );
}
