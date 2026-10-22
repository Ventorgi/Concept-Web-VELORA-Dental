// Teste izolate; nu înlocuiesc redarea într-un browser.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
class Node{
 constructor(){this.events={};this.attrs={};this.dataset={};this.hidden=false;this.paused=true;this.classes=new Set();this.style={};this.classList={add:k=>this.classes.add(k),remove:k=>this.classes.delete(k),contains:k=>this.classes.has(k),toggle:(k,v)=>v?this.classes.add(k):this.classes.delete(k)};}
 addEventListener(k,f){(this.events[k]??=[]).push(f)}emit(k,e={}){for(const f of this.events[k]||[])f(e)}
 setAttribute(k,v){this.attrs[k]=v}getAttribute(k){return k==='src'?this.src:this.attrs[k]}removeAttribute(k){delete this.attrs[k];if(k==='src')this.src=''}
 play(){this.paused=false;this.emit('play');return Promise.resolve()}pause(){this.paused=true;this.emit('pause')}load(){}focus(){this.focused=true}contains(){return false}closest(){return this}
 showModal(){this.open=true}close(){this.open=false;this.emit('close')}
}
function setup({width=1440,reduced=false,saveData=false}={}){
 const map={};for(const key of ['.header','.menu-toggle','#navigation','#hero-video','#video-toggle','.hero','.lightbox'])map[key]=new Node();
 const document=new Node(),motion=new Node(),screen=new Node(),observers=[];
 motion.matches=reduced;screen.matches=width>800;document.hidden=false;document.body=new Node();
 const video=map['#hero-video'];video.dataset.src='assets/videos/hero-cinematic.mp4';
 map['#navigation'].querySelectorAll=()=>[];
 const photos=[new Node(),new Node(),new Node()],picture=new Node();photos.forEach((p,i)=>{p.dataset.gallery='photo-'+i;p.querySelector=()=>({alt:'Image '+i})});
 const dialog=map['.lightbox'];const controls={'.lightbox-close':new Node(),'.lightbox-prev':new Node(),'.lightbox-next':new Node(),img:picture};dialog.querySelector=s=>controls[s];
 document.querySelector=s=>map[s]||null;document.querySelectorAll=s=>s==='[data-gallery]'?photos:[];
 class Observer{constructor(callback){this.callback=callback;observers.push(this)}observe(target){this.target=target}}
 vm.runInNewContext(fs.readFileSync('assets/js/script.js','utf8'),{document,window:{IntersectionObserver:Observer},IntersectionObserver:Observer,matchMedia:s=>s.includes('reduce')?motion:screen,navigator:{connection:{saveData}},innerWidth:width,scrollY:0,addEventListener(){},setTimeout:f=>f()});
 return {video,toggle:map['#video-toggle'],motion,document,observers,photos,dialog,controls,picture};
}
const desktop=setup();assert.equal(desktop.video.src,'assets/videos/hero-cinematic.mp4');assert.equal(desktop.video.playbackRate,.85);assert.equal(desktop.video.paused,false);
desktop.toggle.emit('click');assert(desktop.video.paused);assert.equal(desktop.video.style.animationPlayState,'paused');
desktop.observers[0].callback([{isIntersecting:false}]);desktop.observers[0].callback([{isIntersecting:true}]);assert(desktop.video.paused,'Manual pause must persist after scrolling back');
desktop.toggle.emit('click');assert(!desktop.video.paused);
desktop.observers[0].callback([{isIntersecting:false}]);assert(desktop.video.paused);desktop.observers[0].callback([{isIntersecting:true}]);assert(!desktop.video.paused);
desktop.motion.emit('change',{matches:true});assert.equal(desktop.video.src,'');assert(desktop.video.paused);assert(desktop.toggle.hidden);
for(const options of [{width:390},{reduced:true},{saveData:true}])assert.equal(setup(options).video.src,undefined,'Poster-only mode must not download video');
const gallery=setup();gallery.photos[2].emit('click');assert(gallery.dialog.open);assert.equal(gallery.picture.src,'photo-2');assert(gallery.controls['.lightbox-close'].focused);
gallery.controls['.lightbox-next'].emit('click');assert.equal(gallery.picture.src,'photo-0');
gallery.dialog.emit('keydown',{key:'ArrowLeft',preventDefault(){}});assert.equal(gallery.picture.src,'photo-2');
gallery.controls['.lightbox-close'].emit('click');assert(!gallery.dialog.open);assert(gallery.photos[2].focused);assert(!gallery.document.body.classes.has('locked'));
console.log('PASS: cinematic speed, pause/drift sync, offscreen pause/resume, manual pause persistence, reduced motion, mobile/data-saver poster, gallery arrows/wrap/close/focus.');
