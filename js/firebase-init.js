/* FPP v2 — Firebase 초기화 (compat SDK)
   기존 OPFP Firebase 프로젝트에 그대로 연결한다. 데이터는 읽기 우선으로 사용하며
   삭제/구조 변경은 하지 않는다. */
var firebaseConfig = {
  apiKey: "AIzaSyCF1o7_h-70-HwfC_5YoxOmTJFTBfFa04w",
  authDomain: "fighting-path-patch.firebaseapp.com",
  projectId: "fighting-path-patch",
  storageBucket: "fighting-path-patch.firebasestorage.app",
  messagingSenderId: "1071337898551",
  appId: "1:1071337898551:web:d6f2c10f0f29e430a675b2",
  measurementId: "G-VMY3PHGN4C",
};

var FB = { ready: false, error: null, db: null, auth: null };
try {
  if (window.firebase && firebase.apps && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  FB.db = firebase.firestore();
  FB.auth = firebase.auth();
  FB.ready = true;
} catch (e) {
  FB.error = e;
  console.error("[FPP] Firebase init failed", e);
}
window.FB = FB;
