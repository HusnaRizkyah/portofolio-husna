/* ==========================================================================
   HUSNA RIZKYAH PORTFOLIO — COMPLETE JAVASCRIPT
   Simpan sebagai: js/script.js
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  // LIGHT & DARK MODE
  const themeToggle = document.querySelector(".theme-toggle");
  const themeIcon = document.querySelector(".theme-icon");
  const root = document.documentElement;

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);

    const isLight = theme === "light";

    if (themeIcon) {
      themeIcon.textContent = isLight ? "☾" : "☼";
    }

    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute(
        "aria-label",
        isLight ? "Aktifkan Dark Mode" : "Aktifkan Light Mode"
      );
      themeToggle.title = isLight
        ? "Ganti ke Dark Mode"
        : "Ganti ke Light Mode";
    }
  }

  // Ambil tema yang terakhir dipilih
  let savedTheme = "dark";

  try {
    savedTheme = localStorage.getItem("husna-portfolio-theme") || "dark";
  } catch (error) {
    savedTheme = "dark";
  }

  setTheme(savedTheme);

  // Tombol pergantian tema
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = root.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";

      setTheme(newTheme);

      try {
        localStorage.setItem("husna-portfolio-theme", newTheme);
      } catch (error) {
        // Tema tetap dapat diganti meskipun penyimpanan diblokir.
      }
    });
  }
  // Mobile navigation
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Buka menu navigasi");
      });
    });

    document.addEventListener("click", (event) => {
      const clickedInsideMenu =
        navLinks.contains(event.target) || menuToggle.contains(event.target);

      if (!clickedInsideMenu && navLinks.classList.contains("is-open")) {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Buka menu navigasi");
      }
    });
  }

  // Reveal elements when they enter the viewport
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  // Video demo modal
  const videoModal = document.getElementById("video-modal");
  const modalVideo = document.getElementById("modal-video");
  const closeVideoButton = document.querySelector(".modal-close");
  let lastVideoTrigger = null;

  function openDemo(videoPath, trigger) {
    if (!videoModal || !modalVideo || !videoPath) return;

    lastVideoTrigger = trigger || document.activeElement;
    modalVideo.src = videoPath;
    videoModal.classList.add("is-open");
    videoModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    if (closeVideoButton) closeVideoButton.focus();

    const playAttempt = modalVideo.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {
        // Autoplay bisa diblokir browser; pengguna tetap dapat menekan Play.
      });
    }
  }

  function closeDemo() {
    if (!videoModal || !modalVideo) return;

    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.load();
    videoModal.classList.remove("is-open");
    videoModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (lastVideoTrigger && typeof lastVideoTrigger.focus === "function") {
      lastVideoTrigger.focus();
    }
  }

  document.querySelectorAll(".demo-button").forEach((button) => {
    button.addEventListener("click", () => {
      openDemo(button.dataset.video, button);
    });
  });

  closeVideoButton?.addEventListener("click", closeDemo);

  videoModal?.addEventListener("click", (event) => {
    if (event.target === videoModal) closeDemo();
  });

  // Image lightbox: SIMPB gallery and poster thumbnails
  const imageLightbox = document.getElementById("image-lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const closeLightboxButton = document.querySelector(".lightbox-close");
  const previousButton = document.querySelector(".lightbox-prev");
  const nextButton = document.querySelector(".lightbox-next");

  const galleryImages = Array.from(
    document.querySelectorAll(
      ".simpb-gallery img, .poster-gallery img, .image-gallery-group img"
    )
  );

  let activeImageIndex = 0;
  let lastImageTrigger = null;

  function updateLightbox() {
    if (!lightboxImage || !galleryImages.length) return;

    const image = galleryImages[activeImageIndex];
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "Gambar portofolio";
    if (lightboxTitle) lightboxTitle.textContent = image.alt || "Galeri portofolio";
    if (lightboxCounter) {
      lightboxCounter.textContent = `${activeImageIndex + 1} / ${galleryImages.length}`;
    }
  }

  function openLightbox(index, trigger) {
    if (!imageLightbox || !galleryImages.length) return;

    activeImageIndex = index;
    lastImageTrigger = trigger || document.activeElement;
    updateLightbox();

    imageLightbox.classList.add("active");
    imageLightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    closeLightboxButton?.focus();
  }

  function closeLightbox() {
    if (!imageLightbox) return;

    imageLightbox.classList.remove("active");
    imageLightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (lightboxImage) lightboxImage.removeAttribute("src");
    if (lastImageTrigger && typeof lastImageTrigger.focus === "function") {
      lastImageTrigger.focus();
    }
  }

  function showNextImage() {
    if (!galleryImages.length) return;
    activeImageIndex = (activeImageIndex + 1) % galleryImages.length;
    updateLightbox();
  }

  function showPreviousImage() {
    if (!galleryImages.length) return;
    activeImageIndex =
      (activeImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightbox();
  }

  galleryImages.forEach((image, index) => {
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `Perbesar gambar: ${image.alt || "gambar"}`);

    image.addEventListener("click", (event) => {
      // Cegah tautan pembungkus poster membuka tab baru saat lightbox dibuka.
      event.preventDefault();
      openLightbox(index, image);
    });
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index, image);
      }
    });
  });

  closeLightboxButton?.addEventListener("click", closeLightbox);
  previousButton?.addEventListener("click", showPreviousImage);
  nextButton?.addEventListener("click", showNextImage);

  imageLightbox?.addEventListener("click", (event) => {
    if (event.target === imageLightbox) closeLightbox();
  });

  // Keyboard controls for both modals
  document.addEventListener("keydown", (event) => {
    if (videoModal?.classList.contains("is-open") && event.key === "Escape") {
      closeDemo();
      return;
    }

    if (imageLightbox?.classList.contains("active")) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") showNextImage();
      if (event.key === "ArrowLeft") showPreviousImage();
    }
  });

  // Fallback for images that fail to load: show a neutral placeholder.
  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("image-load-error");
    });
  });

  console.log("Portfolio Husna Rizkyah: JavaScript berhasil dimuat.");
});
