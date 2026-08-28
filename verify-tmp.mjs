import { chromium } from 'playwright';
const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
for(const [w,h,tag] of [[1440,900,'desk'],[1920,1080,'wide'],[390,844,'phone']]){
  const c=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
  const p=await c.newPage();
  await p.goto('http://localhost:3000',{waitUntil:'networkidle'});
  await p.waitForTimeout(3500);
  const hero=await p.evaluate(()=>{
    const cv=document.querySelector('canvas');
    const box=[...document.querySelectorAll('div.relative.aspect-square')][0];
    const R=e=>e?{l:Math.round(e.getBoundingClientRect().left),r:Math.round(e.getBoundingClientRect().right),t:Math.round(e.getBoundingClientRect().top),b:Math.round(e.getBoundingClientRect().bottom)}:null;
    return {canvas:R(cv), box:R(box), vw:innerWidth, vh:innerHeight};
  });
  await p.screenshot({path:`shot-${tag}-hero.png`});
  // scroll to the wall
  await p.evaluate(()=>window.scrollTo(0, innerHeight*1.15));
  await p.waitForTimeout(3500);
  await p.screenshot({path:`shot-${tag}-wall.png`});
  console.log(tag, JSON.stringify(hero));
  await c.close();
}
await b.close();
