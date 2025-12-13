const translations = {
  //portugues
  pt: {
    about: "Sobre mim",
    projects: "Projetos",
    eng: "ENG",

    greeting: "Olá!",
    welcome: "Bem vindo.",
    heroSub: "designer e desenvolvedora",
    heroDesc:
      "Sou do Porto, Portugal, e estou atualmente a tirar o meu Mestrado na FEUP, em Multimédia.",
    seeProjects: "Ver Projetos",

    aboutTitle: "sobre mim",
    projectsTitle: "projetos",
    gradYear: "2025 - Presente",
    gradTitle: "Mestrado em Multimédia",
    gradInstitution: "Faculdade de Engenharia da Universidade do Porto",
    bachelorYear: "2022 - 2025",
    bachelorTitle: "Licenciatura em Multimédia",
    bachelorInstitution:
      "Escola Superior de Media Artes e Design, Politécnico do Porto",
    highschoolYear: "2019 - 2022",
    highschoolTitle: "Ensino Secundário",
    highschoolInstitution:
      "Escola Secundária de Rocha Peixoto, Póvoa de Varzim",
    helloName: "Olá! Sou a Francisca!",
    intro1:
      "Sou uma pessoa criativa e proativa, com um gosto especial por desenvolvimento de jogos, desenvolvimento web, design, ilustração e cinema.",
    intro2:
      "Tirei a minha Licenciatura em Multimédia na Escola Superior de Media Artes e Design, do Politécnico do Porto.",
    intro3:
      "De momento estou a tirar o meu Mestrado em Multimédia na Faculdade de Engenharia da Universidade do Porto.",
    image: "Imagem: Adobe Illustrator, InDesign e Photoshop, Procreate, Figma.",
    video: "Vídeo: Adobe After Effects, Adobe Premiere Pro.",
    "3d": "3D: Autodesk Maya e Motion Builder, Blender.",
    games: "Jogos: Unity, Godot.",
    videoTitle: "Vídeo:",
    gamesTitle: "Jogos:",
    codeTitle: "Desenvolvimento:",
    markupLang: "Linguagens de Marcação: HTML, CSS.",
    codeLang: "Linguagens de Programação: Java, JavaScript, C#, GDScript.",
    arduino: "Arduino IDE.",

    viewProject: "Ver Projeto",
    kitSurvival: "Kit de Sobrevivência",
    jenkins: "Jenkins/5 Shades of Pink",
    dressUp: "Dress-Up Game",
    impeto: "Ímpeto de Voar",
    afterglow: "afterglow",
    ciclo: "Ciclo Obscuro",
    glitch: "GLITCH BOX",

    back: "Voltar",

    home: "Início",
    footer: "© 2025 | Francisca Miranda | franciscaolivmir@gmail.com",
  },
  //ingles
  en: {
    about: "about me",
    projects: "projects",
    eng: "PT",

    greeting: "Hello!",
    welcome: "Welcome.",
    heroSub: "designer & developer",
    heroDesc:
      "I'm from Porto, Portugal, and I'm currently pursuing my Master's degree in Multimedia at FEUP.",
    seeProjects: "See Projects",

    aboutTitle: "about me",
    projectsTitle: "projects",
    gradYear: "2025 - Present",
    gradTitle: "Master's Degree in Multimedia",
    gradInstitution: "Faculty of Engineering, University of Porto",
    bachelorYear: "2022 - 2025",
    bachelorTitle: "Bachelor's Degree in Multimedia",
    bachelorInstitution:
      "School of Media Arts and Design, Polytechnic of Porto",
    highschoolYear: "2019 - 2022",
    highschoolTitle: "High School",
    highschoolInstitution: "Rocha Peixoto Secondary School, Póvoa de Varzim",
    helloName: "Hello! I'm Francisca!",
    intro1:
      "I'm a creative and proactive person with a passion for game development, web development, design, illustration, and cinema.",
    intro2:
      "I earned my Bachelor's degree in Multimedia from ESMAD – Escola Superior de Media Artes e Design, at Instituto Politécnico do Porto.",
    intro3:
      "Right now, I'm pursuing a Master's degree in Multimedia at FEUP – Faculdade de Engenharia da Universidade do Porto, at Universidade do Porto.",
    image:
      "Image: Adobe Illustrator, InDesign, and Photoshop, Procreate, Figma.",
    video: "Video: Adobe After Effects, Adobe Premiere Pro.",
    "3d": "3D: Autodesk Maya and Motion Builder, Blender.",
    games: "Games: Unity.",
    videoTitle: "Video:",
    gamesTitle: "Games:",
    codeTitle: "Code:",
    markupLang: "Markup languages: HTML, CSS.",
    codeLang: "Coding languages: Java, JavaScript, C#.",
    arduino: "Arduino IDE.",

    viewProject: "View Project",
    kitSurvival: "Kit de Sobrevivência",
    jenkins: "Jenkins/5 Shades of Pink",
    dressUp: "Dress-Up Game",
    impeto: "Ímpeto de Voar",
    afterglow: "afterglow",
    ciclo: "Ciclo Obscuro",
    glitch: "GLITCH BOX",

    back: "Back",

    home: "Home",
    footer: "© 2025 | Francisca Miranda | franciscaolivmir@gmail.com",
  },
};

function getBasePath() {
  const path = window.location.pathname;

  let depth = 0;

  if (path.includes("projectpages/") || path.includes("projectpageseng/")) {
    depth = 2;
  } else if (path.includes("/english/") || path.includes("/portugues/")) {
    depth = 1;
  }

  return depth > 0 ? "../".repeat(depth) : "./";
}

const pageMap = {
  about: {
    pt: "portugues/about.html",
    en: "english/aboutenglish.html",
  },
  projects: {
    pt: "portugues/design.html",
    en: "english/aboutgallery.html",
  },
  home: {
    pt: "index.html",
    en: "index.html",
  },
};

function t(key) {
  const lang = localStorage.getItem("language") || "pt";
  const actualKey = key === "3d" ? "3d" : key;
  return translations[lang]?.[actualKey] || key;
}

function setLanguage(lang) {
  localStorage.setItem("language", lang);
  location.reload();
}

function getCurrentLanguage() {
  return localStorage.getItem("language") || "pt";
}

function updatePageContent() {
  const lang = getCurrentLanguage();
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = t(key);
  });

  updateNavigationLinks();

  updateLanguageSwitcher();
}

function updateNavigationLinks() {
  const homeLink = document.querySelector("a.header-name");
  if (homeLink) {
    const hrefAttr = homeLink.getAttribute("href");
    if (!hrefAttr || !hrefAttr.includes("../")) {
      homeLink.href = "#intro";
    }
  }
}

function updateLanguageSwitcher() {
  const lang = getCurrentLanguage();
  const buttons = document.querySelectorAll("[data-lang]");
  buttons.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.getAttribute("data-lang") === lang) {
      btn.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  updatePageContent();
});
