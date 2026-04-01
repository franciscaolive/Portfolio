const basePath = document.body?.dataset.basePath || ".";
const projectRoot = document.querySelector("[data-project-page]");
const projectId = projectRoot?.dataset.projectId || null;
const isProjectPage = Boolean(projectRoot);

const fallbackSite = {
	profile: {
		name: "Francisca Miranda",
		email: "",
		links: {
			github: "",
			linkedin: ""
		}
	},
	projects: []
};

const fallbackTranslations = {
	eng: {
		name: "Francisca Miranda",
		nav: {
			skills: "Skills",
			contact: "Contact Me",
			back: "← Back to portfolio",
			viewProject: "View Project"
		},
		toggles: {
			light: "Light",
			dark: "Dark",
			pt: "Pt",
			eng: "Eng"
		},
		copy: {
			intro: [],
			skills: []
		},
		projects: {}
	},
	pt: {
		name: "Francisca Miranda",
		nav: {
			skills: "Competências",
			contact: "Contactos",
			back: "← Voltar ao portfólio",
			viewProject: "Ver projeto"
		},
		toggles: {
			light: "Claro",
			dark: "Escuro",
			pt: "Pt",
			eng: "Eng"
		},
		copy: {
			intro: [],
			skills: []
		},
		projects: {}
	}
};

const LANGUAGES = ["eng", "pt"];
const SECTIONS = ["intro", "skills"];
const STORAGE_KEYS = {
	lang: "fm-portfolio-lang",
	mode: "fm-portfolio-mode"
};

const state = {
	lang: readStoredValue(STORAGE_KEYS.lang, "eng"),
	mode: readStoredValue(STORAGE_KEYS.mode, "light"),
	section: getSectionFromHash(),
	site: fallbackSite,
	translations: { ...fallbackTranslations }
};

let dom = {};

function readStoredValue(key, fallback) {
	try {
		return localStorage.getItem(key) || fallback;
	} catch (error) {
		return fallback;
	}
}

function storeValue(key, value) {
	try {
		localStorage.setItem(key, value);
	} catch (error) {
	}
}

function getSectionFromHash() {
	const hash = window.location.hash.replace("#", "");
	return SECTIONS.includes(hash) ? hash : "intro";
}

