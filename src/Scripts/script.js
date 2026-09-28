const projects = [
	{
		title: "web development",
		year: "2026",
		image: "../Assets/Images/Projects/WebDevCover.png",
		url: "https://franciscaolive.github.io/T1/",
		description: "collection of websites"
	},
	{
		title: "project two",
		year: "2026",
		image: "../Assets/Images/Projects/Placeholder1.jpg",
		url: "https://eduardo-hora.github.io/Portfolio/",
		description: "portfolio website"
	},
	{
		title: "project three",
		year: "2026",
		image: "../Assets/Images/Projects/Placeholder3.jpg",
		url: "https://diana-coelho.github.io/Portfolio/",
		description: "portfolio website"
	},
	{
		title: "project four",
		year: "2026",
		image: "../Assets/Images/Projects/Placeholder4.jpg",
		url: "https://ahliyah-luna.github.io/Portfolio/",
		description: "portfolio website"
	},
	{
		title: "project five",
		year: "2026",
		image: "../Assets/Images/Projects/Placeholder1.jpg",
		url: "https://joana-p-pinto.github.io/Joana-Portfolio/",
		description: "portfolio website"
	}
];

const projectList = document.querySelector("[data-project-list]");
const projectFrame = document.querySelector("[data-project-frame]");
const projectStatus = document.querySelector("[data-project-status]");
const projectOpenLink = document.querySelector("[data-project-open]");
const projectDescription = document.querySelector("[data-project-description]");
const previousButton = document.querySelector("[data-project-previous]");
const nextButton = document.querySelector("[data-project-next]");

if (projectList && projectFrame) {
	let activeProject = 0;

	projects.forEach((project, index) => {
		const projectLink = document.createElement("button");
		projectLink.className = "project-card";
		projectLink.type = "button";
		projectLink.dataset.projectIndex = index;
		projectLink.innerHTML = `
			<img src="${project.image}" alt="">
			<span>${project.title} (${project.year}) - ${project.description}</span>
		`;
		projectLink.addEventListener("click", () => showProject(index));
		projectList.append(projectLink);
	});

	function showProject(index) {
		activeProject = (index + projects.length) % projects.length;
		const project = projects[activeProject];

		projectFrame.src = project.url;
		projectOpenLink.href = project.url;
		projectDescription.textContent = `${project.title} (${project.year}) - ${project.description}`;
		projectStatus.textContent = `Loading ${project.title}`;
		projectStatus.classList.remove("is-loaded");

		document.querySelectorAll("[data-project-index]").forEach((card, cardIndex) => {
			card.classList.toggle("is-selected", cardIndex === activeProject);
			card.setAttribute("aria-pressed", cardIndex === activeProject);
		});
	}

	projectFrame.addEventListener("load", () => {
		projectStatus.textContent = "Live preview";
		projectStatus.classList.add("is-loaded");
	});

	previousButton.addEventListener("click", () => showProject(activeProject - 1));
	nextButton.addEventListener("click", () => showProject(activeProject + 1));

	document.addEventListener("keydown", (event) => {
		if (event.key === "ArrowLeft") showProject(activeProject - 1);
		if (event.key === "ArrowRight") showProject(activeProject + 1);
	});

	showProject(0);
}
