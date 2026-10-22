// Verificare izolată a logicii JavaScript, fără browser sau date trimise.
const vm=require('vm'),fs=require('fs'),assert=require('assert');
class Element{constructor(){this.events={};this.attrs={};this.classes=new Set();this.classList={toggle:(x,v)=>v?this.classes.add(x):this.classes.delete(x),contains:x=>this.classes.has(x),add:x=>this.classes.add(x),remove:x=>this.classes.delete(x)};this.focused=false;}addEventListener(n,f){(this.events[n]??=[]).push(f)}emit(n,e={}){(this.events[n]||[]).forEach(f=>f(e))}setAttribute(n,v){this.attrs[n]=v}getAttribute(n){return this.attrs[n]}focus(){this.focused=true}contains(){return true}}
const header=new Element(),menu=new Element(),nav=new Element(),form=new Element(),doc=new Element();const link=new Element();nav.querySelectorAll=()=>[link];
const nodes={'.header':header,'.menu-toggle':menu,'#navigation':nav,'#formular':form};
doc.querySelector=s=>nodes[s]||null;doc.querySelectorAll=()=>[];
const context={window:{},document:doc,matchMedia:()=>({matches:false,addEventListener(){}}),addEventListener(){},scrollY:0,setTimeout:f=>f(),console};
vm.runInNewContext(fs.readFileSync('assets/js/script.js','utf8'),context);
menu.emit('click');assert.equal(menu.getAttribute('aria-expanded'),'true');assert(header.classes.has('menu-open'));
doc.emit('keydown',{key:'Escape'});assert.equal(menu.getAttribute('aria-expanded'),'false');assert(menu.focused);
menu.emit('click');link.emit('click');assert.equal(menu.getAttribute('aria-expanded'),'false');
let prevented=false;form.emit('submit',{preventDefault(){prevented=true}});assert(prevented);
prevented=false;form.emit('keydown',{key:'Enter',target:{tagName:'INPUT'},preventDefault(){prevented=true}});assert(prevented);
prevented=false;form.emit('keydown',{key:'Enter',target:{tagName:'TEXTAREA'},preventDefault(){prevented=true}});assert(!prevented);
const html=fs.readFileSync('contact.html','utf8');assert(/type="button">Trimite mesajul/.test(html));
assert(!/fetch\(|localStorage|console\./.test(fs.readFileSync('assets/js/script.js','utf8')));
console.log('PASS: mobile menu toggle, Escape and focus return, link close, blocked submit, blocked Enter in input, newline in textarea, inert button, no transmission/storage code.');
