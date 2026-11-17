const IMG=__IMG__;
const BANNER='<svg class="bn-art" viewBox="0 0 640 300" preserveAspectRatio="xMaxYMax slice" aria-hidden="true" focusable="false"><defs><linearGradient id="bgs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe9f7"/><stop offset=".72" stop-color="#eef8ee"/><stop offset="1" stop-color="#f6fbef"/></linearGradient><radialGradient id="bgsun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff0a6"/><stop offset="1" stop-color="#fff0a6" stop-opacity="0"/></radialGradient><linearGradient id="bgf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6cbf4f"/><stop offset="1" stop-color="#2f8f3f"/></linearGradient></defs><rect width="640" height="300" fill="url(#bgs)"/><circle cx="548" cy="62" r="72" fill="url(#bgsun)"/><circle cx="548" cy="62" r="25" fill="#ffd95a"/><g fill="#fff" opacity=".9"><ellipse cx="410" cy="48" rx="44" ry="11"/><ellipse cx="436" cy="38" rx="28" ry="11"/><ellipse cx="608" cy="128" rx="34" ry="9"/></g><path d="M0 214C90 170 175 182 265 202C345 158 435 158 525 192C575 172 612 176 640 186V300H0Z" fill="#cfe8c6"/><g fill="#8cc67b"><circle cx="330" cy="168" r="14"/><circle cx="352" cy="174" r="11"/><circle cx="470" cy="172" r="13"/></g><path d="M0 240C110 210 220 220 330 237C430 210 540 215 640 232V300H0Z" fill="#9fd18f"/><path d="M0 266C140 244 300 250 420 262C520 250 590 252 640 260V300H0Z" fill="url(#bgf)"/><g fill="none" stroke="#e9f8da" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"><path d="M0 280C150 266 300 270 420 278"/><path d="M200 300C300 282 460 280 640 286"/><path d="M430 262C500 262 570 266 640 276"/></g><g transform="translate(540 205)"><path d="M0 95C0 60 2 30 4 0" stroke="#1f7a37" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M3 38C-26 36-42 14-40-12 -12-12 4 8 3 38Z" fill="#2f9a47"/><path d="M4 22C32 22 50 2 48-26 20-26 4-6 4 22Z" fill="#43b25a"/><path d="M3 62C-18 62-30 48-30 28-8 28 3 42 3 62Z" fill="#43b25a"/></g></svg>';
const MKT_SVG='<svg class="ti" viewBox="0 0 220 130" aria-hidden="true"><ellipse cx="108" cy="119" rx="92" ry="8" fill="#000" opacity=".08"/><rect x="30" y="62" width="150" height="54" rx="7" fill="#c98a4b"/><rect x="30" y="62" width="150" height="11" rx="5" fill="#b2733a"/><rect x="42" y="82" width="126" height="8" rx="3" fill="#b2733a" opacity=".65"/><rect x="42" y="98" width="126" height="8" rx="3" fill="#b2733a" opacity=".65"/><circle cx="60" cy="56" r="17" fill="#e0452f"/><circle cx="94" cy="50" r="18" fill="#e8553a"/><ellipse cx="130" cy="55" rx="21" ry="15" fill="#d9b06a"/><ellipse cx="158" cy="59" rx="17" ry="12" fill="#c99a52"/><ellipse cx="54" cy="49" rx="5" ry="3" fill="#fff" opacity=".35"/><ellipse cx="88" cy="42" rx="5" ry="3" fill="#fff" opacity=".35"/><path d="M52 40c4-6 10-6 16 0M86 33c4-6 11-6 17 0" fill="none" stroke="#2e9a4d" stroke-width="4" stroke-linecap="round"/><g transform="translate(142 8) rotate(10)"><rect width="62" height="36" rx="9" fill="#fff" stroke="#e0a21a" stroke-width="3"/><text x="31" y="26" text-anchor="middle" font-size="21" font-weight="800" fill="#a56d00" font-family="Anek Bangla,Hind Siliguri,sans-serif">৳২২</text></g></svg>';
const ARROW='<span class="go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>';
const timg=k=>`<img src="${IMG[k]}" alt="" loading="lazy">`;
const tile=(r,t,s,img,cls,wide)=>`<a class="tile ${cls}${wide?' wide':''}" href="#${r}">${img}<span class="tt"><b>${t}</b><span>${s}</span></span>${ARROW}</a>`;

const wxStrip=()=>{const a=climate().alerts[0];return a&&a.l==='high'?`<a class="alert-card high wxs" href="#climate"><span class="pill bad">জরুরি</span><div><b>${S.profile.district}: ${a.t}</b><div class="small">বিস্তারিত ও করণীয় দেখুন</div></div></a>`:'';};
V.home=()=>{
 const p=S.profile,dealSum=S.deals.reduce((s,d)=>s+d.total,0),gain=S.deals.reduce((s,d)=>s+d.gain,0);
 return `<div class="stack">
 <section class="hero2" aria-label="স্বাগতম">${BANNER}
  <div class="hero-t"><span class="w">আপনাকে স্বাগতম!</span><h1>কৃষিসখা</h1>
   <span class="tl">স্মার্ট কৃষির পথে আমরা আছি আপনার পাশে।</span></div>
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
 <div class="row" style="justify-content:center"><button class="btn sm" data-a="open" data-v="settings">সেটিংস</button><button class="btn sm" data-a="open" data-v="help">সহায়তা ও মতামত</button></div>
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
   <p class="tiny muted" style="margin-top:10px">খাতভিত্তিক ভাগ আনুমানিক অনুপাত। নিজের আসল খরচ বসালে হিসাব আরও সঠিক হবে।</p>
  </section>
  <div class="stack" id="budOut">${budOut()}</div>
 </div></div>`;
};