function resolvePath(path) {
	if (!path) return "";
	if (/^(https?:)?\/\//.test(path)) return path;
	return `${basePath}/${path}`.replace(/\/\.\//g, "/");
}

function renderHeader() {
	const headerRoot = document.querySelector("[data-site-header]");
	if (!headerRoot) return;

	const profile = state.site.profile || fallbackSite.profile;
	headerRoot.innerHTML = `
		<div class="header-left">
			<button class="brand" data-section="intro" aria-label="Go to intro">
				<span class="brand-name" data-i18n="name">${profile.name}</span>
			</button>
			<div class="toggle-group lang-toggle" aria-label="Toggle language" role="group">
				<button class="toggle" data-lang="pt" aria-pressed="false"></button>
				<span class="slash">/</span>
				<button class="toggle" data-lang="eng" aria-pressed="false"></button>
			</div>
		</div>

		<button class="monogram" data-section="intro" aria-label="Go to intro">
			<img class="monogram-icon" src="${resolvePath("assets/icons/FMIconLightMode.png")}" alt="FM monogram">
		</button>

		<button class="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
			<span class="burger-icon" aria-hidden="true"></span>
		</button>

		<div class="header-right">
			<nav class="nav" aria-label="Primary">
				<button class="nav-link" data-section="skills" data-i18n="skills"></button>
				<div class="contact-wrapper">
						<button class="nav-link contact-toggle" data-i18n="contact" type="button" aria-expanded="false" aria-controls="contact-menu" aria-haspopup="true"></button>
						<div class="contact-menu" id="contact-menu" hidden>
							<a class="contact-item contact-github" href="${profile.links?.github || "#"}" target="_blank" rel="noreferrer">GitHub</a>
							<a class="contact-item contact-linkedin" href="${profile.links?.linkedin || "#"}" target="_blank" rel="noreferrer">LinkedIn</a>
							<a class="contact-item contact-email" href="mailto:${profile.email}">Email</a>
						</div>
				</div>
			</nav>
			<div class="toggle-group mode-toggle" aria-label="Toggle color mode" role="group">
				<button class="toggle" data-mode="light" aria-pressed="false" data-i18n="light"></button>
				<span class="slash">/</span>
				<button class="toggle" data-mode="dark" aria-pressed="false" data-i18n="dark"></button>
			</div>
		</div>

		<div class="mobile-menu" id="mobile-menu" hidden>
			<nav class="mobile-nav" aria-label="Mobile">
				<button class="nav-link" data-section="skills" data-i18n="skills"></button>
				<div class="toggle-group lang-toggle" aria-label="Toggle language" role="group">
					<button class="toggle" data-lang="pt" aria-pressed="false"></button>
					<span class="slash">/</span>
					<button class="toggle" data-lang="eng" aria-pressed="false"></button>
				</div>
				<div class="toggle-group mode-toggle" aria-label="Toggle color mode" role="group">
					<button class="toggle" data-mode="light" aria-pressed="false" data-i18n="light"></button>
					<span class="slash">/</span>
					<button class="toggle" data-mode="dark" aria-pressed="false" data-i18n="dark"></button>
				</div>
				<div class="mobile-contacts">
					<div class="mobile-label" data-i18n="contact"></div>
					<a class="contact-item contact-github" href="${profile.links?.github || "#"}" target="_blank" rel="noreferrer">GitHub</a>
					<a class="contact-item contact-linkedin" href="${profile.links?.linkedin || "#"}" target="_blank" rel="noreferrer">LinkedIn</a>
					<a class="contact-item contact-email" href="mailto:${profile.email}">Email</a>
				</div>
			</nav>
		</div>
	`;
}

function cacheDom() {
	dom.copyTarget = document.querySelector("[data-copy-target]");
	dom.nameTarget = document.querySelector("[data-i18n='name']");
	dom.skillsNav = document.querySelector("[data-section='skills']");
	dom.contactLink = document.querySelector(".contact-toggle");
	dom.contactEmailLink = document.querySelector(".contact-email");
	dom.contactToggle = document.querySelector(".contact-toggle");
	dom.contactMenu = document.querySelector(".contact-menu");
	dom.modeButtons = document.querySelectorAll("[data-mode]");
	dom.langButtons = document.querySelectorAll("[data-lang]");
	dom.navButtons = document.querySelectorAll(".nav-link[data-section]");
	dom.brandButton = document.querySelector(".brand[data-section='intro']");
	dom.monogramButton = document.querySelector(".monogram[data-section='intro']");
	dom.monogramImg = document.querySelector(".monogram-icon");
	dom.burgerButton = document.querySelector(".burger");
	dom.mobileMenu = document.querySelector(".mobile-menu");
	dom.carouselRoot = document.querySelector(".carousel");
	dom.carouselViewport = document.querySelector(".carousel-viewport");
	dom.trackEl = document.querySelector("[data-carousel-track]");
	dom.backLinks = document.querySelectorAll("[data-i18n='back']");
}

function currentTranslations() {
	return state.translations[state.lang] || fallbackTranslations[state.lang];
}

function setActive(buttons, attr, value) {
	buttons.forEach((button) => {
		const isActive = button.dataset[attr] === value;
		button.classList.toggle("is-active", isActive);
		button.setAttribute("aria-pressed", String(isActive));
	});
}

function renderSkillsLine(text) {
	const container = document.createElement("div");
	container.className = "skills-line";

	const splitIndex = text.indexOf(":");
	if (splitIndex === -1) {
		container.textContent = text;
		return container;
	}

	const label = document.createElement("span");
	label.className = "skills-label";
	label.textContent = text.slice(0, splitIndex + 1);

	const list = document.createElement("span");
	list.className = "skills-list";
	list.textContent = text.slice(splitIndex + 1).trim();

	container.appendChild(label);
	container.appendChild(list);
	return container;
}

function renderCopy() {
	if (!dom.copyTarget || isProjectPage) return;

	const translations = currentTranslations();
	const paragraphs = translations.copy?.[state.section] || [];
	const isIntro = state.section === "intro";

	dom.copyTarget.innerHTML = "";
	dom.copyTarget.classList.toggle("intro", isIntro);
	dom.copyTarget.classList.toggle("skills", !isIntro);

	paragraphs.forEach((entry) => {
		if (isIntro) {
			const paragraph = document.createElement("p");
			paragraph.textContent = entry;
			dom.copyTarget.appendChild(paragraph);
			return;
		}

		dom.copyTarget.appendChild(renderSkillsLine(entry));
	});
}

function renderBody(target, content) {
	if (!target || !Array.isArray(content)) return;
	target.innerHTML = "";

	content.forEach((item) => {
		const text = typeof item === "string" ? item : item?.text;
		const hasLink = typeof item === "object" && item?.link?.href;
		if (!text && !hasLink) return;

		const paragraph = document.createElement("p");
		paragraph.className = "project-paragraph";
		if (typeof item === "object" && item.indent) {
			paragraph.classList.add("indent");
		}
		if (hasLink) {
			if (text) {
				paragraph.appendChild(document.createTextNode(`${text} `));
			}
			const link = document.createElement("a");
			link.href = item.link.href;
			link.textContent = item.link.label || item.link.href;
			link.target = "_blank";
			link.rel = "noopener";
			paragraph.appendChild(link);
		} else {
			paragraph.textContent = text;
		}
		target.appendChild(paragraph);
	});
}

function renderProjectPageContent() {
	if (!projectRoot || !projectId) return;

	const translations = currentTranslations();
	const project = translations.projects?.[projectId];
	if (!project) return;

	const titleEl = projectRoot.querySelector("[data-project-title]");
	const tagsEl = projectRoot.querySelector("[data-project-tags]");
	const bodyEl = projectRoot.querySelector("[data-project-body]");
	const bodyFirstEl = projectRoot.querySelector("[data-project-body-first]");
	const bodyMiddleEl = projectRoot.querySelector("[data-project-body-under-video]");
	const bodySecondEl = projectRoot.querySelector("[data-project-body-second]");
	const captionEls = projectRoot.querySelectorAll("[data-project-caption-index]");
	const imageEls = projectRoot.querySelectorAll("[data-project-image-index]");
	const videoSourceEls = projectRoot.querySelectorAll("[data-project-video-index]");

	if (titleEl) titleEl.textContent = project.title || "";
	document.title = `FM | ${project.title || "Project"}`;

	if (tagsEl) {
		tagsEl.innerHTML = "";
		(project.tags || []).forEach((tag) => {
			const chip = document.createElement("span");
			chip.className = "tag-chip";
			chip.textContent = tag;
			tagsEl.appendChild(chip);
		});
	}

	renderBody(bodyEl, project.body);
	renderBody(bodyFirstEl, project.bodyFirst || project.body);
	renderBody(bodyMiddleEl, project.bodyMiddle);
	renderBody(bodySecondEl, project.bodySecond);

	const captions = project.captions || (project.caption ? [project.caption] : []);
	captionEls.forEach((captionEl) => {
		const index = Number(captionEl.dataset.projectCaptionIndex);
		captionEl.textContent = captions[index] || "";
	});

	imageEls.forEach((img) => {
		const index = Number(img.dataset.projectImageIndex);
		const altText = project.images?.[index]?.alt;
		img.alt = altText || "";
	});

	const videoList = state.site.projectMedia?.[projectId]?.videos || project.videos || [];
	videoSourceEls.forEach((sourceEl) => {
		const index = Number(sourceEl.dataset.projectVideoIndex);
		const src = videoList[index]?.src;
		if (!src) return;
		sourceEl.src = resolvePath(src);
		const videoEl = sourceEl.closest("video");
		if (videoEl) videoEl.load();
	});
}

function updateContactLinks() {
	const profile = state.site.profile || fallbackSite.profile;
	const email = (profile.email || "").trim();

	document.querySelectorAll(".contact-github").forEach((link) => {
		if (profile.links?.github) link.href = profile.links.github;
	});

	document.querySelectorAll(".contact-linkedin").forEach((link) => {
		if (profile.links?.linkedin) link.href = profile.links.linkedin;
	});

	document.querySelectorAll(".contact-email").forEach((link) => {
		link.href = email ? `mailto:${email}` : "#";
		link.title = email ? `Email ${email}` : "";
	});
}

function applyTranslations() {
	const translations = currentTranslations();

	if (dom.nameTarget) {
		dom.nameTarget.textContent = translations.name || fallbackSite.profile.name;
	}

	if (dom.skillsNav) {
		const skillsLabel = translations.nav?.skills || fallbackTranslations[state.lang].nav.skills;
		document.querySelectorAll("[data-i18n='skills']").forEach((el) => {
			el.textContent = skillsLabel;
		});
	}

	if (dom.contactLink) {
		const contactLabel = translations.nav?.contact || fallbackTranslations[state.lang].nav.contact;
		document.querySelectorAll("[data-i18n='contact']").forEach((el) => {
			el.textContent = contactLabel;
		});
	}

	dom.backLinks.forEach((link) => {
		link.textContent = translations.nav?.back || fallbackTranslations[state.lang].nav.back;
	});

	document.querySelectorAll("[data-i18n='light']").forEach((el) => {
		el.textContent = translations.toggles?.light || fallbackTranslations[state.lang].toggles.light;
	});

	document.querySelectorAll("[data-i18n='dark']").forEach((el) => {
		el.textContent = translations.toggles?.dark || fallbackTranslations[state.lang].toggles.dark;
	});

	document.querySelectorAll("[data-lang='pt']").forEach((el) => {
		el.textContent = translations.toggles?.pt || fallbackTranslations[state.lang].toggles.pt;
	});

	document.querySelectorAll("[data-lang='eng']").forEach((el) => {
		el.textContent = translations.toggles?.eng || fallbackTranslations[state.lang].toggles.eng;
	});

	renderCopy();
	renderProjectPageContent();
	buildCarousel();
}

function updateMonogramIcon() {
	if (!dom.monogramImg) return;
	const iconPath = state.mode === "dark" ? "assets/icons/FMIconDarkMode.png" : "assets/icons/FMIconLightMode.png";
	dom.monogramImg.src = resolvePath(iconPath);
}

function setMode(mode) {
	state.mode = mode === "dark" ? "dark" : "light";
	document.body.classList.remove("light-mode", "dark-mode");
	document.body.classList.add(`${state.mode}-mode`);
	setActive(dom.modeButtons, "mode", state.mode);
	updateMonogramIcon();
	storeValue(STORAGE_KEYS.mode, state.mode);
}

function setLanguage(lang) {
	if (!LANGUAGES.includes(lang)) return;
	state.lang = lang;
	document.documentElement.lang = lang === "pt" ? "pt" : "en";
	setActive(dom.langButtons, "lang", lang);
	storeValue(STORAGE_KEYS.lang, lang);
	applyTranslations();
}

function setMenuOpen(isOpen) {
	if (!dom.mobileMenu || !dom.burgerButton) return;
	document.body.classList.toggle("menu-open", isOpen);
	dom.mobileMenu.hidden = !isOpen;
	dom.burgerButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

function setContactMenuOpen(isOpen) {
	if (!dom.contactMenu || !dom.contactToggle) return;
	dom.contactMenu.hidden = !isOpen;
	dom.contactToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
	if (isOpen) {
		dom.contactMenu.querySelector("a")?.focus();
	}
}

function isContactMenuOpen() {
	return Boolean(dom.contactMenu && !dom.contactMenu.hidden);
}

function setSection(section, options = {}) {
	if (!SECTIONS.includes(section)) section = "intro";
	state.section = section;

	dom.navButtons.forEach((button) => {
		button.classList.toggle("is-active", button.dataset.section === section);
	});

	if (!isProjectPage) {
		renderCopy();
	}

	if (options.updateHash !== false && !isProjectPage) {
		const hash = section === "intro" ? "" : `#${section}`;
		history.replaceState(null, "", `${window.location.pathname}${hash}`);
	}
}

function createSlide(project, translations) {
	const link = document.createElement("a");
	link.className = "project-card";

	const url = resolvePath(project.route);
	link.href = url;

	const img = document.createElement("img");
	img.src = resolvePath(project.cover);
	img.alt = translations.images?.[0]?.alt || translations.title || "Project cover";

	const overlay = document.createElement("figcaption");
	overlay.className = "project-overlay";

	const meta = document.createElement("div");
	meta.className = "project-meta";

	const title = document.createElement("span");
	title.className = "project-title";
	title.textContent = translations.title || project.id;

	const button = document.createElement("span");
	button.className = "project-btn";
	button.textContent = currentTranslations().nav?.viewProject || fallbackTranslations[state.lang].nav.viewProject;

	meta.appendChild(title);
	meta.appendChild(button);
	overlay.appendChild(meta);
	link.appendChild(img);
	link.appendChild(overlay);

	return link;
}

function buildCarousel() {
	if (!dom.trackEl || !Array.isArray(state.site.projects)) return;

	const translations = currentTranslations();
	const featuredProjects = state.site.projects.filter((project) => project.featured);

	dom.trackEl.innerHTML = "";
	featuredProjects.forEach((project) => {
		const projectTranslations = translations.projects?.[project.id];
		if (!projectTranslations) return;
		dom.trackEl.appendChild(createSlide(project, projectTranslations));
	});

	requestAnimationFrame(updateFeaturedCarouselFade);
}

function updateFeaturedCarouselFade() {
	if (!dom.carouselRoot || !dom.carouselViewport) return;

	const viewport = dom.carouselViewport;
	const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;
	const hasOverflow = maxScrollLeft > 1;
	const fadeDistance = Math.min(120, Math.max(40, viewport.clientWidth * 0.15));
	const scrollLeft = viewport.scrollLeft;
	const leftOpacity = hasOverflow ? Math.min(1, scrollLeft / fadeDistance) : 0;
	const rightOpacity = hasOverflow ? Math.min(1, (maxScrollLeft - scrollLeft) / fadeDistance) : 0;

	dom.carouselRoot.style.setProperty("--fade-left", leftOpacity.toFixed(3));
	dom.carouselRoot.style.setProperty("--fade-right", rightOpacity.toFixed(3));
}

function bindEvents() {
	dom.modeButtons.forEach((button) => {
		button.addEventListener("click", () => setMode(button.dataset.mode));
	});

	dom.langButtons.forEach((button) => {
		button.addEventListener("click", () => setLanguage(button.dataset.lang));
	});

	dom.brandButton?.addEventListener("click", () => {
		if (isProjectPage) {
			window.location.href = resolvePath("index.html");
			return;
		}
		setSection("intro");
	});

	dom.monogramButton?.addEventListener("click", () => {
		if (isProjectPage) {
			window.location.href = resolvePath("index.html");
			return;
		}
		setSection("intro");
	});

	dom.navButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const section = button.dataset.section || "intro";
			if (isProjectPage) {
				const hash = section === "skills" ? "#skills" : "";
				window.location.href = `${resolvePath("index.html")}${hash}`;
				return;
			}
			setSection(section);
			setMenuOpen(false);
		});
	});

	dom.burgerButton?.addEventListener("click", () => {
		const isOpen = document.body.classList.contains("menu-open");
		setMenuOpen(!isOpen);
	});

	dom.contactToggle?.addEventListener("click", () => {
		setContactMenuOpen(!isContactMenuOpen());
	});

	dom.contactMenu?.addEventListener("click", (event) => {
		if (event.target instanceof HTMLAnchorElement) {
			setContactMenuOpen(false);
		}
	});

	dom.mobileMenu?.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof HTMLElement)) return;
		if (target.closest("[data-section]") || target.closest("a")) {
			setMenuOpen(false);
		}
	});

	document.addEventListener("click", (event) => {
		if (!dom.mobileMenu || !dom.burgerButton) return;
		if (!document.body.classList.contains("menu-open")) return;
		const target = event.target;
		if (!(target instanceof HTMLElement)) return;
		if (dom.mobileMenu.contains(target) || dom.burgerButton.contains(target)) return;
		setMenuOpen(false);
	});

	document.addEventListener("click", (event) => {
		if (!dom.contactMenu || !dom.contactToggle) return;
		if (!isContactMenuOpen()) return;
		const target = event.target;
		if (!(target instanceof HTMLElement)) return;
		if (dom.contactMenu.contains(target) || dom.contactToggle.contains(target)) return;
		setContactMenuOpen(false);
	});

	document.addEventListener("focusin", (event) => {
		if (!dom.contactMenu || !dom.contactToggle) return;
		if (!isContactMenuOpen()) return;
		const target = event.target;
		if (!(target instanceof HTMLElement)) return;
		if (dom.contactMenu.contains(target) || dom.contactToggle.contains(target)) return;
		setContactMenuOpen(false);
	});

	window.addEventListener("keydown", (event) => {
		if (event.key !== "Escape") return;
		setMenuOpen(false);
		setContactMenuOpen(false);
	});

	window.addEventListener("resize", () => {
		if (window.innerWidth > 820) {
			setMenuOpen(false);
		}
	});

	window.addEventListener("hashchange", () => {
		if (!isProjectPage) {
			setSection(getSectionFromHash(), { updateHash: false });
		}
	});

	dom.carouselViewport?.addEventListener("scroll", updateFeaturedCarouselFade, { passive: true });
	window.addEventListener("resize", updateFeaturedCarouselFade);
}

