const SITE_PATH = 'data/site.json';
const PROJECTS_PATH = 'data/projects.json';

const el = id => document.getElementById(id);
let site = null;
let projects = [];
let strings = {};
let locale = 'en';
let galleryState = null;

async function loadJSON(path){
  try{
    const res = await fetch(path);
    if(!res.ok) throw new Error('fetch failed');
    return await res.json();
  }catch(e){
    console.warn('Could not load', path, e);
    return null;
  }
}

function savePref(k,v){localStorage.setItem(k,JSON.stringify(v))}
function loadPref(k,def){try{return JSON.parse(localStorage.getItem(k))}catch{ return def }}

function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
}

function openModalContent(node){
  clearGalleryViewer();
  const modal = el('modal');
  if(!modal) return;
  const container = el('modalContent');
  container.innerHTML = '';
  container.appendChild(node);
  modal.setAttribute('aria-hidden','false');
}
function closeModal(){
  clearGalleryViewer();
  const modal = el('modal');
  if(!modal) return;
  const container = el('modalContent');
  container.innerHTML = '';
  modal.setAttribute('aria-hidden','true');
}

function clearGalleryViewer(){
  if(galleryState?.onKeydown){
    document.removeEventListener('keydown', galleryState.onKeydown);
  }
  galleryState = null;
}

function normalizeMediaUrl(url){
  if(!url) return '';
  if(!url.includes('dropbox.com')) return url;
  if(url.includes('raw=1')) return url;
  if(url.includes('dl=0')) return url.replace('dl=0', 'raw=1');
  if(url.includes('?')) return `${url}&raw=1`;
  return `${url}?raw=1`;
}

function setProjectRouteBack(){
  location.hash = '';
  hideProjectView();
}

function createProjectVideo(url){
  const video = document.createElement('video');
  video.className = 'project-video-frame';
  video.controls = true;
  video.preload = 'metadata';
  video.playsInline = true;
  video.src = normalizeMediaUrl(url);
  return video;
}

function openGalleryViewer(images, startIndex = 0){
  if(!images || !images.length) return;
  clearGalleryViewer();

  const modal = el('modal');
  const container = el('modalContent');
  if(!modal || !container) return;

  const viewer = document.createElement('div');
  viewer.className = 'gallery-viewer';

  const prevButton = document.createElement('button');
  prevButton.type = 'button';
  prevButton.className = 'gallery-viewer-button';
  prevButton.textContent = 'Prev';

  const image = document.createElement('img');
  image.alt = 'Project image';

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.className = 'gallery-viewer-button';
  nextButton.textContent = 'Next';

  const meta = document.createElement('div');
  meta.className = 'gallery-viewer-meta';

  const count = document.createElement('span');
  count.className = 'gallery-viewer-count';

  const closeHint = document.createElement('span');
  closeHint.className = 'gallery-viewer-count';
  closeHint.textContent = 'Esc to close';

  meta.appendChild(count);
  meta.appendChild(closeHint);

  viewer.appendChild(prevButton);
  viewer.appendChild(image);
  viewer.appendChild(nextButton);
  viewer.appendChild(meta);

  let index = Math.max(0, Math.min(startIndex, images.length - 1));

  function sync(){
    image.src = images[index];
    image.alt = `Image ${index + 1}`;
    count.textContent = `${index + 1} / ${images.length}`;
  }

  prevButton.addEventListener('click', () => {
    index = (index - 1 + images.length) % images.length;
    sync();
  });

  nextButton.addEventListener('click', () => {
    index = (index + 1) % images.length;
    sync();
  });

  const onKeydown = (e) => {
    if(e.key === 'ArrowLeft') prevButton.click();
    if(e.key === 'ArrowRight') nextButton.click();
    if(e.key === 'Escape') closeModal();
  };

  galleryState = { onKeydown };
  document.addEventListener('keydown', onKeydown);

  container.innerHTML = '';
  container.appendChild(viewer);
  modal.setAttribute('aria-hidden', 'false');
  sync();
}

function createAccordionItem(label, url){
  const item = document.createElement('section');
  item.className = 'accordion-item';
  item.setAttribute('aria-expanded', 'false');

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'accordion-toggle';

  const title = document.createElement('span');
  title.className = 'accordion-title';
  title.textContent = label;

  const state = document.createElement('span');
  state.className = 'accordion-state';
  state.textContent = 'open';

  const panel = document.createElement('div');
  panel.className = 'accordion-panel';

  const iframe = document.createElement('iframe');
  iframe.className = 'project-embed-frame';
  iframe.src = url;
  iframe.loading = 'lazy';
  iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox';
  iframe.referrerPolicy = 'no-referrer';

  const fallback = document.createElement('a');
  fallback.className = 'project-video-link';
  fallback.href = url;
  fallback.target = '_blank';
  fallback.rel = 'noreferrer';
  fallback.textContent = 'Open site in a new tab';

  panel.appendChild(iframe);
  panel.appendChild(fallback);

  toggle.appendChild(title);
  toggle.appendChild(state);

  toggle.addEventListener('click', () => {
    const expanded = item.getAttribute('aria-expanded') === 'true';
    item.setAttribute('aria-expanded', String(!expanded));
    state.textContent = expanded ? 'open' : 'close';
  });

  item.appendChild(toggle);
  item.appendChild(panel);
  return item;
}

