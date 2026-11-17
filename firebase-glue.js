/* Connects the app to Firebase Authentication (email or mobile number + password) and Firestore (farmer profile).
   Does nothing until firebase-config.js is filled in. Exposes window.AgriCloud for the app. */
import cfg from './firebase-config.js';

window.AGRI_CONTACT = (cfg && cfg.contactEmail) || '';
(async () => {
  if (!cfg || !cfg.apiKey) return;
  try {
    const B = 'https://www.gstatic.com/firebasejs/10.14.1/';
    const [{ initializeApp }, A, F] = await Promise.all([
      import(B + 'firebase-app.js'), import(B + 'firebase-auth.js'), import(B + 'firebase-firestore.js')
    ]);
    const app = initializeApp(cfg), auth = A.getAuth(app), db = F.getFirestore(app);
    auth.languageCode = 'bn';
    // Links in verification/reset emails bring the person back to this app (needs the domain in Authorized domains)
    const back = () => ({ url: location.origin + location.pathname + '?verified=1' });
    const backReset = () => ({ url: location.origin + location.pathname });
    const sendVerify = async u => { try { await A.sendEmailVerification(u, back()); } catch (e) { await A.sendEmailVerification(u); } };
    const mk = u => ({ uid: u.uid, email: u.email || '', name: u.displayName || '', verified: !!u.emailVerified });
    // AI রোগ শনাক্ত: Firebase AI Logic (Gemini)। আলাদা app-এ লোড হয়, যাতে লগইনের কাজে হাত না পড়ে।
    let aiP = null;
    const aiInit = () => aiP || (aiP = (async () => {
      const B2 = 'https://www.gstatic.com/firebasejs/13.4.0/';
      const [{ initializeApp: init2 }, AI, AC] = await Promise.all([
        import(B2 + 'firebase-app.js'), import(B2 + 'firebase-ai.js'), import(B2 + 'firebase-app-check.js')
      ]);
      const app2 = init2(cfg, 'ai');
      // শুধু আপনার নিজের ডিভাইসে ডিবাগ টোকেন দিয়ে পরীক্ষার জন্য: ব্রাউজারে localStorage.agri_appcheck_debug = '<টোকেন>' বসান
      try { const dbg = localStorage.getItem('agri_appcheck_debug'); if (dbg) self.FIREBASE_APPCHECK_DEBUG_TOKEN = dbg; } catch (e) {}
      if (cfg.recaptchaSiteKey || self.FIREBASE_APPCHECK_DEBUG_TOKEN) AC.initializeAppCheck(app2, { provider: new AC.ReCaptchaEnterpriseProvider(cfg.recaptchaSiteKey || 'debug'), isTokenAutoRefreshEnabled: true });
      return { AI, ai: AI.getAI(app2, { backend: new AI.GoogleAIBackend() }) };
    })().catch(e => { aiP = null; throw e; }));
    window.AgriCloud = {
      ready: true,
      async signUp(email, pw, name, noVerify) {
        const c = await A.createUserWithEmailAndPassword(auth, email, pw);
        try { await A.updateProfile(c.user, { displayName: name }); if (!noVerify) await sendVerify(c.user); } catch (e) {}
        return mk(c.user);
      },
      async signIn(email, pw) { return mk((await A.signInWithEmailAndPassword(auth, email, pw)).user); },
      async reset(email) { try { await A.sendPasswordResetEmail(auth, email, backReset()); } catch (e) { if (e && e.code && e.code.indexOf('continue-uri') > -1) await A.sendPasswordResetEmail(auth, email); else throw e; } },
      async diagnose(b64, mime, prompt) {
        const { AI, ai } = await aiInit();
        const names = [cfg.aiModel, 'gemini-3.5-flash-lite', 'gemini-3.8-flash'].filter((x, i, a) => x && a.indexOf(x) === i);
        let last;
        for (const n of names) {
          try {
            const m = AI.getGenerativeModel(ai, { model: n, generationConfig: { responseMimeType: 'application/json', temperature: 0.2 } });
            const r = await m.generateContent([prompt, { type: 'inlineData', inlineData: { data: b64, mimeType: mime } }]);
            return r.response.text();
          } catch (e) { last = e; if (!/not.?found|404|unsupported|model/i.test(String(e && e.message))) break; }
        }
        throw last;
      },
      signOut() { return A.signOut(auth); },
      resend() { return sendVerify(auth.currentUser); },
      async refresh() { await A.reload(auth.currentUser); return auth.currentUser.emailVerified; },
      async sendFeedback(d) { await F.addDoc(F.collection(db, 'feedback'), { uid: auth.currentUser ? auth.currentUser.uid : '', type: d.type, message: d.message, contact: d.contact, name: d.name, lang: d.lang, app: d.app, createdAt: F.serverTimestamp() }); },
      saveProfile(uid, data) { return F.setDoc(F.doc(db, 'users', uid), data, { merge: true }); },
      async loadProfile(uid) { const s = await F.getDoc(F.doc(db, 'users', uid)); return s.exists() ? s.data() : null; }
    };
    A.onAuthStateChanged(auth, u => window.dispatchEvent(new CustomEvent('agri-auth', { detail: u ? mk(u) : null })));
    window.dispatchEvent(new Event('agri-cloud'));
  } catch (e) { console.warn('Firebase unavailable, running in demo mode', e); }
})();
