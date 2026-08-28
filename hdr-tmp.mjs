import { chromium } from 'playwright';
const b=await chromium.launch();
const c=await b.newContext({viewport:{width:1366,height:768},deviceScaleFactor:3});
const p=await c.newPage();
await p.goto('http://localhost:3000',{waitUntil:'networkidle'});
await p.waitForTimeout(1500);
await p.screenshot({path:'hdr-left.png', clip:{x:90,y:0,width:280,height:80}});
await p.screenshot({path:'hdr-right.png', clip:{x:1080,y:0,width:200,height:80}});
const ink=await p.evaluate(async()=>{
  const img=document.querySelector('header img');
  const r=img.getBoundingClientRect();
  const cv=document.createElement('canvas');
  cv.width=img.naturalWidth; cv.height=img.naturalHeight;
  const cx=cv.getContext('2d'); cx.drawImage(img,0,0);
  const d=cx.getImageData(0,0,cv.width,cv.height).data;
  let minX=cv.width,maxX=0,minY=cv.height,maxY=0;
  for(let y=0;y<cv.height;y++)for(let x=0;x<cv.width;x++){
    if(d[(y*cv.width+x)*4+3]>16){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}
  }
  const sx=r.width/cv.width, sy=r.height/cv.height;
  return JSON.stringify({box:[Math.round(r.left),Math.round(r.right),Math.round(r.top),Math.round(r.bottom)],
    inkCss:{left:+(r.left+minX*sx).toFixed(1), right:+(r.left+maxX*sx).toFixed(1),
            top:+(r.top+minY*sy).toFixed(1), bottom:+(r.top+maxY*sy).toFixed(1)}});
});
console.log(ink);
await b.close();
