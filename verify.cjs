const fs=require('fs'),path=require('path');
const pages=fs.readdirSync('.').filter(f=>f.endsWith('.html'));
let errors=[];
if(pages.length!==5)errors.push('Expected exactly 5 HTML pages');
for(const file of pages){const text=fs.readFileSync(file,'utf8');
 if((text.match(/<h1[ >]/g)||[]).length!==1)errors.push(file+': H1');
 if(!text.includes('lang="ro"')||!text.includes('noindex, follow'))errors.push(file+': metadata');
 if(/\b(demo|demonstrativ|concept|fictiv)\b/i.test(text))errors.push(file+': forbidden label');
 if(/(?:tel:|mailto:|javascript:|href="#")/.test(text))errors.push(file+': inactive link violation');
 for(const match of text.matchAll(/(?:href|src|poster|data-src|data-gallery)="([^"]+)"/g)){
  const url=match[1];if(/^https?:/.test(url)){errors.push(file+': external asset '+url);continue;}
  const [target,anchor]=url.split('#');const targetFile=target||file;
  if(!fs.existsSync(targetFile)){errors.push(file+': missing '+targetFile);continue;}
  if(anchor&&targetFile.endsWith('.html')&&!fs.readFileSync(targetFile,'utf8').includes('id="'+anchor+'"'))errors.push(file+': missing anchor '+url);
 }
}
for(const stylesheet of ['assets/css/style.css','assets/css/fonts.css']){const css=fs.readFileSync(stylesheet,'utf8');
for(const m of css.matchAll(/url\(['"]?([^)'" ]+)/g)){let f=path.resolve('assets/css',m[1]);if(!fs.existsSync(f))errors.push('Missing CSS asset '+m[1]);}}
console.log(JSON.stringify({htmlPages:pages,errors},null,2));if(errors.length)process.exitCode=1;
