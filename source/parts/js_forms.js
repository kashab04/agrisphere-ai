/* ---------- auth: multi-step sign-up, password login, OTP, password reset (demo only) ---------- */
const authArt=t=>`<div class="auth-art"><b>${t}</b><small>স্মার্ট চাষ, টেকসই ভবিষ্যৎ</small><img src="${IMG.hero}" alt=""></div>`;
const pwh=(ph,pw)=>'h'+hash('agri|'+ph+'|'+pw);
const au=()=>{const a=S.auth;if(!a.mode)a.mode=S.route==='signup'?'signup':'login';if(!a.d)a.d={};return a;};
const fE=k=>{const a=S.auth;return a.errs&&a.errs[k]?`<div class="ferr" role="alert">${a.errs[k]}</div>`:'';};
const fC=k=>S.auth.errs&&S.auth.errs[k]?' bad':'';
const topErr=()=>S.auth.err?`<div class="err" role="alert" style="margin-top:12px">${S.auth.err}</div>`:'';
const topOk=()=>S.auth.ok?`<div class="okmsg" role="status" style="margin-top:12px">${S.auth.ok}</div>`:'';
const prog=(n,t)=>`<div class="steps4" role="img" aria-label="ধাপ ${bn(n)} / ${bn(t)}">${Array.from({length:t},(_,i)=>`<i class="${i+1<n?'dn':i+1===n?'on':''}"></i>`).join('')}</div><p class="small muted" style="margin-top:6px">ধাপ ${bn(n)}/${bn(t)}</p>`;
const pwField=(id,label,ac,k)=>`<div class="fld${fC(k)}"><label for="${id}">${label}</label><div class="pwwrap"><input id="${id}" type="password" autocomplete="${ac}" ${fC(k)?'aria-invalid="true"':''}><button type="button" class="pwtoggle" data-a="togglePw" data-v="${id}" aria-label="পাসওয়ার্ড দেখান বা লুকান">দেখান</button></div>${fE(k)}</div>`;
const phoneField=(id,v,k)=>`<div class="fld${fC(k)}"><label for="${id}">মোবাইল নম্বর</label><input id="${id}" class="phin" type="tel" inputmode="numeric" maxlength="14" placeholder="০১৭XXXXXXXX" autocomplete="tel" value="${esc(v||'')}" ${fC(k)?'aria-invalid="true"':''}>${fE(k)}</div>`;
const sendBtn=(t)=>`<div style="margin-top:18px"><button class="btn primary" style="width:100%" type="submit">${t}</button></div>`;

