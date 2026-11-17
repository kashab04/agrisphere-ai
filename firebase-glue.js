/* Connects the app to Firebase Authentication (email + password) and Firestore (farmer profile).
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
    const mk = u => ({ uid: u.uid, email: u.email || '', name: u.displayName || '', verified: !!u.emailVerified });
    window.AgriCloud = {
      ready: true,
      async signUp(email, pw, name) {
        const c = await A.createUserWithEmailAndPassword(auth, email, pw);
        try { await A.updateProfile(c.user, { displayName: name }); await A.sendEmailVerification(c.user); } catch (e) {}
        return mk(c.user);
      },
      async signIn(email, pw) { return mk((await A.signInWithEmailAndPassword(auth, email, pw)).user); },
      reset(email) { return A.sendPasswordResetEmail(auth, email); },
      signOut() { return A.signOut(auth); },
      resend() { return A.sendEmailVerification(auth.currentUser); },
      async refresh() { await A.reload(auth.currentUser); return auth.currentUser.emailVerified; },
      saveProfile(uid, data) { return F.setDoc(F.doc(db, 'users', uid), data, { merge: true }); },
      async loadProfile(uid) { const s = await F.getDoc(F.doc(db, 'users', uid)); return s.exists() ? s.data() : null; }
    };
    A.onAuthStateChanged(auth, u => window.dispatchEvent(new CustomEvent('agri-auth', { detail: u ? mk(u) : null })));
    window.dispatchEvent(new Event('agri-cloud'));
  } catch (e) { console.warn('Firebase unavailable, running in demo mode', e); }
})();
