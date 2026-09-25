document.addEventListener("DOMContentLoaded", async () => {
  const components = {
    header: "components/header.html",
    sidebar: "components/sidebar.html",
    footer: "components/footer.html"
  };

  async function loadComponent(id, path) {
    const target = document.getElementById(id);
    if (!target) return;
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Failed to load ${path}`);
      target.innerHTML = await response.text();
    } catch (error) { console.error(error); }
  }

  await Promise.all(Object.entries(components).map(([name, path]) => loadComponent(`${name}-placeholder`, path)));

  const $ = id => document.getElementById(id);
  const on = (element, event, handler, options) => element && element.addEventListener(event, handler, options);

  /* Drawer */
  const menuBtn = $("menuBtn");
  const drawerClose = $("drawerClose");
  const drawerOverlay = $("drawerOverlay");
  const closeDrawer = () => {
    document.body.classList.remove("drawer-open");
    menuBtn?.setAttribute("aria-expanded", "false");
  };
  const openDrawer = () => {
    document.body.classList.add("drawer-open");
    menuBtn?.setAttribute("aria-expanded", "true");
  };
  on(menuBtn, "click", openDrawer);
  on(drawerClose, "click", closeDrawer);
  on(drawerOverlay, "click", closeDrawer);
  document.querySelectorAll(".pr-mobile-link").forEach(link => on(link, "click", closeDrawer));

  /* Theme: keep both selectors used by the existing stylesheet in sync. */
  const themeToggle = $("themeToggle");
  const applyTheme = dark => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.body.classList.toggle("dark-theme", dark);
    const icon = themeToggle?.querySelector("i");
    if (icon) icon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    themeToggle?.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  };
  applyTheme(localStorage.getItem("pragyaroot-theme") === "dark");
  on(themeToggle, "click", () => {
    const dark = document.documentElement.dataset.theme !== "dark";
    localStorage.setItem("pragyaroot-theme", dark ? "dark" : "light");
    applyTheme(dark);
  });

  /* Search */
  const searchBtn = $("searchBtn");
  const searchClose = $("searchClose");
  const searchInput = $("searchInput");
  const searchOverlay = $("searchOverlay");
  const searchResults = $("searchResults");
  const searchCount = $("searchCount");
  let searchIndex = [];
  const closeSearch = () => {
    if (!searchOverlay) return;
    searchOverlay.classList.remove("open", "search-open");
    searchOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("search-active");
  };
  const buildSearchIndex = () => {
    const selectors = [".pr-home-hero", ".pr-trust-card", ".pr-tags", ".pr-home-section", ".pr-subj-real", ".pr-subj-dummy", ".pr-grammar-item", ".pr-games-real", ".pr-tools-item", ".pr-contact", ".pr-footer-about", ".pr-footer-column"];
    searchIndex = [...document.querySelectorAll(selectors.join(","))].map(element => ({ element, text: (element.innerText || "").replace(/\s+/g, " ").trim() })).filter(item => item.text);
  };
  const performSearch = value => {
    if (!searchResults || !searchCount) return;
    const query = value.trim().toLowerCase();
    searchResults.innerHTML = "";
    if (!query) { searchCount.textContent = "Start typing to search"; return; }
    const matches = searchIndex.filter(item => item.text.toLowerCase().includes(query));
    searchCount.textContent = `${matches.length} result${matches.length === 1 ? "" : "s"}`;
    if (!matches.length) { searchResults.textContent = "No matching results found."; return; }
    matches.forEach(item => {
      const result = document.createElement("button");
      result.type = "button";
      result.className = "pr-search-result";
      const title = item.element.querySelector("h1, h2, h3, strong");
      const heading = document.createElement("strong");
      heading.textContent = title?.textContent.trim() || item.text.slice(0, 60);
      const excerpt = document.createElement("span");
      excerpt.className = "pr-search-result-excerpt";
      excerpt.textContent = item.text.slice(0, 150);
      result.append(heading, excerpt);
      on(result, "click", () => { closeSearch(); item.element.scrollIntoView({ behavior: "smooth", block: "center" }); });
      searchResults.appendChild(result);
    });
  };
  on(searchBtn, "click", () => {
    if (!searchOverlay) return;
    buildSearchIndex();
    searchOverlay.classList.add("open", "search-open");
    searchOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("search-active");
    if (searchInput) { searchInput.value = ""; if (searchCount) searchCount.textContent = "Start typing to search"; setTimeout(() => searchInput.focus(), 80); }
  });
  on(searchClose, "click", closeSearch);
  on(searchInput, "input", event => performSearch(event.target.value));
  on(searchOverlay, "click", event => { if (event.target === searchOverlay) closeSearch(); });

  /* Language menu */
  const languageBtn = $("languageBtn");
  const languageMenu = $("languageMenu");
  const closeLanguageMenu = () => { if (languageMenu) languageMenu.hidden = true; languageBtn?.setAttribute("aria-expanded", "false"); };
  on(languageBtn, "click", event => { event.stopPropagation(); if (languageMenu) languageMenu.hidden = !languageMenu.hidden; languageBtn.setAttribute("aria-expanded", String(!languageMenu.hidden)); });
  document.querySelectorAll(".pr-language-option").forEach(option => on(option, "click", () => { localStorage.setItem("pragyaroot-language", option.dataset.lang); document.querySelectorAll(".pr-language-option").forEach(item => item.classList.toggle("active", item === option)); closeLanguageMenu(); }));
  on(document, "click", event => { if (languageMenu && !languageMenu.hidden && !languageMenu.contains(event.target) && event.target !== languageBtn) closeLanguageMenu(); });

  /* Back to top */
  const backToTop = $("backToTop");
  const updateBackToTop = () => backToTop?.classList.toggle("is-visible", window.scrollY > 300);
  on(window, "scroll", updateBackToTop, { passive: true });
  updateBackToTop();
  on(backToTop, "click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* Contact form */
  const contactForm = $("contactForm");
  const formMessage = $("formMessage");
  on(contactForm, "submit", async event => {
    event.preventDefault();
    if (formMessage) formMessage.textContent = "Sending message…";
    try {
      const response = await fetch(contactForm.action, { method: "POST", body: new FormData(contactForm), headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Form submission failed.");
      contactForm.reset();
      if (formMessage) formMessage.textContent = "Message sent successfully.";
    } catch (error) { console.error(error); if (formMessage) formMessage.textContent = "Something went wrong. Please try again."; }
  });

  /* Active links and keyboard dismissal */
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  document.querySelectorAll(".pr-sidebar-link, .pr-mobile-link").forEach(link => { link.classList.toggle("active", new URL(link.href, location.href).pathname.replace(/\/+$/, "") || "/" === currentPath); });
  on(document, "keydown", event => { if (event.key === "Escape") { closeSearch(); closeLanguageMenu(); closeDrawer(); } });
});
