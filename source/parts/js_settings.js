
/* ---------- settings, language, help & feedback ---------- */
const LANGS=[['bn','বাংলা'],['en','English']];
let LANG=store.get('agri_lang')==='en'?'en':'bn';
let FSK=store.get('agri_fs');if(!['n','l','x'].includes(FSK))FSK='n';
const FSZ={n:'100%',l:'115%',x:'130%'};
const applyFs=()=>{document.documentElement.style.fontSize=FSZ[FSK];};
applyFs();document.documentElement.lang=LANG;
const BNRE=/[ঀ-৿]/;
const EXACT={},SUBS={};
for(const k in EN){if(k[0]==='='){EXACT[k.slice(1)]=EN[k];}else{EXACT[k]=EN[k];SUBS[k]=EN[k];}}
let ENK=null;
const TD=x=>String(x).replace(/[০-৯]/g,d=>BD.indexOf(d));
const RISKW={'কম':'low','মাঝারি':'medium','বেশি':'high'};
const PAT=[
 [/^(.+?) একর (.+?) জমিতে (.+?) চাষে (.+?)-এর চেয়ে প্রায় (৳\S+) বেশি লাভের সম্ভাবনা আছে। তবে (.+?)-এর ঝুঁকি (\S+) এবং খরচ (৳\S+) (কম|বেশি)। (.+?)-এর ঝুঁকি (\S+)।$/,m=>`On ${TD(m[1])} acre(s) of ${trStr(m[2])} soil, growing ${trStr(m[3])} could earn about ${TD(m[5])} more than ${trStr(m[4])}. However, ${trStr(m[6])} has ${RISKW[m[7]]} risk and costs ${TD(m[8])} ${m[9]==='কম'?'less':'more'}. ${trStr(m[10])} has ${RISKW[m[11]]} risk.`],
 [/^([০-৯]+) দিন পর \((.+?)\) বিক্রি করলে সংরক্ষণ খরচ বাদেও প্রতি কেজিতে প্রায় (৳\S+) বেশি পেতে পারেন।$/,m=>`Selling after ${TD(m[1])} days (${trStr(m[2])}) could earn about ${TD(m[3])} more per kg even after storage cost.`],
 [/^([০-৯]+) বার, প্রায় ([০-৯]+) দিন পরপর। (.+)$/,m=>`${TD(m[1])} times, about every ${TD(m[2])} days. ${trStr(m[3])}`],
 [/^আজ আপনার (.+) ক্ষেতের জন্য কী দেখতে চান\?$/,m=>`What would you like to see for your ${trStr(m[1])} field today?`],
 [/^আজ (৳\S+)$/,m=>`Today ${TD(m[1])}`],
 [/^খরচের (\S+) (লাভ|ক্ষতি)$/,m=>`${m[2]==='লাভ'?'Profit':'Loss'} ${TD(m[1])} of cost`],
 [/^জেলা বেছে নিন \(([০-৯]+) জেলা\)$/,m=>`Choose district (${TD(m[1])} districts)`],
 [/^([+−])৳(\S+) \(প্রায় (\S+) কেজিতে\)$/,m=>`${m[1]}৳${TD(m[2])} (about ${TD(m[3])} kg)`],
 [/^। এটি আপনার বাজারের চেয়ে (৳\S+) বেশি। (.+)$/,m=>`This is ${TD(m[1])} more than your market. ${trStr(m[2])}`],
 [/^শুধু (\S+) জমিতে সেচ দিলেই চলবে, প্রায় (\S+) পানি বাঁচবে।$/,m=>`Irrigating only ${TD(m[1])} of the field is enough; about ${TD(m[2])} water will be saved.`],
 [/^প্রতি ([০-৯]+) দিন অন্তর$/,m=>`Every ${TD(m[1])} days`],
 [/^([▲▼]) (\S+) \(([০-৯]+) দিনে\)$/,m=>`${m[1]} ${TD(m[2])} (in ${TD(m[3])} days)`]
];
const RX=[[/([০-৯.,]+)\s*দিন পর/g,'$1 days later'],[/([০-৯.,]+)\s*বার(?![\u0980-\u09FF])/g,'$1 times'],[/([০-৯.,]+)\s*দিনের/g,'$1-day'],[/([০-৯.,]+)\s*দিন(?![ঀ-৿])/g,'$1 days'],[/([০-৯.,]+)\s*টি(?![ঀ-৿])/g,'$1'],[/([০-৯.,]+)\s*জন(?![ঀ-৿])/g,'$1 people']];
function trStr(s){
 if(!BNRE.test(s))return s;
 const t=s.trim();
 if(t){
  if(EXACT[t]!==undefined)return s.replace(t,EXACT[t]);
  for(const [re,fn] of PAT){const m=t.match(re);if(m)return s.replace(t,fn(m));}
 }
 if(!ENK)ENK=Object.keys(SUBS).sort((a,b)=>b.length-a.length);
 let o=s;for(const k of ENK){if(o.indexOf(k)>-1)o=o.split(k).join(SUBS[k]);}
 for(const [re,r] of RX)o=o.replace(re,r);
 return TD(o).replace(/।/g,'.').replace(/(\d) +-day/g,'$1-day').replace(/(\S) {2,}/g,'$1 ');
}
const TR_ATTR=['aria-label','placeholder','title','alt'];
function applyLang(root){
 if(LANG!=='en'||!root)return;
 if(root.nodeType===3){const v=root.nodeValue,n=trStr(v);if(n!==v)root.nodeValue=n;return;}
 if(root.nodeType!==1)return;
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);let n=root;
 do{
  if(n.nodeType===3){const v=n.nodeValue;if(BNRE.test(v)){const x=trStr(v);if(x!==v)n.nodeValue=x;}}
  else if(n.tagName!=='SCRIPT'&&n.tagName!=='STYLE'){for(const a of TR_ATTR){const v=n.getAttribute(a);if(v&&BNRE.test(v))n.setAttribute(a,trStr(v));}}
 }while((n=w.nextNode()));
}
new MutationObserver(ms=>{if(LANG!=='en')return;for(const m of ms){if(m.type==='characterData')applyLang(m.target);else m.addedNodes.forEach(applyLang);}}).observe(document.body,{childList:true,subtree:true,characterData:true});
const TITLE_BN='কৃষিসখা';
function setLang(l){
 LANG=l==='en'?'en':'bn';store.set('agri_lang',LANG);document.documentElement.lang=LANG;
 document.title=LANG==='en'?'KrishiSakha':TITLE_BN;
 closeModal();render();applyLang(document.body);
}
document.title=LANG==='en'?'KrishiSakha':TITLE_BN;
const segBtns=(items,cur,act)=>`<div class="seg" role="group" style="width:100%">${items.map(([v,l])=>`<button type="button" style="flex:1" data-a="${act}" data-v="${v}" aria-pressed="${cur===v}">${l}</button>`).join('')}</div>`;
Object.assign(A,{
 lang:t=>setLang(t.dataset.v),
 fsize:t=>{FSK=t.dataset.v;store.set('agri_fs',FSK);applyFs();render();},
 open:t=>{closeModal();go(t.dataset.v);}
});
V.settings=()=>{
 const u=S.user||{},p=S.profile;
 return `<div class="stack"><a class="back" href="#home">← পিছনে</a><h1 style="font-size:1.6rem">সেটিংস</h1>
 <section class="card"><h2>ভাষা</h2><p class="lead">অ্যাপ কোন ভাষায় দেখতে চান বেছে নিন।</p>${segBtns(LANGS,LANG,'lang')}<p class="small muted" style="margin-top:10px">আরও ভাষা পরে যোগ করা হবে।</p></section>
 <section class="card"><h2>লেখার আকার</h2><p class="lead">পড়তে অসুবিধা হলে লেখা বড় করুন।</p>${segBtns([['n','স্বাভাবিক'],['l','বড়'],['x','অনেক বড়']],FSK,'fsize')}</section>
 <section class="card"><h2>আমার অ্যাকাউন্ট</h2>
  <dl class="acct"><dt>নাম</dt><dd>${esc(u.name||'')}</dd>${u.cloud?`${u.email?`<dt>ইমেইল</dt><dd>${esc(u.email)}</dd>`:''}${u.mobile?`<dt>মোবাইল</dt><dd>${bn(u.mobile)}</dd>`:''}`:(u.phone?`<dt>মোবাইল</dt><dd>${bn(u.phone)}</dd>`:'')}<dt>জেলা</dt><dd>${p.district}</dd><dt>ফসল</dt><dd>${CROPS[p.crop].bn}</dd><dt>জমি</dt><dd>${dec(p.land)} একর, ${SOIL[p.soil]} মাটি</dd></dl>
  <div class="row"><button class="btn" data-a="profile">তথ্য বদলান</button><button class="btn" data-a="logout">লগ আউট</button></div></section>
 <section class="card"><h2>সাহায্য</h2><p class="lead">কোনো সমস্যা বা পরামর্শ থাকলে আমাদের জানান।</p><button class="btn" data-a="open" data-v="help">সহায়তা ও মতামত</button></section>
 <section class="card"><h2>ডিল ও চ্যাট</h2><p class="lead">ডিল, চ্যাট ও বাজেট মুছে নতুন করে শুরু করুন। আপনার অ্যাকাউন্ট ও জমির তথ্য মুছবে না।</p><button class="btn" data-a="reset">ডিল ও চ্যাট মুছুন</button></section>
 <section class="card flat"><h2>অ্যাপ সম্পর্কে</h2><p class="small muted">কৃষিসখা · সংস্করণ ১.০ · বিল্ড __BUILD__<br>AI Builders Congress · Team 01 · ডোমেইন: AgriSphere AI<br>প্রোটোটাইপ সংস্করণ: দাম, আবহাওয়া ও ক্রেতার তথ্য আনুমানিক নমুনা, আসল উৎসের সাথে সংযোগের কাজ চলছে।</p></section></div>`;
};
const FB_TYPES=[['problem','সমস্যা জানাতে চাই'],['idea','পরামর্শ দিতে চাই'],['question','প্রশ্ন আছে'],['thanks','ধন্যবাদ জানাতে চাই']];
V.help=()=>{
 const fb=S.fb||(S.fb={}),d=fb.draft||{type:'problem',msg:'',contact:(S.user&&(S.user.email||S.user.mobile))||''},mail=(window.AGRI_CONTACT||'');
 return `<div class="stack"><a class="back" href="#home">← পিছনে</a><h1 style="font-size:1.6rem">সহায়তা ও মতামত</h1>
 <section class="card"><h2>আপনার কথা লিখুন</h2><p class="lead">অ্যাপে কোনো সমস্যা হলে বা ভালো কিছু মনে এলে এখানে লিখুন। আমাদের টিম পড়ে দেখবে।</p>
  ${fb.ok?`<div class="okmsg" role="status">${fb.ok}</div>`:''}${fb.err?`<div class="err" role="alert">${fb.err}</div>`:''}
  <form data-f="feedback" novalidate>
   <div class="fld"><label for="fbtype">কী নিয়ে লিখছেন?</label><select id="fbtype">${FB_TYPES.map(([v,l])=>`<option value="${v}" ${d.type===v?'selected':''}>${l}</option>`).join('')}</select></div>
   <div class="fld"><label for="fbmsg">আপনার বার্তা</label><textarea id="fbmsg" rows="5" maxlength="1000" placeholder="যেমন: কোন পাতায় কী সমস্যা হয়েছে লিখুন">${esc(d.msg||'')}</textarea></div>
   <div class="fld"><label for="fbcontact">যোগাযোগের নম্বর বা ইমেইল <span class="muted">(ঐচ্ছিক)</span></label><input id="fbcontact" type="text" maxlength="80" value="${esc(d.contact||'')}"></div>
   ${sendBtn('পাঠান')}</form>
  ${mail?`<p class="small muted" style="margin-top:12px">সরাসরি ইমেইল: <a href="mailto:${esc(mail)}"><b>${esc(mail)}</b></a></p>`:''}</section>
 <section class="card"><h2>সাধারণ প্রশ্ন</h2>
  <p><b>এখানকার দাম ও আবহাওয়া কি আসল?</b><br><span class="muted">এটি প্রোটোটাইপ সংস্করণ, তাই দাম ও আবহাওয়া আনুমানিক। আসল উৎসের সাথে সংযোগের কাজ চলছে।</span></p>
  <p style="margin-top:10px"><b>ইন্টারনেট ছাড়া চলবে?</b><br><span class="muted">একবার খোলার পর অ্যাপের পাতাগুলো ইন্টারনেট ছাড়াও খোলে। লগইন ও মতামত পাঠাতে ইন্টারনেট লাগে।</span></p>
  <p style="margin-top:10px"><b>পাসওয়ার্ড ভুলে গেলে?</b><br><span class="muted">ইমেইল অ্যাকাউন্টে লগইন পাতার "পাসওয়ার্ড ভুলে গেছেন?" চাপুন। মোবাইল নম্বরের অ্যাকাউন্টে এখনও রিসেট নেই।</span></p></section></div>`;
};
AF.feedback=async f=>{
 const fb=S.fb=S.fb||{};fb.ok='';fb.err='';
 const type=$('#fbtype').value,msg=$('#fbmsg').value.trim(),contact=$('#fbcontact').value.trim();fb.draft={type,msg,contact};
 if(msg.length<10){fb.err='কমপক্ষে ১০ অক্ষরে আপনার কথা লিখুন।';return render();}
 if(fb.last&&Date.now()-fb.last<15000){fb.err='একটু অপেক্ষা করে আবার পাঠান।';return render();}
 busyA(f,true);
 const rec={type,message:msg.slice(0,1000),contact:contact.slice(0,80),name:((S.user&&S.user.name)||'').slice(0,60),lang:LANG,app:'krishisakha-web'};
 try{
  if(window.AgriCloud&&AgriCloud.ready&&S.user&&S.user.cloud){await AgriCloud.sendFeedback(rec);fb.ok='আপনার বার্তা পাঠানো হয়েছে। ধন্যবাদ!';}
  else{const q=store.get('agri_feedback')||[];q.push(Object.assign({at:Date.now()},rec));store.set('agri_feedback',q);fb.ok='বার্তা এই ডিভাইসে রাখা হয়েছে। আসল অ্যাকাউন্টে লগইন করলে তা আমাদের কাছে পৌঁছায়।';}
  fb.last=Date.now();fb.draft={type:'problem',msg:'',contact};
 }catch(e){fb.err='পাঠানো যায়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন।';}
 render();
};

