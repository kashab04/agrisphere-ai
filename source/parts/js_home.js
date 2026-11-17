const IMG=__IMG__;
const MKT_SVG='<svg class="ti" viewBox="0 0 220 130" aria-hidden="true"><ellipse cx="108" cy="119" rx="92" ry="8" fill="#000" opacity=".08"/><rect x="30" y="62" width="150" height="54" rx="7" fill="#c98a4b"/><rect x="30" y="62" width="150" height="11" rx="5" fill="#b2733a"/><rect x="42" y="82" width="126" height="8" rx="3" fill="#b2733a" opacity=".65"/><rect x="42" y="98" width="126" height="8" rx="3" fill="#b2733a" opacity=".65"/><circle cx="60" cy="56" r="17" fill="#e0452f"/><circle cx="94" cy="50" r="18" fill="#e8553a"/><ellipse cx="130" cy="55" rx="21" ry="15" fill="#d9b06a"/><ellipse cx="158" cy="59" rx="17" ry="12" fill="#c99a52"/><ellipse cx="54" cy="49" rx="5" ry="3" fill="#fff" opacity=".35"/><ellipse cx="88" cy="42" rx="5" ry="3" fill="#fff" opacity=".35"/><path d="M52 40c4-6 10-6 16 0M86 33c4-6 11-6 17 0" fill="none" stroke="#2e9a4d" stroke-width="4" stroke-linecap="round"/><g transform="translate(142 8) rotate(10)"><rect width="62" height="36" rx="9" fill="#fff" stroke="#e0a21a" stroke-width="3"/><text x="31" y="26" text-anchor="middle" font-size="21" font-weight="800" fill="#a56d00" font-family="Anek Bangla,Hind Siliguri,sans-serif">৳২২</text></g></svg>';
const ARROW='<span class="go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>';
const timg=k=>`<img src="${IMG[k]}" alt="" loading="lazy">`;
const tile=(r,t,s,img,cls,wide)=>`<a class="tile ${cls}${wide?' wide':''}" href="#${r}">${img}<span class="tt"><b>${t}</b><span>${s}</span></span>${ARROW}</a>`;

const wxStrip=()=>{const a=climate().alerts[0];return a&&a.l==='high'?`<a class="alert-card high wxs" href="#climate"><span class="pill bad">জরুরি</span><div><b>${S.profile.district}: ${a.t}</b><div class="small">বিস্তারিত ও করণীয় দেখুন</div></div></a>`:'';};
V.home=()=>{
 const p=S.profile,dealSum=S.deals.reduce((s,d)=>s+d.total,0),gain=S.deals.reduce((s,d)=>s+d.gain,0);
 return `<div class="stack">
 <section class="hero2" aria-label="স্বাগতম">
  <div class="hero-t"><span class="w">স্বাগতম<img class="hero-sprout" src="${IMG.sprout}" alt=""></span><h1>AgriSphere AI</h1>
   <span class="tl">স্মার্ট চাষ, টেকসই ভবিষ্যৎ</span></div>
  <img class="hero-img" src="${IMG.hero}" alt="">
 </section>
 <div class="greet3"><p class="greet2">আসসালামু আলাইকুম, <b>${esc(p.name)}</b></p><p class="greet-sub">আজ আপনার ${CROPS[p.crop].bn} ক্ষেতের জন্য কী দেখতে চান?</p></div>
 ${wxStrip()}
 ${verifyStrip()}
 ${S.deals.length?`<div class="deal-strip"><b>সম্পন্ন ডিল ${bn(S.deals.length)}টি</b><span>মোট ${tk(dealSum)}</span><span class="pos"><b>মধ্যস্বত্বভোগীর তুলনায় বাড়তি ${tk(gain)}</b></span></div>`:''}
 <nav class="tiles" aria-label="সেবাসমূহ">
  ${tile('yieldmax','ফলন ও লাভ','ফসলের ফলন ও লাভ জানুন',timg('y'),'t-green')}
  ${tile('precision','সার ও সেচ','সঠিক সার ও সেচের পরামর্শ পান',timg('f'),'t-blue')}
  ${tile('climate','আবহাওয়া','আজ ও আগামী দিনের আবহাওয়া দেখুন',timg('w'),'t-blue')}
  ${tile('guardian','রোগ শনাক্তকরণ','ফসলের রোগ সম্পর্কে জানুন',timg('d'),'t-green')}
  ${tile('market','বাজার ও বিক্রি','বাজারদর দেখুন, সরাসরি ক্রেতার কাছে ফসল বিক্রি করুন',MKT_SVG,'t-peach',true)}
  ${tile('budget','বাজেট','ফসলের খরচ ও আয় পরিকল্পনা করুন',timg('b'),'t-cream',true)}
 </nav>
 <img class="homefoot" src="${IMG.foot}" alt="Grow Smart, Farm Better, Live Greener">
 <div class="row" style="justify-content:center"><button class="btn sm" data-a="reset">ডেমো ডেটা রিসেট করুন</button></div>
 </div>`;
};

