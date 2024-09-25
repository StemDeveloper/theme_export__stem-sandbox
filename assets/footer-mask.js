function FooterMaskTransition() {
  var windowHeight = window.innerHeight * 2;
  var sectionsBody = document.querySelector('body');
  var sectionFooter = document.querySelector('.section-footer');

  var animationStartTime = null;
  var animationIsPlaying = false;
  var updateVisibility = () => {
    const rect = sectionsBody.getBoundingClientRect();
    if(windowHeight > rect.bottom && !animationIsPlaying) {
      startAnimation();
    }
  }

  var startAnimation = () => {
    animationIsPlaying = true;
    animationStartTime = performance.now();
  
    const runAnimation = (timestamp) => {
      const elapsedTime = timestamp - animationStartTime;
      const rect = sectionsBody.getBoundingClientRect();

      if(windowHeight > (rect.height / 2)) {
        Math.abs(rect.top) > (window.innerHeight / 2) ? sectionFooter.classList.add('section-footer-mask') : sectionFooter.classList.remove('section-footer-mask');
      } else {
        windowHeight > rect.bottom ? sectionFooter.classList.add('section-footer-mask') : sectionFooter.classList.remove('section-footer-mask');
      }
      
      if (elapsedTime < 2000) {
        requestAnimationFrame(runAnimation);
      } else {
        animationIsPlaying = false;
        animationStartTime = null;
      }
    };
  
    requestAnimationFrame(runAnimation);
  };
  
  window.addEventListener('scroll', updateVisibility);
  document.addEventListener('load', updateVisibility);
}

FooterMaskTransition();