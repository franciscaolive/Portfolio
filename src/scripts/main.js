//language mngmt
//keep track of what language in use - default portugues
let currentLanguage = 'pt';
let translations = {};

//theme mngmt- dark mode off by default
let isDarkMode = false;

function toggleTheme() {
    //flip dark mode switch
    isDarkMode = !isDarkMode;
    //adds or removes the dark-mode class from the whole page
    document.body.classList.toggle('dark-mode', isDarkMode);
    
    //changes all the theme icons
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
        
        //apply the current language to the page
        updateLanguage(currentLanguage);
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

function updateLanguage(lang) {
    //switch to the selected language
    currentLanguage = lang;
    const t = translations[lang];
    
    if (!t) return;
    
    //update nav links
    document.querySelector('a[href="#home"]').textContent = t.nav.home;
    document.querySelector('a[href="#about"]').textContent = t.nav.about;
    document.querySelector('a[href="#projects"]').textContent = t.nav.projects;
    
    //update hero section
    document.querySelector('.portfolio-text').textContent = t.hero.title;
    document.querySelector('.subtitle-text').textContent = t.hero.subtitle;
    document.querySelector('.view-projects-btn').textContent = t.hero.cta;
    
    //update about section
    document.querySelector('.about-title').textContent = t.about.title;

    const aboutTextParagraphs = document.querySelectorAll('.about-text p');
    if (aboutTextParagraphs.length >= 2 && t.about.bio.length >= 2) {
        aboutTextParagraphs[0].innerHTML = t.about.bio[0].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        aboutTextParagraphs[1].innerHTML = t.about.bio[1].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }

    document.querySelector('.skillset-title').textContent = t.about.skillsetTitle;
    
    //update all skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    if (skillCategories.length >= 5) {
        //make category names bold
        skillCategories[0].innerHTML = t.about.skills.design.replace(/^(.*?):/, '<strong>$1:</strong>');
        skillCategories[1].innerHTML = t.about.skills.video.replace(/^(.*?):/, '<strong>$1:</strong>');
        skillCategories[2].innerHTML = t.about.skills['3d'].replace(/^(.*?):/, '<strong>$1:</strong>');
        skillCategories[3].innerHTML = t.about.skills.games.replace(/^(.*?):/, '<strong>$1:</strong>');
        skillCategories[4].innerHTML = t.about.skills.development.replace(/^(.*?):/, '<strong>$1:</strong>');
    }
    
    //update which language button is highlighted as active
    document.querySelectorAll('.language-toggle button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    //highlights button of current language
    const activeBtn = lang === 'pt' 
        ? document.querySelector('.language-toggle button:first-child')
        : document.querySelector('.language-toggle button:last-child');
    activeBtn.classList.add('active');
}

function updateActiveNav(sectionId) {
    //removes active class from nav links
    document.querySelectorAll('.nav-left a').forEach(link => {
        link.classList.remove('active');
    });
    
    //active class only to the link of current section
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
        //force top position for home by default
        window.scrollTo(0, 0);

        setTimeout(() => {
            document.documentElement.style.scrollBehavior = '';
        }, 100);
    }
    
    //theme toggle button listener
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    //language button listeners
    const languageButtons = document.querySelectorAll('.language-toggle button');
    languageButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const lang = index === 0 ? 'pt' : 'en';
            updateLanguage(lang);
        });
    });
    
    //smooth scroll navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href').substring(1);
            
            if (targetId === 'home') {
                //scroll to top smoothly
                window.scrollTo({ top: 0, behavior: 'smooth' });
                //remove the #home from url
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
    
    //highlight the nav link of section currently in viewport
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                //update nav to show which section is being viewed
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
    //slide elements & buttons
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.slideshow-arrow-left');
    const nextButton = document.querySelector('.slideshow-arrow-right');
    const indicators = document.querySelectorAll('.indicator');
    //keep track of which slide is selected
    let currentSlide = 0;
    
    function showSlide(index) {
        //remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        //show the slide and indicator for the current index
        slides[index].classList.add('active');
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
    }
    
    function nextSlide() {
        //next slid n loop back to 0 at the end
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        //previous slide 
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    function goToSlide(index) {
        //jump to specific slide
        currentSlide = index;
        showSlide(currentSlide);
    }
    
    //click listeners to prev/next buttons
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', prevSlide);
        nextButton.addEventListener('click', nextSlide);
    }
    
    //u can click the - to jump to a specific slide
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
    
    //do: auto-advance slideshow every 5 seconds
}