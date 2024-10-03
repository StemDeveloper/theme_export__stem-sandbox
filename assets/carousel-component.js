if(!customElements.get('carousel-component')) {
  customElements.define(
    'carousel-component',
    class CarouselComponent extends HTMLElement {
      constructor() {
        super();
        this.savedValue = 0;
        this.loopedValue = 0;
        this.mouseDown = false;
        this.mouseEntered = false;
        this.banners = this.querySelectorAll('.horizontal-scrolling-banner');
        if (!this.banners || this.banners.length === 0) {
          return;
        }
        if(this.dataset.infiniteLoop === 'true') this.infiniteLoop();
      }

      infiniteLoop() {
        var pxPerSecond = parseInt(this.dataset.loopSpeed);
      
        const setUpElements = () => {
          for (var i = 0; i < this.banners.length; i++) {
            this.banners[i].classList.add('infinite-loop-initialized');
            var currentBanner = this.banners[i];
            var helperWrapperClass = 'horizontal-scrolling-banner__helper-wrapper';
            var currentHelperWrapper = currentBanner.querySelector('.' + helperWrapperClass);
            if (currentHelperWrapper) {
              var clones = currentHelperWrapper.querySelectorAll('[data-clone]');
              Array.prototype.forEach.call(clones, function(clone) {
                clone.remove();
              });
              var childrenCount = currentHelperWrapper.children.length;
              for (var i = 0; i < childrenCount; i++) {
                currentBanner.appendChild(currentHelperWrapper.children[0]);
              }
              currentHelperWrapper.remove();
            }
      
            var children = currentBanner.children;
      
            var bannerWidth = currentBanner.getBoundingClientRect().width;
            var minWidthToCoverBanner = (bannerWidth * 2) + children[0].getBoundingClientRect().width;
            var childrenWidth = Array.prototype.reduce.call(children, function(r, child) {
              return r + child.getBoundingClientRect().width;
            }, 0);
            var currentWidth = childrenWidth;
      
      
            do {
              Array.prototype.forEach.call(children, function(child) {
                var clone = child.cloneNode(true);
                clone.setAttribute('aria-hidden', true);
                clone.dataset.clone = true;
                currentBanner.appendChild(clone);
              });
              currentWidth += childrenWidth;
            } while (currentWidth < minWidthToCoverBanner);
      
            var transitionHelperWrapper = document.createElement('div');
            transitionHelperWrapper.classList.add('horizontal-scrolling-banner__helper-wrapper');
            var childrenCount = children.length;
            for (var i = 0; i < childrenCount; i++) {
              transitionHelperWrapper.appendChild(children[0]);
            }
            currentBanner.appendChild(transitionHelperWrapper);
            transitionHelperWrapper.dataset.childrenWidth = childrenWidth;
          }
        }
        
        let lastTimestamp = 0;
        let animationStarted = false;
        let userExperience = window.matchMedia('(min-width: 750px)').matches ? 0.2 : 0.1;
        window.matchMedia('(min-width: 750px)').addEventListener('change', () => userExperience = window.matchMedia('(min-width: 750px)').matches ? 0.2 : 0.1);
        const scrollTheBanners = (timestamp) => {
          const stepSize = 1;
          for (var i = 0; i < this.banners.length; i++) {
            var helperWrapper = this.banners[i].firstElementChild;
            const threshHold = parseInt(helperWrapper.dataset.childrenWidth);
          
            if (typeof this.savedValue === 'undefined') this.savedValue = 0;
            if (typeof this.loopedValue === 'undefined') this.loopedValue = this.savedValue;
            
            if (!animationStarted) {
              lastTimestamp = timestamp;
              animationStarted = true;
            }
          
            const delta = timestamp - lastTimestamp;
            lastTimestamp = timestamp;
            
            if (this.mouseEntered) {
              this.savedValue = this.loopedValue;
              animationStarted = false;
              return;
            }
            
            this.loopedValue += stepSize * delta * userExperience;
            
            if (this.loopedValue >= threshHold) {
              this.loopedValue = this.loopedValue % threshHold;
            }
            
            if (isNaN(this.loopedValue)) this.loopedValue = this.savedValue;
          
            helperWrapper.style.transform = `translateX(${this.loopedValue.toFixed() * -1}px)`;
          }
        
          requestAnimationFrame(scrollTheBanners);
        }
        
        this.addEventListener('mousedown', (event) => {
          this.mouseDown = true;
          this.dataset.dragging = true;
          this.initialMouseX = event.clientX;
          this.relativeMouseX = 0;
        });

        this.addEventListener('mouseenter', () => {
          this.mouseEntered = true;
          this.dataset.mouseEntered = true;
        });

        this.addEventListener('mouseup', () => {
          this.mouseDown = false;
          this.dataset.dragging = false;
          this.relativeMouseX = 0;
        });

        this.addEventListener('mousemove', (event) => {
          if (this.mouseDown) {
            const currentMouseX = event.clientX;
            const deltaMouseX = currentMouseX - this.initialMouseX;
            this.relativeMouseX = deltaMouseX;
            this.savedValue = this.loopedValue + (this.relativeMouseX * -1);

            for (var i = 0; i < this.banners.length; i++) {
              var helperWrapper = this.banners[i].firstElementChild;
              helperWrapper.style.transform = `translateX(${(this.loopedValue + (this.relativeMouseX * -1)) * -1}px)`;
            }
          }
        });
        
        this.addEventListener('mouseleave', () => {
          this.mouseDown = false;
          this.mouseEntered = false;
          this.dataset.dragging = false;
          this.dataset.mouseEntered = false;
          this.relativeMouseX = 0;
          scrollTheBanners();
        });

        this.addEventListener("touchstart", (event) => {
          this.mouseDown = true;
          this.mouseEntered = true;
          this.dataset.dragging = true;
          this.dataset.mouseEntered = true;
          this.initialMouseX = event.touches[0].clientX;
          this.relativeMouseX = 0;
        });
        
        this.addEventListener("touchmove", (event) => {
          if (this.mouseDown) {
            const currentMouseX = event.touches[0].clientX;
            const deltaMouseX = currentMouseX - this.initialMouseX;
            this.relativeMouseX = deltaMouseX;
            this.savedValue = this.loopedValue + (this.relativeMouseX * -1);
        
            for (var i = 0; i < this.banners.length; i++) {
              var helperWrapper = this.banners[i].firstElementChild;
              helperWrapper.style.transform = `translateX(${(this.loopedValue + (this.relativeMouseX * -1)) * -1}px)`;
            }
          }
        });

        this.addEventListener("touchend", () => {
          this.mouseDown = false;
          this.mouseEntered = false;
          this.dataset.dragging = false;
          this.dataset.mouseEntered = false;
          this.relativeMouseX = 0;
          scrollTheBanners();
        });
        
        this.addEventListener("touchcancel", () => {
          this.mouseDown = false;
          this.mouseEntered = false;
          this.dataset.dragging = false;
          this.dataset.mouseEntered = false;
          this.relativeMouseX = 0;
          scrollTheBanners();
        });

        setUpElements();
        scrollTheBanners();
        window.addEventListener('resize', setUpElements);
      }
    }
  )
}