const store={get(k){try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};
let USERS=store.get('agri_users')||{};
const toEn=s=>String(s).replace(/[০-৯]/g,d=>BD.indexOf(d));
const validPhone=p=>/^01[3-9]\d{8}$/.test(p);
let cpT=null;
function persist(){if(!S.user)return;S.user.profile=S.profile;
 if(S.user.cloud){const u=S.user;store.set('agri_cp_'+u.uid,S.profile);clearTimeout(cpT);cpT=setTimeout(()=>{if(window.AgriCloud&&S.user&&S.user.uid===u.uid)AgriCloud.saveProfile(u.uid,{name:u.name,email:u.email,phone:u.mobile||'',profile:S.profile}).catch(()=>{if(!S.saveWarn){S.saveWarn=1;toast('তথ্য এই ডিভাইসে সেভ হয়েছে, কিন্তু ক্লাউডে নয়।');}});},1500);return;}
 USERS[S.user.phone]=S.user;store.set('agri_users',USERS);}
function applyUser(u){
 S.user=u;S.profile=Object.assign({name:u.name,district:'রংপুর',crop:'potato',land:2,soil:'loam'},u.profile||{},{name:u.name});
 S.mCrop=S.profile.crop;S.prefill=null;S.g={key:S.profile.crop,photo:null,scanning:false};
}
function loginUser(u){applyUser(u);if(!u.cloud)store.set('agri_cur',u.phone);persist();go('home');}
function renderHeader(){
 const on=S.route==='login'||S.route==='signup';
 $('#hdr').innerHTML=`<a class="brand" href="#home" aria-label="কৃষিসখা"><img src="${IMG.logo}" alt=""><span>কৃষিসখা</span></a>`
 +(S.user&&!on?`<div class="hright"><button class="langbtn" data-a="lang" data-v="${LANG==='bn'?'en':'bn'}" aria-label="ভাষা বদলান">${LANG==='bn'?'EN':'বাং'}</button><a class="homebtn" href="#home" ${S.route==='home'?'aria-current="page"':''}>${ic('home')}<span>হোম</span></a><button class="avatar" data-a="account" aria-label="আমার অ্যাকাউন্ট"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg></button></div>`:`<div class="hright"><button class="langbtn" data-a="lang" data-v="${LANG==='bn'?'en':'bn'}" aria-label="ভাষা বদলান">${LANG==='bn'?'EN':'বাং'}</button></div>`);
}
function render(){
 renderHeader();
 $('#app').innerHTML=(V[S.route]||V.home)();
 persist();hydrate();
}
function accountSheet(){
 const p=S.profile,u=S.user;
 return `<div class="sheet" role="dialog" aria-modal="true" aria-label="আমার অ্যাকাউন্ট"><div class="sheet-h"><h2>আমার অ্যাকাউন্ট</h2><button class="x" data-a="close" aria-label="বন্ধ করুন">×</button></div>
 <dl class="acct"><dt>নাম</dt><dd>${esc(u.name)}</dd>${u.cloud?`${u.email?`<dt>ইমেইল</dt><dd>${esc(u.email)}</dd>`:''}${u.mobile?`<dt>মোবাইল</dt><dd>${bn(u.mobile)}</dd>`:''}`:`<dt>মোবাইল</dt><dd>${bn(u.phone)}</dd>`}<dt>জেলা</dt><dd>${p.district}</dd><dt>ফসল</dt><dd>${CROPS[p.crop].bn}</dd><dt>জমি</dt><dd>${dec(p.land)} একর, ${SOIL[p.soil]} মাটি</dd></dl>
 <div class="row"><button class="btn" data-a="profile">তথ্য বদলান</button><button class="btn" data-a="logout">লগ আউট</button></div>
 <div class="row" style="margin-top:8px"><button class="btn" data-a="open" data-v="settings">সেটিংস</button><button class="btn" data-a="open" data-v="help">সহায়তা ও মতামত</button></div></div>`;
}
