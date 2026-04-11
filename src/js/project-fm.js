const fmCarousel = {
    images: [
        "src/assets/images/projects/FM/1.png",
        "src/assets/images/projects/FM/2.png",
        "src/assets/images/projects/FM/3.png",
        "src/assets/images/projects/FM/4.png",
        "src/assets/images/projects/FM/5.png",
        "src/assets/images/projects/FM/6.png",
        "src/assets/images/projects/FM/7.png",
        "src/assets/images/projects/FM/8.png"
    ],
    imageEl: document.getElementById("fm-main-image"),
    counterEl: document.getElementById("fm-main-counter"),
    index: 0
};

const fmLightbox = {
    root: document.getElementById("fm-lightbox"),
    imageEl: document.getElementById("fm-lightbox-image"),
    prevBtn: document.getElementById("fm-lightbox-prev"),
    nextBtn: document.getElementById("fm-lightbox-next"),
    closeBtn: document.getElementById("fm-lightbox-close")
};

function renderFm() {
    const src = fmCarousel.images[fmCarousel.index];
    fmCarousel.imageEl.src = src;
    fmCarousel.counterEl.textContent = `${fmCarousel.index + 1}/${fmCarousel.images.length}`;

    if (fmLightbox.root.classList.contains("is-open")) {
        fmLightbox.imageEl.src = src;
    }
}

function shiftFm(direction) {
    const total = fmCarousel.images.length;
    fmCarousel.index = (fmCarousel.index + direction + total) % total;
    renderFm();
}

function openFmLightbox() {
    fmLightbox.imageEl.src = fmCarousel.images[fmCarousel.index];
    fmLightbox.root.classList.add("is-open");
    fmLightbox.root.setAttribute("aria-hidden", "false");
}

function closeFmLightbox() {
    fmLightbox.root.classList.remove("is-open");
    fmLightbox.root.setAttribute("aria-hidden", "true");
}

function bindFm() {
    document.querySelector('[data-carousel-prev="fm-main"]').addEventListener("click", () => shiftFm(-1));
    document.querySelector('[data-carousel-next="fm-main"]').addEventListener("click", () => shiftFm(1));
    document.querySelector('[data-carousel-open="fm-main"]').addEventListener("click", openFmLightbox);

    fmLightbox.prevBtn.addEventListener("click", () => shiftFm(-1));
    fmLightbox.nextBtn.addEventListener("click", () => shiftFm(1));
    fmLightbox.closeBtn.addEventListener("click", closeFmLightbox);

    fmLightbox.root.addEventListener("click", (event) => {
        if (event.target === fmLightbox.root) {
            closeFmLightbox();
        }
    });

    window.addEventListener("keydown", (event) => {
        if (!fmLightbox.root.classList.contains("is-open")) {
            return;
        }

        if (event.key === "Escape") {
            closeFmLightbox();
            return;
        }

        if (event.key === "ArrowLeft") {
            shiftFm(-1);
        }

        if (event.key === "ArrowRight") {
            shiftFm(1);
        }
    });
}

if (fmCarousel.imageEl && fmCarousel.counterEl && fmLightbox.root) {
    renderFm();
    bindFm();
}
