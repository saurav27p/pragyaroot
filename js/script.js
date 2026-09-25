 (function(){

  /* THEME */
  const root = document.documentElement;
  const themeBtn = document.getElementById("themeBtn");
  const themeIcon = document.getElementById("themeIcon");

  function applyTheme(theme){
    const dark = theme === "dark";
    root.classList.toggle("dark", dark);

    if(!themeIcon) return;

    themeIcon.innerHTML = dark
      ? `<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"></path>`
      : `
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
        <path d="M4.93 4.93l1.42 1.42"></path>
        <path d="M17.65 17.65l1.42 1.42"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="M4.93 19.07l1.42-1.42"></path>
        <path d="M17.65 6.35l1.42-1.42"></path>
      `;
  }

  const savedTheme = localStorage.getItem("pragyaroot-theme");
  if(savedTheme){
    applyTheme(savedTheme);
  }else{
    applyTheme(
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark" : "light"
    );
  }

  if(themeBtn){
    themeBtn.addEventListener("click", function(){
      const next = root.classList.contains("dark") ? "light" : "dark";
      localStorage.setItem("pragyaroot-theme", next);
      applyTheme(next);
    });
  }

  /* MOBILE DRAWER */
  const menuBtn = document.getElementById("menuBtn");
  const drawer = document.getElementById("mobileDrawer");
  const overlay = document.getElementById("overlay");
  const drawerClose = document.getElementById("drawerClose");

  function openDrawer(){
    if(!drawer || !overlay) return;
    drawer.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer(){
    if(!drawer || !overlay) return;
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  if(menuBtn) menuBtn.addEventListener("click", openDrawer);
  if(drawerClose) drawerClose.addEventListener("click", closeDrawer);
  if(overlay) overlay.addEventListener("click", closeDrawer);

  if(drawer){
    drawer.querySelectorAll("a").forEach(function(link){
      link.addEventListener("click", closeDrawer);
    });
  }

  /* LANGUAGE */
  const langBtn = document.getElementById("langBtn");
  const langMenu = document.getElementById("langMenu");

  if(langBtn && langMenu){
    langBtn.addEventListener("click", function(e){
      e.stopPropagation();
      langMenu.classList.toggle("open");
    });

    langMenu.querySelectorAll(".pr-lang-option").forEach(function(option){
      option.addEventListener("click", function(){
        root.lang = this.dataset.lang;
        langMenu.classList.remove("open");
      });
    });
  }

  /* SEARCH */
  const searchBtn = document.getElementById("searchBtn");
  const searchPanel = document.getElementById("searchPanel");
  const searchClose = document.getElementById("searchClose");
  const searchInput = document.getElementById("searchInput");
  const searchMeta = document.getElementById("searchMeta");
  const searchResults = document.getElementById("searchResults");

  let searchIndex = [];
  let searchTimer;

  function getSearchableText(el){
    let text = el.innerText || el.textContent || "";
    el.querySelectorAll("[alt],[title],[aria-label]").forEach(function(node){
      text += " " +
        (node.getAttribute("alt") || "") + " " +
        (node.getAttribute("title") || "") + " " +
        (node.getAttribute("aria-label") || "");
    });
    return text.replace(/\s+/g," ").trim();
  }

  function buildSearchIndex(){
    const selectors = [
      ".hero", ".trust-card", ".sh",
      ".subj-real", ".subj-dummy", ".grammar-item",
      ".games-real", ".tools-item", ".contact",
      ".pr-footer-about", ".pr-footer-top > div:not(.pr-footer-about)"
    ];
    searchIndex = [];
    document.querySelectorAll(selectors.join(",")).forEach(function(el){
      const text = getSearchableText(el);
      if(text){
        searchIndex.push({ el: el, text: text });
      }
    });
  }

  function makeExcerpt(text, query){
    const max = 150;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if(index === -1){
      return text.slice(0,max) + (text.length > max ? "…" : "");
    }

    let start = Math.max(0, index - 65);
    let end = Math.min(text.length, start + max);

    if(start > 0){
      const s = text.indexOf(" ", start);
      if(s !== -1) start = s;
    }

    let excerpt = text.slice(start, end).trim();
    if(start > 0) excerpt = "…" + excerpt;
    if(end < text.length) excerpt += "…";
    return excerpt;
  }

  function getResultTitle(el){
    const heading = el.querySelector("h1,h2,h3,h4,.sname,.games-real span:first-child");
    if(heading) return heading.textContent.trim();
    return (el.textContent || "Result").replace(/\s+/g," ").trim().slice(0,55);
  }

  function searchSite(query){
    if(!searchResults || !searchMeta) return;

    const cleanQuery = query.trim().toLowerCase();
    searchResults.innerHTML = "";

    if(!cleanQuery){
      searchMeta.textContent = "Start typing to search";
      return;
    }

    const matches = searchIndex.filter(function(item){
      return item.text.toLowerCase().indexOf(cleanQuery) !== -1;
    });

    searchMeta.textContent = matches.length + (matches.length === 1 ? " result" : " results");

    if(!matches.length){
      searchResults.innerHTML = '<div class="pr-search-empty">No matching content found.</div>';
      return;
    }

    matches.forEach(function(item){
      const result = document.createElement("div");
      result.className = "pr-search-result";

      const title = document.createElement("div");
      title.className = "pr-search-result-title";
      title.textContent = getResultTitle(item.el);

      const excerpt = document.createElement("div");
      excerpt.className = "pr-search-result-excerpt";
      excerpt.textContent = makeExcerpt(item.text, cleanQuery);

      result.appendChild(title);
      result.appendChild(excerpt);

      result.addEventListener("click", function(){
        closeSearch();
        item.el.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(function(){
          item.el.classList.add("pr-search-highlight");
          setTimeout(function(){
            item.el.classList.remove("pr-search-highlight");
          }, 1400);
        }, 350);
      });

      searchResults.appendChild(result);
    });
  }

  function openSearch(){
    if(!searchPanel || !searchInput) return;
    buildSearchIndex();
    searchPanel.classList.add("open");
    setTimeout(function(){ searchInput.focus(); }, 80);
  }

  function closeSearch(){
    if(!searchPanel || !searchInput || !searchResults || !searchMeta) return;
    searchPanel.classList.remove("open");
    searchInput.value = "";
    searchResults.innerHTML = "";
    searchMeta.textContent = "Start typing to search";
  }

  if(searchBtn && searchPanel){
    searchBtn.addEventListener("click", function(e){
      e.stopPropagation();
      if(searchPanel.classList.contains("open")) closeSearch();
      else openSearch();
    });
  }

  if(searchClose) searchClose.addEventListener("click", closeSearch);

  if(searchInput){
    searchInput.addEventListener("input", function(){
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function(){
        searchSite(searchInput.value);
      }, 40);
    });
  }

  /* OUTSIDE CLICK / ESCAPE */
  document.addEventListener("click", function(e){
    if(langMenu && langBtn && !langMenu.contains(e.target) && !langBtn.contains(e.target)){
      langMenu.classList.remove("open");
    }
    if(
      searchPanel &&
      searchBtn &&
      searchPanel.classList.contains("open") &&
      !searchPanel.contains(e.target) &&
      !searchBtn.contains(e.target)
    ){
      closeSearch();
    }
  });

  document.addEventListener("keydown", function(e){
    if(e.key === "Escape"){
      closeSearch();
      if(langMenu) langMenu.classList.remove("open");
      closeDrawer();
    }
  });

  /* BACK TO TOP */
  const backTop = document.getElementById("backTop");

  function updateBackTop(){
    if(!backTop) return;
    if(window.scrollY > 420) backTop.classList.add("visible");
    else backTop.classList.remove("visible");
  }

  window.addEventListener("scroll", updateBackTop, { passive:true });

  if(backTop){
    backTop.addEventListener("click", function(){
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  updateBackTop();

  /* REVEAL */
  if("IntersectionObserver" in window){
    const observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("on");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal").forEach(function(el){
      observer.observe(el);
    });
  }else{
    document.querySelectorAll(".reveal").forEach(function(el){
      el.classList.add("on");
    });
  }

  /* ROTATING TEXT */
  const words = [
    "CLASS 10 NOTES",
    "EXERCISE SOLUTIONS",
    "GRAMMAR GUIDES",
    "LEARNING GAMES",
    "SEE PREP TOOLS"
  ];

  let wordIndex = 0;
  const rotator = document.getElementById("rw");

  if(rotator){
    setInterval(function(){
      const next = (wordIndex + 1) % words.length;
      rotator.classList.remove("active");
      rotator.classList.add("exit");

      setTimeout(function(){
        rotator.textContent = words[next];
        rotator.classList.remove("exit");
        rotator.classList.add("active");
      }, 500);

      wordIndex = next;
    }, 3000);
  }

})();
