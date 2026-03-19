const body = document.body;
const langButtons = document.querySelectorAll('.lang-option');
const aboutSection = document.querySelector('[data-i18n="about"] p');
const skillsBody = document.querySelector('[data-i18n="skills"] .skills-body');
const i18nTextNodes = document.querySelectorAll('[data-i18n-key]');
const projectTitleRest = document.querySelector('.project-name-rest[data-project-id]');
const projectTitleInitial = document.querySelector('.project-initial');
const projectDescriptionNodes = document.querySelectorAll('.description-column[data-project-description]');
const projectDescriptionSection = document.querySelector('.project-description');
const projectDetailNode = document.querySelector('.project-detail');
const projectVideosNode = document.querySelector('[data-project-videos]');
const projectPostTextNode = document.querySelector('[data-project-post-text]');
const projectBookNode = document.querySelector('[data-project-book]');
const projectGrid = document.querySelector('.project-grid');
const filterButtons = document.querySelectorAll('.project-filter');

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const mobileMarkIcon = document.getElementById('mobileMarkIcon');
const contactToggle = document.getElementById('contactToggle');
const contactMenu = document.getElementById('contactMenu');
const burgerButton = document.getElementById('burgerButton');
const cvDownloadLink = document.querySelector('.cv-action');
const sidebar = document.querySelector('.sidebar');
const isProjectPage = Boolean(document.querySelector('.project-detail'));

const LANG_STORAGE_KEY = 'portfolio_lang';
const THEME_STORAGE_KEY = 'portfolio_theme';
const DEFAULT_LANG = 'eng';
const DEFAULT_THEME = 'light';
const CV_PATHS = {
  eng: 'assets/cvs/CVFranciscaMirandaEnglish.pdf',
  pt: 'assets/cvs/CVFranciscaMirandaPortugues.pdf'
};

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
  const dark = theme === 'dark';
  if (themeIcon) {
    themeIcon.src = resolvePath(`assets/icons/${dark ? 'sun.png' : 'moon.png'}`);
  }
  if (mobileMarkIcon) {
    mobileMarkIcon.src = resolvePath(`assets/icons/${dark ? 'mobileIconNight.png' : 'mobileIcon.png'}`);
  }
};