function otpStep(){
 const a=S.auth;
 return `<form data-f="otp" novalidate>
 ${topErr()}<p class="okmsg" style="margin-top:12px">${bn(a.d.phone)} নম্বরে ৪ অঙ্কের OTP পাঠানো হয়েছে। ডেমো: কোনো এসএমএস যায় না, OTP হলো ১২৩৪।</p>
 <div class="otpbox-row${fC('otp')}" role="group" aria-label="৪ অঙ্কের OTP">${[0,1,2,3].map(i=>`<input class="otpbox" type="text" inputmode="numeric" maxlength="1" autocomplete="${i?'off':'one-time-code'}" aria-label="অঙ্ক ${bn(i+1)}">`).join('')}</div>
 ${fE('otp')}
 <div id="resend" class="small muted" style="margin-top:12px;text-align:center"></div>
 <div class="row" style="margin-top:16px"><button class="btn primary" type="submit">যাচাই করুন</button><button class="btn" type="button" data-a="authBack">নম্বর বদলান</button></div></form>`;
}
function passStep(){
 const a=S.auth,reset=a.mode==='reset';
 return `<form data-f="pass" novalidate>${topErr()}
 ${pwField('apw',reset?'নতুন পাসওয়ার্ড':'পাসওয়ার্ড তৈরি করুন','new-password','pw')}
 <div id="pwm" class="pwm" aria-live="polite"></div>
 ${pwField('apw2','পাসওয়ার্ড আবার লিখুন','new-password','pw2')}
 <p class="small muted" style="margin-top:8px">কমপক্ষে ৬ অক্ষর। ডেমো: পাসওয়ার্ড শুধু এই ব্রাউজারে সংরক্ষিত থাকে।</p>
 ${sendBtn(reset?'পাসওয়ার্ড বদলান':'এগিয়ে যান')}</form>`;
}
function farmStep(){
 const a=S.auth,f=a.d.farm||{district:'রংপুর',crop:'potato',land:1,soil:'loam'};
 return `<form data-f="farm" novalidate>${topErr()}
 <div class="fld"><label for="sdist">জেলা</label><select id="sdist">${distOpts(f.district)}</select></div>
 <div class="fld"><label for="scrop">প্রধান ফসল</label><select id="scrop">${cropOpts(f.crop)}</select></div>
 <div class="fld${fC('land')}"><label for="sland">জমির পরিমাণ (একর)</label><input id="sland" type="number" min="0.1" max="50" step="0.1" inputmode="decimal" value="${f.land}">${fE('land')}</div>
 <div class="fld"><label for="ssoil">মাটির ধরন</label><select id="ssoil">${soilOpts(f.soil)}</select></div>
 <p class="small muted" style="margin-top:8px">না জানলে "দো-আঁশ" রাখুন। পরে প্রোফাইল থেকে বদলানো যাবে।</p>
 ${sendBtn('অ্যাকাউন্ট তৈরি করুন')}
 <div style="margin-top:8px"><button class="btn" style="width:100%" type="button" data-a="farmBack">পেছনে</button></div></form>`;
}
const signupLocal=()=>{
 const a=au(),d=a.d;let body,n=1;
 if(a.step==='otp'){n=2;body=otpStep();}
 else if(a.step==='pass'){n=3;body=passStep();}
 else if(a.step==='farm'){n=4;body=farmStep();}
 else body=`<form data-f="info" novalidate>${topErr()}
  <div class="fld${fC('name')}"><label for="sname">আপনার নাম</label><input id="sname" type="text" autocomplete="name" value="${esc(d.name||'')}" ${fC('name')?'aria-invalid="true"':''}>${fE('name')}</div>
  ${phoneField('sphone',d.phone,'phone')}
  <label class="chk${fC('terms')}"><input type="checkbox" id="sterms" ${d.terms?'checked':''}><span>আমি ডেমো ব্যবহারের শর্ত ও গোপনীয়তা নীতিতে সম্মত।</span></label>${fE('terms')}
  ${sendBtn('OTP পাঠান')}</form>`;
 const title=['অ্যাকাউন্ট খুলুন','মোবাইল যাচাই','পাসওয়ার্ড দিন','আপনার জমির তথ্য'][n-1];
 const sub=['নাম ও মোবাইল নম্বর দিয়ে শুরু করুন।','এসএমএসে আসা কোডটি লিখুন।','অ্যাকাউন্ট সুরক্ষিত রাখতে পাসওয়ার্ড দিন।','এই তথ্য দিয়ে সব হিসাব আপনার জন্য মিলিয়ে দেওয়া হবে।'][n-1];
 return `<div class="auth-wrap">${authArt('নতুন অ্যাকাউন্ট')}
 <section class="card">${prog(n,4)}<h1 style="font-size:1.5rem;margin-top:8px">${title}</h1><p class="muted" style="margin-top:4px">${sub}</p>${body}</section>
 <p class="small muted" style="text-align:center">আগে থেকেই অ্যাকাউন্ট আছে? <a href="#login"><b>লগইন করুন</b></a></p></div>`;
};
const loginLocal=()=>{
 const a=au(),d=a.d;
 if(a.mode==='reset'){
  const n=a.step==='otp'?2:a.step==='pass'?3:1;
  const body=a.step==='otp'?otpStep():a.step==='pass'?passStep():`<form data-f="reset-phone" novalidate>${topErr()}${phoneField('aphone',d.phone,'phone')}${sendBtn('OTP পাঠান')}</form>`;
  return `<div class="auth-wrap">${authArt('পাসওয়ার্ড উদ্ধার')}
  <section class="card">${prog(n,3)}<h1 style="font-size:1.5rem;margin-top:8px">পাসওয়ার্ড ভুলে গেছেন?</h1><p class="muted" style="margin-top:4px">মোবাইলে OTP দিয়ে নতুন পাসওয়ার্ড দিন।</p>${body}</section>
  <p class="small muted" style="text-align:center"><a href="#login" data-a="authCancel"><b>লগইনে ফিরে যান</b></a></p></div>`;
 }
 return `<div class="auth-wrap">${authArt('স্বাগতম')}
 <section class="card"><h1 style="font-size:1.5rem">লগইন</h1><p class="muted" style="margin-top:4px">মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে প্রবেশ করুন।</p>
 ${topOk()}${topErr()}
 <form data-f="login" novalidate>${phoneField('aphone',d.phone,'phone')}${pwField('apw','পাসওয়ার্ড','current-password','pw')}
 <div style="margin-top:6px;text-align:right"><button type="button" class="linkbtn" data-a="forgot">পাসওয়ার্ড ভুলে গেছেন?</button></div>
 ${sendBtn('লগইন')}</form></section>
 <div class="divider">অথবা</div>
 <button class="btn" data-a="demoLogin">ডেমো কৃষক হিসেবে প্রবেশ করুন</button>
 <p class="small muted" style="text-align:center">নতুন? <a href="#signup"><b>অ্যাকাউন্ট খুলুন</b></a></p></div>`;
};

