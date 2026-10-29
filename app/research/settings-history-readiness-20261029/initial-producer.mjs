import { createRequire } from 'node:module';
import { writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root='/workspace/pump-app-privacy-links';
const require=createRequire(root+'/app/packages/frontend/package.json');
const {chromium,expect}=require('@playwright/test');
const base='http://127.0.0.1:3027';
const mint='7bS1mH6MXbw1GnEkKTU6w5YLTywPkQ1w3YVZXWFupump';
const browser=await chromium.launch({headless:true});
const results=[];
try {
 for(const mode of ['light-original','light-interactive']) {
  const context=await browser.newContext({viewport:{width:390,height:844},storageState:{cookies:[{name:'clickwrap_accepted',value:'true',domain:'127.0.0.1',path:'/',expires:-1,httpOnly:false,secure:false,sameSite:'Lax'}],origins:[]}});
  const requests=[],errors=[],external=[];
  await context.route('https://**/*',route=>(external.push(route.request().url()),route.abort()));
  await context.addInitScript(()=>{
   const trace=[];
   const stateInfo=(state)=>({next:state?.__NA??null,renderedSearch:state?.__PRIVATE_NEXTJS_INTERNALS_TREE?.renderedSearch??null});
   const snapshot=()=>({url:location.pathname+location.search+location.hash,length:history.length,state:stateInfo(history.state),
     settingsOpen:[...document.querySelectorAll('dialog[open]')].some(n=>n.querySelector('h2')?.textContent==='Settings'),
     sidebar:document.querySelector('[data-app-shell]')?.getAttribute('data-mobile-navigation')??null,
     overflow:document.body?.style.overflow??null,focused:document.activeElement?.getAttribute('aria-label')??document.activeElement?.id??null});
   const record=(event,detail={})=>{if(trace.length<400)trace.push({time:Math.round(performance.now()*10)/10,event,url:location.pathname+location.search,state:stateInfo(history.state),detail});};
   window.__settingsBack={trace,record,snapshot};
   for(const method of ['pushState','replaceState']){const original=history[method];history[method]=function(state,title,url){record(method+':before',{input:stateInfo(state),url:String(url)});const result=original.apply(this,arguments);record(method+':after');return result;};}
   for(const method of ['showModal','close']){const original=HTMLDialogElement.prototype[method];HTMLDialogElement.prototype[method]=function(){const result=original.apply(this,arguments);record('dialog:'+method,{id:this.id,label:this.getAttribute('aria-label')});return result;};}
   addEventListener('popstate',event=>{record('popstate',{eventState:stateInfo(event.state)});queueMicrotask(()=>record('popstate:microtask'));requestAnimationFrame(()=>record('popstate:frame'));});
   addEventListener('DOMContentLoaded',()=>record('DOMContentLoaded'));addEventListener('load',()=>record('load'));
   window.navigation?.addEventListener('navigate',event=>record('navigate',{type:event.navigationType,url:event.destination.url,sameDocument:event.destination.sameDocument}));
  });
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(request.headers().rsc==='1')requests.push({event:'request',url:request.url(),time:Date.now()});});
  page.on('response',response=>{if(response.request().headers().rsc==='1')requests.push({event:'response',url:response.url(),status:response.status(),time:Date.now()});});
  await page.goto(base+`/live?stream=${mint}`);
  const playback=page.locator('#main-content').getByTestId('playback-unavailable');await expect(playback).toBeVisible();
  
  const seed=async()=>{await page.evaluate(()=>{window.__settingsBack.record('seed:before');history.pushState(null,'',`${location.pathname}${location.search}&step=2`);window.__settingsBack.record('seed:after');});};
  if(mode==='light-original'){await seed();await expect(page).toHaveURL(/step=2$/);}
  await page.getByRole('button',{name:'Open navigation',exact:true}).click();
  if(mode==='light-interactive'){await expect(page.locator('[data-app-shell]')).toHaveAttribute('data-mobile-navigation','open');await seed();await expect(page).toHaveURL(/step=2$/);}
  const launcher=page.getByRole('button',{name:'Open settings',exact:true});await launcher.click();
  const dialog=page.getByRole('dialog',{name:'Settings',exact:true});await expect(dialog).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('overflow','hidden');
  await page.goBack();
  let closed=false,failure=null;
  try{await expect(dialog).not.toBeVisible({timeout:3000});closed=true;}catch(error){failure=error.message;}
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const {trace,final}=await page.evaluate(()=>({trace:window.__settingsBack.trace,final:window.__settingsBack.snapshot()}));
  results.push({mode,closed,failure,trace,final,requests,errors,external,launcherFocused:await launcher.evaluate(node=>node===document.activeElement),streamPreserved:new URL(page.url()).searchParams.get('stream')===mint,playbackVisible:await playback.isVisible()});
  await context.close();
 }
 const sha=(bytes)=>createHash('sha256').update(bytes).digest('hex');const inputs={};
 for(const file of ['src/components/settings/settings-control.tsx','tests/settings.spec.ts','src/components/ui/sidebar.tsx','src/app/live/live-discovery.tsx'])inputs[file]=sha(await readFile(root+'/app/packages/frontend/'+file));
 await writeFile('/tmp/settings-back-light-baseline.json',JSON.stringify({baseline:'31cea320be04121f25ebb2effb34ad54b5458a64',inputs,browser:browser.version(),results},null,2)+'\n');
 console.log(JSON.stringify(results.map(r=>({mode:r.mode,closed:r.closed,final:r.final,seed:r.trace.filter(t=>t.event==='seed:before'||t.event==='seed:after'),pop:r.trace.filter(t=>t.event==='popstate'),errors:r.errors,external:r.external})),null,2));
}finally{await browser.close();}
