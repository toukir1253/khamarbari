
/* ===== সাধারণ সহায়ক (থ্রিডি ছাড়াই চলে) ===== */
window.bn=function(n){return String(n).replace(/\d/g,function(d){return '০১২৩৪৫৬৭৮৯'[d];});};
window.fmtN=function(n){return window.bn(Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,','));};
window.el=function(tag,props,kids){var e=document.createElement(tag);if(props)for(var k in props){if(k==='text')e.textContent=props[k];else if(k==='cls')e.className=props[k];else e.setAttribute(k,props[k]);}(kids||[]).forEach(function(c){if(c)e.appendChild(typeof c==='string'?document.createTextNode(c):c);});return e;};
window.store={get:function(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v);}catch(e){return d;}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};

/* ===== খামারের মাপ ও জমির হিসাব: ১ ইউনিট = ১ মিটার ===== */
window.FARM=(function(){
 var W={x0:-80,x1:80,z0:-48,z1:42},GX=46,BIGHA=1440;            // ১৬০ মি × ৯০ মি = ১৪,৪০০ বর্গমিটার = ১০ বিঘা
 var P={cx:-42,cz:-13.2,a:37.3,b:34.5,n:8};                      // পুকুরের আকার: গোল-কোণা আয়তক্ষেত্র
 function pt(t,sc){var c=Math.cos(t),s=Math.sin(t);return [P.cx+(c<0?-1:1)*Math.pow(Math.abs(c),2/P.n)*P.a*sc,P.cz+(s<0?-1:1)*Math.pow(Math.abs(s),2/P.n)*P.b*sc];}
 function outline(N,sc){var o=[];for(var i=0;i<N;i++)o.push(pt(i/N*Math.PI*2,sc||1));return o;}
 function area(p){var A=0;for(var i=0;i<p.length;i++){var q=p[(i+1)%p.length];A+=p[i][0]*q[1]-q[0]*p[i][1];}return Math.abs(A)/2;}
 P.b=P.b*(3.5*BIGHA)/area(outline(1440,1));                       // পুকুর ঠিক ৩.৫ বিঘা হওয়ার মতো করে মেলানো
 var MANGO={x0:-3.65,x1:14.81,z0:-48,z1:30},NAPIER={x0:14.81,x1:42.5,z0:-48,z1:30};
 var ra=function(r){return (r.x1-r.x0)*(r.z1-r.z0);};
 var rows=[
  {k:'pond',n:'পুকুর (জলাশয়)',bigha:3.5,c:'#3aa0b8',drawn:area(outline(1440,1))},
  {k:'grass',n:'ঘাস চাষের জমি (নেপিয়ার)',bigha:1.5,c:'#8aa84a',drawn:ra(NAPIER)},
  {k:'mango',n:'হিমসাগর আম বাগান',bigha:1.0,c:'#5a9a45',drawn:ra(MANGO)},
  {k:'live',n:'গরু, ছাগল ও মুরগির খামার',bigha:1.3,c:'#c9955a'},
  {k:'mill',n:'তেল ও ঘিয়ের মিল ও উঠান',bigha:0.6,c:'#d9a23a'},
  {k:'house',n:'ডুপ্লেক্স, অফিস ও গোডাউন',bigha:1.2,c:'#e0b84a'},
  {k:'gate',n:'প্রবেশপথ, সড়ক ও সবুজায়ন',bigha:0.9,c:'#9a9a94'}];
 rows.forEach(function(r){r.m2=r.bigha*BIGHA;});
 return {W:W,GX:GX,BIGHA:BIGHA,POND:P,pondPt:pt,pondOutline:outline,MANGO:MANGO,NAPIER:NAPIER,rows:rows,
  totalBigha:rows.reduce(function(s,r){return s+r.bigha;},0),totalM2:(W.x1-W.x0)*(W.z1-W.z0),
  COW:100,GOAT:200,HEN:10000};
})();

