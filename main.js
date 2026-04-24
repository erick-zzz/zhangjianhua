(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeLabel = document.getElementById("themeLabel");
  const navToggle = document.querySelector(".nav__toggle");
  const navMenu = document.getElementById("navMenu");
  const yearEl = document.getElementById("year");
  const toast = document.getElementById("toast");
  const printBtn = document.getElementById("printBtn");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const backToTop = document.getElementById("backToTop");

  const setToast = (text) => {
    if (!toast) return;
    toast.textContent = text;
    window.clearTimeout(setToast._t);
    setToast._t = window.setTimeout(() => {
      toast.textContent = "";
    }, 1800);
  };

  const getPreferredTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia?.("(prefers-color-scheme: light)")?.matches ? "light" : "dark";
  };

  const applyTheme = (theme) => {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
      if (themeLabel) themeLabel.textContent = "浅色";
      if (themeColor) themeColor.setAttribute("content", "#f6f7fb");
    } else {
      root.removeAttribute("data-theme");
      if (themeLabel) themeLabel.textContent = "深色";
      if (themeColor) themeColor.setAttribute("content", "#0b1020");
    }
    localStorage.setItem("theme", theme);
  };

  applyTheme(getPreferredTheme());

  themeToggle?.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    applyTheme(isLight ? "dark" : "light");
  });

  const closeMenu = () => {
    if (!navMenu) return;
    navMenu.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  };

  navToggle?.addEventListener("click", () => {
    if (!navMenu) return;
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // close menu on nav click (mobile)
  navMenu?.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.tagName.toLowerCase() !== "a") return;
    closeMenu();
  });

  // close menu on outside click / ESC
  document.addEventListener("click", (e) => {
    if (!navMenu || !navToggle) return;
    if (!navMenu.classList.contains("is-open")) return;
    const target = e.target;
    if (!(target instanceof Node)) return;
    if (navMenu.contains(target) || navToggle.contains(target)) return;
    closeMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeMenu();
  });

  // copy helpers
  document.body.addEventListener("click", async (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const text = target.getAttribute("data-copy");
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setToast("已复制到剪贴板");
    } catch {
      try {
        window.prompt("复制到剪贴板失败，请手动复制：", text);
      } catch {}
      setToast("复制失败：已弹出手动复制");
    }
  });

  printBtn?.addEventListener("click", () => window.print());

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // back to top
  const updateBackToTop = () => {
    if (!backToTop) return;
    const show = window.scrollY > 600;
    backToTop.classList.toggle("is-visible", show);
  };
  updateBackToTop();
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // active nav link (scroll spy)
  const navLinks = navMenu ? Array.from(navMenu.querySelectorAll('a[href^="#"]')) : [];
  const linkById = new Map();
  for (const a of navLinks) {
    const id = a.getAttribute("href")?.slice(1);
    if (!id) continue;
    linkById.set(id, a);
  }

  const setActive = (id) => {
    for (const a of navLinks) {
      a.classList.remove("is-active");
      a.removeAttribute("aria-current");
    }
    const active = id ? linkById.get(id) : null;
    if (active) {
      active.classList.add("is-active");
      active.setAttribute("aria-current", "page");
    }
  };

  const sections = Array.from(linkById.keys())
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((x) => x.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target?.id) return;
        setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0.08, 0.12, 0.2, 0.4] }
    );
    for (const s of sections) io.observe(s);
  } else {
    setActive(location.hash.replace("#", ""));
    window.addEventListener("hashchange", () => setActive(location.hash.replace("#", "")));
  }
})();
