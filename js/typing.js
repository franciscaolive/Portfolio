class TypeWriter {
  constructor(element, texts, speed = 100, deleteSpeed = 50, pauseTime = 2000) {
    this.element = element;
    this.texts = texts;
    this.speed = speed;
    this.deleteSpeed = deleteSpeed;
    this.pauseTime = pauseTime;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.type();
  }

  type() {
    const currentText = this.texts[this.textIndex];

    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;

    if (!this.isDeleting && this.charIndex === currentText.length) {
      //remove cursor when typing is complete
      this.element.classList.add("typing-complete");
      return;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const typingElement = document.querySelector(".typing-text");
  if (typingElement) {
    const lang = localStorage.getItem("language") || "pt";

    //seleciona a animação baseada na lingua escolhida
    const textsByLanguage = {
      pt: ["olá, sou a francisca!"],
      en: ["hi, francisca here!"],
    };

    const texts = textsByLanguage[lang] || textsByLanguage.pt;

    new TypeWriter(typingElement, texts, 100, 50, 2000);
  }

  //atualiza animação se trocar a lingua
  window.addEventListener("storage", (e) => {
    if (e.key === "language") {
      location.reload();
    }
  });
});