/* helpers */
const authFocus=()=>{const el=document.querySelector('.fld.bad input,.otpbox-row.bad .otpbox')||document.querySelector('.otpbox')||document.querySelector('.auth-wrap form input:not([type=checkbox])');if(el)try{el.focus({preventScroll:false});}catch(e){}};
const rerender=()=>{render();authFocus();};
const busy=(f,fn)=>{const b=f&&f.querySelector('button[type=submit]');if(b){b.disabled=true;b.innerHTML='<span class="spin"></span> অপেক্ষা করুন…';}setTimeout(fn,500);};
const sendOtp=()=>{S.auth.sentAt=Date.now();S.auth.resendAt=Date.now()+30000;S.auth.tries=0;};
const cleanPh=v=>toEn(v).replace(/\D/g,'');

const AF={
 'login':f=>{
  const a=au(),ph=cleanPh($('#aphone').value),pw=$('#apw').value;a.d.phone=ph;a.ok='';a.err='';a.errs={};
  if(a.lockUntil&&Date.now()<a.lockUntil){a.err='অনেকবার ভুল হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।';return rerender();}
  if(!validPhone(ph))a.errs.phone='সঠিক মোবাইল নম্বর দিন, যেমন ০১৭১২৩৪৫৬৭৮৯।';
  if(!pw)a.errs.pw='পাসওয়ার্ড লিখুন।';
  if(Object.keys(a.errs).length)return rerender();
  busy(f,()=>{
   const u=USERS[ph];
   if(!u){a.errs.phone='এই নম্বরে কোনো অ্যাকাউন্ট নেই। অ্যাকাউন্ট খুলুন বা ডেমো কৃষক হিসেবে প্রবেশ করুন।';return rerender();}
   if(!u.pw){a.errs.pw='এই অ্যাকাউন্টে এখনও পাসওয়ার্ড নেই। "পাসওয়ার্ড ভুলে গেছেন?" চেপে একটি দিন।';return rerender();}
   if(u.pw!==pwh(ph,pw)){a.fails=(a.fails||0)+1;if(a.fails>=5){a.lockUntil=Date.now()+30000;a.fails=0;a.err='৫ বার ভুল হয়েছে। ৩০ সেকেন্ড পর আবার চেষ্টা করুন।';}else a.errs.pw='পাসওয়ার্ড ঠিক নয়। আর '+bn(5-a.fails)+' বার চেষ্টা করা যাবে।';return rerender();}
   loginUser(u);toast('স্বাগতম, '+u.name+'!');
  });
 },
 'info':f=>{
  const a=au(),d=a.d;d.name=$('#sname').value.trim();d.phone=cleanPh($('#sphone').value);d.terms=$('#sterms').checked;a.err='';a.errs={};
  if(d.name.length<2)a.errs.name='আপনার নাম লিখুন।';
  if(!validPhone(d.phone))a.errs.phone='সঠিক মোবাইল নম্বর দিন, যেমন ০১৭১২৩৪৫৬৭৮৯।';
  else if(USERS[d.phone])a.errs.phone='এই নম্বরে আগেই অ্যাকাউন্ট আছে। লগইন করুন।';
  if(!d.terms)a.errs.terms='এগিয়ে যেতে সম্মতি দিন।';
  if(Object.keys(a.errs).length)return rerender();
  busy(f,()=>{sendOtp();a.step='otp';rerender();});
 },
 'reset-phone':f=>{
  const a=au(),ph=cleanPh($('#aphone').value);a.d.phone=ph;a.err='';a.errs={};
  if(!validPhone(ph))a.errs.phone='সঠিক মোবাইল নম্বর দিন, যেমন ০১৭১২৩৪৫৬৭৮৯।';
  else if(!USERS[ph])a.errs.phone='এই নম্বরে কোনো অ্যাকাউন্ট নেই।';
  if(Object.keys(a.errs).length)return rerender();
  busy(f,()=>{sendOtp();a.step='otp';rerender();});
 },
 'otp':f=>{
  const a=au(),code=[...document.querySelectorAll('.otpbox')].map(i=>i.value).join('');a.err='';a.errs={};
  if(code.length<4){a.errs.otp='৪ অঙ্কের কোডটি পুরোটা লিখুন।';return rerender();}
  busy(f,()=>{
   if(code!=='1234'){a.tries=(a.tries||0)+1;a.errs.otp=a.tries>=3?'অনেকবার ভুল হয়েছে। নতুন OTP চান।':'OTP ঠিক নয়। ডেমো OTP হলো ১২৩৪।';if(a.tries>=3)a.resendAt=0;return rerender();}
   a.step='pass';rerender();
  });
 },
 'pass':f=>{
  const a=au(),pw=$('#apw').value,pw2=$('#apw2').value;a.err='';a.errs={};
  if(pw.length<6)a.errs.pw='পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের দিন।';
  else if(pw!==pw2)a.errs.pw2='দুটি পাসওয়ার্ড মেলেনি।';
  if(Object.keys(a.errs).length)return rerender();
  busy(f,()=>{
   const ph=a.d.phone,h=pwh(ph,pw);
   if(a.mode==='reset'){USERS[ph].pw=h;store.set('agri_users',USERS);S.auth={mode:'login',step:'phone',d:{phone:ph},ok:'পাসওয়ার্ড বদলে গেছে। এবার লগইন করুন।'};return rerender();}
   a.d.pw=h;a.step='farm';rerender();
  });
 },
 'farm':f=>{
  const a=au(),d=a.d,farm={district:$('#sdist').value,crop:$('#scrop').value,land:+$('#sland').value,soil:$('#ssoil').value};d.farm=farm;a.err='';a.errs={};
  if(!(farm.land>=.1&&farm.land<=50)){a.errs.land='জমির পরিমাণ ০.১ থেকে ৫০ একরের মধ্যে দিন।';return rerender();}
  busy(f,()=>{
   const u={name:d.name,phone:d.phone,pw:d.pw,profile:Object.assign({name:d.name},farm)};
   USERS[u.phone]=u;loginUser(u);toast('অ্যাকাউন্ট তৈরি হয়েছে। স্বাগতম, '+u.name+'!');
  });
 }
};
Object.assign(A,{
 togglePw:t=>{const i=$('#'+t.dataset.v);if(!i)return;const show=i.type==='password';i.type=show?'text':'password';t.textContent=show?'লুকান':'দেখান';},
 forgot:()=>{S.auth={mode:'reset',step:'phone',d:{phone:(S.auth.d&&S.auth.d.phone)||''}};rerender();},
 authCancel:()=>{S.auth={mode:'login',step:'phone',d:{}};render();},
 farmBack:()=>{S.auth.step='pass';S.auth.errs={};rerender();},
 resendOtp:()=>{sendOtp();S.auth.errs={};S.auth.err='';rerender();toast('নতুন OTP পাঠানো হয়েছে (ডেমো: ১২৩৪)');},
 authBack:()=>{const a=au();a.step='phone';a.errs={};a.err='';rerender();}
});
document.addEventListener('input',e=>{
 const t=e.target;
 if(t.classList.contains('phin')){const v=cleanPh(t.value).slice(0,11);if(t.value!==v)t.value=v;}
 if(t.classList.contains('otpbox')){
  const v=toEn(t.value).replace(/\D/g,'').slice(-1);t.value=v;
  const bx=[...document.querySelectorAll('.otpbox')],i=bx.indexOf(t);
  if(v&&i<3)bx[i+1].focus();
  if(bx.every(b=>b.value)){const f=t.closest('form');if(f&&f.requestSubmit)f.requestSubmit();}
 }
 if(t.id==='apw'&&$('#pwm')){const v=t.value;let s=0;if(v.length>=6)s++;if(v.length>=8)s++;if(/[A-Za-z]/.test(v)&&/\d/.test(v))s++;if(/[^A-Za-z0-9]/.test(v)&&v.length>=8)s++;
  const L=[['','',0],['দুর্বল','bad',1],['মোটামুটি','warn',2],['ভালো','ok',3],['শক্তিশালী','ok',4]][v?Math.max(1,s):0];
  $('#pwm').innerHTML=v?`<div class="bar ${L[1]==='bad'?'':L[1]==='warn'?'sun':''}"><i style="width:${L[2]*25}%"></i></div><span class="small muted">পাসওয়ার্ড: ${L[0]}</span>`:'';}
});
document.addEventListener('keydown',e=>{
 const t=e.target;if(!t.classList||!t.classList.contains('otpbox'))return;
 const bx=[...document.querySelectorAll('.otpbox')],i=bx.indexOf(t);
 if(e.key==='Backspace'&&!t.value&&i>0){bx[i-1].focus();bx[i-1].value='';}
 if(e.key==='ArrowLeft'&&i>0)bx[i-1].focus();if(e.key==='ArrowRight'&&i<3)bx[i+1].focus();
});
document.addEventListener('paste',e=>{
 const t=e.target;if(!t.classList||!t.classList.contains('otpbox'))return;
 const d=toEn((e.clipboardData||window.clipboardData).getData('text')).replace(/\D/g,'').slice(0,4);if(!d)return;
 e.preventDefault();const bx=[...document.querySelectorAll('.otpbox')];d.split('').forEach((c,i)=>{bx[i].value=c;});(bx[Math.min(d.length,3)]).focus();
 if(d.length===4){const f=t.closest('form');if(f&&f.requestSubmit)f.requestSubmit();}
});
setInterval(()=>{
 const el=$('#resend');if(!el||S.route==='home')return;const a=S.auth,left=Math.max(0,Math.ceil(((a.resendAt||0)-Date.now())/1000)),st=left>0?'w'+left:'b';
 if(el.dataset.s===st)return;el.dataset.s=st;
 el.innerHTML=left>0?`${bn(left)} সেকেন্ড পরে আবার OTP চাইতে পারবেন`:'<button class="btn sm" type="button" data-a="resendOtp">আবার OTP পাঠান</button>';
},500);

