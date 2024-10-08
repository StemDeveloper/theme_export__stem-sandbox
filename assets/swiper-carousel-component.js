if(!customElements.get('swiper-carousel-component')) {
  customElements.define(
    'swiper-carousel-component',
    class CarouselComponent extends HTMLElement {
      constructor() {
        super();
        this.slidesMobile = parseInt(this.dataset.slidesMobile);
        this.slidesTablet = parseInt(this.dataset.slidesTablet);
        this.slidesDesktop = parseInt(this.dataset.slidesDesktop);
        if(this.dataset.infiniteLoop === 'false') return;
        this.initSwiper();
        console.log(this);
      }

      initSwiper() {
        this.swiper = new Swiper(this.querySelector('[id^="Swiper-"]'), {
          loop: true,
          freeMode: true,
          autoplay: {
            delay: 0,
            disableOnInteraction: false
          },
          loopAddBlankSlides: true,
          slidesPerView: "auto",
          speed: 5000,
          grabCursor: true,
          loopAdditionalSlides: 2
        });
      }
    }
  )
}