/* ===== ২ডি ম্যাপ ও হিসাব: থ্রিডি না চললে বা নেট না থাকলে এটাই দেখায় ===== */
window.showPlan2D=function(note){
 var F=window.FARM,W=F.W,old=document.getElementById('plan2d');if(old)old.remove();
 var root=el('div',{id:'plan2d',cls:'plan'});
 var ok=!!window.__3dOk;
 var btn=el('button',{type:'button',cls:'btn on',text:ok?'← ৩ডি দৃশ্যে ফিরুন':'↻ আবার চেষ্টা করুন'});
 btn.addEventListener('click',function(){if(ok)root.remove();else location.reload();});
 root.appendChild(el('div',{cls:'planhead'},[el('h1',{text:'১০ বিঘা সমন্বিত খামার: ২ডি ম্যাপ ও হিসাব'}),btn]));
 if(note)root.appendChild(el('p',{cls:'plannote',text:note}));
 var NS='http://www.w3.org/2000/svg',pad=5;
 var svg=document.createElementNS(NS,'svg');
 svg.setAttribute('viewBox',(W.x0-pad)+' '+(W.z0-pad)+' '+(W.x1-W.x0+2*pad)+' '+(W.z1-W.z0+2*pad+9));
 svg.setAttribute('role','img');svg.setAttribute('aria-label','খামারের ২ডি ম্যাপ। ১ ইউনিট = ১ মিটার');
 function S(tag,a){var e=document.createElementNS(NS,tag);for(var k in a)e.setAttribute(k,a[k]);svg.appendChild(e);return e;}
 function R(x0,x1,z0,z1,fill,op,stroke){return S('rect',{x:x0,y:z0,width:x1-x0,height:z1-z0,fill:fill,opacity:op||1,stroke:stroke||'none','stroke-width':0.35,rx:0.6});}
 function T(x,z,s,size,fill){var t=S('text',{x:x,y:z,'font-size':size||3,fill:fill||'#fff','text-anchor':'middle','font-family':'Hind Siliguri,Noto Sans Bengali,sans-serif','font-weight':600});t.textContent=s;return t;}
 R(W.x0,W.x1,W.z0,W.z1,'#86b35a');
 var po=F.pondOutline(240,1).map(function(p){return p[0].toFixed(2)+','+p[1].toFixed(2);}).join(' ');
 S('polygon',{points:po,fill:'#2a86c9',stroke:'#9cc468','stroke-width':0.7});
 R(F.MANGO.x0,F.MANGO.x1,F.MANGO.z0,F.MANGO.z1,'#5a9a45',0.95,'#2d6a2b');
 R(F.NAPIER.x0,F.NAPIER.x1,F.NAPIER.z0,F.NAPIER.z1,'#8aa84a',0.95,'#5d7a2a');
 R(F.GX-3.5,F.GX+3.5,W.z0,W.z1+14,'#8e8b84');R(F.GX+3.5,W.x1,9,12,'#8e8b84');
 R(54,78,18,36,'#d9a23a',1,'#7a4b12');R(54,78,-15,8,'#c9955a',1,'#7a4b12');R(53,79,-30,-18,'#a4b88a',1,'#4a5d3a');R(54,76,-46,-33,'#b89a7a',1,'#5a4630');
 R(-76,-40,23,39,'#e0b84a',1,'#7a5a1a');R(-34,-6,22.5,30.5,'#bdb7a8',1,'#6b6a64');
 S('circle',{cx:-30,cy:5,r:3.6,fill:'#c9a35a',stroke:'#7a5a3a','stroke-width':0.4});
 S('rect',{x:W.x0,y:W.z0,width:W.x1-W.x0,height:W.z1-W.z0,fill:'none',stroke:'#8a3a28','stroke-width':1.1});
 S('line',{x1:W.x0,y1:W.z1,x2:W.x1,y2:W.z1,stroke:'#f0b84a','stroke-width':0.4,'stroke-dasharray':'2 2'});
 R(F.GX-5,F.GX+5,W.z1-0.7,W.z1+0.7,'#86b35a');
 T(-42,-14,'পুকুর ৩.৫ বিঘা',4.2);T(-42,-9,'১ ইউনিট = ১ মিটার',2.8,'#d8ecf7');
 T((F.MANGO.x0+F.MANGO.x1)/2,-8,'আম',3.6);T((F.MANGO.x0+F.MANGO.x1)/2,-4,'১ বিঘা',2.8);
 T((F.NAPIER.x0+F.NAPIER.x1)/2,-8,'নেপিয়ার ঘাস',3.4);T((F.NAPIER.x0+F.NAPIER.x1)/2,-4,'১.৫ বিঘা',2.8);
 T(66,-3,'গরু ১০০',3.4);T(66,1,'৫ লাইন × ২০',2.5);
 T(66,-23,'ছাগল ২০০',3.4);T(66,-19.6,'৪ লাইন × ৫০',2.4);
 T(65,-40.5,'মুরগি ১০,০০০',3.2);T(65,-37,'৪ তলা',2.6);
 T(66,27,'সরিষা, নারিকেল তেল ও ঘি',2.9,'#3a2208');
 T(-58,31,'ডুপ্লেক্স, অফিস, গোডাউন',2.9,'#3a2a08');T(-20,27,'পার্কিং',2.7,'#33322e');
 T(-30,6,'গোল ঘর',2.2,'#3a2a08');T(F.GX,W.z1+5.5,'প্রধান ফটক',3);
 S('line',{x1:W.x0,y1:W.z1+9,x2:W.x0+10,y2:W.z1+9,stroke:'#fff','stroke-width':0.8});T(W.x0+5,W.z1+7.6,'১০ মি',2.6);
 T(0,W.z1+7.6,'জমি ১৬০ মি × ৯০ মি = ১৪,৪০০ বর্গমিটার (১০ বিঘা)',3);
 svg.style.width='100%';svg.style.height='auto';svg.style.background='#0d1a13';svg.style.borderRadius='12px';
 root.appendChild(svg);
 /* জমির হিসাব টেবিল */
 var tb=el('table',{cls:'ptab'}),th=el('tr',null,['অংশ','বিঘা','বর্গমিটার','শতাংশ','মডেলে আঁকা (বর্গমিটার)'].map(function(h){return el('th',{text:h});}));
 tb.appendChild(el('thead',null,[th]));var body=el('tbody');
 F.rows.forEach(function(r){var sw=el('i');sw.style.background=r.c;
  body.appendChild(el('tr',null,[el('td',null,[sw,' '+r.n]),el('td',{text:bn(r.bigha.toFixed(2))}),el('td',{text:fmtN(r.m2)}),el('td',{text:bn((r.m2/F.totalM2*100).toFixed(1))+'%'}),el('td',{text:r.drawn?'≈ '+fmtN(r.drawn):'—'})]));});
 body.appendChild(el('tr',{cls:'tot'},[el('td',{text:'মোট'}),el('td',{text:bn(F.totalBigha.toFixed(2))}),el('td',{text:fmtN(F.totalM2)}),el('td',{text:'১০০.০%'}),el('td',{text:'—'})]));
 tb.appendChild(body);root.appendChild(tb);
 root.appendChild(el('p',{cls:'plannote',text:'হিসাব: ১ বিঘা = ১,৪৪০ বর্গমিটার ধরা হয়েছে, তাই ১০ বিঘা = ১৪,৪০০ বর্গমিটার। স্কেল: ১ ইউনিট = ১ মিটার। জমির মাপ ১৬০ মি × ৯০ মি = ১৪,৪০০ বর্গমিটার। শেষ কলামে ৩ডি মডেলে আসলে যতটুকু জায়গা আঁকা আছে তার হিসাব।'}));
 var tb2=el('table',{cls:'ptab'});tb2.appendChild(el('thead',null,[el('tr',null,['প্রাণী ও পাখি','সংখ্যা','সাজানোর ধরন'].map(function(h){return el('th',{text:h});}))]));
 var b2=el('tbody');[['গরু','১০০','৫টি লাইন, প্রতি লাইনে ২০টি'],['ছাগল','২০০','৪টি লাইন, প্রতি লাইনে ৫০টি'],['ডিম পাড়া লেয়ার মুরগি','১০,০০০','৪ তলা বিল্ডিং, প্রতি তলায় ২,৫০০টি, খাঁচার থাকে থাকে'],['তেলের মিল','৩ পণ্য','সরিষার তেল, নারিকেল তেল ও ঘি']].forEach(function(r){b2.appendChild(el('tr',null,r.map(function(c){return el('td',{text:c});})));});
 tb2.appendChild(b2);root.appendChild(tb2);
 document.body.appendChild(root);
};

