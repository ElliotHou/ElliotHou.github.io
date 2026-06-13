(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.querySelector("#field-canvas");

  function initReveal() {
    const items = document.querySelectorAll(
      ".section > *, .interest-list article, .project-card, .archive-tile, .photo-card, .writing-card"
    );

    items.forEach((item, index) => {
      item.classList.add("reveal-item");
      item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6%" }
    );

    items.forEach((item) => observer.observe(item));
  }

  function initHero() {
    const heroItems = document.querySelectorAll(
      ".site-nav, .hero-copy > *, .hero-media, .subpage-copy > *"
    );

    heroItems.forEach((item, index) => {
      item.style.setProperty("--hero-delay", `${80 + index * 85}ms`);
      item.classList.add("hero-enter");
    });

    requestAnimationFrame(() => {
      heroItems.forEach((item) => item.classList.add("is-ready"));
    });
  }

  function initField() {
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let width = 0;
    let height = 0;
    let points = [];
    let frame = 0;
    const pointer = { x: 0, y: 0, active: false };

    function createPoints() {
      const count = Math.min(52, Math.max(26, Math.floor(width / 30)));
      points = Array.from({ length: count }, (_, index) => ({
        x: (index * 131) % width,
        y: (index * 211) % height,
        vx: ((index % 5) - 2) * 0.025,
        vy: ((index % 7) - 3) * 0.02,
        radius: 0.6 + (index % 3) * 0.2
      }));
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      createPoints();
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(95, 143, 220, 0.66)";
      context.strokeStyle = "rgba(95, 143, 220, 0.12)";
      context.lineWidth = 0.8;

      points.forEach((point) => {
        if (!reduceMotion) {
          point.x += point.vx;
          point.y += point.vy;
        }

        if (point.x < -12) point.x = width + 12;
        if (point.x > width + 12) point.x = -12;
        if (point.y < -12) point.y = height + 12;
        if (point.y > height + 12) point.y = -12;

        if (pointer.active && !reduceMotion) {
          const dx = pointer.x - point.x;
          const dy = pointer.y - point.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 150) {
            point.x -= dx * 0.0012;
            point.y -= dy * 0.0012;
          }
        }

        context.beginPath();
        context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        context.fill();
      });

      for (let first = 0; first < points.length; first += 1) {
        for (let second = first + 1; second < points.length; second += 1) {
          const a = points[first];
          const b = points[second];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance >= 125) continue;
          context.globalAlpha = (1 - distance / 125) * 0.55;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }

      context.globalAlpha = 1;
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.documentElement);

    window.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    }, { passive: true });

    window.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    window.addEventListener("pagehide", () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    }, { once: true });

    resize();
    draw();
  }

  initHero();
  initReveal();
  initField();
})();
