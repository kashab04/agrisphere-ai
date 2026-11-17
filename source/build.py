import re, json, pathlib
KEEP_SUB = {'কেজি', 'একর', 'কিমি', 'ছত্রাক।', 'কেজি।', 'কেজিতে', 'বার্তা', 'সোম:', 'মঙ্গল:', 'বুধ:', 'বৃহঃ:', 'শুক্র:', 'শনি:', 'রবি:', 'ডোমেইন:', 'ইউরিয়া', 'হিমাগার-', 'কাছেই'}
def load_en():
    d = {}
    for f in ['names.txt', 'frag1.txt', 'frag2.txt', 'extras.txt']:
        for ln in (pathlib.Path(__file__).resolve().parent / 'en' / f).read_text(encoding='utf-8').split('\n'):
            if '=>' in ln and ln.strip():
                k, v = ln.split('=>', 1)
                if f != 'names.txt' and k and k[0] not in '=- /(' and ' ' not in k and len(k) <= 8 and k not in KEEP_SUB:
                    k = '=' + k
                d[k] = v
    for sk, sv in [('এঁটেল','Clay'),('বেলে','Sandy'),('পলি','Silt'),('লাল','Red'),('লবণাক্ত','Saline'),('বেলে-দো-আঁশ','Sandy loam'),('এঁটেল-দো-আঁশ','Clay loam'),('পিট/জৈব','Peat/organic'),('দো-আঁশ','Loam')]:
        d[sk + ' মাটি'] = sv + ' soil'
        d[sk + ' মাটিতে মাঝারি সেচ যথেষ্ট।'] = sv + ' soil needs only medium irrigation.'
        d[sk + ' মাটি দ্রুত শুকায়, তাই সেচ বেশি লাগে।'] = sv + ' soil dries quickly, so more irrigation is needed.'
        d[sk + ' মাটি পানি ধরে রাখে, তাই সেচ কম লাগে।'] = sv + ' soil holds water, so less irrigation is needed.'
    return 'const EN=' + json.dumps(d, ensure_ascii=False, separators=(',', ':')) + ';\n'
root = pathlib.Path(__file__).resolve().parent
P = lambda n: (root / 'parts' / n).read_text()
s = (root / 'orig.html').read_text()

def between(s, a, b, repl):
    i = s.index(a); j = s.index(b, i)
    return s[:i] + repl + s[j:]

# CSS
s = between(s, '/* top bar */', 'main{padding-block:22px 110px;display:block}', P('css_top.css'))
s = between(s, '/* home */', '/* day strip */', P('css_home.css'))
s = s.replace('</style>', P('css_extra.css') + '</style>', 1)

# markup
s = between(s, '<header class="top">', '<main class="wrap" id="app"></main>', P('markup_top.html'))
s = re.sub(r'<nav class="bnav".*?</nav>\n', '', s, flags=re.S)

# JS
s = between(s, 'V.home=()=>{', 'V.yieldmax=()=>{', P('js_home.js'))
s = s.replace('<header class="mod-head"><span class="tag">', '<header class="mod-head"><a class="back" href="#home">← পিছনে</a><span class="tag">', 1)
s = between(s, 'function render(){', 'function hydrate()', P('js_render.js'))
old_route = "function route(){const h=location.hash.slice(1);S.route=V[h]?h:'home';render();window.scrollTo(0,0);}"
assert old_route in s
s = s.replace(old_route, P('js_route.js').strip())
s = re.sub(r" reset:\(\)=>\{Object\.assign\(S,\{profile.*\n", lambda m: P('js_actions.js'), s, count=1)
s = s.replace("document.addEventListener('submit',e=>{\n const f=e.target.dataset.f;if(!f)return;e.preventDefault();",
              P('js_forms.js') + load_en() + P('js_settings.js') + "document.addEventListener('submit',e=>{\n const f=e.target.dataset.f;if(!f)return;e.preventDefault();\n if(AF[f]){AF[f](e.target);return;}", 1)
