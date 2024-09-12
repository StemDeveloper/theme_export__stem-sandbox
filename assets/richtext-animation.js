if(!customElements.get('richtext-animation')) {
  customElements.define(
    'richtext-animation',
    class RichtextAnimation extends HTMLElement {
      constructor() {
        super();
        this.richtextParent = this.parentElement;
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
        const rect = this.getBoundingClientRect();
        const rectParent = this.parentElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        const elementHeight = rect.height;
        const elementTop = rect.top;
        const elementBottom = rect.bottom;
        
        const elementParentHeight = rectParent.height;
        const elementParentTop = rectParent.top;
        const elementParentBottom = rectParent.bottom;
      
        const visibleTop = Math.max(elementTop, 0);
        const visibleBottom = Math.min(elementBottom, viewportHeight);
      
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const percentageVisible = (visibleHeight / elementHeight) * 100;

        const elementParentTopAbs = Math.abs(rectParent.top);
        this.animateBlocks.forEach((block, index) => {
          const rectBlock = block.getBoundingClientRect();
          const rectBlockHeight = rectBlock.height;
          const rectBlockHeightRadius = rectBlock.height / 2;
          if(elementParentTop < 0 && elementParentTopAbs <= rectBlockHeightRadius) {
            requestAnimationFrame(animateBlock)
            function animateBlock() {
              console.log(elementParentTopAbs);
              if(percentageVisible < 100) {
                block.style.clipPath = `circle(${0}px at center)`;
              } else {
                block.style.clipPath = `circle(${elementParentTopAbs}px at center)`;
              };

              if(elementParentTop < 0) return;
              requestAnimationFrame(animateBlock);
            }
          }
        });
      }
    }
  )
}