/* ---------- cloud mode (Firebase email + password), active only when firebase-config.js is filled in ---------- */
const cloud=()=>!!(window.AgriCloud&&window.AgriCloud.ready);
const cErr=e=>{const c=(e&&e.code)||'';return({'auth/email-already-in-use':'এই ইমেইলে আগেই অ্যাকাউন্ট আছে। লগইন করুন।','auth/invalid-email':'সঠিক ইমেইল দিন।','auth/weak-password':'পাসওয়ার্ড আরও শক্ত করুন (কমপক্ষে ৬ অক্ষর)।','auth/invalid-credential':'ইমেইল বা পাসওয়ার্ড ঠিক নয়।','auth/user-not-found':'এই ইমেইলে কোনো অ্যাকাউন্ট নেই।','auth/wrong-password':'ইমেইল বা পাসওয়ার্ড ঠিক নয়।','auth/too-many-requests':'অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।','auth/network-request-failed':'ইন্টারনেট সংযোগ নেই। সংযোগ দেখে আবার চেষ্টা করুন।','auth/operation-not-allowed':'ইমেইল লগইন চালু করা নেই (Firebase → Authentication → Sign-in method দেখুন)।','auth/unauthorized-domain':'এই ঠিকানা Firebase-এ অনুমোদিত নয় (Authorized domains দেখুন)।'})[c]||'কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।';};
const validEmail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const emailField=(id,v,k)=>`<div class="fld${fC(k)}"><label for="${id}">ইমেইল</label><input id="${id}" type="email" inputmode="email" autocomplete="email" placeholder="name@example.com" value="${esc(v||'')}" ${fC(k)?'aria-invalid="true"':''}>${fE(k)}</div>`;
const SYN='@agrisphere.app';
const isSyn=e=>!!e&&e.endsWith(SYN);
const meth=()=>au().method||'phone';
const seg=()=>`<div class="seg" role="group" aria-label="কীভাবে প্রবেশ করবেন" style="margin-top:14px;width:100%"><button type="button" style="flex:1" data-a="authMethod" data-v="phone" aria-pressed="${meth()==='phone'}">মোবাইল নম্বর</button><button type="button" style="flex:1" data-a="authMethod" data-v="email" aria-pressed="${meth()==='email'}">ইমেইল</button></div>`;
const cErrM=(e,m)=>{const t=cErr(e);return m==='phone'?t.replace('ইমেইলে','নম্বরে').replace('ইমেইল','মোবাইল নম্বর'):t;};
const busyA=(f,on)=>{const b=f&&f.querySelector('button[type=submit]');if(b){if(on){b.disabled=true;b.dataset.h=b.innerHTML;b.innerHTML='<span class="spin"></span> অপেক্ষা করুন…';}else{b.disabled=false;if(b.dataset.h)b.innerHTML=b.dataset.h;}}};
async function cloudUser(u,farm,extra){
 let doc=null;try{doc=await AgriCloud.loadProfile(u.uid);}catch(e){}
 const lp=store.get('agri_cp_'+u.uid);
 const base=Object.assign({district:'রংপুর',crop:'potato',land:1,soil:'loam'},(doc&&doc.profile)||lp||{},farm||{});
 const name=(extra&&extra.name)||(doc&&doc.name)||u.name||'কৃষক';
 const syn=isSyn(u.email),em=syn?'':u.email;
 return {cloud:true,uid:u.uid,email:em,name,mobile:(extra&&extra.mobile)||(doc&&doc.phone)||(syn?u.email.slice(0,-SYN.length):''),phone:'cloud:'+u.uid,verified:syn?true:u.verified,profile:Object.assign({},base,{name})};
}
const signupCloud=()=>{
 const a=au(),d=a.d;let n=1,body;
 if(a.step==='pass'){n=2;body=passStep();}
 else if(a.step==='farm'){n=3;body=farmStep();}
  else{const m=meth();body=`${seg()}<form data-f="c-info" novalidate>${topErr()}
  <div class="fld${fC('name')}"><label for="sname">আপনার নাম</label><input id="sname" type="text" autocomplete="name" value="${esc(d.name||'')}" ${fC('name')?'aria-invalid="true"':''}>${fE('name')}</div>
  ${m==='email'?emailField('semail',d.email,'email')+`<div class="fld${fC('phone')}"><label for="sphone">মোবাইল নম্বর <span class="muted">(ঐচ্ছিক)</span></label><input id="sphone" class="phin" type="tel" inputmode="numeric" maxlength="14" placeholder="০১৭XXXXXXXX" autocomplete="tel" value="${esc(d.phone||'')}">${fE('phone')}</div>`:phoneField('sphone',d.phone,'phone')+'<p class="small muted" style="margin-top:6px">এসএমএস কোড লাগবে না। নম্বর ও পাসওয়ার্ড দিয়েই প্রবেশ করবেন।</p>'}
  <label class="chk${fC('terms')}"><input type="checkbox" id="sterms" ${d.terms?'checked':''}><span>আমি ব্যবহারের শর্ত ও গোপনীয়তা নীতিতে সম্মত।</span></label>${fE('terms')}
  ${sendBtn('এগিয়ে যান')}</form>`;}
 const title=['অ্যাকাউন্ট খুলুন','পাসওয়ার্ড দিন','আপনার জমির তথ্য'][n-1];
 const sub=[meth()==='phone'?'নাম ও মোবাইল নম্বর দিয়ে শুরু করুন।':'নাম ও ইমেইল দিয়ে শুরু করুন।','অ্যাকাউন্ট সুরক্ষিত রাখতে পাসওয়ার্ড দিন।','এই তথ্য দিয়ে সব হিসাব আপনার জন্য মিলিয়ে দেওয়া হবে।'][n-1];
 return `<div class="auth-wrap">${authArt('নতুন অ্যাকাউন্ট')}
 <section class="card">${prog(n,3)}<h1 style="font-size:1.5rem;margin-top:8px">${title}</h1><p class="muted" style="margin-top:4px">${sub}</p>${body}</section>
 <p class="small muted" style="text-align:center">আগে থেকেই অ্যাকাউন্ট আছে? <a href="#login"><b>লগইন করুন</b></a></p></div>`;
};
const loginCloud=()=>{
 const a=au(),d=a.d;
 if(a.mode==='reset'){const pm=meth()==='phone';return `<div class="auth-wrap">${authArt('পাসওয়ার্ড উদ্ধার')}
  <section class="card"><h1 style="font-size:1.5rem">পাসওয়ার্ড ভুলে গেছেন?</h1>${seg()}
  ${pm?`<div class="alert-card mid" style="margin-top:14px"><span class="pill warn">জানুন</span><div><b>মোবাইল নম্বরের অ্যাকাউন্টে রিসেট এখনও নেই</b><div class="small">এসএমএস পাঠানোর সুবিধা পরে যুক্ত হবে। এখন পাসওয়ার্ড ভুলে গেলে নতুন পাসওয়ার্ডের জন্য ইমেইল অপশন ব্যবহার করুন, অথবা অন্য নম্বরে নতুন অ্যাকাউন্ট খুলুন।</div></div></div>`
  :`<p class="muted" style="margin-top:12px">ইমেইলে একটি রিসেট লিংক পাঠানো হবে।</p>${topOk()}${topErr()}
  <form data-f="c-reset" novalidate>${emailField('aemail',d.email,'email')}${sendBtn('রিসেট লিংক পাঠান')}</form>`}</section>
  <p class="small muted" style="text-align:center"><a href="#login" data-a="authCancel"><b>লগইনে ফিরে যান</b></a></p></div>`;}
 const m=meth();
 return `<div class="auth-wrap">${authArt('স্বাগতম')}
 <section class="card"><h1 style="font-size:1.5rem">লগইন</h1><p class="muted" style="margin-top:4px">${m==='phone'?'মোবাইল নম্বর':'ইমেইল'} ও পাসওয়ার্ড দিয়ে প্রবেশ করুন।</p>${seg()}
 ${topOk()}${topErr()}
 <form data-f="c-login" novalidate>${m==='phone'?phoneField('aphone',d.phone,'phone'):emailField('aemail',d.email,'email')}${pwField('apw','পাসওয়ার্ড','current-password','pw')}
 <div style="margin-top:6px;text-align:right"><button type="button" class="linkbtn" data-a="forgot">পাসওয়ার্ড ভুলে গেছেন?</button></div>
 ${sendBtn('লগইন')}</form></section>
 <div class="divider">অথবা</div>
 <button class="btn" data-a="demoLogin">ডেমো কৃষক হিসেবে প্রবেশ করুন</button>
 <p class="small muted" style="text-align:center">নতুন? <a href="#signup"><b>অ্যাকাউন্ট খুলুন</b></a></p></div>`;
};
V.signup=()=>cloud()?signupCloud():signupLocal();
V.login=()=>cloud()?loginCloud():loginLocal();
const verifyStrip=()=>S.user&&S.user.cloud&&!S.user.verified?`<div class="alert-card mid"><span class="pill warn">ইমেইল</span><div><b>${esc(S.user.email)} যাচাই করুন</b><div class="small">আমরা যে লিংক পাঠিয়েছি সেটি চাপুন। <button class="linkbtn" data-a="resendVerify">আবার পাঠান</button></div></div></div>`:'';

