const projectTranslations = {
  //portugues
  pt: {
    //kit
    proj1: {
      title: "Kit de Sobrevivência ao Ensino Superior",
      subtitle:
        "Tudo que um estudante precisa de saber para uma carreira universitária de sucesso!",
      paragraphs: ["explicação"],
    },
    //jenkins
    proj2: {
      title: "Jenkins/5 Shades of Pink",
      subtitle: "",
      paragraphs: ["explicação"],
    },
    //dressup
    proj3: {
      title: "Dress Up Game",
      subtitle: "Escolhe o teu estilo!",
      paragraphs: ["explicação"],
    },
    //curta
    proj4: {
      title: "Ímpeto de Voar",
      subtitle:
        "Liberdade é um conceito difícil de definir. <em>Ímpeto de Voar</em> tenta capturar o momento em que nos sentimos no topo do mundo, sem preocupações ou limites, com a adrenalina a correr-nos pelas veias. É a ausência de qualquer coação externa, a plena autonomia do ser humano, capaz de agir sem receio.",
      paragraphs: ["explicação"],
    },
    //afterglow
    proj5: {
      title: "afterglow",
      subtitle: "",
      paragraphs: ["explicação"],
    },
    //ciclo obscuro
    proj6: {
      title: "Ciclo Obscuro",
      subtitle: "A última aventura de duas amigas...",
      paragraphs: ["explicação"],
    },
  },
  //ingles
  en: {
    //kit
    proj1: {
      title: "Survival Guide to College",
      subtitle:
        "Everything a student needs to know for a successful college experience!",
      paragraphs: ["explanation"],
    },
    //jenkins
    proj2: {
      title: "Jenkins/5 Shades of Pink",
      subtitle: "",
      paragraphs: ["explanation"],
    },
    //dressup
    proj3: {
      title: "Dress Up Game",
      subtitle: "Choose your style!",
      paragraphs: ["explanation"],
    },
    //curta
    proj4: {
      title: "Ímpeto de Voar",
      subtitle:
        "Freedom is a difficult concept to define. <em>Ímpeto de Voar</em> tries to capture the moment when we feel on top of the world, without worries or limits, with adrenaline running through our veins. It is the absence of any external coercion, the full autonomy of the human being, capable of acting without fear.",
      paragraphs: ["explanation"],
    },
    //afterglow
    proj5: {
      title: "afterglow",
      subtitle: "",
      paragraphs: ["explanation"],
    },
    //ciclo obscuro
    proj6: {
      title: "Ciclo Obscuro",
      subtitle: "The last adventure of two friends...",
      paragraphs: ["explanation"],
    },
  },
};

function getProjectContent(projectId) {
  const lang = localStorage.getItem("language") || "pt";
  return (
    projectTranslations[lang][projectId] || projectTranslations.pt[projectId]
  );
}

function updateProjectPage(projectId) {
  const content = getProjectContent(projectId);

  const titleEl = document.querySelector(".project-header h1");
  if (titleEl) titleEl.innerHTML = content.title;

  const subtitleEl = document.querySelector(".project-subtitle");
  if (subtitleEl && content.subtitle) {
    subtitleEl.innerHTML = content.subtitle;
  }

  const descriptionEl = document.querySelector(".project-description");
  if (descriptionEl && content.paragraphs) {
    descriptionEl.innerHTML = content.paragraphs
      .map((p) => `<p>${p}</p>`)
      .join("");
  }
}

window.addEventListener("languageChanged", () => {
  const projectId = document.body.dataset.projectId;
  if (projectId) {
    updateProjectPage(projectId);
  }
});
