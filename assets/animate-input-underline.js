if (!customElements.get('animate-input-underline')) {
  customElements.define(
    'animate-input-underline',
    class AnimateInputUnderline extends HTMLElement {
      constructor() {
        super();
        this.inputFields = this.querySelectorAll('.field');
        this.handleScroll = this.handleScroll.bind(this);
      }

      connectedCallback() {        
        window.addEventListener('scroll', this.handleScroll);
        this.handleScroll();
      }

      disconnectedCallback() {
        window.removeEventListener('scroll', this.handleScroll);
      }

      handleScroll() {
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY;
        const viewportCenter = scrollY + viewportHeight / 2;

        this.inputFields.forEach(field => {
          const rect = field.getBoundingClientRect();
          const fieldTop = rect.top + scrollY;
          const fieldBottom = rect.bottom + scrollY;
          const fieldCenter = (fieldTop + fieldBottom) / 2;
          
          const distanceFromCenter = Math.abs(fieldCenter - viewportCenter);
          
          const maxDistance = viewportHeight / 2 + fieldBottom - fieldTop;
          const percentageVisible = Math.max(0, Math.min(100, (1 - distanceFromCenter / maxDistance) * 100));
          
          if(rect.top < viewportHeight / 2) {
            field.style.setProperty('--input-underline-percentage', `100%`);
            return;
          }
          field.style.setProperty('--input-underline-percentage', `${percentageVisible.toFixed(2)}%`);
        });
      }
    }
  );
}
