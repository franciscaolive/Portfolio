const qmvvCarousels = {
    main: {
        images: [
            "src/assets/images/projects/QMV2/1.png",
            "src/assets/images/projects/QMV2/2.png",
            "src/assets/images/projects/QMV2/3.png",
            "src/assets/images/projects/QMV2/4.png",
            "src/assets/images/projects/QMV2/5.png",
            "src/assets/images/projects/QMV2/6.png",
            "src/assets/images/projects/QMV2/7.png",
            "src/assets/images/projects/QMV2/8.png"
        ],
        imageEl: document.getElementById("qmvv-main-image"),
        counterEl: document.getElementById("qmvv-main-counter"),
        index: 0
    },
    process: {
        images: [
            "src/assets/images/projects/QMV2/esbocos+processo/processo1.png",
            "src/assets/images/projects/QMV2/esbocos+processo/processo2.png",
            "src/assets/images/projects/QMV2/esbocos+processo/processo3.png",
            "src/assets/images/projects/QMV2/esbocos+processo/processo4.png"
        ],
        imageEl: document.getElementById("qmvv-process-image"),
        counterEl: document.getElementById("qmvv-process-counter"),
        index: 0
    }
};

const lightbox = {
    root: document.getElementById("qmvv-lightbox"),
    imageEl: document.getElementById("qmvv-lightbox-image"),
    prevBtn: document.getElementById("qmvv-lightbox-prev"),
    nextBtn: document.getElementById("qmvv-lightbox-next"),
    closeBtn: document.getElementById("qmvv-lightbox-close"),
    activeCarousel: null
};

function renderCarousel(name) {
    const carousel = qmvvCarousels[name];
    if (!carousel || !carousel.imageEl || !carousel.counterEl) {
        return;
    }

    const src = carousel.images[carousel.index];
    carousel.imageEl.src = src;
    carousel.counterEl.textContent = `${carousel.index + 1}/${carousel.images.length}`;

    if (lightbox.activeCarousel === name && lightbox.root.classList.contains("is-open")) {
        lightbox.imageEl.src = src;
    }
}

function shiftCarousel(name, direction) {
    const carousel = qmvvCarousels[name];
    if (!carousel) {
        return;
    }

    const total = carousel.images.length;
    carousel.index = (carousel.index + direction + total) % total;
    renderCarousel(name);
}

function openLightbox(name) {
    const carousel = qmvvCarousels[name];
    if (!carousel) {
        return;
    }

    lightbox.activeCarousel = name;
    lightbox.imageEl.src = carousel.images[carousel.index];
    lightbox.root.classList.add("is-open");
    lightbox.root.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
    lightbox.root.classList.remove("is-open");
    lightbox.root.setAttribute("aria-hidden", "true");
    lightbox.activeCarousel = null;
}

function bindCarouselControls() {
    document.querySelectorAll("[data-carousel-prev]").forEach((button) => {
        button.addEventListener("click", () => {
            shiftCarousel(button.dataset.carouselPrev, -1);
        });
    });

    document.querySelectorAll("[data-carousel-next]").forEach((button) => {
        button.addEventListener("click", () => {
            shiftCarousel(button.dataset.carouselNext, 1);
        });
    });

    document.querySelectorAll("[data-carousel-open]").forEach((button) => {
        button.addEventListener("click", () => {
            openLightbox(button.dataset.carouselOpen);
        });
    });
}

function bindLightbox() {
    lightbox.prevBtn.addEventListener("click", () => {
        if (lightbox.activeCarousel) {
            shiftCarousel(lightbox.activeCarousel, -1);
        }
    });

    lightbox.nextBtn.addEventListener("click", () => {
        if (lightbox.activeCarousel) {
            shiftCarousel(lightbox.activeCarousel, 1);
        }
    });

    lightbox.closeBtn.addEventListener("click", closeLightbox);

    lightbox.root.addEventListener("click", (event) => {
        if (event.target === lightbox.root) {
            closeLightbox();
        }
    });

    window.addEventListener("keydown", (event) => {
        if (!lightbox.root.classList.contains("is-open")) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
            return;
        }

        if (!lightbox.activeCarousel) {
            return;
        }

        if (event.key === "ArrowLeft") {
            shiftCarousel(lightbox.activeCarousel, -1);
        }

        if (event.key === "ArrowRight") {
            shiftCarousel(lightbox.activeCarousel, 1);
        }
    });
}

function initQmvv() {
    Object.keys(qmvvCarousels).forEach((name) => renderCarousel(name));
    bindCarouselControls();
    bindLightbox();
}

if (document.getElementById("qmvv-main-image")) {
    initQmvv();
}
