/* Connects the app to Firebase Authentication (email or mobile number + password) and Firestore (farmer profile).
   Does nothing until firebase-config.js is filled in. Exposes window.AgriCloud for the app. */
import cfg from './firebase-config.js';

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
    window.AgriCloud = {
      ready: true,
      async signUp(email, pw, name, noVerify) {
        const c = await A.createUserWithEmailAndPassword(auth, email, pw);
        try { await A.updateProfile(c.user, { displayName: name }); if (!noVerify) await sendVerify(c.user); } catch (e) {}
        return mk(c.user);
      },
      async signIn(email, pw) { return mk((await A.signInWithEmailAndPassword(auth, email, pw)).user); },
      async reset(email) { try { await A.sendPasswordResetEmail(auth, email, backReset()); } catch (e) { if (e && e.code && e.code.indexOf('continue-uri') > -1) await A.sendPasswordResetEmail(auth, email); else throw e; } },
      signOut() { return A.signOut(auth); },
      resend() { return sendVerify(auth.currentUser); },
      async refresh() { await A.reload(auth.currentUser); return auth.currentUser.emailVerified; },
      saveProfile(uid, data) { return F.setDoc(F.doc(db, 'users', uid), data, { merge: true }); },
      async loadProfile(uid) { const s = await F.getDoc(F.doc(db, 'users', uid)); return s.exists() ? s.data() : null; }
    };
    A.onAuthStateChanged(auth, u => window.dispatchEvent(new CustomEvent('agri-auth', { detail: u ? mk(u) : null })));
    window.dispatchEvent(new Event('agri-cloud'));
  } catch (e) { console.warn('Firebase unavailable, running in demo mode', e); }
})();
