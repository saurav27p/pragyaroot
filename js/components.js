document.addEventListener("DOMContentLoaded", async () => {

  /* =========================================
     COMPONENT LOADER
  ========================================= */

  const components = {
    header: "components/header.html",
    sidebar: "components/sidebar.html",
    footer: "components/footer.html"
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


  /* =========================================
     MOBILE DRAWER
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

  document.querySelectorAll(".pr-mobile-link").forEach(link => {
    link.addEventListener("click", closeDrawer);
  });


  /* =========================================
     DARK / LIGHT THEME
  ========================================= */

  const themeToggle =
    document.getElementById("themeToggle");

  function updateThemeIcon() {

    if (!themeToggle) return;

    const icon =
      themeToggle.querySelector("i");

    if (!icon) return;

    const isDark =
      document.documentElement.classList.contains("dark");

    if (isDark) {

      icon.className =
        "fa-solid fa-sun";

      themeToggle.setAttribute(
        "aria-label",
        "Switch to light mode"
      );

    } else {

      icon.className =
        "fa-solid fa-moon";

      themeToggle.setAttribute(
        "aria-label",
        "Switch to dark mode"
      );
    }
  }

  const savedTheme =
    localStorage.getItem("pragyaroot-theme");

  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  }

  updateThemeIcon();

  if (themeToggle) {

    themeToggle.addEventListener(
      "click",
      () => {

        document.documentElement.classList.toggle(
          "dark"
        );

        const isDark =
          document.documentElement.classList.contains(
            "dark"
          );

        localStorage.setItem(
          "pragyaroot-theme",
          isDark ? "dark" : "light"
        );

        updateThemeIcon();
      }
    );
  }


  /* =========================================
     HERO WORD ROTATOR
  ========================================= */

  const rotatingWord =
    document.getElementById("rotatingWord");

  if (rotatingWord) {

    const words = [
      "CLASS 10 NOTES",
      "EXERCISE SOLUTIONS",
      "GRAMMAR GUIDES",
      "LEARNING GAMES",
      "SEE PREP TOOLS"
    ];

    let wordIndex = 0;

    setInterval(() => {

      rotatingWord.style.opacity = "0";

      setTimeout(() => {

        wordIndex =
          (wordIndex + 1) % words.length;

        rotatingWord.textContent =
          words[wordIndex];

        rotatingWord.style.opacity = "1";

      }, 180);

    }, 3000);
  }


  /* =========================================
     SEARCH
  ========================================= */

  const searchBtn =
    document.getElementById("searchBtn");

  const searchClose =
    document.getElementById("searchClose");

  const searchInput =
    document.getElementById("searchInput");

  const searchOverlay =
    document.getElementById("searchOverlay");

  const searchResults =
    document.getElementById("searchResults");

  const searchCount =
    document.getElementById("searchCount");

  let searchIndex = [];


  function buildSearchIndex() {

    searchIndex = [];

    const selectors = [
      ".pr-home-hero",
      ".pr-trust-card",
      ".pr-tags",
      ".pr-home-section",
      ".pr-subj-real",
      ".pr-subj-dummy",
      ".pr-grammar-item",
      ".pr-games-real",
      ".pr-tools-item",
      ".pr-contact",
      ".pr-footer-about",
      ".pr-footer-column"
    ];

    document
      .querySelectorAll(selectors.join(","))
      .forEach(block => {

        const text =
          block.innerText
            .replace(/\s+/g, " ")
            .trim();

        if (!text) return;

        searchIndex.push({
          element: block,
          text
        });

      });
  }


  function createExcerpt(text, query) {

    const lowerText =
      text.toLowerCase();

    const lowerQuery =
      query.toLowerCase();

    const matchIndex =
      lowerText.indexOf(lowerQuery);

    if (matchIndex === -1) {
      return text.slice(0, 150);
    }

    const radius = 75;

    const start =
      Math.max(
        0,
        matchIndex - radius
      );

    const end =
      Math.min(
        text.length,
        matchIndex +
        query.length +
        radius
      );

    let excerpt =
      text.slice(start, end);

    if (start > 0) {
      excerpt = "…" + excerpt;
    }

    if (end < text.length) {
      excerpt += "…";
    }

    return excerpt;
  }


  function highlightElement(element) {

    element.classList.remove(
      "pr-search-highlight"
    );

    void element.offsetWidth;

    element.classList.add(
      "pr-search-highlight"
    );

    setTimeout(() => {

      element.classList.remove(
        "pr-search-highlight"
      );

    }, 1600);
  }


  function performSearch(query) {

    if (!searchResults || !searchCount) {
      return;
    }

    const cleanQuery =
      query.trim().toLowerCase();

    searchResults.innerHTML = "";

    if (!cleanQuery) {

      searchCount.textContent =
        "Start typing to search";

      return;
    }

    const matches =
      searchIndex.filter(item =>
        item.text
          .toLowerCase()
          .includes(cleanQuery)
      );

    searchCount.textContent =
      `${matches.length} result${matches.length === 1 ? "" : "s"}`;


    if (matches.length === 0) {

      const empty =
        document.createElement("div");

      empty.className =
        "pr-search-empty";

      empty.textContent =
        "No matching results found.";

      searchResults.appendChild(empty);

      return;
    }


    matches.forEach(item => {

      const result =
        document.createElement("button");

      result.type = "button";
      result.className =
        "pr-search-result";

      const title =
        item.element.querySelector(
          "h1, h2, h3, strong"
        );

      const titleText =
        title
          ? title.textContent.trim()
          : item.text.slice(0, 60);

      const heading =
        document.createElement("strong");

      heading.textContent =
        titleText;

      const excerpt =
        document.createElement("span");

      excerpt.textContent =
        createExcerpt(
          item.text,
          cleanQuery
        );

      result.appendChild(heading);
      result.appendChild(excerpt);

      result.addEventListener(
        "click",
        () => {

          closeSearch();

          setTimeout(() => {

            item.element.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

            setTimeout(() => {
              highlightElement(
                item.element
              );
            }, 500);

          }, 120);

        }
      );

      searchResults.appendChild(result);

    });
  }


  function openSearch() {

    if (!searchOverlay) return;

    buildSearchIndex();

    searchOverlay.classList.add(
      "search-open"
    );

    searchOverlay.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "search-active"
    );

    if (searchInput) {

      searchInput.value = "";

      if (searchCount) {
        searchCount.textContent =
          "Start typing to search";
      }

      setTimeout(() => {
        searchInput.focus();
      }, 80);
    }
  }


  function closeSearch() {

    if (!searchOverlay) return;

    searchOverlay.classList.remove(
      "search-open"
    );

    searchOverlay.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "search-active"
    );
  }


  if (searchBtn) {
    searchBtn.addEventListener(
      "click",
      openSearch
    );
  }

  if (searchClose) {
    searchClose.addEventListener(
      "click",
      closeSearch
    );
  }


  if (searchInput) {

    let searchTimer;

    searchInput.addEventListener(
      "input",
      event => {

        clearTimeout(searchTimer);

        searchTimer =
          setTimeout(() => {

            performSearch(
              event.target.value
            );

          }, 40);
      }
    );
  }


  if (searchOverlay) {

    searchOverlay.addEventListener(
      "click",
      event => {

        if (
          event.target === searchOverlay
        ) {
          closeSearch();
        }

      }
    );
  }


  /* =========================================
     LANGUAGE MENU
  ========================================= */

  const languageBtn =
    document.getElementById("languageBtn");

  const languageMenu =
    document.getElementById("languageMenu");

  const languageOptions =
    document.querySelectorAll(
      ".pr-language-option"
    );


  function closeLanguageMenu() {

    if (!languageMenu) return;

    languageMenu.hidden = true;

    if (languageBtn) {
      languageBtn.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  }


  function openLanguageMenu() {

    if (!languageMenu) return;

    languageMenu.hidden = false;

    if (languageBtn) {
      languageBtn.setAttribute(
        "aria-expanded",
        "true"
      );
    }
  }


  if (languageBtn) {

    languageBtn.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        if (!languageMenu) return;

        if (languageMenu.hidden) {
          openLanguageMenu();
        } else {
          closeLanguageMenu();
        }

      }
    );
  }


  languageOptions.forEach(option => {

    option.addEventListener(
      "click",
      () => {

        const selectedLanguage =
          option.dataset.lang;

        localStorage.setItem(
          "pragyaroot-language",
          selectedLanguage
        );

        languageOptions.forEach(item => {
          item.classList.remove("active");

          const check =
            item.querySelector("i");

          if (check) {
            check.remove();
          }
        });

        option.classList.add("active");

        const check =
          document.createElement("i");

        check.className =
          "fa-solid fa-check";

        option.appendChild(check);

        closeLanguageMenu();

        /*
         * The language selector is ready for
         * full Nepali/English translations.
         * We keep the page content unchanged
         * until translated content is added.
         */

      }
    );
  });


  document.addEventListener(
    "click",
    event => {

      if (
        languageMenu &&
        !languageMenu.hidden &&
        !languageMenu.contains(event.target) &&
        event.target !== languageBtn
      ) {
        closeLanguageMenu();
      }

    }
  );


  /* =========================================
     BACK TO TOP
  ========================================= */

  const backToTop =
    document.getElementById("backToTop");


  function updateBackToTop() {

    if (!backToTop) return;

    if (window.scrollY > 500) {

      backToTop.classList.add(
        "is-visible"
      );

    } else {

      backToTop.classList.remove(
        "is-visible"
      );

    }
  }


  window.addEventListener(
    "scroll",
    updateBackToTop,
    { passive: true }
  );

  updateBackToTop();


  if (backToTop) {

    backToTop.addEventListener(
      "click",
      () => {

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }
    );
  }


  /* =========================================
     CONTACT FORM
  ========================================= */

  const contactForm =
    document.getElementById("contactForm");

  const formMessage =
    document.getElementById("formMessage");


  if (contactForm) {

    contactForm.addEventListener(
      "submit",
      async event => {

        event.preventDefault();

        if (formMessage) {
          formMessage.textContent =
            "Sending message…";
        }

        const formData =
          new FormData(contactForm);

        try {

          const response =
            await fetch(
              contactForm.action,
              {
                method: "POST",
                body: formData,
                headers: {
                  Accept:
                    "application/json"
                }
              }
            );

          if (!response.ok) {
            throw new Error(
              "Form submission failed."
            );
          }

          contactForm.reset();

          if (formMessage) {
            formMessage.textContent =
              "Message sent successfully.";
          }

        } catch (error) {

          console.error(error);

          if (formMessage) {
            formMessage.textContent =
              "Something went wrong. Please try again.";
          }

        }

      }
    );
  }


  /* =========================================
     ACTIVE NAVIGATION
  ========================================= */

  const currentPath =
    window.location.pathname
      .replace(/\/+$/, "") || "/";


  document.querySelectorAll(
    ".pr-header-nav a, .pr-sidebar-link, .pr-mobile-link"
  ).forEach(link => {

    const linkPath =
      new URL(
        link.href,
        window.location.href
      ).pathname
        .replace(/\/+$/, "") || "/";

    link.classList.remove("active");

    if (linkPath === currentPath) {
      link.classList.add("active");
    }

  });


  /* =========================================
     ESCAPE KEY
  ========================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key !== "Escape") {
        return;
      }

      closeSearch();
      closeLanguageMenu();
      closeDrawer();

    }
  );

});