s = s.replace(" if(c==='land'){S.profile.land=+e.target.value;",
              " if(c==='bud'){const p=S.profile,key=p.crop+'|'+p.land;S.bud[key]=S.bud[key]||{};document.querySelectorAll('[data-c=\"bud\"]').forEach(el=>{const v=Math.max(0,+el.value||0);if(el.dataset.k==='price')S.budP[p.crop]=Math.max(1,v);else S.bud[key][el.dataset.k]=v;});$('#budOut').innerHTML=budOut();}\n if(c==='land'){S.profile.land=+e.target.value;", 1)
s = s.replace("window.addEventListener('hashchange',route);\nroute();",
              "window.addEventListener('hashchange',route);\n{const cur=store.get('agri_cur');if(cur&&USERS[cur])applyUser(USERS[cur]);}\nroute();", 1)
assert "AF[f]" in s and "c==='bud'" in s and 'applyUser(USERS' in s


# all 64 districts
s = between(s, 'const DIST={', 'const DIS={', P('js_dist.js'))
old1 = '<div class="chips" role="group" aria-label="জেলা">${Object.keys(DIST).map(k=>chip(k,`data-a="setDistrict" data-v="${k}"`,k===p.district)).join(\'\')}</div>'
new1 = '<div class="fld" style="margin-top:0"><label for="distsel">জেলা বেছে নিন (৬৪ জেলা)</label><select id="distsel" data-c="district">${distOpts(p.district)}</select></div>'
assert old1 in s
s = s.replace(old1, new1, 1)
old2 = '<div class="lbl">জেলা</div><div class="chips">${Object.keys(DIST).map(k=>chip(k,`data-a="setDistrict" data-v="${k}" data-sheet="1"`,k===p.district)).join(\'\')}</div>'
new2 = '<div class="lbl"><label for="distsel2">জেলা</label></div><select id="distsel2" data-c="district">${distOpts(p.district)}</select>'
assert old2 in s
s = s.replace(old2, new2, 1)
old3 = " if(c==='land'){S.prefill=null;render();}"
assert old3 in s
s = s.replace(old3, old3 + "\n if(c==='district'){S.profile.district=e.target.value;S.prefill=null;render();}", 1)

# more crops and soils
s = between(s, 'const SOIL={', 'const MARKETS={', P('js_crops.js'))
s = between(s, 'const CASES=[', 'const BUY={', P('js_dis.js'))
assert 'const VEH=' in s
s = s.replace('const VEH=', P('js_buy.js') + 'const VEH=', 1)
def rep(old, new):
    global s
    assert old in s, old[:60]
    s = s.replace(old, new, 1)
rep("  healthy:''\n }[key];", "  healthy:''\n }[key]||spotsGen(dz.col||'#6b4a24');")
rep("ঝড়ে গাছ হেলে পড়তে পারে।'}[crop];", "ঝড়ে গাছ হেলে পড়তে পারে।'}[crop]||ACT_DEF;")
rep("(crop==='potato'||crop==='tomato'||crop==='onion'||crop==='rice')&&d.r.some", "DIS[crop].humid&&d.r.some")
rep("maize:.8}[crop];", "maize:.8}[crop]||1;")
rep("${p.soil==='sandy'?'বেলে মাটি দ্রুত শুকায়, তাই সেচ বেশি লাগে।':p.soil==='clay'?'এঁটেল মাটি পানি ধরে রাখে, তাই সেচ কম লাগে।':'দো-আঁশ মাটিতে মাঝারি সেচ যথেষ্ট।'}",
    "${p.soil==='saline'?'লবণাক্ত মাটিতে মিঠা পানিতে সেচ দিন এবং লবণ-সহনশীল জাত বেছে নিন।':SOILF[p.soil].w>=1.1?SOIL[p.soil]+' মাটি দ্রুত শুকায়, তাই সেচ বেশি লাগে।':SOILF[p.soil].w<=.9?SOIL[p.soil]+' মাটি পানি ধরে রাখে, তাই সেচ কম লাগে।':SOIL[p.soil]+' মাটিতে মাঝারি সেচ যথেষ্ট।'}")
