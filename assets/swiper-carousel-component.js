if(!customElements.get('swiper-carousel-component')) {
  customElements.define(
    'swiper-carousel-component',
    class CarouselComponent extends HTMLElement {
      constructor() {
        super();
        this.loopSpeed = parseInt(this.dataset.loopSpeed);
        this.loopSpeedMobile = parseInt(this.dataset.loopSpeedMobile);
        this.slidesMobile = parseInt(this.dataset.slidesMobile);
        this.slidesTablet = parseInt(this.dataset.slidesTablet);
        this.slidesDesktop = parseInt(this.dataset.slidesDesktop);
        this.matchMedia = window.matchMedia('(min-width: 990px)');
        this.swiperSpeed = this.matchMedia.matches ? this.loopSpeed : this.loopSpeedMobile;
        console.log(this.swiperSpeed);
        if(this.dataset.infiniteLoop === 'false') return;
        this.initSwiper();
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
          speed: this.swiperSpeed,
          grabCursor: true,
          loopAdditionalSlides: 2
        });
      }
    }
  )
}