/* ===== থ্রিডি লাইব্রেরি: একটা সার্ভার না চললে পরেরটা চেষ্টা করে। i = Integrity হ্যাশ (ফাইল বদলানো থাকলে ব্রাউজার চালাবেই না) ===== */
window.THREE_SRC=[
 {u:'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',i:'__SRI_CDNJS__'},
 {u:'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js',i:'__SRI_JSD__'},
 {u:'https://unpkg.com/three@0.128.0/build/three.min.js',i:'__SRI_JSD__'}];
window.loadThree=function(){return new Promise(function(res,rej){var i=0,round=0;
 (function next(){if(window.THREE)return res();if(i>=window.THREE_SRC.length){if(round<1){round++;i=0;setTimeout(next,900);return;}return rej(new Error('three.js লোড হয়নি'));}
  var src=window.THREE_SRC[i++],s=document.createElement('script'),done=false;
  var tm=setTimeout(function(){if(done)return;done=true;s.remove();next();},10000);
  s.src=src.u;if(src.i&&src.i.indexOf('__')!==0)s.integrity=src.i;s.crossOrigin='anonymous';
  s.onload=function(){if(done)return;done=true;clearTimeout(tm);window.THREE?res():next();};
  s.onerror=function(){if(done)return;done=true;clearTimeout(tm);next();};
  document.head.appendChild(s);})();});};
