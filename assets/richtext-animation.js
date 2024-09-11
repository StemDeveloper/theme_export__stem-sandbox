if(!customElements.get('richtext-animation')) {
  customElements.define(
    'richtext-animation',
    class RichtextAnimation extends HTMLElement {
      constructor() {
        super();
        this.richtextParent = this.parentElement;
        this.richtextTextBlocks = this.querySelectorAll('.rich-text__text');
        
        window.addEventListener('scroll', () => {
          this.obserder = this.getBoundingClientRect();
          console.log(this.obserder.top);
          console.log(this.obserder.y);
        });
      }
    }
  )
}