(() => {
  const canvas = document.querySelector("#field-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  let width = 0;
  let height = 0;
  let points = [];
  let pointer = { x: 0, y: 0, active: false };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    createPoints();
  }

  function createPoints() {
    const count = Math.floor(Math.min(92, Math.max(44, width / 18)));
    points = Array.from({ length: count }, (_, index) => ({
      x: (index * 97) % width,
      y: (index * 193) % height,
      vx: ((index % 7) - 3) * 0.035,
      vy: ((index % 5) - 2) * 0.032,
      r: 0.8 + (index % 4) * 0.18
    }));
  }

  function drawField() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(125, 183, 255, 0.58)";
    ctx.strokeStyle = "rgba(125, 183, 255, 0.11)";
    ctx.lineWidth = 1;

    points.forEach((point) => {
      point.x += point.vx;
      point.y += point.vy;

      if (point.x < -20) point.x = width + 20;
      if (point.x > width + 20) point.x = -20;
      if (point.y < -20) point.y = height + 20;
      if (point.y > height + 20) point.y = -20;

      if (pointer.active) {
        const dx = pointer.x - point.x;
        const dy = pointer.y - point.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 140) {
          point.x -= dx * 0.0018;
          point.y -= dy * 0.0018;
        }
      }

      ctx.beginPath();
      ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i];
        const b = points[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < 118) {
          ctx.globalAlpha = (1 - distance / 118) * 0.62;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    if (!prefersReducedMotion) requestAnimationFrame(drawField);
  }

  function splitRevealText() {
    document.querySelectorAll(".reveal-text").forEach((element) => {
      const words = element.textContent.trim().split(/\s+/);
      element.textContent = "";
      words.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = `${word}${index === words.length - 1 ? "" : " "}`;
        element.appendChild(span);
      });
    });
  }

  function initGsap() {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".site-nav", {
      y: -24,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out"
    });

    gsap.from([".eyebrow", ".hero-copy h1", ".subpage-copy h1", ".subpage-copy p:not(.eyebrow)", ".hero-school", ".hero-line", ".hero-actions"], {
      y: 34,
      opacity: 0,
      duration: 1,
      stagger: 0.09,
      ease: "power3.out",
      delay: 0.12
    });

    if (document.querySelector(".media-frame")) {
      gsap.from(".media-frame", {
        scale: 0.88,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.25
      });

      gsap.to(".media-frame", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }

    gsap.utils.toArray(".reveal-text span").forEach((word, index) => {
      gsap.to(word, {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".profile-section",
          start: `top+=${index * 7} 72%`,
          end: `top+=${index * 7 + 160} 42%`,
          scrub: true
        }
      });
    });

    gsap.utils.toArray(".interest-card, .accordion-strip article, .archive-tile, .photo-card, .writing-card").forEach((item) => {
      gsap.fromTo(item, {
        y: 46,
        opacity: 0,
        scale: 0.96
      }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 82%"
        }
      });
    });

    ScrollTrigger.matchMedia({
      "(min-width: 981px)": () => {
        if (document.querySelector(".projects-section") && document.querySelector(".pin-copy")) {
          ScrollTrigger.create({
            trigger: ".projects-section",
            start: "top 120px",
            end: "bottom bottom",
            pin: ".pin-copy",
            pinSpacing: false
          });
        }

        gsap.utils.toArray(".project-card").forEach((card, index) => {
          gsap.fromTo(card, {
            y: 80,
            opacity: 0,
            scale: 0.94
          }, {
            y: 0,
            opacity: 1,
            scale: 1 - index * 0.018,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 86%",
              end: "top 36%",
              scrub: true
            }
          });
        });
      },
      "(max-width: 980px)": () => {
        gsap.utils.toArray(".project-card").forEach((card) => {
          gsap.from(card, {
            y: 46,
            opacity: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 86%"
            }
          });
        });
      }
    });
  }

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", (event) => {
    pointer = { x: event.clientX, y: event.clientY, active: true };
  });
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  splitRevealText();
  resizeCanvas();
  if (prefersReducedMotion) drawField();
  if (!prefersReducedMotion) requestAnimationFrame(drawField);
  initGsap();
})();
