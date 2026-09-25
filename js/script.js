(function(){
  const $=s=>document.querySelector(s), root=document.documentElement;
  const saved=localStorage.getItem('pragyaroot-theme');
  if(saved==='dark'||(!saved&&matchMedia('(prefers-color-scheme: dark)').matches)) root.classList.add('dark');
  $('#themeBtn').addEventListener('click',()=>{root.classList.toggle('dark');localStorage.setItem('pragyaroot-theme',root.classList.contains('dark')?'dark':'light')});
  const drawer=$('#mobileDrawer'), overlay=$('#overlay');
  const close=()=>{drawer.classList.remove('open');overlay.classList.remove('open');document.body.style.overflow=''};
  $('#menuBtn').addEventListener('click',()=>{drawer.classList.add('open');overlay.classList.add('open');document.body.style.overflow='hidden'});$('#drawerClose').addEventListener('click',close);overlay.addEventListener('click',close);drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  $('#langBtn').addEventListener('click',e=>{e.stopPropagation();$('#langMenu').classList.toggle('open')});document.addEventListener('click',()=>$('#langMenu').classList.remove('open'));
  const panel=$('#searchPanel'), input=$('#searchInput'), results=$('#searchResults');
  $('#searchBtn').addEventListener('click',()=>{panel.style.display=panel.style.display==='block'?'none':'block';if(panel.style.display==='block')input.focus()});$('#searchClose').addEventListener('click',()=>panel.style.display='none');
  input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();results.innerHTML='';const items=[...document.querySelectorAll('.searchable')].filter(x=>(x.innerText||'').toLowerCase().includes(q));$('#searchMeta').textContent=q?`${items.length} result${items.length===1?'':'s'}`:'Start typing to search';items.forEach(item=>{const r=document.createElement('div');r.className='search-result';r.innerHTML=`<strong>${(item.querySelector('h2,h1,strong')||{textContent:'Result'}).textContent}</strong><br><small>${item.innerText.slice(0,120)}…</small>`;r.onclick=()=>{panel.style.display='none';item.scrollIntoView({behavior:'smooth',block:'center'})};results.appendChild(r)})});
  const words=['CLASS 10 NOTES','EXERCISE SOLUTIONS','GRAMMAR GUIDES','LEARNING GAMES','SEE PREP TOOLS'];let i=0;setInterval(()=>{$('#rotatingText').textContent=words[++i%words.length]},3000);
  addEventListener('scroll',()=>$('#backTop').classList.toggle('visible',scrollY>400));$('#backTop').onclick=()=>scrollTo({top:0,behavior:'smooth'});
  if('IntersectionObserver' in window){const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');ob.unobserve(e.target)}}),{threshold:.1});document.querySelectorAll('.reveal').forEach(x=>ob.observe(x))}else document.querySelectorAll('.reveal').forEach(x=>x.classList.add('on'));
  $('#contactForm').addEventListener('submit',async e=>{e.preventDefault();const form=e.target,msg=$('#formMessage'),button=form.querySelector('button');button.disabled=true;button.textContent='Sending...';try{const r=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});if(!r.ok)throw Error();msg.textContent='Message sent. We will get back soon.';form.reset()}catch(err){msg.textContent='Unable to send. Please try again.'}finally{button.disabled=false;button.innerHTML='<i class="fa-solid fa-paper-plane"></i> Send'}});
})();