// "পিছনে" বাটন: অ্যাপের ভেতরে আগের পাতা থাকলে সেখানে যায়, নইলে হোমে।
let navN=0;window.addEventListener('hashchange',()=>{navN++;});
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('a.back');if(!b)return;if(navN>0){e.preventDefault();navN--;history.back();}});

// ডিলের রসিদ
const MONTHS_R=['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
function receiptData(lid){
 const d=S.deals.find(x=>x.lid===lid);if(!d)return null;
 const b=BUY[d.buyer],p=S.profile,t=new Date(d.at||Date.now()),c=CROPS[d.crop];
 const hh=t.getHours(),mm=String(t.getMinutes()).padStart(2,'0');
 return {d,b,p,c,no:bn(d.no||'KS-000000'),
  when:bn(t.getDate())+' '+MONTHS_R[t.getMonth()]+' '+bn(t.getFullYear())+', '+bn(String(hh%12||12))+':'+bn(mm)+(hh<12?' সকাল':' বিকাল')};
}
function receiptText(r){
 return ['কৃষিসখা · ডিলের রসিদ','নং: '+r.no,'তারিখ: '+r.when,'বিক্রেতা: '+r.p.name+', '+r.p.district,'ক্রেতা: '+r.b.n+' ('+r.b.city+')',
  'ফসল: '+r.c.bn+', '+num(r.d.qty)+' কেজি','দর: '+tk(r.d.price)+'/কেজি','মোট: '+tk(r.d.total),'পেমেন্ট: '+r.b.pay,'কৃষিসখা · AgriSphere AI'].join('\n');
}
function receiptSheet(lid){
 const r=receiptData(lid);if(!r)return '';
 const row=(a,b)=>`<div class="rc-r"><span>${a}</span><b>${b}</b></div>`;
 return `<div class="sheet receipt" role="dialog" aria-modal="true" aria-label="ডিলের রসিদ">
  <div class="sheet-h"><h2>ডিলের রসিদ</h2><button class="btn sm" data-a="close" aria-label="বন্ধ করুন">×</button></div>
  <div class="rc" id="rcbox">
   <div class="rc-top"><div class="rc-brand">কৃষিসখা</div><div class="rc-ok">ডিল নিশ্চিত ✓</div></div>
   ${row('রসিদ নং',r.no)}${row('তারিখ ও সময়',r.when)}
   <hr>
   ${row('বিক্রেতা (কৃষক)',r.p.name+', '+r.p.district)}${row('ক্রেতা',r.b.n+' ('+r.b.city+')'+(r.b.ver?' · যাচাইকৃত':''))}
   <hr>
   ${row('ফসল',r.c.bn)}${row('পরিমাণ',num(r.d.qty)+' কেজি')}${row('দর',tk(r.d.price)+'/কেজি')}
   <div class="rc-total"><span>মোট মূল্য</span><b>${tk(r.d.total)}</b></div>
   <hr>
   ${row('পেমেন্ট',r.b.pay)}${row('পরিবহন',r.b.tp)}
   ${r.d.gain>0?`<div class="rc-gain">মধ্যস্বত্বভোগীর দরের তুলনায় আপনার বাড়তি আয়: <b>${tk(r.d.gain)}</b></div>`:''}
   <div class="rc-note">কৃষিসখা · AgriSphere AI</div>
  </div>
  <div class="row" style="margin-top:14px;gap:10px"><button class="btn primary" data-a="rcPrint">প্রিন্ট / PDF</button><button class="btn" data-a="rcShare" data-v="${lid}">শেয়ার</button></div>
 </div>`;
}
A.receipt=t=>{openModal(receiptSheet(t.dataset.v));};
A.rcPrint=()=>{document.body.classList.add('printing');setTimeout(()=>{try{window.print();}catch(e){}document.body.classList.remove('printing');},50);};
A.rcShare=t=>{const r=receiptData(t.dataset.v);if(!r)return;const x=receiptText(r);
 if(navigator.share){navigator.share({title:'কৃষিসখা রসিদ',text:x}).catch(()=>{});}
 else if(navigator.clipboard){navigator.clipboard.writeText(x).then(()=>toast('রসিদের লেখা কপি হয়েছে।'),()=>toast('কপি করা গেল না।'));}
 else toast('এই ব্রাউজারে শেয়ার সুবিধা নেই।');};

// আসল আবহাওয়া: Open-Meteo (বিনা খরচে, API key লাগে না)
const WX_TTL=3*3600*1000,wxBusy={},wxFail={};
function wxApply(n,o){if(!FC[n]||!o||!o.t||o.t.length<7)return;FC[n].t=o.t.slice(0,7);FC[n].r=o.r.slice(0,7);FC[n].live=true;FC[n].at=o.at;}
function wxEnsure(n){
 const c=DCO[n];if(!c||wxBusy[n])return;
 const f=FC[n];if(f&&f.live&&Date.now()-f.at<WX_TTL)return;
 try{const k=store.get('agri_wx_'+n);if(k&&Date.now()-k.at<WX_TTL){wxApply(n,k);return;}}catch(e){}
 if(wxFail[n]&&Date.now()-wxFail[n]<120000)return;
 wxBusy[n]=1;
 const u='https://api.open-meteo.com/v1/forecast?latitude='+c[0]+'&longitude='+c[1]+'&daily=temperature_2m_max,precipitation_probability_max&timezone=Asia%2FDhaka&forecast_days=7';
 fetch(u).then(r=>{if(!r.ok)throw 0;return r.json();}).then(j=>{
  const dl=j.daily,o={at:Date.now(),t:dl.temperature_2m_max.map(v=>Math.round(v)),r:dl.precipitation_probability_max.map(v=>Math.round(v==null?0:v))};
  wxApply(n,o);try{store.set('agri_wx_'+n,o);}catch(e){}
  delete wxBusy[n];if(S.user&&S.profile&&S.profile.district===n)render();
 }).catch(()=>{delete wxBusy[n];wxFail[n]=Date.now();});
}
function wxNote(n){
 const f=FC[n];
 if(f&&f.live){const t=new Date(f.at);return 'তথ্যসূত্র: Open-Meteo (আসল পূর্বাভাস) · হালনাগাদ '+bn(String(t.getHours()).padStart(2,'0'))+':'+bn(String(t.getMinutes()).padStart(2,'0'));}
 return wxBusy[n]?'আসল পূর্বাভাস আনা হচ্ছে…':'ইন্টারনেট সংযোগ না থাকায় আনুমানিক পূর্বাভাস দেখানো হচ্ছে।';
}

// ছবি থেকে আসল AI রোগ শনাক্ত (Gemini, Firebase AI Logic)
const aiShrink=src=>new Promise((res,rej)=>{const im=new Image();im.onload=()=>{const M=1024,k=Math.min(1,M/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.85).split(',')[1]);};im.onerror=rej;im.src=src;});
const AI_PROMPT=(crop,dist)=>`তুমি বাংলাদেশের একজন অভিজ্ঞ কৃষি সম্প্রসারণ কর্মকর্তা। ছবিটি একজন কৃষকের তোলা ফসলের পাতা বা গাছের। কৃষক জানিয়েছেন তাঁর ফসল: ${crop}, জেলা: ${dist}।
ছবি দেখে শুধু JSON ফেরত দাও, অন্য কোনো লেখা নয়। সব লেখা সহজ বাংলায়, কৃষক যেন বোঝেন। নিশ্চিত না হলে অনুমান না করে status "unclear" দাও।
{"is_plant":true/false,"status":"healthy|disease|pest|deficiency|unclear","name_bn":"রোগ/পোকা/ঘাটতির নাম বা 'সুস্থ দেখাচ্ছে'","name_en":"","confidence":0-100,"severity":"low|medium|high","cause":"১-২ বাক্য","symptoms":"ছবিতে যা দেখা যাচ্ছে","steps":["এখনই করণীয় ৩-৪টি"],"organic":"জৈব বা সাংস্কৃতিক উপায়","chemical":"রাসায়নিক বিকল্প শুধু ক্রিয়াশীল উপাদানের নামসহ, কোনো মাত্রা নয়; শেষে লেবেল ও কৃষি অফিসারের পরামর্শ নিতে বলো","prevention":"ভবিষ্যতে এড়ানোর উপায়"}
ছবিতে পাতা বা ফসল না থাকলে is_plant false দাও।`;
let aiLast=0;
async function aiRun(){
 const g=S.g;if(!g||!g.photo)return;
 if(!(window.AgriCloud&&AgriCloud.ready&&AgriCloud.diagnose)){g.ai={err:'noai'};render();return;}
 if(Date.now()-aiLast<4000){g.ai={err:'wait'};render();return;}
 aiLast=Date.now();g.ai={busy:true};g.scanning=true;render();
 const mine=g.photo;
 try{
  const b64=await aiShrink(g.photo);
  const raw=await AgriCloud.diagnose(b64,'image/jpeg',AI_PROMPT(CROPS[S.profile.crop].bn,S.profile.district));
  const d=JSON.parse(String(raw).replace(/^```json|```$/g,'').trim());
  if(S.g.photo===mine){S.g.ai={d};}
 }catch(e){console.warn('AI',e);if(S.g.photo===mine)S.g.ai={err:'fail',msg:String((e&&(e.code||'')+' '+(e&&e.message||e))).slice(0,220)};}
 if(S.g.photo===mine){S.g.scanning=false;if(S.route==='guardian')render();}
}
A.aiRetry=()=>{aiLast=0;aiRun();};
function aiCard(g,p){
 const a=g.ai||{busy:true},t=x=>esc(x==null?'':x),L=(h,x)=>x?`<div><h3>${h}</h3><p>${t(x)}</p></div>`:'';
 if(a.busy)return `<section class="card"><h2>ছবি বিশ্লেষণ</h2><p class="muted">AI আপনার ছবি দেখছে, প্রায় ১০ সেকেন্ড লাগতে পারে…</p></section>`;
 if(a.err){const m=a.err==='wait'?'একটু পরে আবার চেষ্টা করুন।':a.err==='noai'?'এই মুহূর্তে ছবি বিশ্লেষণ করা যাচ্ছে না। ইন্টারনেট সংযোগ দেখুন বা লগইন করে আবার চেষ্টা করুন।':'ছবি বিশ্লেষণ করা গেল না। ইন্টারনেট দেখে আবার চেষ্টা করুন।';
  return `<section class="card"><h2>ছবি বিশ্লেষণ</h2><p class="muted">${m}</p><div class="row" style="margin-top:10px"><button class="btn primary" data-a="aiRetry">আবার চেষ্টা করুন</button></div><p class="small muted" style="margin-top:10px">অথবা বাঁ পাশ থেকে একটি নমুনা পাতা বেছে রোগের তথ্য দেখুন।</p>${a.msg?`<p class="tiny muted" style="margin-top:8px;word-break:break-all">কারিগরি তথ্য: ${t(a.msg)}</p>`:''}</section>`;}
 const d=a.d||{};
 if(d.is_plant===false)return `<section class="card"><h2>পাতা বোঝা যাচ্ছে না</h2><p class="muted">ছবিতে ফসলের পাতা দেখা যাচ্ছে না। দিনের আলোতে, পাতার কাছ থেকে পরিষ্কার ছবি তুলে আবার দিন।</p></section>`;
 const sev={low:['কম',''],medium:['মাঝারি','warn'],high:['বেশি','bad']}[d.severity]||['',''];
 const ok=d.status==='healthy',un=d.status==='unclear';
 const steps=Array.isArray(d.steps)?d.steps.filter(Boolean):[];
 return `<section class="card"><div class="row" style="justify-content:space-between;align-items:flex-start;margin-bottom:8px"><div><h2 style="margin:0">${t(d.name_bn||(un?'নিশ্চিত বলা যাচ্ছে না':'ফলাফল'))}</h2><span class="muted small">${t(d.name_en)}</span></div>${ok?'<span class="pill ok">সুস্থ</span>':sev[0]&&!un?`<span class="pill ${sev[1]}">${sev[0]}</span>`:''}</div>
  ${typeof d.confidence==='number'&&!un?`<div class="conf" style="margin-bottom:12px"><span class="small muted nowrap">নিশ্চয়তা</span><div class="meter"><i style="width:${Math.max(0,Math.min(100,d.confidence))}%"></i></div><b>${pct(d.confidence)}</b></div>`:''}
  <div class="kv">${L('কারণ',d.cause)}${L('ছবিতে যা দেখা যাচ্ছে',d.symptoms)}${steps.length?`<div><h3>এখনই যা করবেন</h3><ol class="steps">${steps.map(x=>`<li>${t(x)}</li>`).join('')}</ol></div>`:''}${L('জৈব ও সাংস্কৃতিক উপায়',d.organic)}${L('রাসায়নিক বিকল্প',d.chemical)}${L('ভবিষ্যতে করণীয়',d.prevention)}</div>
  <div class="row" style="margin-top:14px"><button class="btn" data-a="officer">কৃষি অফিসারকে ছবি পাঠান</button></div>
  <p class="tiny muted" style="margin-top:10px">AI বিশ্লেষণ (Google Gemini)। এটি প্রাথমিক ধারণা। ওষুধ ব্যবহারের আগে লেবেল পড়ুন এবং উপজেলা কৃষি অফিসারের পরামর্শ নিন।</p></section>`;
}
