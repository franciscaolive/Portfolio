const state = {
  lang: localStorage.getItem('portfolio-lang') || 'en',
  theme: localStorage.getItem('portfolio-theme') || 'light',
  data: { en: null, pt: null },
  lightboxImages: [],
  lightboxIndex: 0
};

const ui = {
  page: document.getElementById('project-page'),
  back: document.getElementById('back-projects'),
  lightbox: document.getElementById('lightbox'),
  lightboxImage: document.getElementById('lightbox-image'),
  lightboxClose: document.getElementById('lightbox-close'),
  lightboxPrev: document.getElementById('lightbox-prev'),
  lightboxNext: document.getElementById('lightbox-next')
};

const PROJECT_MEDIA = {
  fm: Array.from({ length: 11 }, (_, index) => ({ src: `../assets/images/fm/${index + 1}.png`, alt: `FM screen ${index + 1}` })),
  qmv2_book: Array.from({ length: 8 }, (_, index) => ({ src: `../assets/images/qmv2/book/${index + 1}.png`, alt: `QMV2 page ${index + 1}` })),
  qmv2_sketches: Array.from({ length: 4 }, (_, index) => ({ src: `../assets/images/qmv2/sketches/processo${index + 1}.png`, alt: `QMV2 sketch ${index + 1}` })),
  awtf: [
    { src: '../assets/images/awtf/AWTF.jpg', alt: 'Away with the Fairies poster' },
    { src: '../assets/images/awtf/GATE.jpeg', alt: 'Gate reference' }
  ]
};

function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug') || 'frontend';
}

function paragraphHtml(paragraphs) {
  return paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join('');
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  localStorage.setItem('portfolio-theme', state.theme);
  document.querySelectorAll('[data-theme]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.theme === state.theme);
  });
}

function updateLanguageButtons() {
  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.lang === state.lang);
  });
}

function openLightbox(images, index) {
  state.lightboxImages = images;
  state.lightboxIndex = index;
  ui.lightboxImage.src = images[index].src;
  ui.lightboxImage.alt = images[index].alt || 'Expanded image';
  ui.lightbox.hidden = false;
}

function setLightboxIndex(nextIndex) {
  if (!state.lightboxImages.length) return;
  const size = state.lightboxImages.length;
  state.lightboxIndex = (nextIndex + size) % size;
  const image = state.lightboxImages[state.lightboxIndex];
  ui.lightboxImage.src = image.src;
  ui.lightboxImage.alt = image.alt || 'Expanded image';
}

function closeLightbox() {
  ui.lightbox.hidden = true;
}

function createCarousel(images, keyPrefix) {
  const uid = `${keyPrefix}-${Math.random().toString(36).slice(2, 8)}`;

  return `
    <section class="carousel" data-carousel="${uid}">
      <div class="carousel-track-wrap">
        <button class="carousel-nav prev" data-carousel-prev="${uid}" aria-label="Previous">‹</button>
        <div class="carousel-track" id="${uid}">
          ${images.map((image, index) => `
            <div class="carousel-slide">
              <img src="${image.src}" alt="${image.alt}" data-lightbox-group="${uid}" data-lightbox-index="${index}">
            </div>
          `).join('')}
        </div>
        <button class="carousel-nav next" data-carousel-next="${uid}" aria-label="Next">›</button>
      </div>
    </section>
  `;
}

