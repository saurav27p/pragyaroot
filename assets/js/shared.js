/* Loads every shared block, then initializes its interactions. */
(function(){
  "use strict";
  const root=document.currentScript.closest("html");
  const base=root.dataset.componentsBase||"./components/";
  const targets=[...document.querySelectorAll("[data-component]")];
  Promise.all(targets.map(async el=>{const name=el.dataset.component;const res=await fetch(base+name+".html");if(!res.ok)throw new Error("Unable to load "+name);el.outerHTML=await res.text();})).then(init).catch(console.error);
  function init(){
    const $=id=>document.getElementById(id), menu=$("menuBtn"),drawer=$("mobileDrawer"),overlay=$("overlay"),close=$("drawerClose"),search=$("searchPanel"),searchBtn=$("searchBtn"),searchClose=$("searchClose"),theme=$("themeBtn"),back=$("backTop");
    const setDrawer=open=>{drawer?.classList.toggle("open",open);overlay?.classList.toggle("open",open);drawer?.setAttribute("aria-hidden",String(!open));menu?.setAttribute("aria-expanded",String(open));document.body.style.overflow=open?"hidden":""};
    menu?.addEventListener("click",()=>setDrawer(true));close?.addEventListener("click",()=>setDrawer(false));overlay?.addEventListener("click",()=>setDrawer(false));
    searchBtn?.addEventListener("click",()=>{const open=!search.classList.contains("open");search.classList.toggle("open",open);search.setAttribute("aria-hidden",String(!open));searchBtn.setAttribute("aria-expanded",String(open));if(open)$("searchInput")?.focus()});searchClose?.addEventListener("click",()=>search.classList.remove("open"));
    theme?.addEventListener("click",()=>{document.documentElement.classList.toggle("dark");localStorage.setItem("pragyaroot-theme",document.documentElement.classList.contains("dark")?"dark":"light")});if(localStorage.getItem("pragyaroot-theme")==="dark")document.documentElement.classList.add("dark");
    const scroll=()=>{document.querySelector(".pr-header")?.classList.toggle("scrolled",scrollY>8);back?.classList.toggle("visible",scrollY>420)};addEventListener("scroll",scroll,{passive:true});scroll();back?.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));
  }
})();