/* in cloud mode the same step forms are reused, only the submit targets differ */
const cloudForm=AF;
AF['c-info']=f=>{
 const a=au(),d=a.d,m=meth();d.name=$('#sname').value.trim();d.phone=cleanPh($('#sphone').value);d.terms=$('#sterms').checked;a.err='';a.errs={};d.method=m;
 if(m==='email')d.email=$('#semail').value.trim().toLowerCase();
 if(d.name.length<2)a.errs.name='আপনার নাম লিখুন।';
 if(m==='email'){if(!validEmail(d.email))a.errs.email='সঠিক ইমেইল দিন, যেমন name@example.com।';if(d.phone&&!validPhone(d.phone))a.errs.phone='সঠিক মোবাইল নম্বর দিন বা ঘরটি ফাঁকা রাখুন।';}
 else if(!validPhone(d.phone))a.errs.phone='সঠিক মোবাইল নম্বর দিন, যেমন ০১৭১২৩৪৫৬৭৮৯।';
 if(!d.terms)a.errs.terms='এগিয়ে যেতে সম্মতি দিন।';
 if(Object.keys(a.errs).length)return rerender();
 a.step='pass';rerender();
};
const passSubmit=AF['pass'],farmSubmit=AF['farm'],loginSubmit=AF['login'];
AF['pass']=f=>{
 if(!cloud())return passSubmit(f);
 const a=au(),pw=$('#apw').value,pw2=$('#apw2').value;a.err='';a.errs={};
 if(pw.length<6)a.errs.pw='পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের দিন।';else if(pw!==pw2)a.errs.pw2='দুটি পাসওয়ার্ড মেলেনি।';
 if(Object.keys(a.errs).length)return rerender();
 a.d.pwPlain=pw;a.step='farm';rerender();
};
AF['farm']=async f=>{
 if(!cloud())return farmSubmit(f);
 const a=au(),d=a.d,farm={district:$('#sdist').value,crop:$('#scrop').value,land:+$('#sland').value,soil:$('#ssoil').value};d.farm=farm;a.err='';a.errs={};
 if(!(farm.land>=.1&&farm.land<=50)){a.errs.land='জমির পরিমাণ ০.১ থেকে ৫০ একরের মধ্যে দিন।';return rerender();}
 busyA(f,true);S.cloudBusy=true;
 try{
  const pm=d.method==='phone',cu=await AgriCloud.signUp(pm?d.phone+SYN:d.email,d.pwPlain,d.name,pm);d.pwPlain='';
  const u=await cloudUser(cu,farm,{name:d.name,mobile:d.phone});
  try{await AgriCloud.saveProfile(u.uid,{name:u.name,email:u.email,phone:u.mobile,profile:u.profile});}catch(e){}
  S.cloudBusy=false;loginUser(u);toast(pm?'অ্যাকাউন্ট তৈরি হয়েছে। স্বাগতম, '+u.name+'!':'অ্যাকাউন্ট তৈরি হয়েছে। ইমেইলে যাচাইয়ের লিংক পাঠানো হয়েছে।');
 }catch(e){S.cloudBusy=false;a.err=cErrM(e,d.method);if(e&&e.code==='auth/email-already-in-use'){a.step='phone';}rerender();}
};
AF['c-login']=async f=>{
 const a=au(),d=a.d,m=meth();a.ok='';a.err='';a.errs={};const pw=$('#apw').value;let id='';
 if(m==='phone'){d.phone=cleanPh($('#aphone').value);if(!validPhone(d.phone))a.errs.phone='সঠিক মোবাইল নম্বর দিন, যেমন ০১৭১২৩৪৫৬৭৮৯।';id=d.phone+SYN;}
 else{d.email=$('#aemail').value.trim().toLowerCase();if(!validEmail(d.email))a.errs.email='সঠিক ইমেইল দিন।';id=d.email;}
 if(!pw)a.errs.pw='পাসওয়ার্ড লিখুন।';
 if(Object.keys(a.errs).length)return rerender();
 busyA(f,true);S.cloudBusy=true;
 try{const cu=await AgriCloud.signIn(id,pw);const u=await cloudUser(cu);S.cloudBusy=false;loginUser(u);toast('স্বাগতম, '+u.name+'!');}
 catch(e){S.cloudBusy=false;a.err=cErrM(e,m);rerender();}
};
AF['c-reset']=async f=>{
 const a=au(),d=a.d;d.email=$('#aemail').value.trim().toLowerCase();a.ok='';a.err='';a.errs={};
 if(!validEmail(d.email)){a.errs.email='সঠিক ইমেইল দিন।';return rerender();}
 busyA(f,true);
 try{await AgriCloud.reset(d.email);a.ok='যদি এই ইমেইলে অ্যাকাউন্ট থাকে, রিসেট লিংক পাঠানো হয়েছে। ইনবক্স ও স্প্যাম ফোল্ডার দেখুন।';}
 catch(e){a.err=cErr(e);}
 rerender();
};
/* login form dispatch: the shared "login" handler name is used by the local form only */
Object.assign(A,{
 authMethod:t=>{const a=au();a.method=t.dataset.v==='email'?'email':'phone';a.errs={};a.err='';a.ok='';rerender();},
 resendVerify:()=>{AgriCloud.resend().then(()=>toast('যাচাইয়ের ইমেইল আবার পাঠানো হয়েছে')).catch(e=>toast(cErr(e)));}
});
window.addEventListener('agri-cloud',()=>{if(S.route==='login'||S.route==='signup'){S.auth={step:'phone'};render();}});
window.addEventListener('agri-auth',async ev=>{
 const d=ev.detail;if(S.cloudBusy)return;
 if(d){
  if(S.user&&S.user.uid===d.uid)return;
  const u=await cloudUser(d);if(S.cloudBusy||(S.user&&S.user.uid===d.uid))return;
  applyUser(u);route();
 }else if(S.user&&S.user.cloud){S.user=null;route();}
});
document.addEventListener('visibilitychange',()=>{
 if(document.visibilityState==='visible'&&S.user&&S.user.cloud&&!S.user.verified&&window.AgriCloud){
  AgriCloud.refresh().then(v=>{if(v&&S.user){S.user.verified=true;render();}}).catch(()=>{});}
});
