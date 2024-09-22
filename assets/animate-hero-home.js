function HomeHeroTransition() {
  var sectionAnnouncement = document.querySelector('.section-announcement');
  var sectionAnnouncementOriginal = sectionAnnouncement.querySelector('.utility-bar:not(.utility-bar--mask)');
  var sectionHeader = document.querySelector('.section-header');
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
      const rectHero = sectionHero.getBoundingClientRect();
      const rect = sectionRichtextBox.getBoundingClientRect();
      const parentTopPosition = sectionRichtext.getBoundingClientRect().top;
      const blockAnimateEnd = rect.height;

      if(parentTopPosition < 0) {
        const parentTopPositionValue = Math.abs(parentTopPosition);
        let visibilityPx = 0;
        if(parentTopPositionValue > rectHero.height) {
          visibilityPx = parentTopPositionValue - rectHero.height;
        }
        if(parentTopPositionValue < rectHero.height) {
          visibilityPercent = ((parentTopPositionValue - rectHero.height) / (blockAnimateEnd - rectHero.height)) * 100;
          document.documentElement.classList.remove('animate-hero-end');
        } else {
          visibilityPercent = 100;
          document.documentElement.classList.add('animate-hero-end');
        }
        if(parentTopPositionValue > (rectHero.height * 2)) {
          document.documentElement.classList.add('animate-hero-cliped');
        } else {
          document.documentElement.classList.remove('animate-hero-cliped');
        }
        sectionHeader.style.clipPath = `circle(${parentTopPositionValue.toFixed(2)}px at 50% ${rectHero.height}px)`;
        sectionAnnouncementOriginal.style.clipPath = `circle(${parentTopPositionValue.toFixed(2)}px at 50% ${rect.height}px)`;
        sectionRichtextBox.style.clipPath = `circle(${parentTopPositionValue.toFixed(2)}px at 50% 100%)`;
        document.documentElement.classList.add('animating-hero');
      } else {
        sectionHeader.style.clipPath = `circle(0px 0px at 50% 100%)`;
        sectionAnnouncementOriginal.style.clipPath = `circle(0px 0px at 50% 100%)`;
        sectionRichtextBox.style.clipPath = `circle(0 at 50% 100%)`;
        document.documentElement.classList.remove('animating-hero');
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
  document.documentElement.classList.add('animate-hero-richtext');
  sectionRichtextBox.setAttribute('data-animate-start-index', '1');
}

HomeHeroTransition();