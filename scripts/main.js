const body = document.body;
const langButtons = document.querySelectorAll('.lang-option');
const aboutSection = document.querySelector('[data-i18n="about"] p');
const skillsBody = document.querySelector('[data-i18n="skills"] .skills-body');
const i18nTextNodes = document.querySelectorAll('[data-i18n-key]');
const projectTitleRest = document.querySelector('.project-name-rest[data-project-id]');
const projectTitleInitial = document.querySelector('.project-initial');
const projectDescriptionNodes = document.querySelectorAll('[data-project-description]');
const projectGrid = document.querySelector('.project-grid');
const filterButtons = document.querySelectorAll('.project-filter');

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const contactToggle = document.getElementById('contactToggle');
const contactMenu = document.getElementById('contactMenu');
const burgerButton = document.getElementById('burgerButton');
const sidebar = document.querySelector('.sidebar');
const isProjectPage = Boolean(document.querySelector('.project-detail'));

const LANG_STORAGE_KEY = 'portfolio_lang';
const THEME_STORAGE_KEY = 'portfolio_theme';
const DEFAULT_LANG = 'eng';
const DEFAULT_THEME = 'light';

const translationCache = {};
let projectsCache = null;
let currentLang = DEFAULT_LANG;
let currentFilter = 'all';

const pathPrefix = window.location.pathname.includes('/projects/') ? '../' : '';
const resolvePath = (path) => `${pathPrefix}${path}`;

const queryProjectId = new URLSearchParams(window.location.search).get('id');

const normalizeLang = (lang) => {
  if (lang === 'en') {
    return 'eng';
  }
  if (lang === 'pt') {
    return 'pt';
  }
  return DEFAULT_LANG;
};

const readStored = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStored = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // noop
  }
};

const applyThemeIcons = (theme) => {
  if (!themeIcon) {
    return;
  }

  const dark = theme === 'dark';
  themeIcon.src = resolvePath(`assets/icons/${dark ? 'theme-sun.svg' : 'theme-moon.svg'}`);
};

const setTheme = (theme) => {
  const nextTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', nextTheme);
  body.setAttribute('data-theme', nextTheme);
  applyThemeIcons(nextTheme);
  writeStored(THEME_STORAGE_KEY, nextTheme);
};

const setActiveLanguageButton = (lang) => {
  langButtons.forEach((langButton) => {
    langButton.classList.toggle('active-lang', langButton.dataset.lang === lang);
  });
};

const setActiveFilterButton = (filter) => {
  filterButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === filter);
  });
};

const loadTranslations = async (lang) => {
  if (translationCache[lang]) {
    return translationCache[lang];
  }

  const response = await fetch(resolvePath(`data/${lang}.json`));
  if (!response.ok) {
    throw new Error(`Failed to load translations for ${lang}`);
  }

  const translations = await response.json();
  translationCache[lang] = translations;
  return translations;
};

const loadProjects = async () => {
  if (projectsCache) {
    return projectsCache;
  }

  const response = await fetch(resolvePath('data/projects.json'));
  if (!response.ok) {
    throw new Error('Failed to load project metadata');
  }

  const projectsPayload = await response.json();
  projectsCache = projectsPayload.projects || [];
  return projectsCache;
};

const applyProjectFilter = () => {
  if (!projectGrid) {
    return;
  }

  projectGrid.querySelectorAll('.project-card').forEach((card) => {
    const category = card.dataset.category;
    card.style.display = currentFilter === 'all' || category === currentFilter ? '' : 'none';
  });
};

const renderProjectGrid = (projects, translations) => {
  if (!projectGrid) {
    return;
  }

  const viewLabel = translations.labels?.viewProject || 'View Project';

  projectGrid.innerHTML = projects
    .map((project) => {
      const title = translations.projects?.[project.id]?.title || `Project ${project.id}`;
      return `
        <a href="${resolvePath(project.href)}" class="project-card" data-category="${project.category}" aria-label="${title}" style="background-image: url('${resolvePath(project.cover)}');">
          <div class="project-overlay">
            <h3 class="project-title">${title}</h3>
            <span class="view-button">${viewLabel}</span>
          </div>
        </a>
      `;
    })
    .join('');

  applyProjectFilter();
};

const renderAbout = (about) => {
  if (!aboutSection || !about) {
    return;
  }

  if (typeof about.html === 'string') {
    aboutSection.innerHTML = about.html;
    return;
  }

  if (typeof about.text === 'string') {
    aboutSection.innerHTML = about.text;
    return;
  }

  if (!Array.isArray(about.segments)) {
    return;
  }

  aboutSection.textContent = '';
  const fragment = document.createDocumentFragment();
  about.segments.forEach((segment) => {
    if (segment.strong) {
      const strong = document.createElement('strong');
      strong.textContent = segment.text;
      fragment.append(strong);
      return;
    }

    fragment.append(document.createTextNode(segment.text));
  });

  aboutSection.append(fragment);
};

const renderSkills = (skills) => {
  if (!skillsBody || !Array.isArray(skills)) {
    return;
  }

  skillsBody.textContent = '';
  const fragment = document.createDocumentFragment();

  skills.forEach((skill) => {
    const line = document.createElement('span');
    line.className = 'skill-line';

    const label = document.createElement('strong');
    label.textContent = `${skill.label}:`;
    line.append(label);
    line.append(document.createTextNode(` ${skill.items}`));

    fragment.append(line);
  });

  skillsBody.append(fragment);
};

