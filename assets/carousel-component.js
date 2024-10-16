if(!customElements.get('carousel-component')) {
  customElements.define(
    'carousel-component',
    class CarouselComponent extends HTMLElement {
      constructor() {
        super();
        this.scrollStep = 1;
        this.savedValue = 0;
        this.loopedValue = 0;
        this.currentWidth = 0;
        this.mouseDown = false;
        this.isScrolling = false;
        this.isDragScrolling = false;
        this.isTouchScrolling = false;
        this.wasDragScrolling = false;
        this.loopedValueSaved = false;
        this.previousRelativeMouseX = 0;
        this.lastMovementOnReverse = false;
        this.matchMedia = window.matchMedia('(min-width: 990px)');
        this.banners = this.querySelectorAll('.horizontal-scrolling-banner');
        this.loopSpeedMobile = parseFloat(this.dataset.loopSpeedMobile);
        this.loopSpeed = parseFloat(this.dataset.loopSpeed);
        this.iosDevice = false;
      }

      connectedCallback() {
        if (this.dataset.infiniteLoop !== 'true' && (!this.banners || this.banners.length === 0)) return;
        this.setUpElements();
        window.addEventListener('resize', () => this.setUpElements());
      }

      setUpElements() {
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) this.iosDevice = true;
        if(navigator.platform === 'iPad' || navigator.platform === 'iPhone' || navigator.platform === 'iPod') this.iosDevice = true;
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
          this.currentWidth = childrenWidth;
          
          do {
            Array.prototype.forEach.call(children, function(child) {
              var clone = child.cloneNode(true);
              clone.setAttribute('aria-hidden', true);
              clone.dataset.clone = true;
              currentBanner.appendChild(clone);
            });
            this.currentWidth += childrenWidth;
          } while (this.currentWidth < minWidthToCoverBanner);

          Array.prototype.forEach.call(children, function(child) {
            var clone = child.cloneNode(true);
            clone.setAttribute('aria-hidden', true);
            clone.dataset.clone = true;
            clone.dataset.cloneSecond = true;
            currentBanner.appendChild(clone);
          });

          this.savedValue = childrenWidth;
          
          var transitionHelperWrapper = document.createElement('div');
          transitionHelperWrapper.classList.add('horizontal-scrolling-banner__helper-wrapper');
          var childrenCount = children.length;
          for (var i = 0; i < childrenCount; i++) {
            transitionHelperWrapper.appendChild(children[0]);
          }
          currentBanner.appendChild(transitionHelperWrapper);
          transitionHelperWrapper.dataset.childrenWidth = childrenWidth;
          
          transitionHelperWrapper.scrollLeft = this.savedValue;
          
          this.querySelectorAll('a[href]').forEach((link) => {
            link.addEventListener('click', (e) => {
              if (this.mouseDown || this.isDragScrolling) {
                e.preventDefault();
              }
            });
          });

          this.scrollStep = this.matchMedia.matches ? this.loopSpeed : this.loopSpeedMobile;
          this.runAnimationFrame(transitionHelperWrapper);
          this.setUpMouseControls(transitionHelperWrapper);
          this.setUpTouchControls(transitionHelperWrapper);
        }
      }

      setUpMouseControls(helperWrapper) {
        let lastMoveTimeout;
        this.addEventListener('mousedown', (event) => {
          this.mouseDown = true;
          this.dataset.dragging = true;
          this.initialMouseX = event.clientX;
          this.previousRelativeMouseX = 0;
          this.relativeMouseX = 0;
        });

        this.addEventListener('mouseleave', () => {
          this.mouseDown = false;
          this.dataset.dragging = false;
          this.previousRelativeMouseX = 0;
          this.relativeMouseX = 0;
        });

        this.addEventListener('mouseup', () => {
          this.mouseDown = false;
          this.dataset.dragging = false;
          this.previousRelativeMouseX = 0;
          this.relativeMouseX = 0;
        });

        this.addEventListener('mousemove', (event) => {
          if (this.mouseDown) {
            this.isDragScrolling = true;
            const currentMouseX = event.clientX;
            const deltaMouseX = currentMouseX - this.initialMouseX;
            this.relativeMouseX = deltaMouseX;
            if(this.relativeMouseX != 0 && !this.loopedValueSaved) {
              this.loopedValue = helperWrapper.scrollLeft;
              this.loopedValueSaved = true;
            }
            
            const difference = (this.relativeMouseX - this.previousRelativeMouseX) * -1;
            this.scrollToPosition(helperWrapper, difference);
            this.previousRelativeMouseX = this.relativeMouseX;

            clearTimeout(lastMoveTimeout);
            lastMoveTimeout = setTimeout(() => {
              this.isDragScrolling = false;
            }, 200);
          }
        });
      }

      setUpTouchControls(helperWrapper) {
        let lastMoveTimeout;
      
        this.addEventListener("touchstart", (event) => {
          this.mouseDown = true;
          this.dataset.dragging = true;
          this.loopedValueSaved = false;
          this.initialMouseX = event.touches[0].clientX;
          this.relativeTouchX = 0;
          this.loopedValue = 0;
        });
      
        this.addEventListener("touchend", () => {
          this.mouseDown = false;
          this.dataset.dragging = false;
          this.loopedValueSaved = false;
          this.relativeTouchX = 0;
          this.loopedValue = 0;
        });
      
        this.addEventListener("touchcancel", () => {
          this.mouseDown = false;
          this.dataset.dragging = false;
          this.loopedValueSaved = false;
          this.relativeTouchX = 0;
          this.loopedValue = 0;
        });
      
        this.addEventListener("touchmove", (event) => {
          if (this.mouseDown) {
            if(helperWrapper.scrollLeft === 0) return;

            this.isDragScrolling = true;
            this.isTouchScrolling = true;
      
            if (!this.loopedValueSaved) {
              this.loopedValue = helperWrapper.scrollLeft;
              this.loopedValueSaved = true;
            }
      
            const currentMouseX = event.touches[0].clientX;
            const deltaMouseX = currentMouseX - this.initialMouseX;
            this.relativeTouchX = deltaMouseX;

            helperWrapper.scrollTo({
              left: this.loopedValue + (this.relativeTouchX * -1),
              behavior: this.iosDevice ? 'smooth' : 'auto'
            });
      
            clearTimeout(lastMoveTimeout);
            lastMoveTimeout = setTimeout(() => {
              this.isDragScrolling = false;
            }, 200);
          }
        });
      }
      
      runAnimationFrame(helperWrapper) {
        const scrollAnimate = () => {
          if (!this.isScrolling) {
            this.isScrolling = true;

            if(!this.isDragScrolling) {
              if(helperWrapper.scrollLeft > this.currentWidth) {
                const currentStartPosition = helperWrapper.scrollLeft - this.currentWidth;
                helperWrapper.scrollLeft = this.savedValue + currentStartPosition;
              } else if (helperWrapper.scrollLeft < this.savedValue) {
                const currentEndPosition = this.savedValue - helperWrapper.scrollLeft;
                helperWrapper.scrollLeft = this.currentWidth - currentEndPosition;
              }

              this.scrollToPosition(helperWrapper, this.scrollStep);
            }

            requestAnimationFrame(scrollAnimate);
            this.isScrolling = false;
          }
        };
    
        helperWrapper.scrollLeft = this.savedValue;
        scrollAnimate();
      }

      async scrollToPosition(helperWrapper, step) {
        helperWrapper.scrollTo({
          left: helperWrapper.scrollLeft + step,
          behavior: 'auto'
        });
      }
    }
  )
}