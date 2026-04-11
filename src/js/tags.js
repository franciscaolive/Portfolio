const sectionTargets = {
    genre: document.getElementById("genre-list"),
    program: document.getElementById("program-list")
};

let tagsData = null;

function getCurrentLang() {
    const lang = document.body.dataset.lang;
    return lang === "pt" ? "pt" : "en";
}

function createPreviewCard(project, lang) {
    const link = document.createElement("a");
    link.className = "finder-preview-card";
    link.href = project.href;

    const img = document.createElement("img");
    img.src = project.image;
    img.alt = project.title[lang];

    const title = document.createElement("strong");
    title.textContent = project.title[lang];

    link.append(img, title);
    return link;
}

function createFinderItem(tag, lang, projectMap) {
    const article = document.createElement("article");
    article.className = "finder-item";

    const trigger = document.createElement("button");
    trigger.className = "finder-trigger";
    trigger.type = "button";
    trigger.setAttribute("aria-expanded", "false");

    const label = document.createElement("span");
    label.textContent = tag.label[lang] || tag.label.en;

    const count = document.createElement("em");
    count.className = "finder-count";
    count.textContent = `(${tag.projects.length})`;

    trigger.append(label, count);

    const panel = document.createElement("div");
    panel.className = "finder-panel";

    const previewGrid = document.createElement("div");
    previewGrid.className = "finder-preview-grid";

    tag.projects.forEach((projectId) => {
        const project = projectMap[projectId];
        if (project) {
            previewGrid.appendChild(createPreviewCard(project, lang));
        }
    });

    panel.appendChild(previewGrid);

    trigger.addEventListener("click", () => {
        const expanded = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", String(!expanded));
        panel.classList.toggle("is-open", !expanded);
    });

    article.append(trigger, panel);
    return article;
}

function renderSections() {
    if (!tagsData) {
        return;
    }

    const lang = getCurrentLang();
    const projectMap = tagsData.projects;

    Object.entries(sectionTargets).forEach(([sectionKey, container]) => {
        if (!container) {
            return;
        }

        container.innerHTML = "";
        const section = tagsData.sections[sectionKey] || [];

        section.forEach((tag) => {
            container.appendChild(createFinderItem(tag, lang, projectMap));
        });
    });
}

async function initTags() {
    try {
        const response = await fetch("src/data/tags.json?v=2026-04-11", { cache: "no-store" });
        tagsData = await response.json();
        renderSections();

        document.querySelectorAll("[data-lang-choice]").forEach((button) => {
            button.addEventListener("click", () => {
                requestAnimationFrame(renderSections);
            });
        });
    } catch (error) {
        console.error("Unable to load tags data.", error);
    }
}

initTags();
