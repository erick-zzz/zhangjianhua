(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeLabel = document.getElementById("themeLabel");
  const navToggle = document.querySelector(".nav__toggle");
  const navMenu = document.getElementById("navMenu");
  const yearEl = document.getElementById("year");
  const toast = document.getElementById("toast");
  const printBtn = document.getElementById("printBtn");

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
    } else {
      root.removeAttribute("data-theme");
      if (themeLabel) themeLabel.textContent = "深色";
    }
    localStorage.setItem("theme", theme);
  };

  applyTheme(getPreferredTheme());

  themeToggle?.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    applyTheme(isLight ? "dark" : "light");
  });

  navToggle?.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // close menu on nav click (mobile)
  navMenu?.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.tagName.toLowerCase() !== "a") return;
    navMenu.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
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
      setToast("复制失败：请手动复制");
    }
  });

  printBtn?.addEventListener("click", () => window.print());

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

