let currentLanguage = 'pt';
let translations = {};

let isDarkMode = false;

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.src = isDarkMode ? 'src/assets/icons/sunDarkMode.png' : 'src/assets/icons/moonLightMode.png';
        themeIcon.alt = isDarkMode ? 'Light mode' : 'Dark mode';
    }
    
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        const srcPath = icon.src;
        if (isDarkMode) {
            icon.src = srcPath.replace('LightMode', 'DarkMode');
        } else {
            icon.src = srcPath.replace('DarkMode', 'LightMode');
        }
    });
    
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        isDarkMode = true;
        document.body.classList.add('dark-mode');
        
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.src = 'src/assets/icons/sunDarkMode.png';
            themeIcon.alt = 'Light mode';
        }
        
        const socialIcons = document.querySelectorAll('.social-icon');
        socialIcons.forEach(icon => {
            const srcPath = icon.src;
            icon.src = srcPath.replace('LightMode', 'DarkMode');
        });
    }
}

async function loadTranslations() {
    try {
        const [enResponse, ptResponse] = await Promise.all([
            fetch('src/data/en.json'),
            fetch('src/data/pt.json')
        ]);
        
        translations = {
            en: await enResponse.json(),
            pt: await ptResponse.json()
        };
        
        updateLanguage(currentLanguage);
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

function updateLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', currentLanguage);
    const t = translations[lang];
    
    if (!t) return;
    
    const homeLink = document.querySelector('a[href="#home"], a[href="index.html#home"]');
    if (homeLink) homeLink.textContent = t.nav.home;
    const aboutLink = document.querySelector('a[href="#about"], a[href="index.html#about"]');
    if (aboutLink) aboutLink.textContent = t.nav.about;
    const projectsLink = document.querySelector('a[href="#projects"], a[href="index.html#projects"]');
    if (projectsLink) projectsLink.textContent = t.nav.projects;
    
    const portfolioText = document.querySelector('.portfolio-text');
    if (portfolioText) portfolioText.textContent = t.hero.title;
    const subtitleText = document.querySelector('.subtitle-text');
    if (subtitleText) subtitleText.textContent = t.hero.subtitle;
    const viewProjectsBtn = document.querySelector('.view-projects-btn');
    if (viewProjectsBtn) viewProjectsBtn.textContent = t.hero.cta;
    
    const aboutTitle = document.querySelector('.about-title');
    if (aboutTitle) aboutTitle.textContent = t.about.title;

    const aboutTextParagraphs = document.querySelectorAll('.about-text p');
    if (aboutTextParagraphs.length >= 2 && t.about.bio.length >= 2) {
        aboutTextParagraphs[0].innerHTML = t.about.bio[0].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        aboutTextParagraphs[1].innerHTML = t.about.bio[1].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }

    const skillsetTitle = document.querySelector('.skillset-title');
    if (skillsetTitle) skillsetTitle.textContent = t.about.skillsetTitle;
    
    const skillCategories = document.querySelectorAll('.skill-category');
    if (skillCategories.length >= 5) {
        skillCategories[0].innerHTML = t.about.skills.design.replace(/^(.*?):/, '<strong>$1:</strong>');
        skillCategories[1].innerHTML = t.about.skills.video.replace(/^(.*?):/, '<strong>$1:</strong>');
        skillCategories[2].innerHTML = t.about.skills['3d'].replace(/^(.*?):/, '<strong>$1:</strong>');
        skillCategories[3].innerHTML = t.about.skills.games.replace(/^(.*?):/, '<strong>$1:</strong>');
        skillCategories[4].innerHTML = t.about.skills.development.replace(/^(.*?):/, '<strong>$1:</strong>');
    }
    
    const footerText = document.querySelector('.footer-text');
    if (footerText && t.footer) {
        footerText.textContent = t.footer.copyright;
    }
    
    document.querySelectorAll('[data-lang-en][data-lang-pt]').forEach(element => {
        if (lang === 'en') {
            element.textContent = element.getAttribute('data-lang-en');
        } else {
            element.textContent = element.getAttribute('data-lang-pt');
        }
    });
    
    const languageButtons = document.querySelectorAll('.language-toggle button');
    languageButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = lang === 'pt' 
        ? document.querySelector('.language-toggle button:first-child')
        : document.querySelector('.language-toggle button:last-child');
    if (activeBtn) activeBtn.classList.add('active');
}

function updateActiveNav(sectionId) {
    document.querySelectorAll('.nav-left a').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`.nav-left a[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.documentElement.style.scrollBehavior = 'auto';
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage === 'en' || savedLanguage === 'pt') {
        currentLanguage = savedLanguage;
    }

    loadTheme();
    loadTranslations();
    
    if (window.location.hash && window.location.hash !== '#home') {
        const targetId = window.location.hash.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            document.documentElement.style.scrollBehavior = '';
            setTimeout(() => {
                targetSection.scrollIntoView();
            }, 100);
        }
    } else {
        window.scrollTo(0, 0);

        setTimeout(() => {
            document.documentElement.style.scrollBehavior = '';
        }, 100);
    }
    
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    const languageButtons = document.querySelectorAll('.language-toggle button');
    languageButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const lang = index === 0 ? 'pt' : 'en';
            updateLanguage(lang);
        });
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href').substring(1);
            
            if (targetId === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                history.pushState(null, null, window.location.pathname);
                updateActiveNav('home');
            } else {
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    history.pushState(null, null, `#${targetId}`);
                }
            }
        });
    });
    
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateActiveNav(entry.target.id);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    initSlideshow();
});

function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.slideshow-arrow-left');
    const nextButton = document.querySelector('.slideshow-arrow-right');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        slides[index].classList.add('active');
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
    }
    
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', prevSlide);
        nextButton.addEventListener('click', nextSlide);
    }
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
    
}