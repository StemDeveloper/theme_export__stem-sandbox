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
        this.multicardSticky = this.dataset.stickyMulticard === 'true';
        this.multicardStickyHeading = this.dataset.stickyHeading === 'true';
        this.multicardHeader = this.querySelector('.multicard-heading--sticky');
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
          const rectParent = this.multicardParent.getBoundingClientRect();
          const rectHeading = this.multicardHeader.getBoundingClientRect();
          const rectParentHeight = rectParent.height;
          const blockAnimateStart = 0;
          const blockAnimateStartEnd = rectHeading.height / 2;
          const blockAnimateEndStart = rectParentHeight - rectHeading.height - (rectHeading.height / 2);
          const blockAnimateEndEnd = rectParentHeight - rectHeading.height;
          
          if(this.multicardSticky) {
            rect.top < 0 ? this.multicardParent.classList.add('animate-multicard') : this.multicardParent.classList.remove('animate-multicard');
          }

          if (this.multicardStickyHeading) {
            if (rectParent.top < 0) {
              const parentTopPositionValue = Math.abs(rectParent.top);
              let visibilityPercent = 0;
              if (parentTopPositionValue >= blockAnimateStart && parentTopPositionValue < blockAnimateStartEnd) {
                visibilityPercent = ((parentTopPositionValue - blockAnimateStart) / (blockAnimateStartEnd - blockAnimateStart)) * 100;
              } else if (parentTopPositionValue >= blockAnimateStartEnd && parentTopPositionValue < blockAnimateEndStart) {
                visibilityPercent = 100;
              } else if (parentTopPositionValue >= blockAnimateEndStart && parentTopPositionValue < blockAnimateEndEnd) {
                visibilityPercent = ((blockAnimateEndEnd - parentTopPositionValue) / (blockAnimateEndEnd - blockAnimateEndStart)) * 100;
              }

              if(parentTopPositionValue >= blockAnimateStartEnd && parentTopPositionValue < blockAnimateEndEnd) {
                visibilityPercent = 0;
                if(parentTopPositionValue >= blockAnimateStartEnd && parentTopPositionValue < blockAnimateEndStart) {
                  visibilityPercent = ((parentTopPositionValue - blockAnimateStartEnd) / (blockAnimateEndStart - blockAnimateStartEnd)) * 100;
                } else if (parentTopPositionValue >= blockAnimateEndStart && parentTopPositionValue < blockAnimateEndEnd) {
                  console.log(visibilityPercent);
                  visibilityPercent = ((blockAnimateEndEnd - parentTopPositionValue) / (blockAnimateEndEnd - blockAnimateEndStart)) * 100;
                }
                const animateBlurStrength = (visibilityPercent / 100) * parseInt(this.dataset.blurStrength);
                this.style.setProperty('--heading-blur-strength', `${animateBlurStrength.toFixed(2)}px`);
              } else {
                this.style.setProperty('--heading-blur-strength', `0px`);
              }

              this.multicardParent.classList.add('animate-multicard-heading');
            } else {
              this.multicardParent.classList.remove('animate-multicard-heading');
            }
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