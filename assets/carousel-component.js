if(!customElements.get('carousel-component')) {
  customElements.define(
    'carousel-component',
    class CarouselComponent extends HTMLElement {
      constructor() {
        super();
        this.mouseDown = false;
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
            var transitionPxPerSecond = (childrenWidth / pxPerSecond).toFixed();
            currentBanner.appendChild(transitionHelperWrapper);
            transitionHelperWrapper.dataset.childrenWidth = childrenWidth;
            this.style.setProperty('--infinite-loop-value', `${childrenWidth * -1}px`);
            this.style.setProperty('--infinite-loop-time', `${transitionPxPerSecond}s`);
          }
        }
        
        this.addEventListener('mousedown', (event) => {
          this.mouseDown = true;
          this.dataset.dragging = true;
          this.initialMouseX = event.clientX;
          this.relativeMouseX = 0;
        });

        this.addEventListener('mouseleave', () => {
          this.mouseDown = false;
          this.dataset.dragging = false;
          this.relativeMouseX = 0;
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

            for (var i = 0; i < this.banners.length; i++) {
              var helperWrapper = this.banners[i].firstElementChild;
              var childrenWidth = parseInt(helperWrapper.dataset.childrenWidth);
              var offsetLeft = helperWrapper.offsetLeft;

              // helperWrapper.style.left = `${offsetLeft + this.relativeMouseX}px`;
              helperWrapper.style.transform = `translateX(${this.relativeMouseX}px)`;
            }
          }
        });
      
        const scrollTheBanners = (timestamp) => {
          for (var i = 0; i < this.banners.length; i++) {
            var helperWrapper = this.banners[i].firstElementChild;
            var childrenWidth = parseInt(helperWrapper.dataset.childrenWidth);
            var offsetLeft = helperWrapper.offsetLeft;
            
            if (offsetLeft <= (childrenWidth * -1)) {
              helperWrapper.style.removeProperty('transform');
            }
          }
          requestAnimationFrame(scrollTheBanners);
        }

        setUpElements();
        scrollTheBanners();
        window.addEventListener('resize', setUpElements);
      }
    }
  )
}