function renderProjectContent(project){
  const content = el('projectContent');
  if(!content) return;

  content.innerHTML = '';

  if(project.id === 'frontend'){
    const accordion = document.createElement('div');
    accordion.className = 'project-accordion';
    (project.links || []).forEach(link => {
      accordion.appendChild(createAccordionItem(link.label, link.url));
    });
    content.appendChild(accordion);
    return;
  }

  if(project.type === 'gallery' && project.images && project.images.length){
    let currentIndex = 0;
    const carousel = document.createElement('div');
    carousel.className = 'project-carousel';

    const main = document.createElement('div');
    main.className = 'project-carousel-main';

    const image = document.createElement('img');
    image.alt = project.id;

    const nav = document.createElement('div');
    nav.className = 'project-carousel-nav';

    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'project-carousel-button';
    prev.textContent = '<';

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'project-carousel-button';
    next.textContent = '>';

    nav.appendChild(prev);
    nav.appendChild(next);
    main.appendChild(image);
    main.appendChild(nav);

    const sync = () => {
      image.src = project.images[currentIndex];
      image.alt = `${project.id} image ${currentIndex + 1}`;
      const nextIdx = (currentIndex + 1) % project.images.length;
      const prevIdx = (currentIndex - 1 + project.images.length) % project.images.length;
      [nextIdx, prevIdx].forEach(i => {
        const pre = new Image();
        pre.decoding = 'async';
        pre.loading = 'eager';
        pre.src = project.images[i];
      });
    };

    main.addEventListener('click', () => openGalleryViewer(project.images, currentIndex));
    prev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + project.images.length) % project.images.length;
      sync();
    });
    next.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % project.images.length;
      sync();
    });

    carousel.appendChild(main);
    content.appendChild(carousel);
    sync();
    return;
  }

  if(project.type === 'video' && project.videos && project.videos.length){
    const videoList = document.createElement('div');
    videoList.className = 'project-video-list';
    project.videos.forEach(url => {
      videoList.appendChild(createProjectVideo(url));
    });
    content.appendChild(videoList);
    return;
  }

  if(project.embed){
    const iframe = document.createElement('iframe');
    iframe.className = 'project-game';
    iframe.src = project.embed;
    iframe.sandbox = 'allow-scripts allow-same-origin allow-forms';
    iframe.frameBorder = 0;
    content.appendChild(iframe);

    if(project.id !== 'afterglow' && project.videos && project.videos.length){
      const videoList = document.createElement('div');
      videoList.className = 'project-video-list';
      project.videos.forEach(url => {
        videoList.appendChild(createProjectVideo(url));
      });
      content.appendChild(videoList);
    }
    return;
  }

  if(project.links && project.links.length){
    const linkList = document.createElement('div');
    linkList.className = 'project-video-list';
    project.links.forEach(link => {
      const a = document.createElement('a');
      a.className = 'project-video-link';
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noreferrer';
      a.textContent = link.label;
      linkList.appendChild(a);
    });
    content.appendChild(linkList);
  }
}

function setHTMLLang(next){
  locale = next;
  document.documentElement.lang = next;
  savePref('lang', next);
}

function getString(key, def=''){
  const s = (strings && strings[locale]) || {};
  return s[key] ?? def;
}

function renderFooter(){
  const footerLeft = el('footerLeft');
  const footerRight = el('footerRight');
  if(!footerLeft || !footerRight) return;

  const year = new Date().getFullYear();
  const title = site?.title || 'Portfolio';
  footerLeft.textContent = `${title} © ${year}`;

  const c = site?.contact || {};
  footerRight.innerHTML = '';

  const links = [];
  if(c.email) links.push({ href: `mailto:${c.email}`, label: c.email, external: false });
  if(c.github) links.push({ href: c.github, label: 'github', external: true });
  if(c.cv_en && c.cv_pt) links.push({
    href: (locale === 'pt' ? c.cv_pt : c.cv_en),
    label: 'CV',
    external: true,
  });

  links.forEach((l, idx) => {
    const a = document.createElement('a');
    a.href = l.href;
    a.textContent = l.label;
    if(l.external){
      a.target = '_blank';
      a.rel = 'noreferrer';
    }
    footerRight.appendChild(a);
    if(idx < links.length - 1){
      const sep = document.createElement('span');
      sep.className = 'sep';
      sep.textContent = ' | ';
      footerRight.appendChild(sep);
    }
  });
}

