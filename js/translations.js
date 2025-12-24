const translations = {
  pt: {
    about: "Sobre mim",
    projects: "Projetos",
    eng: "ENG",
    heroSub: "designer e desenvolvedora",
    aboutTitle: "sobre mim",
    projectsTitle: "projetos",
    gradYear: "2025 - Presente",
    gradTitle: "Mestrado em Multimédia",
    gradInstitution: "Faculdade de Engenharia da Universidade do Porto - FEUP",
    bachelorYear: "2022 - 2025",
    bachelorTitle: "Licenciatura em Multimédia",
    bachelorInstitution:
      "Escola Superior de Media Artes e Design, Politécnico do Porto - ESMAD",
    highschoolYear: "2019 - 2022",
    highschoolTitle: "Ensino Secundário",
    highschoolInstitution:
      "Escola Secundária de Rocha Peixoto, Póvoa de Varzim",
    videoTitle: "Vídeo:",
    gamesTitle: "Jogos:",
    codeTitle: "Desenvolvimento:",
    viewProject: "Ver Projeto",
    footer: "© 2025 | Francisca Miranda | franciscaolivmir@gmail.com",
    highlight1: "Destaque 1",
    highlightDesc1: "descrição",
    highlight2: "Destaque 2",
    highlightDesc2: "descrição",
    highlight3: "Destaque 3",
    highlightDesc3: "descrição",
    highlight4: "Destaque 4",
    highlightDesc4: "descrição",
    project1: "Projeto 1",
    project2: "Projeto 2",
    project3: "Projeto 3",
    project4: "Projeto 4",
    project5: "Projeto 5",
    project6: "Projeto 6",
  },
  en: {
    about: "about me",
    projects: "projects",
    eng: "PT",
    heroSub: "designer & developer",
    aboutTitle: "about me",
    projectsTitle: "projects",
    gradYear: "2025 - Present",
    gradTitle: "Master's Degree in Multimedia",
    gradInstitution: "Faculty of Engineering, University of Porto - FEUP",
    bachelorYear: "2022 - 2025",
    bachelorTitle: "Bachelor's Degree in Multimedia",
    bachelorInstitution:
      "School of Media Arts and Design, Polytechnic of Porto - ESMAD",
    highschoolYear: "2019 - 2022",
    highschoolTitle: "High School",
    highschoolInstitution: "Rocha Peixoto Secondary School, Póvoa de Varzim",
    videoTitle: "Video:",
    gamesTitle: "Games:",
    codeTitle: "Code:",
    viewProject: "View Project",
    footer: "© 2025 | Francisca Miranda | franciscaolivmir@gmail.com",
    highlight1: "Highlight 1",
    highlightDesc1: "description",
    highlight2: "Highlight 2",
    highlightDesc2: "description",
    highlight3: "Highlight 3",
    highlightDesc3: "description",
    highlight4: "Highlight 4",
    highlightDesc4: "description",
    project1: "Project 1",
    project2: "Project 2",
    project3: "Project 3",
    project4: "Project 4",
    project5: "Project 5",
    project6: "Project 6",
  },
};

function t(key) {
  const lang = localStorage.getItem("language") || "pt";
  return translations[lang]?.[key] || key;
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

  updateLanguageSwitcher();
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
