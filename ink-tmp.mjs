import { chromium } from 'playwright';
const b=await chromium.launch();
const c=await b.newContext({viewport:{width:1200,height:600}});
const p=await c.newPage();
await p.setContent(`<body style="margin:0"><img id="i" src="http://localhost:3000/logo/wordmark.png"></body>`);
await p.waitForTimeout(1200);
const r=await p.evaluate(()=>{
  const img=document.getElementById('i');
  const w=img.naturalWidth,h=img.naturalHeight;
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;
  const cx=cv.getContext('2d');cx.drawImage(img,0,0);
  const d=cx.getImageData(0,0,w,h).data;
  let minX=w,maxX=0,minY=h,maxY=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    if(d[(y*w+x)*4+3]>16){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}
  }
  return JSON.stringify({w,h,ink:{minX,maxX,minY,maxY},
    padLeft:minX, padRight:w-1-maxX, padTop:minY, padBottom:h-1-maxY});
});
console.log(r);
await b.close();
