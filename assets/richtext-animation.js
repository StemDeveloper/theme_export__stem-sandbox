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
              const windowMedia = window.matchMedia('(min-width: 990px)');
              const windowTabletMedia = window.matchMedia('(min-width: 750px) and (max-width: 989px)');
              const windowMobileMedia = window.matchMedia('(max-width: 749px)');
              const parentTopPositionValue = Math.abs(parentTopPosition);
              let visibilityPercent = 0;
              if (parentTopPositionValue >= blockAnimateStart && parentTopPositionValue < blockAnimateMiddle) {
                visibilityPercent = ((parentTopPositionValue - blockAnimateStart) / (blockAnimateMiddle - blockAnimateStart)) * 100;
              } else if (parentTopPositionValue >= blockAnimateMiddle && parentTopPositionValue < blockAnimateEnd) {
                visibilityPercent = ((blockAnimateEnd - parentTopPositionValue) / (blockAnimateEnd - blockAnimateMiddle)) * 100;
              }
              let animateRadius = Math.min(blockWidthRadius, 470);
              if(windowTabletMedia.matches) {
                animateRadius = 340;
              }
              if(windowMobileMedia.matches) {
                animateRadius = 330;
              }
              const animateCircle = (visibilityPercent / 100) * animateRadius;
              if(windowMedia.matches) {
                block.style.clipPath = `circle(${animateCircle.toFixed(2)}px at 50% 60%)`;
              } else if (windowTabletMedia.matches) {
                block.style.clipPath = `circle(${animateCircle.toFixed(2)}px at 60% 65%)`;
              } else {
                block.style.clipPath = `circle(${animateCircle.toFixed(2)}px at 80% 65%)`;
              }
              if(parentTopPositionValue >= blockAnimateStart && parentTopPositionValue < blockAnimateEnd) {
                const animateBlurStrength = (visibilityPercent / 100) * parseInt(this.richtextHeading.dataset.blurStrength);
                this.richtextHeading.style.setProperty('--heading-blur-strength', `${animateBlurStrength.toFixed(2)}`);
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

if(!customElements.get('richtext-tab')) {
  customElements.define(
    'richtext-tab',
    class RichtextTab extends HTMLElement {
      constructor() {
        super();
        this.buttons = this.querySelectorAll('.js-tab-button');
        this.contents = this.querySelectorAll('.js-tab-content');
        this.dataset.eventType === 'hover' ? this.mouseEvent() : this.clickEvent();
      }

      mouseEvent() {
        this.buttons?.forEach((button) => {
          button.addEventListener('mouseenter', () => {
            this.toggleAttribute(button);
          });
        });
      }

      clickEvent() {
        this.buttons?.forEach((button) => {
          button.addEventListener('click', () => {
            if(button.dataset.tabActive === 'false' || button.dataset.tabActive === false) {
              this.toggleAttribute(button);
            } else {
              button.dataset.tabActive = false;
              this.querySelector(`#${button.dataset.tabTarget}`).dataset.tabActive = false;
            };
          });
        });
      }

      toggleAttribute(button) {
        this.buttons.forEach((button) => button.dataset.tabActive = false);
        this.contents.forEach((content) => content.dataset.tabActive = false);
        button.dataset.tabActive = true;
        this.querySelector(`#${button.dataset.tabTarget}`).dataset.tabActive = true;
      }
    }
  )
}