/* ---------- budget ---------- */
const BUDI=[['seed','বীজ বা চারা',.15],['prep','জমি তৈরি',.10],['fert','সার',null],['irr','সেচ',.10],['pest','কীটনাশক ও পরিচর্যা',.08],['labor','শ্রমিক মজুরি',.25],['harv','ফসল তোলা ও পরিবহন',.07],['other','অন্যান্য',.03]];
S.bud={};S.budP={};S.auth={step:'phone'};S.user=null;
function budItems(){
 const p=S.profile,c=CROPS[p.crop],total=c.cost*p.land,fert=precCalc().cost,rest=Math.max(0,total-fert),ws=BUDI.reduce((s,i)=>s+(i[2]||0),0);
 const ov=S.bud[p.crop+'|'+p.land]||{};
 return BUDI.map(([k,n,w])=>{const def=Math.round((k==='fert'?fert:rest*w/ws)/10)*10;return {k,n,def,v:ov[k]!=null?ov[k]:def};});
}
function budCalc(){
 const p=S.profile,items=budItems(),cost=items.reduce((s,i)=>s+i.v,0),y=yieldCalc();
 const price=S.budP[p.crop]!=null?S.budP[p.crop]:Math.round(localPrice(p.crop));
 const revenue=y.yieldKg*price,profit=revenue-cost;
 return {items,cost,price,revenue,profit,be:cost/y.yieldKg,roi:cost?profit/cost:0,y};
}
function budOut(){
 const b=budCalc(),mx=Math.max(...b.items.map(i=>i.v),1),mr=Math.max(b.cost,b.revenue,1);
 const sorted=b.items.slice().sort((a,c)=>c.v-a.v);
 return `<div class="stats">
  ${statT('মোট খরচ',tk(b.cost),dec(S.profile.land)+' একরের জন্য')}
  ${statT('প্রত্যাশিত আয়',tk(b.revenue),num(b.y.yieldKg)+' কেজি × '+tk(b.price))}
  ${statT('নিট লাভ',tk(b.profit),'খরচের '+pct(Math.abs(b.roi)*100)+(b.profit<0?' ক্ষতি':' লাভ'),b.profit<0?'neg':'hero')}
  ${statT('লাভ-ক্ষতিহীন দাম',tkd(b.be)+'/কেজি','এর নিচে বিক্রি করলে লোকসান')}
 </div>
 <section class="card"><h2>খরচ বনাম আয়</h2>
  <div class="brow"><span>মোট খরচ</span><span class="bar sun" aria-hidden="true"><i style="width:${b.cost/mr*100}%"></i></span><span class="val">${tk(b.cost)}</span></div>
  <div class="brow"><span>প্রত্যাশিত আয়</span><span class="bar" aria-hidden="true"><i style="width:${b.revenue/mr*100}%"></i></span><span class="val">${tk(b.revenue)}</span></div>
 </section>
 <section class="card"><h2>কোন খাতে কত খরচ</h2>
  ${sorted.map(i=>`<div class="brow"><span>${i.n}</span><span class="bar" aria-hidden="true"><i style="width:${i.v/mx*100}%"></i></span><span class="val">${tk(i.v)} <span class="tiny muted">${b.cost?pct(i.v/b.cost*100):''}</span></span></div>`).join('')}
 </section>`;
}
V.budget=()=>{
 const p=S.profile,items=budItems(),b=budCalc();
 return `<div class="stack">
 ${head('খামার বাজেট','ফসলের খরচ ও আয় পরিকল্পনা','খাত অনুযায়ী খরচ বসান, আয় ও লাভ সাথে সাথে দেখুন।')}
 <div class="grid two">
  <section class="card"><h2>খরচের খাত</h2><p class="lead">${CROPS[p.crop].bn}, ${dec(p.land)} একর। যেকোনো সংখ্যা বদলাতে পারেন। সারের খরচ "সার ও সেচ" অংশের হিসাব থেকে এসেছে।</p>
   ${items.map(i=>`<div class="bud-row"><label for="bud-${i.k}">${i.n}</label><input type="number" id="bud-${i.k}" data-c="bud" data-k="${i.k}" min="0" step="100" inputmode="numeric" value="${i.v}"></div>`).join('')}
   <div class="hr" style="margin:10px 0"></div>
   <div class="bud-row"><label for="bud-price"><b>বিক্রির দাম (৳/কেজি)</b><div class="tiny muted">আজকের স্থানীয় দর ${tk(localPrice(p.crop))}</div></label><input type="number" id="bud-price" data-c="bud" data-k="price" min="1" step="1" inputmode="numeric" value="${b.price}"></div>
   <div style="margin-top:14px"><button class="btn sm" data-a="budReset">ডিফল্টে ফেরান</button></div>
   <p class="tiny muted" style="margin-top:10px">খাতভিত্তিক ভাগ নমুনা অনুপাত। নিজের আসল খরচ বসালে হিসাব আরও সঠিক হবে।</p>
  </section>
  <div class="stack" id="budOut">${budOut()}</div>
 </div></div>`;
};