async function loadJson(path, fallback) {
	try {
		const response = await fetch(resolvePath(path));
		if (!response.ok) {
			throw new Error(`Failed to load ${path}`);
		}
		return await response.json();
	} catch (error) {
		console.warn(error);
		return fallback;
	}
}

async function loadData() {
	const [site, eng, pt] = await Promise.all([
		loadJson("data/site.json", fallbackSite),
		loadJson("data/eng.json", fallbackTranslations.eng),
		loadJson("data/pt.json", fallbackTranslations.pt)
	]);

	state.site = site;
	state.translations.eng = eng;
	state.translations.pt = pt;
}

function initProjectCarousel() {
	const carousels = document.querySelectorAll("[data-project-carousel]");
	if (!carousels.length) return;

	let zoomOverlay;
	let overlayImg;
	let overlayIndicator;
	let overlaySlides = [];
	let overlayIndex = 0;
	let overlayInitialized = false;

	function closeOverlay() {
		if (!zoomOverlay) return;
		zoomOverlay.classList.remove("is-active");
		document.body.classList.remove("no-scroll");
	}

	function renderOverlay() {
		if (!zoomOverlay || !overlayImg || !overlaySlides.length) return;
		overlayImg.src = overlaySlides[overlayIndex];
		const showNavigation = overlaySlides.length > 1;
		zoomOverlay.classList.toggle("is-single", !showNavigation);
		if (overlayIndicator) {
			overlayIndicator.textContent = `${overlayIndex + 1}/${overlaySlides.length}`;
		}
	}

	function getOverlay() {
		if (zoomOverlay) return zoomOverlay;

		zoomOverlay = document.createElement("div");
		zoomOverlay.className = "carousel-zoom-overlay";

		overlayImg = document.createElement("img");
		zoomOverlay.appendChild(overlayImg);

		const prevBtn = document.createElement("button");
		prevBtn.className = "zoom-btn zoom-btn--prev";
		prevBtn.type = "button";
		prevBtn.textContent = "←";

		const nextBtn = document.createElement("button");
		nextBtn.className = "zoom-btn zoom-btn--next";
		nextBtn.type = "button";
		nextBtn.textContent = "→";

		overlayIndicator = document.createElement("span");
		overlayIndicator.className = "zoom-indicator";

		zoomOverlay.appendChild(prevBtn);
		zoomOverlay.appendChild(nextBtn);
		zoomOverlay.appendChild(overlayIndicator);

		const step = (delta) => {
			if (!overlaySlides.length) return;
			overlayIndex = (overlayIndex + delta + overlaySlides.length) % overlaySlides.length;
			renderOverlay();
		};

		prevBtn.addEventListener("click", (event) => {
			event.stopPropagation();
			step(-1);
		});

		nextBtn.addEventListener("click", (event) => {
			event.stopPropagation();
			step(1);
		});

		zoomOverlay.addEventListener("click", (event) => {
			if (event.target === zoomOverlay) closeOverlay();
		});

		document.body.appendChild(zoomOverlay);

		if (!overlayInitialized) {
			document.addEventListener("keydown", (event) => {
				if (!zoomOverlay?.classList.contains("is-active")) return;

				if (event.key === "Escape") {
					closeOverlay();
				} else if (event.key === "ArrowLeft") {
					event.preventDefault();
					step(-1);
				} else if (event.key === "ArrowRight") {
					event.preventDefault();
					step(1);
				}
			});
			overlayInitialized = true;
		}

		return zoomOverlay;
	}

	carousels.forEach((carousel) => {
		const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
		if (!slides.length) return;

		const currentEl = carousel.querySelector("[data-current]");
		const totalEl = carousel.querySelector("[data-total]");
		const controls = carousel.querySelectorAll("[data-direction]");
		const frame = carousel.querySelector("[data-frame]");
		let index = 0;

		if (totalEl) totalEl.textContent = String(slides.length);

		function render() {
			slides.forEach((slide, slideIndex) => {
				slide.classList.toggle("is-active", slideIndex === index);
			});
			if (currentEl) currentEl.textContent = String(index + 1);
		}

		controls.forEach((button) => {
			button.addEventListener("click", () => {
				const delta = button.dataset.direction === "prev" ? -1 : 1;
				index = (index + delta + slides.length) % slides.length;
				render();
			});
		});

		frame?.addEventListener("click", () => {
			const overlay = getOverlay();
			overlaySlides = slides.map((slide) => slide.querySelector("img")?.src).filter(Boolean);
			overlayIndex = index;
			renderOverlay();
			overlay.classList.add("is-active");
			document.body.classList.add("no-scroll");
		});

		render();
	});
}

async function init() {
	await loadData();

	renderHeader();
	cacheDom();
	bindEvents();
	updateContactLinks();
	setMode(state.mode);
	setLanguage(state.lang);
	setSection(state.section, { updateHash: false });
	initProjectCarousel();
}

init();