/* এরর দেখানো: শুধু textContent, innerHTML নয় */
window.showLoadErr=function(msg){var l=document.getElementById('load');if(l)l.classList.add('off');window.showPlan2D(msg);};
window.__retrying3D=false;
window.clear3DRetryFlag=function(){try{var u=new URL(location.href);if(u.searchParams.has('kb3d_retry')){u.searchParams.delete('kb3d_retry');history.replaceState(null,'',u.pathname+(u.search?u.search:'')+u.hash);}}catch(e){}};
window.retry3DStart=function(msg){if(window.__retrying3D)return;window.__retrying3D=true;try{var u=new URL(location.href);if(u.searchParams.get('kb3d_retry')!=='1'){u.searchParams.set('kb3d_retry','1');location.replace(u.href);return;}u.searchParams.delete('kb3d_retry');history.replaceState(null,'',u.pathname+(u.search?u.search:'')+u.hash);}catch(e){}window.showLoadErr(msg);};
window.addEventListener('error',function(e){var l=document.getElementById('load');if(l&&!l.classList.contains('off')&&!window.__3dOk)window.retry3DStart('সমস্যা: '+(e.message||'অজানা ত্রুটি')+'। ৩ডি চালু করা যায়নি; নিচে ২ডি ম্যাপ ও হিসাব দেখানো হলো।');});
/* মোবাইল/কম ক্ষমতার ফোন চেনা: শুরুতেই লাইট মোড */
window.LITE_WEAK=(function(){try{return (navigator.hardwareConcurrency||8)<=2||(navigator.deviceMemory||8)<=2;}catch(e){return false;}})();
window.LITE0=(function(){var s=window.store.get('khamar.settings',{});if(typeof s.lite==='boolean')return s.lite;
 try{var cores=navigator.hardwareConcurrency||8,mem=navigator.deviceMemory||8,coarse=window.matchMedia&&matchMedia('(pointer:coarse)').matches,small=Math.min(screen.width,screen.height)<700;
  return (coarse&&small)||cores<=4||mem<=3;}catch(e){return false;}})();
