const header=document.querySelector('.header');
const menu=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#navigation');
const setMenu=open=>{header.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Închide meniul':'Deschide meniul');};
menu.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&header.classList.contains('menu-open')){setMenu(false);menu.focus();}});
header.addEventListener('focusout',()=>setTimeout(()=>{if(!header.contains(document.activeElement))setMenu(false)},0));
const updateHeader=()=>header.classList.toggle('scrolled',scrollY>40);
addEventListener('scroll',updateHeader,{passive:true});updateHeader();
matchMedia('(min-width:801px)').addEventListener('change',e=>{if(e.matches)setMenu(false)});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
// Mișcarea este inițializată mai jos; conținutul rămâne vizibil fără JavaScript.
const heroVideo=document.querySelector('#hero-video');
const toggle=document.querySelector('#video-toggle');
if(heroVideo){
 let userPaused=false,heroInView=true;
 heroVideo.defaultPlaybackRate=.85;heroVideo.playbackRate=.85;
 const syncVideo=()=>{toggle.setAttribute('aria-label',heroVideo.paused?'Redă videoclipul':'Pune videoclipul pe pauză');toggle.innerHTML=heroVideo.paused?'▷ <span>Redare</span>':'Ⅱ <span>Pauză</span>';heroVideo.style.animationPlayState=heroVideo.paused?'paused':'running';};
 if(!reduced.matches&&!navigator.connection?.saveData&&innerWidth>800){heroVideo.src=heroVideo.dataset.src;heroVideo.autoplay=true;heroVideo.play().then(()=>{toggle.hidden=false;syncVideo()}).catch(()=>{heroVideo.hidden=true})}
 toggle.addEventListener('click',()=>{userPaused=!heroVideo.paused;if(heroVideo.paused)heroVideo.play().catch(()=>{});else heroVideo.pause()});
 heroVideo.addEventListener('play',syncVideo);heroVideo.addEventListener('pause',syncVideo);
 reduced.addEventListener('change',e=>{if(e.matches){heroVideo.pause();heroVideo.removeAttribute('src');heroVideo.load();toggle.hidden=true}});
 const resumeHero=()=>{if(!document.hidden&&heroInView&&!userPaused&&!reduced.matches&&heroVideo.getAttribute('src'))heroVideo.play().catch(()=>{})};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)heroVideo.pause();else resumeHero()});
 if('IntersectionObserver' in window){new IntersectionObserver(entries=>{heroInView=entries[0].isIntersecting;if(!heroInView)heroVideo.pause();else resumeHero()},{threshold:.05}).observe(heroVideo.closest('.hero'));}
}
const form=document.querySelector('#formular');
if(form){form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.tagName!=='TEXTAREA')e.preventDefault()});}
const dialog=document.querySelector('.lightbox');
if(dialog){const photos=[...document.querySelectorAll('[data-gallery]')];let current=0,opener;
 const show=i=>{current=(i+photos.length)%photos.length;dialog.querySelector('img').src=photos[current].dataset.gallery;dialog.querySelector('img').alt=photos[current].querySelector('img').alt;};
 photos.forEach((p,i)=>p.addEventListener('click',()=>{opener=p;show(i);dialog.showModal();document.body.classList.add('locked');dialog.querySelector('.lightbox-close').focus()}));
 dialog.querySelector('.lightbox-close').addEventListener('click',()=>dialog.close());
 dialog.querySelector('.lightbox-prev').addEventListener('click',()=>show(current-1));dialog.querySelector('.lightbox-next').addEventListener('click',()=>show(current+1));
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();show(current-1)}if(e.key==='ArrowRight'){e.preventDefault();show(current+1)}});
 dialog.addEventListener('close',()=>{document.body.classList.remove('locked');opener?.focus()});
}
const clinicVideo=document.querySelector('.clinic-video');
if(clinicVideo&&'IntersectionObserver' in window){new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)clinicVideo.pause()})},{threshold:.1}).observe(clinicVideo);}

// Animații la intrare și mișcare sincronizată cu scrollul, fără a modifica scrollul nativ.
if('IntersectionObserver' in window&&typeof Element!=='undefined'&&Element.prototype.animate){
 const animated=new WeakSet(),running=new Set(),active=new Set();
 const textSelector='main h1, main h2, main h3, main p, main .actions, main .treatment li, main .prices dl>div, main details, .footer-grid>div';
 const textElements=[...document.querySelectorAll(textSelector)];
 const imageElements=[...document.querySelectorAll('main img:not(.line-icon img):not(.lightbox img), .clinic-video')];
 const enter=new IntersectionObserver(entries=>{
  if(reduced.matches)return;
  entries.forEach(entry=>{if(!entry.isIntersecting||animated.has(entry.target))return;
   const el=entry.target;animated.add(el);enter.unobserve(el);
   // Nu animăm un element în timp ce utilizatorul interacționează cu el.
   if(el.contains(document.activeElement))return;
   const siblings=[...el.parentElement.children].filter(node=>node.matches?.('h1,h2,h3,p,article,a,li,div,details'));
   const delay=Math.min(Math.max(0,siblings.indexOf(el))*45,135);
   const photo=el.matches('img,video');
   const animation=el.animate(photo?[
    {opacity:.55,transform:'scale(1.035)'},{opacity:1,transform:'scale(1)'}
   ]:[{opacity:.25,transform:'translateY(18px) scale(.985)'},{opacity:1,transform:'translateY(0) scale(1)'}],
   {duration:photo?850:650,delay,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'});
   running.add(animation);animation.finished.then(()=>running.delete(animation)).catch(()=>running.delete(animation));
  });
 },{threshold:.08,rootMargin:'0px 0px -20px 0px'});
 [...textElements,...imageElements.filter(el=>!el.closest('.hero'))].forEach(el=>enter.observe(el));
 const scrollElements=[...document.querySelectorAll('main h1,main h2,.wide-photo img,.photo-pair img,.panorama>img,.treatment>img,.team-grid img,.gallery-item img')];
 scrollElements.forEach(el=>el.classList.add('scroll-motion'));
 let frame=0;
 const render=()=>{frame=0;if(reduced.matches||document.hidden)return;
  const compact=innerWidth<=800;
  active.forEach(el=>{const rect=el.getBoundingClientRect();
   const progress=Math.max(-1,Math.min(1,(innerHeight/2-(rect.top+rect.height/2))/(innerHeight/2+rect.height/2)));
   const title=el.matches('h1,h2'),travel=title?(compact?4:8):(compact?4:9);
   el.style.setProperty('--scroll-y',(progress*travel).toFixed(2)+'px');
   // Zoomul acoperă cadrul și la deplasarea maximă, fără margini goale.
   el.style.setProperty('--scroll-scale',title?'1':(1.015+2*travel/Math.max(rect.height,160)+(1-Math.abs(progress))*.012).toFixed(4));
  });
 };
 const requestRender=()=>{if(!frame&&!reduced.matches)frame=requestAnimationFrame(render)};
 const visibility=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)active.add(e.target);else active.delete(e.target)});requestRender()},{rootMargin:'80px'});
 scrollElements.forEach(el=>visibility.observe(el));
 addEventListener('scroll',requestRender,{passive:true});addEventListener('resize',requestRender,{passive:true});
 document.addEventListener('visibilitychange',requestRender);
 reduced.addEventListener('change',()=>{if(reduced.matches){running.forEach(animation=>animation.cancel());if(frame){cancelAnimationFrame(frame);frame=0;}scrollElements.forEach(el=>{el.style.removeProperty('--scroll-y');el.style.removeProperty('--scroll-scale')});}else requestRender()});
}
