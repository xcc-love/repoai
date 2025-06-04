document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  const navDots = document.querySelectorAll(".nav-dot");
  let currentSection = 0;
  let isScrolling = false;
  let touchStartY = 0;
  let touchEndY = 0;

  // Initialize first section
  sections[0].classList.add("active");
  navDots[0].classList.add("active");

  // Navigation dot click handlers
  navDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      if (!isScrolling) {
        navigateToSection(index);
      }
    });
  });

  // Mouse wheel handler with section scrolling
  let wheelTimeout;
  document.addEventListener("wheel", (e) => {
    if (isScrolling) return;

    const currentSectionElement = sections[currentSection];
    const scrollHeight = currentSectionElement.scrollHeight;
    const scrollTop = currentSectionElement.scrollTop;
    const clientHeight = currentSectionElement.clientHeight;

    // Clear existing timeout
    clearTimeout(wheelTimeout);

    // Handle scrolling
    wheelTimeout = setTimeout(() => {
      if (e.deltaY > 0) {
        // Scrolling down
        if (Math.abs(scrollHeight - scrollTop - clientHeight) < 2) {
          // At bottom of section, move to next section
          if (currentSection < sections.length - 1) {
            navigateToSection(currentSection + 1);
          }
        }
      } else if (e.deltaY < 0) {
        // Scrolling up
        if (scrollTop === 0) {
          // At top of section, move to previous section
          if (currentSection > 0) {
            navigateToSection(currentSection - 1);
          }
        }
      }
    }, 50);
  });

  // Touch handlers for mobile with improved sensitivity
  document.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
  });

  document.addEventListener("touchend", (e) => {
    touchEndY = e.changedTouches[0].clientY;
    handleTouchMove();
  });

  function handleTouchMove() {
    if (isScrolling) return;

    const currentSectionElement = sections[currentSection];
    const scrollHeight = currentSectionElement.scrollHeight;
    const scrollTop = currentSectionElement.scrollTop;
    const clientHeight = currentSectionElement.clientHeight;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > 70) {
      // Minimum swipe distance
      if (diff > 0) {
        // Swiping up (scrolling down)
        if (
          Math.abs(scrollHeight - scrollTop - clientHeight) < 2 &&
          currentSection < sections.length - 1
        ) {
          navigateToSection(currentSection + 1);
        }
      } else {
        // Swiping down (scrolling up)
        if (scrollTop === 0 && currentSection > 0) {
          navigateToSection(currentSection - 1);
        }
      }
    }
  }

  function navigateToSection(index) {
    if (index === currentSection) return;

    isScrolling = true;

    // Update sections
    sections[currentSection].classList.remove("active");
    sections[index].classList.add("active");

    // Update navigation dots
    navDots[currentSection].classList.remove("active");
    navDots[index].classList.add("active");

    // Reset scroll position of new section
    sections[index].scrollTop = 0;

    currentSection = index;

    // Reset scrolling flag after animation
    setTimeout(() => {
      isScrolling = false;
    }, 800);
  }

  // Keyboard navigation with improved handling
  document.addEventListener("keydown", (e) => {
    if (isScrolling) return;

    const currentSectionElement = sections[currentSection];
    const scrollHeight = currentSectionElement.scrollHeight;
    const scrollTop = currentSectionElement.scrollTop;
    const clientHeight = currentSectionElement.clientHeight;

    if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === "Space") {
      e.preventDefault();
      if (Math.abs(scrollHeight - scrollTop - clientHeight) < 2) {
        if (currentSection < sections.length - 1) {
          navigateToSection(currentSection + 1);
        }
      } else {
        currentSectionElement.scrollBy({
          top: 100,
          behavior: "smooth",
        });
      }
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      if (scrollTop === 0) {
        if (currentSection > 0) {
          navigateToSection(currentSection - 1);
        }
      } else {
        currentSectionElement.scrollBy({
          top: -100,
          behavior: "smooth",
        });
      }
    }
  });

  // Enhanced particle animation
  function createParticle() {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.25});
            border-radius: 50%;
            pointer-events: none;
        `;

    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";

    const particles = document.querySelector(".ai-particles");
    if (particles) {
      particles.appendChild(particle);

      const animation = particle.animate(
        [
          {
            transform: "translate(0, 0) scale(1)",
            opacity: 1,
          },
          {
            transform: `translate(${Math.random() * 200 - 100}px, ${
              Math.random() * 200 - 100
            }px) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration: Math.random() * 2000 + 2000,
          easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
        }
      );

      animation.onfinish = () => particle.remove();
    }
  }

  // Create particles periodically with check for hero section visibility
  setInterval(() => {
    if (sections[0].classList.contains("active")) {
      createParticle();
    }
  }, 100);

  // Handle window resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Reset scroll position of current section
      sections[currentSection].scrollTop = 0;
    }, 250);
  });
});
