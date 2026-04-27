const state = {
    lang: "en",
    theme: "light",
    copy: {
        en: null,
        pt: null
    }
};

const THEME_STORAGE_KEY = "fm-theme";
const LANG_STORAGE_KEY = "fm-lang";
const COPY_VERSION = "2026-04-11";

const refs = {
    body: document.body,
    fmIcon: document.getElementById("fm-icon"),
    themeButtons: Array.from(document.querySelectorAll("[data-theme-choice]")),
    langButtons: Array.from(document.querySelectorAll("[data-lang-choice]")),
    searchButton: document.querySelector(".search-trigger"),
    intro1: document.getElementById("intro-1"),
    intro2: document.getElementById("intro-2"),
    skillsTitle: document.getElementById("skills-title"),
    skillsDesign: document.getElementById("skills-design"),
    skillsDevelopment: document.getElementById("skills-development"),
    skillsMotion: document.getElementById("skills-motion"),
    skills3d: document.getElementById("skills-3d"),
    skillsGamedev: document.getElementById("skills-gamedev"),
    contactTitle: document.getElementById("contact-title"),
    contactEmailLabel: document.getElementById("contact-email-label"),
    contactEmail: document.getElementById("contact-email"),
    contactGithubLabel: document.getElementById("contact-github-label"),
    contactGithub: document.getElementById("contact-github"),
    contactLinkedinLabel: document.getElementById("contact-linkedin-label"),
    contactLinkedin: document.getElementById("contact-linkedin"),
    contactCv: document.getElementById("contact-cv"),
    projectBackLinks: Array.from(document.querySelectorAll(".project-back"))
};

function splitContactLine(line) {
    const [label = "", handle = ""] = line.split("・").map((part) => part.trim());
    return {
        label: label ? `${label} ・ ` : "",
        handle: handle || line
    };
}

function toSocialUrl(platform, handle) {
    const normalized = handle.trim().replace(/^@/, "");
    if (/^https?:\/\//i.test(normalized)) {
        return normalized;
    }

    if (platform === "github") {
        return `https://github.com/${normalized}`;
    }

    if (platform === "linkedin") {
        return `https://www.linkedin.com/in/${normalized.replace(/\/+$/, "")}/`;
    }

    return "#";
}

function applyHighlight(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<span class="text-highlight">$1</span>');
}

function resolveFromBase(path) {
    return new URL(path, document.baseURI).toString();
}

function setFaviconHref() {
    const faviconLink = document.querySelector('link[rel="icon"]');
    if (!faviconLink) {
        return;
    }

    faviconLink.href = resolveFromBase("src/assets/images/icons/Favicon.png");
}

function setTheme(theme) {
    state.theme = theme;
    refs.body.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    refs.fmIcon.src = theme === "dark"
        ? resolveFromBase("src/assets/images/icons/FMIconWhite.png")
        : resolveFromBase("src/assets/images/icons/FMIconBlack.png");

    refs.themeButtons.forEach((button) => {
        const isActive = button.dataset.themeChoice === theme;
        button.classList.toggle("is-active", isActive);
    });
}

function setLang(lang) {
    state.lang = lang;
    refs.body.dataset.lang = lang;
    localStorage.setItem(LANG_STORAGE_KEY, lang);

    refs.langButtons.forEach((button) => {
        const isActive = button.dataset.langChoice === lang;
        button.classList.toggle("is-active", isActive);
    });

    renderCopy();
}

function renderCopy() {
    const t = state.copy[state.lang];
    if (!t) {
        return;
    }

    refs.intro1.innerHTML = applyHighlight(t.intro1);
    refs.intro2.innerHTML = applyHighlight(t.intro2);

    refs.skillsTitle.textContent = t.skillsTitle;
    refs.skillsDesign.innerHTML = applyHighlight(t.skillsDesign);
    refs.skillsDevelopment.innerHTML = applyHighlight(t.skillsDevelopment);
    refs.skillsMotion.innerHTML = applyHighlight(t.skillsMotion);
    refs.skills3d.innerHTML = applyHighlight(t.skills3d);
    refs.skillsGamedev.innerHTML = applyHighlight(t.skillsGamedev);

    refs.contactTitle.textContent = t.contactTitle;
    const emailLine = splitContactLine(t.contactEmail);
    const githubLine = splitContactLine(t.contactGithub);
    const linkedinLine = splitContactLine(t.contactLinkedin);

    refs.contactEmailLabel.textContent = emailLine.label;
    refs.contactEmail.textContent = emailLine.handle;
    refs.contactGithubLabel.textContent = githubLine.label;
    refs.contactGithub.textContent = githubLine.handle;
    refs.contactGithub.href = toSocialUrl("github", githubLine.handle);
    refs.contactLinkedinLabel.textContent = linkedinLine.label;
    refs.contactLinkedin.textContent = 'francisca-mir';
    refs.contactLinkedin.href = 'https://www.linkedin.com/in/francisca-miranda-18702b347/';
    refs.contactCv.textContent = t.contactCv;
    refs.contactCv.href = t.contactCvHref;

    const projectBackLabel = state.lang === "pt"
        ? "Voltar ao Portfólio"
        : (t.projectBack || "Back to Portfolio");

    refs.projectBackLinks.forEach((link) => {
        link.textContent = projectBackLabel;
    });

    document.documentElement.lang = state.lang;
}

async function loadCopy() {
    const [enResponse, ptResponse] = await Promise.all([
        fetch(`src/data/en.json?v=${COPY_VERSION}`, { cache: "no-store" }),
        fetch(`src/data/pt.json?v=${COPY_VERSION}`, { cache: "no-store" })
    ]);

    state.copy.en = await enResponse.json();
    state.copy.pt = await ptResponse.json();
}

function bindEvents() {
    refs.themeButtons.forEach((button) => {
        button.addEventListener("click", () => setTheme(button.dataset.themeChoice));
    });

    refs.langButtons.forEach((button) => {
        button.addEventListener("click", () => setLang(button.dataset.langChoice));
    });

    if (refs.searchButton) {
        refs.searchButton.addEventListener("click", () => {
            window.location.href = "src/projects/tags.html";
        });
    }
}

function getInitialTheme() {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
    }

    return state.theme;
}

function getInitialLang() {
    const storedLang = localStorage.getItem(LANG_STORAGE_KEY);
    if (storedLang === "en" || storedLang === "pt") {
        return storedLang;
    }

    return state.lang;
}

function optimizeThumbnailLoading() {
    const firstProjectImage = document.querySelector(".project-card img");
    if (firstProjectImage) {
        firstProjectImage.loading = "eager";
        firstProjectImage.decoding = "async";
        firstProjectImage.fetchPriority = "high";
    }

    document.querySelectorAll(".project-card img, .finder-preview-card img").forEach((img) => {
        if (img !== firstProjectImage) {
            img.loading = "lazy";
        }

        if (!img.decoding) {
            img.decoding = "async";
        }
    });
}

async function init() {
    bindEvents();
    optimizeThumbnailLoading();
    setFaviconHref();

    try {
        await loadCopy();
    } catch (error) {
        console.error("Unable to load data files.", error);
    }

    setTheme(getInitialTheme());
    setLang(getInitialLang());
}

init();
