const state = {
  lang: localStorage.getItem('portfolio-lang') || 'en',
  theme: localStorage.getItem('portfolio-theme') || 'light',
  isContactsOpen: false,
  data: { en: null, pt: null }
};

const ui = {
  title: document.querySelector('title'),
  roleLabel: document.getElementById('role-label'),
  toggleContacts: document.getElementById('toggle-contacts'),
  contactsPanel: document.getElementById('contacts-panel'),
  name: document.getElementById('name'),
  intro: document.getElementById('intro'),
  viewProjects: document.getElementById('view-projects'),
  copyright: document.getElementById('copyright'),
  cv: document.getElementById('contact-cv'),
  email: document.getElementById('contact-email'),
  github: document.getElementById('contact-github'),
  linkedin: document.getElementById('contact-linkedin')
};

function renderIntro(text) {
  ui.intro.replaceChildren();

  const paragraphs = text.split('\n');

  paragraphs.forEach((paragraph, index) => {
    const span = document.createElement('span');
    span.className = index === 0 ? 'intro-first' : 'intro-second';
    span.textContent = paragraph;
    ui.intro.append(span);
  });
}

async function loadTranslations() {
  const [enResponse, ptResponse] = await Promise.all([
    fetch('src/data/en.json'),
    fetch('src/data/pt.json')
  ]);

  if (!enResponse.ok || !ptResponse.ok) {
    throw new Error('Could not load translation files.');
  }

  const [enData, ptData] = await Promise.all([
    enResponse.json(),
    ptResponse.json()
  ]);

  state.data.en = enData;
  state.data.pt = ptData;
}

function renderFromLanguage() {
  const content = state.data[state.lang];
  if (!content) return;

  const { home, contacts } = content;

  ui.title.textContent = home.title;
  ui.roleLabel.textContent = home.role_label;
  ui.toggleContacts.textContent = state.isContactsOpen ? home.toggle_about : home.toggle_contacts;
  ui.name.replaceChildren();
  const firstName = document.createElement('span');
  firstName.className = 'script';
  firstName.textContent = home.name_first;
  const lastName = document.createElement('span');
  lastName.className = 'script';
  lastName.textContent = home.name_last;
  ui.name.append(firstName, document.createTextNode(' '), lastName);
  renderIntro(home.intro);
  ui.viewProjects.textContent = home.view_projects;
  ui.copyright.textContent = home.copyright;

  ui.cv.textContent = contacts.CVLabel;
  ui.cv.href = contacts.cvHref;
  ui.email.textContent = contacts.emailLabel;
  ui.email.href = contacts.emailHref;
  ui.github.textContent = contacts.githubLabel;
  ui.github.href = contacts.githubHref;
  ui.linkedin.textContent = contacts.linkedinLabel;
  ui.linkedin.href = contacts.linkedinHref;

  document.documentElement.lang = state.lang;
  localStorage.setItem('portfolio-lang', state.lang);
  ui.toggleContacts.setAttribute('aria-expanded', String(state.isContactsOpen));
  ui.contactsPanel.toggleAttribute('inert', !state.isContactsOpen);
  ui.contactsPanel.setAttribute('aria-hidden', String(!state.isContactsOpen));
  ui.contactsPanel.classList.toggle('is-open', state.isContactsOpen);
  ui.intro.classList.toggle('is-hidden', state.isContactsOpen);
  updateActiveButtons();
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  localStorage.setItem('portfolio-theme', state.theme);
  updateActiveButtons();
}

function updateActiveButtons() {
  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.lang === state.lang);
  });

  document.querySelectorAll('[data-theme]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.theme === state.theme);
  });
}

function bindEvents() {
  ui.toggleContacts.addEventListener('click', () => {
    state.isContactsOpen = !state.isContactsOpen;
    renderFromLanguage();
  });

  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.addEventListener('click', () => {
      state.lang = button.dataset.lang;
      renderFromLanguage();
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
    renderFromLanguage();
    applyTheme();
    bindEvents();
  } catch (error) {
    console.error(error);
  }
}

init();
