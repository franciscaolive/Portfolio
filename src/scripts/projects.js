const state = {
  lang: localStorage.getItem('portfolio-lang') || 'en',
  theme: localStorage.getItem('portfolio-theme') || 'light',
  activeFilter: 'all',
  data: { en: null, pt: null }
};

const ui = {
  backHome: document.getElementById('back-home'),
  nameFirst: document.getElementById('name-first'),
  nameLast: document.getElementById('name-last'),
  filters: document.getElementById('filters'),
  grid: document.getElementById('projects-grid'),
  footer: document.getElementById('projects-footer')
};

const projectDisplay = {
  frontend: { cover: '../assets/images/project-covers/FRONTEND.png', categories: ['development'] },
  fm: { cover: '../assets/images/project-covers/FM.png', categories: ['design'] },
  qmv2: { cover: '../assets/images/project-covers/QMV2.png', categories: ['design'] },
  awtf: { cover: '../assets/images/project-covers/AWTF.jpg', categories: ['design'] },
  jenkins: { cover: '../assets/images/project-covers/JENKINS.jpg', categories: ['development'] },
  afterglow: { cover: '../assets/images/project-covers/AFTERGLOW.png', categories: ['design', 'development'] }
};

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function loadTranslations() {
  const [enResponse, ptResponse] = await Promise.all([
    fetch('../data/en.json'),
    fetch('../data/pt.json')
  ]);

  if (!enResponse.ok || !ptResponse.ok) {
    throw new Error('Could not load translation files.');
  }

  state.data.en = await enResponse.json();
  state.data.pt = await ptResponse.json();
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  localStorage.setItem('portfolio-theme', state.theme);

  document.querySelectorAll('[data-theme]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.theme === state.theme);
  });
}

function renderFilters(home) {
  const items = [
    { key: 'all', label: home.filter_all },
    { key: 'design', label: home.filter_design },
    { key: 'development', label: home.filter_development }
  ];

  ui.filters.innerHTML = items
    .map((item) => `<button data-filter="${item.key}" class="${state.activeFilter === item.key ? 'is-active' : ''}">${escapeHtml(item.label)}</button>`)
    .join('');

  ui.filters.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeFilter = button.dataset.filter;
      renderPage();
    });
  });
}

function renderProjects(projects) {
  const cards = projects
    .filter((project) => {
      if (state.activeFilter === 'all') return true;
      return projectDisplay[project.slug]?.categories?.includes(state.activeFilter);
    })
    .map((project) => {
      const display = projectDisplay[project.slug];
      if (!display) return '';

      return `
        <figure class="project-card">
          <a href="project-detail-page.html?slug=${project.slug}">
            <img src="${display.cover}" alt="${escapeHtml(project.alt || project.title)}">
          </a>
          <figcaption><a href="project-detail-page.html?slug=${project.slug}">${escapeHtml(project.title)}</a></figcaption>
        </figure>
      `;
    })
    .join('');

  ui.grid.innerHTML = cards;
}

function renderPage() {
  const content = state.data[state.lang];
  if (!content) return;

  const { home, projects } = content;

  document.documentElement.lang = state.lang;
  localStorage.setItem('portfolio-lang', state.lang);

  ui.backHome.textContent = home.back_home;
  ui.nameFirst.textContent = home.name_first;
  ui.nameLast.textContent = home.name_last;
  ui.footer.textContent = home.copyright;

  renderFilters(home);
  renderProjects(projects.items);

  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.lang === state.lang);
  });
}

function bindTopbarEvents() {
  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.addEventListener('click', () => {
      state.lang = button.dataset.lang;
      renderPage();
    });
  });

  document.querySelectorAll('[data-theme]').forEach((button) => {
    button.addEventListener('click', () => {
      state.theme = button.dataset.theme;
      applyTheme();
    });
  });
}

async function init() {
  try {
    await loadTranslations();
    applyTheme();
    bindTopbarEvents();
    renderPage();
  } catch (error) {
    console.error(error);
  }
}

init();
