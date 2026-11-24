
(function(){
'use strict';
const WA='8801909787087', KEY='khamarbari.biz.v1';
const base=[
 {id:'pond',name:'পুকুর ও মাছ',area:3.5,qty:'মাছের মজুত',stock:'মাছের সংখ্যা/ওজন পরে বসান',invest:0,cost:0,units:0,price:350,unit:'কেজি'},
 {id:'grass',name:'নেপিয়ার ঘাস',area:1.5,qty:'ঘাস উৎপাদন',stock:'কাটার পরিমাণ পরে বসান',invest:0,cost:0,units:0,price:5,unit:'কেজি'},
 {id:'mango',name:'হিমসাগর আম বাগান',area:1,qty:'আমের গাছ',stock:'গাছের সংখ্যা পরে বসান',invest:0,cost:0,units:0,price:100,unit:'কেজি'},
 {id:'live',name:'গরু-ছাগল-মুরগি ফার্ম',area:1.3,qty:'১০০ গরু · ২০০ ছাগল · ১০,০০০ মুরগি',stock:'ডিমের উৎপাদন দৈনিক ইনপুটে হিসাব হবে',invest:0,cost:0,units:0,price:12,unit:'ডিম'},
 {id:'mill',name:'তেল ও ঘিয়ের মিল',area:.6,qty:'সরিষার তেল · নারিকেল তেল · ঘি',stock:'উৎপাদন ও বিক্রি পরে বসান',invest:0,cost:0,units:0,price:250,unit:'লিটার'},
 {id:'house',name:'ডুপ্লেক্স, অফিস ও গোডাউন',area:1.2,qty:'বসবাস · অফিস · সংরক্ষণ',stock:'প্রযোজ্য নয়',invest:0,cost:0,units:0,price:0,unit:'ইউনিট'},
 {id:'gate',name:'প্রবেশপথ ও সবুজায়ন',area:.9,qty:'সড়ক · ফটক · বাগান',stock:'প্রযোজ্য নয়',invest:0,cost:0,units:0,price:0,unit:'ইউনিট'}
];
let data;try{data=JSON.parse(localStorage.getItem(KEY))||null}catch(e){}
if(!data||!Array.isArray(data.zones))data={zones:base.map(x=>({...x})),eggsPerDay:0,milkPerDay:0,otherIncome:0,otherCost:0};
const fmt=n=>'৳'+Math.round(Number(n)||0).toLocaleString('en-BD');
const num=n=>Math.max(0,Number(n)||0);
const panel=document.getElementById('bizPanel'),content=document.getElementById('bpContent');
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function open(title,html){document.getElementById('bpTitle').textContent=title;content.innerHTML=html;panel.classList.add('open');panel.scrollTop=0}
function close(){panel.classList.remove('open')}
document.getElementById('bpClose').onclick=close;
window.addEventListener('khamarbari:open-finance',dashboard);
document.addEventListener('click',function(e){if(e.target&&e.target.closest&&e.target.closest('#bizVisitBtn'))booking()});
function totals(){let inv=0,cost=num(data.otherCost),income=num(data.otherIncome);data.zones.forEach(z=>{inv+=num(z.invest);cost+=num(z.cost);income+=num(z.units)*num(z.price)});income+=num(data.eggsPerDay)*30*12+num(data.milkPerDay)*30*80;return {inv,cost,income,profit:income-cost}}
function dashboard(){
const t=totals(),pay=t.profit>0?t.inv/t.profit:0;
let html='<div class="bpGrid"><div class="bpStat">মোট বিনিয়োগ<b>'+fmt(t.inv)+'</b></div><div class="bpStat">মাসিক খরচ<b>'+fmt(t.cost)+'</b></div><div class="bpStat">মাসিক আয়<b>'+fmt(t.income)+'</b></div><div class="bpStat">মাসিক লাভ/ক্ষতি<b>'+fmt(t.profit)+'</b></div></div><div class="bpCard"><b>বিনিয়োগ উঠতে সময় (Break-even)</b><p>'+(pay?pay.toFixed(1)+' মাস':'লাভজনক আয় ও বিনিয়োগের তথ্য দিন')+'</p><p class="muted">এগুলো তোমার দেওয়া ইনপুটের ভিত্তিতে হিসাব; শূন্য মানে তথ্য এখনো দেওয়া হয়নি।</p></div>';
html+='<div class="bpCard"><h3>দাম ও উৎপাদন সম্পাদনা</h3>';
data.zones.forEach((z,i)=>{html+='<div class="bpRow"><label>'+z.name+' — প্রতি '+z.unit+' দাম (৳)<input data-i="'+i+'" data-k="price" type="number" min="0" value="'+z.price+'"></label><label>মাসিক বিক্রির পরিমাণ<input data-i="'+i+'" data-k="units" type="number" min="0" value="'+z.units+'"></label></div><label>মাসিক খরচ (৳)<input data-i="'+i+'" data-k="cost" type="number" min="0" value="'+z.cost+'"></label><label>বিনিয়োগ (৳)<input data-i="'+i+'" data-k="invest" type="number" min="0" value="'+z.invest+'"></label>';});
html+='<label>ডিম উৎপাদন (টি/দিন)<input id="eggQty" type="number" min="0" value="'+data.eggsPerDay+'"></label><label>দুধ উৎপাদন (লিটার/দিন)<input id="milkQty" type="number" min="0" value="'+data.milkPerDay+'"></label><label>অন্যান্য মাসিক আয় (৳)<input id="otherIn" type="number" min="0" value="'+data.otherIncome+'"></label><label>অন্যান্য মাসিক খরচ (৳)<input id="otherOut" type="number" min="0" value="'+data.otherCost+'"></label><button id="bpSave">হিসাব সেভ করুন</button><button id="bpReset">ডিফল্টে ফিরুন</button></div>';
html+='<div class="bpCard"><h3>জোন অনুযায়ী মাসিক আয়</h3>'+data.zones.map(z=>'<p>'+z.name+' <b style="float:right">'+fmt(z.units*z.price)+'</b><div class="bpBar"><i style="width:'+Math.min(100,t.income?z.units*z.price/t.income*100:0)+'%"></i></div></p>').join('')+'</div>';
open('আয়-ব্যয়ের হিসাব',html);
content.querySelector('#bpSave').onclick=()=>{content.querySelectorAll('[data-i]').forEach(e=>data.zones[+e.dataset.i][e.dataset.k]=num(e.value));data.eggsPerDay=num(content.querySelector('#eggQty').value);data.milkPerDay=num(content.querySelector('#milkQty').value);data.otherIncome=num(content.querySelector('#otherIn').value);data.otherCost=num(content.querySelector('#otherOut').value);save();dashboard()};
content.querySelector('#bpReset').onclick=()=>{if(confirm('সব ব্যবসায়িক ইনপুট ডিফল্টে ফিরবে?')){data={zones:base.map(x=>({...x})),eggsPerDay:0,milkPerDay:0,otherIncome:0,otherCost:0};save();dashboard()}};
}
function zoneCard(z){let v=z.units*z.price;open(z.name,'<div class="bpCard"><div class="bpGrid"><div class="bpStat">জমির পরিমাণ<b>'+z.area+' বিঘা</b><span class="muted">'+(z.area*1440).toLocaleString('en-BD')+' বর্গমিটার</span></div><div class="bpStat">পরিমাণ / সক্ষমতা<b>'+z.qty+'</b></div><div class="bpStat">মাসিক খরচ<b>'+fmt(z.cost)+'</b></div><div class="bpStat">মাসিক আয়<b>'+fmt(v)+'</b></div></div><p>মাসিক লাভ/ক্ষতি: <b>'+fmt(v-z.cost)+'</b></p><p class="muted">'+z.stock+'</p><button id="zoneEdit">হিসাব সম্পাদনা</button></div>');content.querySelector('#zoneEdit').onclick=dashboard}
function booking(){open('খামার ভিজিট বুকিং','<div class="bpCard"><label>তোমার নাম<input id="vName" placeholder="নাম লিখুন"></label><label>ফোন নম্বর<input id="vPhone" inputmode="tel" placeholder="01XXXXXXXXX"></label><label>ভিজিটের তারিখ<input id="vDate" type="date"></label><label>কতজন আসবেন<input id="vPeople" type="number" min="1" value="1"></label><label>মেসেজ<textarea id="vMsg" rows="3" placeholder="অতিরিক্ত কিছু জানাতে চাইলে লিখুন"></textarea></label><button id="vSend">WhatsApp-এ বুকিং পাঠান</button><a href="tel:+8801909787087"><button type="button">📞 ফোন করুন</button></a></div>');content.querySelector('#vSend').onclick=()=>{let n=document.querySelector('#vName').value.trim(),p=document.querySelector('#vPhone').value.trim(),d=document.querySelector('#vDate').value,people=document.querySelector('#vPeople').value,m=document.querySelector('#vMsg').value.trim();if(!n||!p||!d){alert('নাম, ফোন নম্বর ও তারিখ দিন।');return}let msg='খামার ভিজিট বুকিং%0Aনাম: '+encodeURIComponent(n)+'%0Aফোন: '+encodeURIComponent(p)+'%0Aতারিখ: '+encodeURIComponent(d)+'%0Aলোকসংখ্যা: '+encodeURIComponent(people)+'%0Aমেসেজ: '+encodeURIComponent(m);location.href='https://wa.me/'+WA+'?text='+msg}}
const wa=document.createElement('a');wa.href='https://wa.me/'+WA;wa.target='_blank';wa.rel='noopener';wa.textContent='☏';wa.title='WhatsApp যোগাযোগ';wa.style.cssText='position:fixed;right:14px;bottom:82px;z-index:40;width:50px;height:50px;border-radius:50%;background:#20bd67;color:white;display:grid;place-items:center;font-size:27px;text-decoration:none;box-shadow:0 3px 14px #0008';document.body.appendChild(wa);
const map=[['pond',/পুকুর|মাছ/],['grass',/নেপিয়ার|ঘাস/],['mango',/আম/],['live',/গরু|ছাগল|মুরগি|মুরগির/],['mill',/মিল|তেল|ঘি/],['house',/ডুপ্লেক্স|অফিস|গোডাউন/],['gate',/ফটক|সড়ক|রাস্তা|সবুজায়ন/]];
function attach(){document.querySelectorAll('#labels .lb').forEach(el=>{if(el.dataset.bizBound)return;el.dataset.bizBound='1';el.style.cursor='pointer';el.addEventListener('click',()=>{let z=map.find(x=>x[1].test(el.textContent));if(z){let a=data.zones.find(q=>q.id===z[0]);if(a)zoneCard(a)}})});document.querySelectorAll('#legend .zr').forEach((el,i)=>{if(el.dataset.bizBound)return;el.dataset.bizBound='1';el.addEventListener('dblclick',()=>{let a=data.zones[i];if(a)zoneCard(a)})})}
attach();new MutationObserver(attach).observe(document.getElementById('labels'),{childList:true});
})();