const applyCvLink = (lang) => {
  if (!cvDownloadLink) {
    return;
  }

  const normalizedLang = normalizeLang(lang);
  const cvPath = CV_PATHS[normalizedLang] || CV_PATHS[DEFAULT_LANG];
  cvDownloadLink.setAttribute('href', resolvePath(cvPath));
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
      const projectText = translations.projects?.[project.id] || {};
      const title = projectText.previewTitle || projectText.title || `Project ${project.id}`;
      const coverStyle = project.cover
        ? ` style="background-image: url('${resolvePath(project.cover)}');"`
        : '';
      return `
        <a href="${resolvePath(project.href)}" class="project-card" data-category="${project.category}" aria-label="${title}"${coverStyle}>
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

const toEmbeddableVideoUrl = (url) => {
  if (typeof url !== 'string' || !url.trim()) {
    return '';
  }

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes('dropbox.com')) {
      parsedUrl.searchParams.delete('dl');
      parsedUrl.searchParams.set('raw', '1');
      return parsedUrl.toString();
    }
    return url;
  } catch {
    return url;
  }
};

const toYouTubeEmbedUrl = (url) => {
  if (typeof url !== 'string' || !url.trim()) {
    return '';
  }

  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace('www.', '');

    if (host === 'youtu.be') {
      const videoId = parsedUrl.pathname.replace('/', '');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsedUrl.pathname === '/watch') {
        const videoId = parsedUrl.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
      }

      if (parsedUrl.pathname.startsWith('/embed/')) {
        return parsedUrl.toString();
      }
    }

    return '';
  } catch {
    return '';
  }
};

const renderProjectVideos = (projectData) => {
  if (!projectVideosNode) {
    return;
  }

  const videos = Array.isArray(projectData?.videos)
    ? projectData.videos.filter((url) => typeof url === 'string' && url.trim().length > 0)
    : [];

  if (!videos.length) {
    projectVideosNode.innerHTML = '';
    projectVideosNode.hidden = true;
    return;
  }

  projectVideosNode.hidden = false;
  projectVideosNode.innerHTML = videos
    .map((url, index) => {
      const youtubeEmbedUrl = toYouTubeEmbedUrl(url);
      if (youtubeEmbedUrl) {
        return `
          <iframe
            class="project-video-frame"
            src="${youtubeEmbedUrl}"
            title="Project video ${index + 1}"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        `;
      }

      const embedUrl = toEmbeddableVideoUrl(url);
      return `
        <video class="project-video" controls playsinline preload="metadata" aria-label="Project video ${index + 1}">
          <source src="${embedUrl}" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      `;
    })
    .join('');
};

const renderProjectBook = (projectData, translations) => {
  if (!projectBookNode) {
    return;
  }

  const pages = Array.isArray(projectData?.bookPages)
    ? projectData.bookPages.filter((page) => typeof page === 'string' && page.trim().length > 0)
    : [];

  if (!pages.length) {
    projectBookNode.hidden = true;
    projectBookNode.innerHTML = '';
    return;
  }

  const prevLabel = translations.labels?.bookPrev || 'Previous';
  const nextLabel = translations.labels?.bookNext || 'Next';
  const pageLabel = translations.labels?.bookPage || 'Pages';
  const pagesPerSpread = 1;
  const totalSpreads = Math.ceil(pages.length / pagesPerSpread);
  let currentSpread = 0;

  projectBookNode.hidden = false;

  const renderSpread = () => {
    const startIndex = currentSpread * pagesPerSpread;
    const visiblePages = pages.slice(startIndex, startIndex + pagesPerSpread);
    const statusText = pagesPerSpread === 1
      ? `${pageLabel} ${startIndex + 1}/${pages.length}`
      : `${pageLabel} ${startIndex + 1}-${Math.min(startIndex + pagesPerSpread, pages.length)}/${pages.length}`;

    projectBookNode.innerHTML = `
      <div class="book-spread">
        ${visiblePages
          .map(
            (pagePath, index) =>
              `<img class="book-page" src="${resolvePath(pagePath)}" alt="Book page ${startIndex + index + 1}" loading="lazy" />`
          )
          .join('')}
      </div>
      <div class="book-controls">
        <button class="book-button" data-book-prev type="button">${prevLabel}</button>
        <span class="book-status">${statusText}</span>
        <button class="book-button" data-book-next type="button">${nextLabel}</button>
      </div>
    `;

    const prevButton = projectBookNode.querySelector('[data-book-prev]');
    const nextButton = projectBookNode.querySelector('[data-book-next]');

    if (prevButton) {
      prevButton.disabled = currentSpread === 0;
      prevButton.addEventListener('click', () => {
        if (currentSpread === 0) {
          return;
        }
        currentSpread -= 1;
        renderSpread();
      });
    }

    if (nextButton) {
      nextButton.disabled = currentSpread >= totalSpreads - 1;
      nextButton.addEventListener('click', () => {
        if (currentSpread >= totalSpreads - 1) {
          return;
        }
        currentSpread += 1;
        renderSpread();
      });
    }
  };

  renderSpread();
};

const renderProjectPostText = (projectData) => {
  if (!projectPostTextNode) {
    return;
  }

  const content = projectData?.postVideoText;
  const paragraphs = Array.isArray(content)
    ? content.filter((paragraph) => typeof paragraph === 'string' && paragraph.trim().length > 0)
    : typeof content === 'string' && content.trim().length > 0
      ? [content]
      : [];

  if (!paragraphs.length) {
    projectPostTextNode.hidden = true;
    projectPostTextNode.innerHTML = '';
    return;
  }

  projectPostTextNode.hidden = false;
  projectPostTextNode.innerHTML = paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('');
};

const positionProjectDescription = (projectId, projectData) => {
  if (!projectDescriptionSection || !projectDetailNode || !projectVideosNode) {
    return;
  }

  const videos = Array.isArray(projectData?.videos)
    ? projectData.videos.filter((url) => typeof url === 'string' && url.trim().length > 0)
    : [];

  const shouldPlaceBetweenVideos = projectId === '2' && videos.length >= 2;

  if (shouldPlaceBetweenVideos) {
    const renderedVideos = projectVideosNode.querySelectorAll('.project-video');
    if (renderedVideos.length >= 2) {
      projectVideosNode.insertBefore(projectDescriptionSection, renderedVideos[1]);
      return;
    }
  }

  if (projectDescriptionSection.parentElement !== projectDetailNode || projectDescriptionSection.previousElementSibling !== projectVideosNode) {
    projectDetailNode.appendChild(projectDescriptionSection);
  }
};

const applyProjectPageContent = (translations) => {
  if (!isProjectPage || !projectTitleRest) {
    return;
  }

  const pageProjectId = queryProjectId || projectTitleRest.dataset.projectId || '1';
  projectTitleRest.dataset.projectId = pageProjectId;

  const projectData = translations.projects?.[pageProjectId];
  if (!projectData) {
    renderProjectVideos(null);
    renderProjectPostText(null);
    positionProjectDescription(pageProjectId, null);
    return;
  }

  const title = projectData.pageTitle || projectData.title || `Project ${pageProjectId}`;
  const firstChar = title.charAt(0);
  const remaining = title.slice(1);

  if (projectTitleInitial) {
    projectTitleInitial.textContent = firstChar;
  }

  projectTitleRest.textContent = remaining;
  renderProjectVideos(projectData);
  renderProjectPostText(projectData);
  renderProjectBook(projectData, translations);
  positionProjectDescription(pageProjectId, projectData);

  projectDescriptionNodes.forEach((node) => {
    const side = node.dataset.projectDescription;
    const content = side ? projectData.description?.[side] : null;
    if (!side || !content) {
      return;
    }

    const paragraphs = Array.isArray(content)
      ? content.filter((paragraph) => typeof paragraph === 'string' && paragraph.trim().length > 0)
      : [content];

    if (!paragraphs.length) {
      return;
    }

    node.innerHTML = '';
    paragraphs.forEach((paragraph, index) => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      if (index === 1) {
        p.classList.add('indented-paragraph');
      }
      node.append(p);
    });
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
    applyCvLink(currentLang);

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