function renderControls(locales){
  const langPt = el('langPt');
  const langEn = el('langEn');
  if(langPt) langPt.setAttribute('aria-pressed', String(locale === 'pt'));
  if(langEn) langEn.setAttribute('aria-pressed', String(locale === 'en'));

  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  const themeLight = el('themeLight');
  const themeDark = el('themeDark');
  if(themeLight) themeLight.setAttribute('aria-pressed', String(theme === 'light'));
  if(themeDark) themeDark.setAttribute('aria-pressed', String(theme === 'dark'));
}

function renderHome(){
  const bio = el('bio');
  if(bio) bio.textContent = (site?.bio && site.bio[locale]) || '';

  const viewProjects = el('viewProjects');
  if(viewProjects) viewProjects.textContent = getString('viewProjects', 'View Projects');

  renderFooter();
}

function renderProjects(){
  const backHome = el('backHome');
  if(backHome) backHome.textContent = getString('backHome', 'back to home page');

  const intro = el('projectsIntro');
  if(intro) intro.textContent = getString('projectsIntro', '');

  const list = el('projectsList');
  if(list){
    list.innerHTML='';
    projects.forEach((p)=>{
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'project-row';
      row.addEventListener('click', ()=>{ location.hash = `#/project/${p.id}` });

      const title = document.createElement('span');
      title.className = 'project-row-title';
      title.textContent = (p.title && p.title[locale]) || p.id;

      const thumb = document.createElement('span');
      thumb.className = 'project-row-thumb';
      if(p.thumb){
        const img = document.createElement('img');
        img.src = p.thumb;
        img.alt = (p.title && p.title[locale]) || p.id;
        img.loading = 'lazy';
        img.decoding = 'async';
        thumb.appendChild(img);
      }

      row.appendChild(title);
      row.appendChild(thumb);
      list.appendChild(row);
    });
  }

  renderFooter();
}

async function init(){
  site = await loadJSON(SITE_PATH) || {};
  projects = await loadJSON(PROJECTS_PATH) || [];

  const locales = site.locales || ['en'];
  strings = site.strings || {};
  const savedLang = loadPref('lang', locales[0]);
  setHTMLLang(locales.includes(savedLang) ? savedLang : locales[0]);

  const themeFromPref = loadPref('theme','light');
  applyTheme(themeFromPref);

  function render(){
    renderControls(locales);
    const page = document.body?.dataset?.page || 'home';
    if(page === 'projects'){
      renderProjects();
      const match = (location.hash || '').match(/^#\/project\/(.+)/);
      if(match) showProject(match[1]);
      else hideProjectView();
    } else {
      renderHome();
    }
  }

  const langPt = el('langPt');
  const langEn = el('langEn');
  if(langPt) langPt.addEventListener('click', ()=>{ if(locales.includes('pt')){ setHTMLLang('pt'); render(); handleRoute(); }});
  if(langEn) langEn.addEventListener('click', ()=>{ if(locales.includes('en')){ setHTMLLang('en'); render(); handleRoute(); }});

  const themeLight = el('themeLight');
  const themeDark = el('themeDark');
  if(themeLight) themeLight.addEventListener('click', ()=>{
    applyTheme('light'); savePref('theme', 'light'); renderControls(locales);
  });
  if(themeDark) themeDark.addEventListener('click', ()=>{
    applyTheme('dark'); savePref('theme', 'dark'); renderControls(locales);
  });

  const modalClose = el('modalClose');
  if(modalClose) modalClose.addEventListener('click', closeModal);

  const modal = el('modal');
  if(modal){
    modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });
  }

  render();
  handleRoute();
}

document.addEventListener('DOMContentLoaded', init);

window.addEventListener('hashchange', () => handleRoute());
window.addEventListener('load', () => handleRoute());

function handleRoute(){
  if(document.body?.dataset?.page !== 'projects') return;
  const hash = location.hash || '';
  const match = hash.match(/^#\/project\/(.+)/);
  if(match){
    const id = match[1];
    showProject(id);
  } else {
    hideProjectView();
  }
}

function showProject(id){
  if(document.body?.dataset?.page !== 'projects') return;
  const project = projects && projects.find(p=>p.id===id);
  if(!project) return hideProjectView();

  const pv = el('projectView');
  if(!pv) return;
  pv.setAttribute('aria-hidden','false');

  const backButton = el('projectBack');
  if(backButton) backButton.textContent = getString('backProjects', 'back to projects page');

  el('projectTitle').textContent = (project.title && project.title[locale]) || project.id;
  el('projectDesc').textContent = (project.description && project.description[locale]) || '';
  const extras = el('projectExtras');
  if(extras) extras.innerHTML='';

  renderProjectContent(project);

  if(backButton) backButton.onclick = setProjectRouteBack;
}

function hideProjectView(){
  const pv = el('projectView'); if(pv) pv.setAttribute('aria-hidden','true');
}