function attachCarouselEvents() {
  document.querySelectorAll('[data-carousel-prev]').forEach((button) => {
    button.addEventListener('click', () => {
      const track = document.getElementById(button.dataset.carouselPrev);
      track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('[data-carousel-next]').forEach((button) => {
    button.addEventListener('click', () => {
      const track = document.getElementById(button.dataset.carouselNext);
      track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
    });
  });
}

function attachLightboxEvents() {
  const groupMap = new Map();
  document.querySelectorAll('[data-lightbox-group]').forEach((image) => {
    const group = image.dataset.lightboxGroup;
    if (!groupMap.has(group)) groupMap.set(group, []);
    groupMap.get(group).push({ src: image.src, alt: image.alt });
  });

  document.querySelectorAll('[data-lightbox-group]').forEach((image) => {
    image.addEventListener('click', () => {
      const group = image.dataset.lightboxGroup;
      const index = Number(image.dataset.lightboxIndex);
      openLightbox(groupMap.get(group), index);
    });
  });
}

function renderFrontend(project) {
  const embeds = project.detail.media
    .filter((item) => item.type === 'iframe')
    .map((item) => `
      <article class="embed-item" data-embed-item>
        <div class="embed-head">
          <strong>${escapeHtml(item.label)}</strong>
          <a class="link-btn" href="${item.src}" target="_blank" rel="noopener noreferrer">Visit site ↗</a>
        </div>
        <button class="embed-toggle" type="button" data-embed-toggle>Open preview</button>
        <iframe class="embed-frame" data-embed-frame src="${item.src}" title="${escapeHtml(item.label)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" hidden></iframe>
      </article>
    `).join('');

  return `
    <h1 class="project-title">${escapeHtml(project.title)}</h1>
    <div class="project-description">${paragraphHtml(project.detail.paragraphs)}</div>
    <section class="embed-list">${embeds}</section>
    <p class="embed-note">If a preview is blank, open it directly with “Visit site ↗”.</p>
  `;
}

function renderFM(project) {
  return `
    <h1 class="project-title">${escapeHtml(project.title)}</h1>
    <div class="project-description">${paragraphHtml(project.detail.paragraphs)}</div>
    ${createCarousel(PROJECT_MEDIA.fm, 'fm')}
  `;
}

function renderQMV2(project) {
  return `
    <h1 class="project-title">${escapeHtml(project.title)}</h1>
    <div class="project-description">${paragraphHtml(project.detail.paragraphs)}</div>
    <section class="media-grid-2">
      ${createCarousel(PROJECT_MEDIA.qmv2_book, 'qmv2-book')}
      ${createCarousel(PROJECT_MEDIA.qmv2_sketches, 'qmv2-sketches')}
    </section>
  `;
}

function renderAWTF(project) {
  return `
    <h1 class="project-title">${escapeHtml(project.title)}</h1>
    <div class="project-description">${paragraphHtml(project.detail.paragraphs)}</div>
    ${createCarousel(PROJECT_MEDIA.awtf, 'awtf')}
  `;
}

function renderJenkins(project) {
  const firstPart = project.detail.paragraphs.slice(0, 4);
  const secondPart = project.detail.paragraphs.slice(4);
  const [firstVideo, secondVideo] = project.detail.media;

  return `
    <h1 class="project-title">${escapeHtml(project.title)}</h1>
    <div class="project-description">${paragraphHtml(firstPart)}</div>
    <section class="video-wrap section-spacing">
      <video controls preload="metadata" src="${firstVideo.src}"></video>
    </section>
    <div class="project-description section-spacing">${paragraphHtml(secondPart)}</div>
    <section class="video-wrap section-spacing">
      <video controls preload="metadata" src="${secondVideo.src}"></video>
    </section>
  `;
}

function renderAfterglow(project) {
  const iframe = project.detail.media.find((item) => item.type === 'iframe');
  const itchLink = project.detail.links?.[0];
  return `
    <h1 class="project-title">${escapeHtml(project.title)}</h1>
    <div class="project-description">${paragraphHtml(project.detail.paragraphs)}</div>
    <section class="video-wrap section-spacing">
      <iframe src="../assets/afterglow/index.html" title="${iframe?.label || 'Afterglow playable export'}" loading="lazy"></iframe>
    </section>
    <p class="section-spacing"><a class="link-btn" href="${itchLink.href}" target="_blank" rel="noopener noreferrer">${escapeHtml(itchLink.label)} ↗</a></p>
  `;
}

function renderProjectContent(project) {
  switch (project.slug) {
    case 'frontend': return renderFrontend(project);
    case 'fm': return renderFM(project);
    case 'qmv2': return renderQMV2(project);
    case 'awtf': return renderAWTF(project);
    case 'jenkins': return renderJenkins(project);
    case 'afterglow': return renderAfterglow(project);
    default:
      return `<h1 class="project-title">${escapeHtml(project.title)}</h1><div class="project-description">${paragraphHtml(project.detail.paragraphs || [])}</div>`;
  }
}

function bindDynamicEvents() {
  document.querySelectorAll('[data-embed-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('[data-embed-item]');
      const iframe = card.querySelector('[data-embed-frame]');
      const isHidden = iframe.hidden;
      iframe.hidden = !isHidden;
      button.textContent = isHidden ? 'Hide preview' : 'Open preview';
    });
  });

  attachCarouselEvents();
  attachLightboxEvents();
}

function renderPage() {
  const content = state.data[state.lang];
  if (!content) return;
  const slug = getSlug();
  const project = content.projects.items.find((item) => item.slug === slug) || content.projects.items[0];
  if (!project) return;

  document.documentElement.lang = state.lang;
  localStorage.setItem('portfolio-lang', state.lang);

  ui.back.textContent = content.home.back_projects;
  ui.page.innerHTML = renderProjectContent(project);
  closeLightbox();

  updateLanguageButtons();
  bindDynamicEvents();
}

function bindGlobalEvents() {
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

  ui.lightboxClose.addEventListener('click', closeLightbox);
  ui.lightboxPrev.addEventListener('click', () => setLightboxIndex(state.lightboxIndex - 1));
  ui.lightboxNext.addEventListener('click', () => setLightboxIndex(state.lightboxIndex + 1));
  ui.lightbox.addEventListener('click', (event) => {
    if (event.target === ui.lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (ui.lightbox.hidden) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') setLightboxIndex(state.lightboxIndex - 1);
    if (event.key === 'ArrowRight') setLightboxIndex(state.lightboxIndex + 1);
  });
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

async function init() {
  try {
    await loadTranslations();
    applyTheme();
    bindGlobalEvents();
    renderPage();
  } catch (error) {
    console.error(error);
  }
}

init();
