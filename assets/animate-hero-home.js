function HomeHeroTransition() {
  var sectionHero = document.querySelector('.section--hero-banner');
  var sectionRichtext = document.querySelector('.section--richtext');
  var sectionRichtextBox = sectionRichtext.querySelector('.richtext--container');
  var sectionsOnHome = Array.from(document.querySelectorAll('[id^="shopify-section-template"]'));
  var sectionHeroIndex = sectionsOnHome.indexOf(sectionsOnHome.find(section => section === sectionHero));
  var sectionRichtextIndex = sectionsOnHome.indexOf(sectionsOnHome.find(section => section === sectionRichtext));

  if((sectionHeroIndex + 1) !== sectionRichtextIndex) return; 
  var animationStartTime = null;
  var animationIsPlaying = false;
  var updateVisibility = () => {
    const parentRect = sectionRichtext.getBoundingClientRect();
    if (parentRect.top <= 0 && !animationIsPlaying) {
      startAnimation();
    }
  }

  var startAnimation = () => {
    animationIsPlaying = true;
    animationStartTime = performance.now();
  
    const runAnimation = (timestamp) => {
      const elapsedTime = timestamp - animationStartTime;      
      const rect = sectionRichtextBox.getBoundingClientRect();
      const parentTopPosition = sectionRichtext.getBoundingClientRect().top;
      const blockAnimateStart = 0;
      const blockAnimateEnd = rect.height;

      if(parentTopPosition < 0) {
        const parentTopPositionValue = Math.abs(parentTopPosition);
        let visibilityPercent = 0;

        if(parentTopPositionValue < blockAnimateEnd) {
          visibilityPercent = ((parentTopPositionValue - blockAnimateStart) / (blockAnimateEnd - blockAnimateStart)) * 100;
          document.documentElement.classList.remove('animate-hero-end');
        } else {
          visibilityPercent = 100;
          document.documentElement.classList.add('animate-hero-end');
        }
        sectionRichtextBox.style.clipPath = `circle(${visibilityPercent.toFixed(2)}% at 50% 100%)`;
        document.documentElement.classList.add('animating-hero');
      } else {
        sectionRichtextBox.style.clipPath = `circle(0 at 50% 100%)`;
        document.documentElement.classList.remove('animating-hero');
      }
      
      if (elapsedTime < 1000) {
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
  document.documentElement.classList.add('animate-hero-richtext');
}

HomeHeroTransition();