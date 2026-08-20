--- public/js/Firebase.js (原始)


+++ public/js/Firebase.js (修改后)
/* ============================================================
   FPP v2 — Firebase.js
   기존 Firebase 프로젝트(fighting-path-patch)에 연결만 한다.
   데이터는 절대 삭제/변경하지 않으며, 읽기 + 규칙이 허용하는 쓰기만 수행.
   ============================================================ */
(function () {
  'use strict';

  /* ---- 기존 프로젝트 설정 (기존 저장소 firebase.js와 동일 프로젝트) ---- */
  var firebaseConfig = {
    apiKey: "AIzaSyCF1o7_h-70-HwfC_5YoxOmTJFTBfFa04w",
    authDomain: "fighting-path-patch.firebaseapp.com",
    projectId: "fighting-path-patch",
    storageBucket: "fighting-path-patch.firebasestorage.app",
    messagingSenderId: "1071337898551",
    appId: "1:1071337898551:web:d6f2c10f0f29e430a675b2",
    measurementId: "G-VMY3PHGN4C"
  };

  var app = null, db = null, auth = null, ready = false;
  try {
    if (window.firebase && firebase.apps) {
      app = firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
      auth = firebase.auth();
      try { auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); } catch (e) {}
      ready = true;
    }
  } catch (err) {
    console.error('[FPP] Firebase init failed:', err);
  }

  /* ================= 공통 유틸 ================= */
  function tsToDate(v) {
    if (!v) return null;
    try {
      if (typeof v.toDate === 'function') return v.toDate();
      if (v.seconds) return new Date(v.seconds * 1000);
      var d = new Date(v);
      return isNaN(d.getTime()) ? null : d;
    } catch (e) { return null; }
  }
  function dateKey(v) {
    var d = tsToDate(v);
    if (d) return d.toISOString().slice(0, 10);
    if (typeof v === 'string' && v) return v.slice(0, 10);
    return '';
  }
  function pick(d /*, keys... */) {
    for (var i = 1; i < arguments.length; i++) {
      var v = d[arguments[i]];
      if (v !== undefined && v !== null && v !== '') return v;
    }
    return null;
  }
  function errMsg(e) {
    if (!e) return 'Firebase 요청 중 오류가 발생했습니다.';
    var c = e.code || '';
    var map = {
      'auth/invalid-credential': '아이디 또는 비밀번호가 올바르지 않습니다.',
      'auth/wrong-password': '비밀번호가 올바르지 않습니다.',
      'auth/user-not-found': '가입되지 않은 아이디입니다.',
      'auth/email-already-in-use': '이미 가입된 이메일입니다.',
      'auth/weak-password': '비밀번호는 6자 이상이어야 합니다.',
      'auth/network-request-failed': '네트워크 연결을 확인해 주세요.',
      'auth/popup-closed-by-user': '로그인 창이 닫혔습니다.',
      'auth/too-many-requests': '시도가 너무 많습니다. 잠시 후 다시 해주세요.',
      'auth/requires-recent-login': '보안을 위해 다시 로그인한 후 진행해 주세요.',
      'permission-denied': '요청이 거부되었습니다. 로그인 상태를 확인해 주세요.'
    };
    if (map[c]) return map[c];
    if (String(c).indexOf('permission') > -1) return map['permission-denied'];
    return e.message || 'Firebase 요청 중 오류가 발생했습니다.';
  }

  /* ================= 읽기 API ================= */
  function col(name) { return db.collection(name); }

  function getBanners() {
    return col('banners').get().then(function (snap) {
      return snap.docs
        .map(function (d) { return Object.assign({ docId: d.id }, d.data()); })
        .filter(function (b) { return b.imageUrl && b.isActive !== false && b.visible !== false; })
        .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    });
  }
  function getEventBanners() {
    return col('eventBanners').get().then(function (snap) {
      return snap.docs
        .map(function (d) { return Object.assign({ docId: d.id }, d.data()); })
        .filter(function (b) { return (b.imageUrl || b.image) && b.visible !== false; })
        .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    });
  }

  function normChar(d) {
    var attr = String(pick(d, 'type', 'attr', 'attribute') || '').toLowerCase();
    var attrMap = { 'force': 'force', '힘': 'force', 'ki': 'ki', '기': 'ki', 'sim': 'sim', '속': 'sim', 'speed': 'sim' };
    return {
      id: pick(d, 'id') != null ? d.id : d.docId,
      docId: d.docId,
      name: pick(d, 'name', 'title') || '이름 미상',
      image: pick(d, 'image', 'imageUrl', 'img', 'thumbnail'),
      grade: pick(d, 'grade', 'gradeName', '등급', 'star', 'stars'),
      attr: attrMap[attr] || attr || null,
      charType: pick(d, 'charType', 'typeName', 'category', 'typeLabel', '타입'),
      visible: d.visible !== false,
      skills: d.skills || null,
      supportSkills: d.supportSkills || null,
      tips: d.tips || null,
      recentPatches: d.recentPatches || null,
      raw: d
    };
  }
  function getCharacters() {
    return col('characters').get().then(function (snap) {
      return snap.docs
        .map(function (d) { return normChar(Object.assign({ docId: d.id }, d.data())); })
        .filter(function (c) { return c.visible; })
        .sort(function (a, b) { return (Number(a.id) || 0) - (Number(b.id) || 0); });
    });
  }
  function getSupportCharacters() {
    return col('supportCharacters').get().then(function (snap) {
      return snap.docs
        .map(function (d) { return normChar(Object.assign({ docId: d.id }, d.data())); })
        .filter(function (c) { return c.visible; })
        .sort(function (a, b) { return (Number(a.id) || 0) - (Number(b.id) || 0); });
    });
  }

  /* pvpPatch — 기존 데이터 구조(type/patches/charId/patchDate)를 그대로 해석 */
  function getPvpPatches() {
    return col('pvpPatch').get().then(function (snap) {
      var groups = [];
      snap.docs.forEach(function (doc) {
        var d = doc.data();
        if (d.visible === false) return;
        var items = (d.patches || []).map(function (p) {
          return typeof p === 'string' ? { type: d.type || '', text: p } : (p || {});
        }).filter(function (p) { return p.text; });
        if (!items.length && !d.charId) return;
        groups.push({
          docId: doc.id,
          charId: d.charId != null ? d.charId : null,
          name: pick(d, 'name', 'charName') || null,
          image: pick(d, 'image', 'imageUrl', 'img'),
          type: d.type || 'fix',
          patchDate: dateKey(pick(d, 'patchDate', 'displayStart', 'updatedAt', 'date')) || dateKey(new Date().toISOString()),
          items: items.length ? items : [{ type: d.type || 'fix', text: pick(d, 'text', 'content') || '' }].filter(function (x) { return x.text; })
        });
      });
      groups.sort(function (a, b) { return (b.patchDate || '').localeCompare(a.patchDate || ''); });
      return groups;
    });
  }

  function normArticle(d, extra) {
    var date = dateKey(pick(d, 'date', 'createdAt', 'timestamp', 'updatedAt')) || '';
    return Object.assign({
      docId: d.docId,
      title: pick(d, 'title', 'name') || '(제목 없음)',
      content: pick(d, 'content', 'html', 'body', 'text'),
      author: pick(d, 'author', 'authorName', 'writer', 'nickname') || '운영자',
      date: date,
      ts: tsToDate(pick(d, 'createdAt', 'date', 'timestamp', 'updatedAt')),
      visible: d.visible !== false,
      raw: d
    }, extra || {});
  }
  function getPatchNotes() {
    return col('patchNotes').get().then(function (snap) {
      return snap.docs
        .map(function (d) { return normArticle(Object.assign({ docId: d.id }, d.data())); })
        .filter(function (p) { return p.visible; })
        .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
    });
  }
  function getNotices() {
    return col('notices').get().then(function (snap) {
      return snap.docs
        .map(function (d) {
          var base = normArticle(Object.assign({ docId: d.id }, d.data()));
          base.category = pick(d.data(), 'category', 'type', 'tag') || null;
          return base;
        })
        .filter(function (n) { return n.visible; })
        .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
    });
  }

  /* 이벤트 — 진행 상태는 status 필드优先, 없으면 기간으로 계산 */
  function evStatus(d) {
    var s = String(pick(d, 'status', 'state') || '').toLowerCase();
    if (s === 'ing' || s === 'on' || s === 'active' || s.indexOf('진행') > -1) return 'ing';
    if (s === 'end' || s === 'off' || s.indexOf('종료') > -1) return 'end';
    var end = dateKey(pick(d, 'endDate', 'endAt', 'end'));
    if (end) {
      var today = new Date(); today.setHours(23, 59, 59, 999);
      return new Date(end + 'T23:59:59') >= today ? 'ing' : 'end';
    }
    var start = dateKey(pick(d, 'startDate', 'startAt', 'start', 'createdAt', 'date'));
    if (start) return 'ing';
    return 'ing';
  }
  function getEvents() {
    return col('events').get().then(function (snap) {
      return snap.docs
        .map(function (d) {
          var data = Object.assign({ docId: d.id }, d.data());
          var likedBy = data.likedBy || [];
          return normArticle(data, {
            image: pick(data, 'imageUrl', 'image', 'thumbnail', 'img', 'bannerUrl'),
            startDate: dateKey(pick(data, 'startDate', 'startAt', 'start')),
            endDate: dateKey(pick(data, 'endDate', 'endAt', 'end')),
            status: evStatus(data),
            likeCount: data.likeCount != null ? data.likeCount : likedBy.length,
            likedBy: likedBy,
            commentCount: data.commentCount || 0
          });
        })
        .filter(function (e) { return e.visible; })
        .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
    });
  }

  function getBoards() {
    return col('boards').get().then(function (snap) {
      return snap.docs
        .map(function (d) {
          var data = Object.assign({ docId: d.id }, d.data());
          var likedBy = data.likedBy || [];
          return normArticle(data, {
            category: pick(data, 'prefix', 'category', 'cat') || '자유',
            uid: data.uid || null,
            images: data.images || [],
            likeCount: data.likeCount != null ? data.likeCount : likedBy.length,
            likedBy: likedBy,
            commentCount: data.commentCount || 0,
            text: data.text || ''
          });
        })
        .sort(function (a, b) { return (b.date || '').localeCompare(a.date || '') || String(b.docId).localeCompare(String(a.docId)); });
    });
  }

  /* ================= 댓글 ================= */
  function commentCol(kind) { return kind === 'event' ? 'eventComments' : 'boardComments'; }
  function getComments(kind, targetId) {
    var q = col(commentCol(kind));
    var key = kind === 'event' ? 'eventId' : 'boardId';
    return q.get().then(function (snap) {
      return snap.docs
        .map(function (d) { return Object.assign({ docId: d.id }, d.data()); })
        .filter(function (c) { return !targetId || c[key] == targetId || c.targetId == targetId; })
        .sort(function (a, b) {
          var da = tsToDate(a.createdAt) || 0, dbb = tsToDate(b.createdAt) || 0;
          return da - dbb;
        });
    });
  }
  function addComment(kind, targetId, text, user, profile) {
    var key = kind === 'event' ? 'eventId' : 'boardId';
    var payload = {
      text: text,
      uid: user.uid,
      authorName: (profile && profile.nickname) || user.displayName || '선원',
      authorIcon: (profile && profile.profileIcon) || null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    payload[key] = targetId;
    return col(commentCol(kind)).add(payload);
  }
  function deleteComment(kind, docId) { return col(commentCol(kind)).doc(docId).delete(); }

  /* ================= 좋아요 ================= */
  /* 게시판: 문서 내부 likedBy 배열 (규칙이 허용하는 유일한 방식) */
  function toggleBoardLike(docId, uid, liked) {
    var ref = col('boards').doc(docId);
    return ref.update({
      likedBy: liked ? firebase.firestore.FieldValue.arrayRemove(uid) : firebase.firestore.FieldValue.arrayUnion(uid),
      likeCount: firebase.firestore.FieldValue.increment(liked ? -1 : 1)
    }).then(function () { return !liked; });
  }
  /* 패치노트/이벤트: likes 컬렉션 (관리자 전용 컬렉션이므로 별도 likes 문서 사용) */
  function likeRef(type, id) { return col('likes').doc(type + '_' + id); }
  function getLikeDoc(type, id) {
    return likeRef(type, id).get().then(function (s) { return s.exists ? s.data() : null; });
  }
  function toggleGenericLike(type, id, uid) {
    var ref = likeRef(type, id);
    return db.runTransaction(function (tx) {
      return tx.get(ref).then(function (snap) {
        var data = snap.exists ? snap.data() : { likedBy: [], likeCount: 0 };
        var arr = Array.isArray(data.likedBy) ? data.likedBy : [];
        var liked = arr.indexOf(uid) > -1;
        var next = liked ? arr.filter(function (u) { return u !== uid; }) : arr.concat([uid]);
        var nextCount = Math.max(0, (data.likeCount != null ? data.likeCount : arr.length) + (liked ? -1 : 1));
        tx.set(ref, { likedBy: next, likeCount: nextCount, targetId: id, targetType: type });
        return !liked;
      });
    });
  }
  function bumpUserLikeCount(uid, delta) {
    return col('users').doc(uid).update({
      likedCount: firebase.firestore.FieldValue.increment(delta)
    }).catch(function () { /* users 문서가 없으면 무시 */ });
  }

  /* ================= 사용자 ================= */
  function ensureUserDoc(user, extra) {
    var ref = col('users').doc(user.uid);
    return ref.get().then(function (snap) {
      if (snap.exists) return snap.data();
      var provider = (user.providerData && user.providerData[0] && user.providerData[0].providerId) || 'password';
      var doc = {
        uid: user.uid,
        email: user.email || null,
        provider: provider.indexOf('google') > -1 ? 'google' : 'email',
        nickname: (extra && extra.nickname) || user.displayName || (user.email ? user.email.split('@')[0] : '선원'),
        profileIcon: (extra && extra.profileIcon) || null,
        likedCount: 0,
        favoriteCharacters: [],
        favoriteSupports: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      return ref.set(doc).then(function () { return doc; });
    });
  }
  function getUserDoc(uid) {
    return col('users').doc(uid).get().then(function (s) { return s.exists ? s.data() : null; });
  }
  function updateUserDoc(uid, patch) { return col('users').doc(uid).update(patch); }

  function getUserStats(uid) {
    return Promise.all([
      col('boards').where('uid', '==', uid).get(),
      col('boardComments').where('uid', '==', uid).get(),
      col('eventComments').where('uid', '==', uid).get(),
      col('users').doc(uid).get()
    ]).then(function (r) {
      var me = r[3].exists ? r[3].data() : {};
      return {
        posts: r[0].size,
        comments: r[1].size + r[2].size,
        likes: me.likedCount || 0
      };
    });
  }

  function withdraw(user) {
    var blockPromise = Promise.resolve();
    try {
      if (user.email && window.crypto && crypto.subtle) {
        blockPromise = crypto.subtle.digest('SHA-256', new TextEncoder().encode(user.email))
          .then(function (buf) {
            var hash = Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
            return col('withdrawalBlocks').doc(hash).set({
              uid: user.uid,
              emailHash: hash,
              blockedUntil: new Date(Date.now() + 24 * 3600 * 1000)
            }).catch(function () { });
          }).catch(function () { });
      }
    } catch (e) { blockPromise = Promise.resolve(); }
    return blockPromise.then(function () { return user.delete(); });
  }

  /* ================= 즐겨찾기 ================= */
  var FAV_KEY = 'fpp_favs_local';
  function getFavs(user) {
    if (!user) {
      try { return Promise.resolve(JSON.parse(localStorage.getItem(FAV_KEY)) || { chars: [], supports: [] }); }
      catch (e) { return Promise.resolve({ chars: [], supports: [] }); }
    }
    return getUserDoc(user.uid).then(function (d) {
      return {
        chars: (d && d.favoriteCharacters) || [],
        supports: (d && d.favoriteSupports) || []
      };
    }).catch(function () { return { chars: [], supports: [] }; });
  }
  function saveFavs(user, favs) {
    if (!user) {
      try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (e) {}
      return Promise.resolve();
    }
    return col('users').doc(user.uid).update({
      favoriteCharacters: favs.chars.slice(0, 16),
      favoriteSupports: favs.supports.slice(0, 16)
    }).catch(function (e) { throw new Error(errMsg(e)); });
  }

  /* ================= 고객센터 1:1 문의 ================= */
  function addInquiry(user, profile, title, text) {
    return col('inquiries').add({
      uid: user.uid,
      authorName: (profile && profile.nickname) || '선원',
      title: title,
      text: text,
      status: '접수',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  function getMyInquiries(uid) {
    return col('inquiries').where('uid', '==', uid).get().then(function (snap) {
      return snap.docs.map(function (d) { return Object.assign({ docId: d.id }, d.data()); })
        .sort(function (a, b) { return (tsToDate(b.createdAt) || 0) - (tsToDate(a.createdAt) || 0); });
    });
  }

  /* ================= 공개 ================= */
  window.FB = {
    ready: ready,
    db: function () { return db; },
    auth: function () { return auth; },
    errMsg: errMsg,
    dateKey: dateKey,
    tsToDate: tsToDate,
    getBanners: getBanners,
    getEventBanners: getEventBanners,
    getCharacters: getCharacters,
    getSupportCharacters: getSupportCharacters,
    getPvpPatches: getPvpPatches,
    getPatchNotes: getPatchNotes,
    getNotices: getNotices,
    getEvents: getEvents,
    getBoards: getBoards,
    getComments: getComments,
    addComment: addComment,
    deleteComment: deleteComment,
    toggleBoardLike: toggleBoardLike,
    getLikeDoc: getLikeDoc,
    toggleGenericLike: toggleGenericLike,
    bumpUserLikeCount: bumpUserLikeCount,
    ensureUserDoc: ensureUserDoc,
    getUserDoc: getUserDoc,
    updateUserDoc: updateUserDoc,
    getUserStats: getUserStats,
    withdraw: withdraw,
    getFavs: getFavs,
    saveFavs: saveFavs,
    addInquiry: addInquiry,
    getMyInquiries: getMyInquiries
  };

  window.addEventListener('fpp:ready', function () {});
  document.dispatchEvent(new CustomEvent('fpp:fb-ready', { detail: { ready: ready } }));
})();
