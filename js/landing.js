import { initAuthGuard } from "./auth-guard.js";

const handleNavbarScroll = () => {
    const header = document.querySelector('.header');
    const links = document.getElementById('loginButtons');
    const logos = {
        withText: document.getElementById('TechNestLogo'),
        withTextHighlight: document.getElementById('TechNestColored'),
        withTextEnd: document.getElementById('TechNestLogoEnd')
    }
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;

    const setNavbarColor = {
        surface: {
            backgroundColor: '#f8f9fa',
            backdropFilter: 'blur(0px)'
        },
        transparent: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(30px)'
        }
    };

    if (scrollPosition > viewportHeight) {
        header.style.backgroundColor = setNavbarColor.surface.backgroundColor;
        header.style.backdropFilter = setNavbarColor.surface.backdropFilter;
        // Logic About logo texts
        if (logos.withText) logos.withText.style.color = '#000000';
        if (logos.withTextHighlight) logos.withTextHighlight.style.color = '#0c5241';
        if (logos.withTextEnd) logos.withTextEnd.style.color = '#000000';

        links.style.color = '#000000';
    } else {
        header.style.backgroundColor = setNavbarColor.transparent.backgroundColor;
        header.style.backdropFilter = setNavbarColor.transparent.backdropFilter;
        // Logic About logo texts
        if (logos.withText) logos.withText.style.color = '#ffffff';
        if (logos.withTextHighlight) logos.withTextHighlight.style.color = '#11735b';
        if (logos.withTextEnd) logos.withTextEnd.style.color = '#ffffff';

        links.style.color = '#ffffff';
    }
};

const initScrollListener = () => {
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();
};

const setCurrentYear = () => {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
};

const init = () => {
  initAuthGuard();
  initScrollListener();
  setCurrentYear();
};

init(); 