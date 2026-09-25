/* Keep the mobile drawer usable even when the header component is injected
   after the main page script has initialized. */
(() => {
  const setDrawerState = (open) => {
    document.body.classList.toggle("drawer-open", open);

    const menuButton = document.getElementById("menuBtn");
    const drawer = document.getElementById("mobileDrawer");
    const overlay = document.getElementById("drawerOverlay");

    menuButton?.setAttribute("aria-expanded", String(open));
    drawer?.setAttribute("aria-hidden", String(!open));
    overlay?.setAttribute("aria-hidden", String(!open));
  };

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    if (target.closest("#menuBtn")) {
      event.preventDefault();
      setDrawerState(true);
      return;
    }

    if (target.closest("#drawerClose, #drawerOverlay, .pr-mobile-link")) {
      setDrawerState(false);
    }
  });

  // The menu is injected dynamically, so apply the mobile display rule when it
  // becomes available instead of relying only on the original stylesheet pass.
  const ensureMobileButtonIsClickable = () => {
    const menuButton = document.getElementById("menuBtn");
    if (menuButton && window.matchMedia("(max-width: 768px)").matches) {
      menuButton.style.display = "flex";
      menuButton.style.pointerEvents = "auto";
    }
  };

  ensureMobileButtonIsClickable();
  new MutationObserver(ensureMobileButtonIsClickable).observe(document.body, {
    childList: true,
    subtree: true
  });
})();
