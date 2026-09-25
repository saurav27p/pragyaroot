document.addEventListener("DOMContentLoaded", async () => {

  const components = {
    header: "/components/header.html",
    sidebar: "/components/sidebar.html",
    footer: "/components/footer.html"
  };


  /* =========================================
     Load Components
     ========================================= */

  async function loadComponent(elementId, filePath) {

    const element = document.getElementById(elementId);

    if (!element) return;

    try {

      const response = await fetch(filePath);

      if (!response.ok) {
        throw new Error(`Failed to load ${filePath}`);
      }

      element.innerHTML = await response.text();

    } catch (error) {

      console.error(error);

    }

  }


  await Promise.all([
    loadComponent("header-placeholder", components.header),
    loadComponent("sidebar-placeholder", components.sidebar),
    loadComponent("footer-placeholder", components.footer)
  ]);


  /* =========================================
     Mobile Drawer
     ========================================= */

  const menuBtn = document.getElementById("menuBtn");
  const drawerClose = document.getElementById("drawerClose");
  const drawerOverlay = document.getElementById("drawerOverlay");


  function openDrawer() {

    document.body.classList.add("drawer-open");

    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", "true");
    }

  }


  function closeDrawer() {

    document.body.classList.remove("drawer-open");

    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", "false");
    }

  }


  if (menuBtn) {
    menuBtn.addEventListener("click", openDrawer);
  }


  if (drawerClose) {
    drawerClose.addEventListener("click", closeDrawer);
  }


  if (drawerOverlay) {
    drawerOverlay.addEventListener("click", closeDrawer);
  }


  /* Close drawer when a mobile link is clicked */

  document.querySelectorAll(".pr-mobile-link").forEach(link => {

    link.addEventListener("click", closeDrawer);

  });


  /* =========================================
     Theme Toggle
     ========================================= */

  const themeToggle = document.getElementById("themeToggle");


  function updateThemeIcon() {

    if (!themeToggle) return;

    const icon = themeToggle.querySelector("i");

    if (!icon) return;

    if (document.documentElement.classList.contains("dark")) {

      icon.className = "fa-solid fa-sun";

      themeToggle.setAttribute(
        "aria-label",
        "Switch to light mode"
      );

    } else {

      icon.className = "fa-solid fa-moon";

      themeToggle.setAttribute(
        "aria-label",
        "Switch to dark mode"
      );

    }

  }


  const savedTheme = localStorage.getItem("pragyaroot-theme");

  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  }


  updateThemeIcon();


  if (themeToggle) {

    themeToggle.addEventListener("click", () => {

      document.documentElement.classList.toggle("dark");

      const isDark =
        document.documentElement.classList.contains("dark");

      localStorage.setItem(
        "pragyaroot-theme",
        isDark ? "dark" : "light"
      );

      updateThemeIcon();

    });

  }


});
