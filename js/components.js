document.addEventListener("DOMContentLoaded", async () => {

  const components = {
    header: "/components/header.html",
    sidebar: "/components/sidebar.html",
    footer: "/components/footer.html"
  };

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

});
