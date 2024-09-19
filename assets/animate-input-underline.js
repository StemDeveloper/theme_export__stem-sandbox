if (!customElements.get('animate-input-underline')) {
  customElements.define(
    'animate-input-underline',
    class AnimateInputUnderline extends HTMLElement {
      constructor() {
        super();
        this.startTime = null;
        this.isAnimating = false;
        this.inputFields = this.querySelectorAll('.field');
        this.inputFields.forEach((input) => {
          const inputLine = document.createElement('span');
          inputLine.classList.add('animate__field-line');
          input.classList.add('field__animate-underline');
          input.appendChild(inputLine);
        });      
        this.handleScroll = this.startAnimation.bind(this);
      }

      connectedCallback() {
        window.addEventListener('scroll', this.handleScroll);
        this.handleScroll();
      }

      disconnectedCallback() {
        window.removeEventListener('scroll', this.handleScroll);
      }

      startAnimation() {
        this.isAnimating = true;
        this.startTime = performance.now();
      
        const runAnimation = (timestamp) => {
          const elapsedTime = timestamp - this.startTime;
          const viewportHeight = window.innerHeight;
          const scrollY = window.scrollY;
          const viewportCenter = scrollY + viewportHeight / 2;
          
          this.inputFields.forEach(field => {
            const inputLine = field.querySelector('.animate__field-line');
            const rect = field.getBoundingClientRect();
            const fieldTop = rect.top + scrollY;
            const fieldBottom = rect.bottom + scrollY;
            const fieldCenter = (fieldTop + fieldBottom) / 2;
            
            const distanceFromCenter = Math.abs(fieldCenter - viewportCenter);
            
            const maxDistance = viewportHeight / 2 + fieldBottom - fieldTop;
            const percentageVisible = Math.max(0, Math.min(100, (1 - distanceFromCenter / maxDistance) * 100));
            
            if(rect.top < viewportHeight / 2) {
              inputLine.style.setProperty('width', `100%`);
              return;
            }
            inputLine.style.setProperty('width', `${percentageVisible.toFixed(2)}%`);
            percentageVisible.toFixed(2) > 0 ? field.classList.add('animating-field') : field.classList.remove('animating-field');
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
