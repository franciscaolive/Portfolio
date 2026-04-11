const awtfCarousel = {
    images: [
        "src/assets/images/projects/AWTF/AWTF.jpg",
        "src/assets/images/projects/AWTF/GATE.jpeg"
    ],
    imageEl: document.getElementById("awtf-main-image"),
    counterEl: document.getElementById("awtf-main-counter"),
    index: 0
};

const awtfLightbox = {
    root: document.getElementById("awtf-lightbox"),
    imageEl: document.getElementById("awtf-lightbox-image"),
    prevBtn: document.getElementById("awtf-lightbox-prev"),
    nextBtn: document.getElementById("awtf-lightbox-next"),
    closeBtn: document.getElementById("awtf-lightbox-close")
};

function renderAwtf() {
    const src = awtfCarousel.images[awtfCarousel.index];
    awtfCarousel.imageEl.src = src;
    awtfCarousel.counterEl.textContent = `${awtfCarousel.index + 1}/${awtfCarousel.images.length}`;

    if (awtfLightbox.root.classList.contains("is-open")) {
        awtfLightbox.imageEl.src = src;
    }
}

function shiftAwtf(direction) {
    const total = awtfCarousel.images.length;
    awtfCarousel.index = (awtfCarousel.index + direction + total) % total;
    renderAwtf();
}

function openAwtfLightbox() {
    awtfLightbox.imageEl.src = awtfCarousel.images[awtfCarousel.index];
    awtfLightbox.root.classList.add("is-open");
    awtfLightbox.root.setAttribute("aria-hidden", "false");
}

function closeAwtfLightbox() {
    awtfLightbox.root.classList.remove("is-open");
    awtfLightbox.root.setAttribute("aria-hidden", "true");
}

function bindAwtf() {
    document.querySelector('[data-carousel-prev="awtf-main"]').addEventListener("click", () => shiftAwtf(-1));
    document.querySelector('[data-carousel-next="awtf-main"]').addEventListener("click", () => shiftAwtf(1));
    document.querySelector('[data-carousel-open="awtf-main"]').addEventListener("click", openAwtfLightbox);

    awtfLightbox.prevBtn.addEventListener("click", () => shiftAwtf(-1));
    awtfLightbox.nextBtn.addEventListener("click", () => shiftAwtf(1));
    awtfLightbox.closeBtn.addEventListener("click", closeAwtfLightbox);

    awtfLightbox.root.addEventListener("click", (event) => {
        if (event.target === awtfLightbox.root) {
            closeAwtfLightbox();
        }
    });

    window.addEventListener("keydown", (event) => {
        if (!awtfLightbox.root.classList.contains("is-open")) {
            return;
        }

        if (event.key === "Escape") {
            closeAwtfLightbox();
            return;
        }

        if (event.key === "ArrowLeft") {
            shiftAwtf(-1);
        }

        if (event.key === "ArrowRight") {
            shiftAwtf(1);
        }
    });
}

if (awtfCarousel.imageEl && awtfCarousel.counterEl && awtfLightbox.root) {
    renderAwtf();
    bindAwtf();
}
