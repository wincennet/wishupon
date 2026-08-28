import { chromium } from 'playwright';
const b=await chromium.launch();
for(const [w,h] of [[1366,768],[1440,900],[1920,1080]]){
  const c=await b.newContext({viewport:{width:w,height:h}});
  const p=await c.newPage();
  await p.goto('http://localhost:3000',{waitUntil:'networkidle'});
  await p.waitForTimeout(1500);
  const m=await p.evaluate(()=>{
    const R=e=>{const r=e.getBoundingClientRect();return[Math.round(r.left),Math.round(r.right)];};
    const nav=document.querySelector('header nav');
    const logo=document.querySelector('header a[aria-label]');
    const cart=[...document.querySelectorAll('header a')].find(a=>a.textContent.includes('Cart'));
    const wallInner=document.querySelector('section.relative.z-10:not(#top) > div');
    const h2=[...document.querySelectorAll('h2')].find(x=>x.textContent.includes('Ready to post'));
    const see=[...document.querySelectorAll('a')].find(a=>a.textContent.includes('See everything'));
    const canvas=document.querySelector('canvas');
    return JSON.stringify({
      nav:R(nav), logo:logo?R(logo):null, cart:cart?R(cart):null,
      wallInner:wallInner?R(wallInner):null, h2:h2?R(h2):null, see:see?R(see):null,
      canvas:canvas?R(canvas):null, vw:window.innerWidth
    });
  });
  console.log(w, m);
  await c.close();
}
await b.close();