rep(r'''<div class="lbl">ফসল</div><div class="chips">${CK.map(k=>chip(CROPS[k].bn,`data-a="pickCrop" data-v="${k}" data-sheet="1"`,k===p.crop)).join('')}</div>''',
    r'''<div class="lbl"><label for="pcrop">ফসল</label></div><select id="pcrop" data-c="crop">${cropOpts(p.crop)}</select>''')
rep(r'''<div class="lbl">মাটি</div><div class="chips">${Object.keys(SOIL).map(k=>chip(SOIL[k],`data-a="setSoil" data-v="${k}" data-sheet="1"`,k===p.soil)).join('')}</div>''',
    r'''<div class="lbl"><label for="psoil">মাটি</label></div><select id="psoil" data-c="soil">${soilOpts(p.soil)}</select>''')
rep(r'''const cropChips=()=>`<div class="chips" role="group" aria-label="ফসল">${CK.map(k=>chip(CROPS[k].bn,`data-a="mCrop" data-v="${k}"`,S.mCrop===k)).join('')}</div>`;''',
    r'''const cropChips=()=>`<div class="fld" style="margin:0 0 4px"><label for="mcropsel">ফসল বেছে নিন</label><select id="mcropsel" data-c="mcrop">${cropOpts(S.mCrop)}</select></div>`;''')
rep(r'''<select id="lcrop">${CK.map(k=>`<option value="${k}" ${k===pf.crop?'selected':''}>${CROPS[k].bn}</option>`).join('')}</select>''',
    r'''<select id="lcrop">${cropOpts(pf.crop)}</select>''')
rep(r'''<div class="chips">${CASES.map(c=>chip(c[1],`data-a="case" data-v="${c[0]}"`,!g.photo&&g.key===c[0])).join('')}</div>''',
    r'''<select id="gcase" data-c="gcase" aria-label="নমুনা পাতা">${CASEOPTS(g.photo?'':g.key)}</select>''')
rep(" if(c==='land'){S.prefill=null;render();}",
    " if(c==='land'){S.prefill=null;render();}\n if(c==='crop'){S.profile.crop=e.target.value;onProfile(false);}\n if(c==='soil'){S.profile.soil=e.target.value;render();}\n if(c==='mcrop'){S.mCrop=e.target.value;render();}\n if(c==='gcase'){A.case({dataset:{v:e.target.value}});}")

img = json.dumps(json.loads(P('assets.json')), ensure_ascii=False)
s = s.replace('__IMG__', img)
s = s.replace('<title>AgriSphere AI</title>', '<title>কৃষিসখা</title>', 1)
s = s.replace('AI Builders Congress · Team 01 · AgriSphere AI।', 'AI Builders Congress · Team 01 · ডোমেইন: AgriSphere AI।', 1)
s = s.replace('[AgriSphere] ', '[কৃষিসখা] ')
_a = " const avg=d.r.reduce((a,b)=>a+b,0)/7;"
assert _a in s
s = s.replace(_a, " if(!alerts.length)alerts.push({l:'ok',t:'মাঝারি বৃষ্টির সম্ভাবনা আছে',a:'সেচ দেওয়ার আগে আকাশের অবস্থা দেখে নিন।'});\n" + _a, 1)
# standalone page for GitHub Pages: full document, charset, viewport and PWA tags
head = ('<!doctype html>\n<html lang="bn"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
        '<meta name="theme-color" content="#1B7A3D">'
        '<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes">'
        '<meta name="apple-mobile-web-app-title" content="কৃষিসখা">'
        '<link rel="manifest" href="manifest.webmanifest">' '<script type="module" src="firebase-glue.js"></script>'
        '<link rel="icon" href="icon-192.png"><link rel="apple-touch-icon" href="icon-192.png">')
tail = ('\n<script>if("serviceWorker" in navigator&&location.protocol.startsWith("http")){addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));}</script>\n</body></html>\n')
(root.parent / 'index.html').write_text(head + s + tail)
print('built', len(s)//1024, 'KB')