const applyProjectPageContent = (translations) => {
  if (!isProjectPage || !projectTitleRest) {
    return;
  }

  const pageProjectId = queryProjectId || projectTitleRest.dataset.projectId || '1';
  projectTitleRest.dataset.projectId = pageProjectId;

  const projectData = translations.projects?.[pageProjectId];
  if (!projectData) {
    return;
  }

  const title = projectData.title || `Project ${pageProjectId}`;
  const firstChar = title.charAt(0);
  const remaining = title.slice(1);

  if (projectTitleInitial) {
    projectTitleInitial.textContent = firstChar;
  }

  projectTitleRest.textContent = remaining;

  projectDescriptionNodes.forEach((node) => {
    const side = node.dataset.projectDescription;
    const text = projectData.description?.[side];
    if (side && text) {
      node.textContent = text;
    }
  });

  document.title = `${title} | Francisca Miranda`;
};

const applyLanguage = (translations) => {
  renderAbout(translations.about);
  renderSkills(translations.skills);

  i18nTextNodes.forEach((node) => {
    const key = node.dataset.i18nKey;
    const value = translations.labels?.[key];
    if (key && value) {
      node.textContent = value;
    }
  });

  applyProjectPageContent(translations);
};

const switchLanguage = async (lang) => {
  try {
    const normalizedLang = normalizeLang(lang);
    const translations = await loadTranslations(normalizedLang);
    const projects = projectGrid ? await loadProjects() : [];

    currentLang = normalizedLang;
    applyLanguage(translations);

    if (projectGrid) {
      renderProjectGrid(projects, translations);
    }

    setActiveLanguageButton(currentLang);
    document.documentElement.lang = currentLang === 'eng' ? 'en' : currentLang;
    writeStored(LANG_STORAGE_KEY, currentLang);
  } catch (error) {
    console.error(error);
  }
};

langButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const selectedLang = normalizeLang(button.dataset.lang);
    if (!selectedLang) {
      return;
    }

    await switchLanguage(selectedLang);
  });
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.filter || 'all';
    currentFilter = selectedFilter;
    setActiveFilterButton(currentFilter);
    applyProjectFilter();
  });
});

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme') || DEFAULT_THEME;
    themeToggle.classList.remove('theme-toggle-animate');
    void themeToggle.offsetWidth;
    themeToggle.classList.add('theme-toggle-animate');
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
    window.setTimeout(() => {
      themeToggle.classList.remove('theme-toggle-animate');
    }, 450);
  });
}

if (burgerButton && sidebar) {
  burgerButton.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('mobile-menu-open');
    burgerButton.setAttribute('aria-expanded', String(isOpen));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 780) {
      sidebar.classList.remove('mobile-menu-open');
      burgerButton.setAttribute('aria-expanded', 'false');
    }
  });
}

if (contactToggle && contactMenu) {
  const contactGroup = contactToggle.closest('.contact-group');
  const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)');
  let closeMenuTimeoutId = null;

  const setContactMenuOpen = (open) => {
    contactMenu.classList.toggle('open', open);
    contactToggle.setAttribute('aria-expanded', String(open));
  };

  const clearCloseMenuTimeout = () => {
    if (closeMenuTimeoutId !== null) {
      window.clearTimeout(closeMenuTimeoutId);
      closeMenuTimeoutId = null;
    }
  };

  const scheduleMenuClose = () => {
    clearCloseMenuTimeout();
    closeMenuTimeoutId = window.setTimeout(() => {
      setContactMenuOpen(false);
      closeMenuTimeoutId = null;
    }, 180);
  };

  if (hoverCapable.matches) {
    contactToggle.addEventListener('mouseenter', () => {
      clearCloseMenuTimeout();
      setContactMenuOpen(true);
    });
    contactMenu.addEventListener('mouseenter', () => {
      clearCloseMenuTimeout();
      setContactMenuOpen(true);
    });
    contactToggle.addEventListener('mouseleave', () => scheduleMenuClose());
    contactMenu.addEventListener('mouseleave', () => scheduleMenuClose());
  } else {
    contactToggle.addEventListener('click', () => {
      setContactMenuOpen(!contactMenu.classList.contains('open'));
    });
  }

  if (contactGroup) {
    contactGroup.addEventListener('focusin', () => setContactMenuOpen(true));
    contactGroup.addEventListener('focusout', (event) => {
      const next = event.relatedTarget;
      if (next instanceof Node && contactGroup.contains(next)) {
        return;
      }
      clearCloseMenuTimeout();
      setContactMenuOpen(false);
    });
  }

  document.addEventListener('click', (event) => {
    if (!contactMenu.classList.contains('open')) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (!contactMenu.contains(target) && !contactToggle.contains(target)) {
      clearCloseMenuTimeout();
      setContactMenuOpen(false);
    }
  });
}

if (isProjectPage) {
  body.classList.add('is-project-page');
}

const storedLang = readStored(LANG_STORAGE_KEY);
currentLang = normalizeLang(storedLang);

const storedTheme = readStored(THEME_STORAGE_KEY);
setTheme(storedTheme === 'dark' ? 'dark' : DEFAULT_THEME);

setActiveFilterButton(currentFilter);
switchLanguage(currentLang);
