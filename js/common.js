--- public/js/common.js (原始)


+++ public/js/common.js (修改后)
/* ============================================================
   FPP v2 — common.js (공통 UI 레이어)
   ============================================================ */
(function () {
  'use strict';

  /* ================= 아이콘 ================= */
  var IC = {
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6L12 16.9 6.6 19.7l1.1-6L3.2 9.4l6.1-.8z" stroke-linejoin="round"/></svg>',
    starFill: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.4l-5.8 3 1.1-6.4L2.6 9.4l6.5-.9z"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="3.4"/><path d="M19 12a7 7 0 0 0-.14-1.4l2-1.55-2-3.46-2.36.95a7 7 0 0 0-2.42-1.4L13.7 2.6h-3.4l-.38 2.54a7 7 0 0 0-2.42 1.4l-2.36-.95-2 3.46 2 1.55A7 7 0 0 0 5 12c0 .48.05.94.14 1.4l-2 1.55 2 3.46 2.36-.95a7 7 0 0 0 2.42 1.4l.38 2.54h3.4l.38-2.54a7 7 0 0 0 2.42-1.4l2.36.95 2-3.46-2-1.55c.09-.46.14-.92.14-1.4z" stroke-linejoin="round"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><path d="M4 6.5h16M4 12h16M4 17.5h10"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M4 11l8-7 8 7v9h-6v-6h-4v6H4z" stroke-linejoin="round"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-3.6 4.4-5.5 8-5.5s6.5 1.9 8 5.5" stroke-linecap="round"/></svg>',
    swords: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 4l7 7M4 4v4M4 4h4M20 4l-7 7M20 4v4M20 4h-4M7 14l-3 3M17 14l3 3M8.5 12.5L5 16l3 3 3.5-3.5M15.5 12.5L19 16l-3 3-3.5-3.5"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z" stroke-linejoin="round"/></svg>',
    cs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M5 13a7 7 0 0 1 14 0v3a2 2 0 0 1-2 2h-1v-5h3M5 13v3a2 2 0 0 0 2 2h1v-5H5" stroke-linejoin="round"/><path d="M18 18a4 4 0 0 1-4 3h-2" stroke-linecap="round"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zM10 19a2 2 0 0 0 4 0" stroke-linejoin="round"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h5" stroke-linejoin="round" stroke-linecap="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20.4l-7.2-7A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 7.2 6.8z"/></svg>',
    share: '<svg viewBox="0 0 24 24"><circle cx="6" cy="12" r="2.6"/><circle cx="17.5" cy="5.5" r="2.6"/><circle cx="17.5" cy="18.5" r="2.6"/><path d="M8.4 10.8l6.8-4M8.4 13.2l6.8 4"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21" stroke-linecap="round"/></svg>',
    logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M14 4H6v16h8M10 12h11M17 8l4 4-4 4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5" stroke-linecap="round"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M14.5 5l-7 7 7 7"/></svg>'
  };

  var LOGO_SVG = '<svg viewBox="0 0 64 64" width="30" height="30"><circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" stroke-width="3.4"/><path d="M32 13c-8 0-13.5 5.7-13.5 12.4 0 4.8 2.8 8.6 6.7 10.5v5.9l3.8-1.9 3 2.9 3-2.9 3.8 1.9v-5.9c3.9-1.9 6.7-5.7 6.7-10.5C45.5 18.7 40 13 32 13z" fill="currentColor"/><circle cx="26.3" cy="25.5" r="3.2" fill="var(--bg-2,#0b1a2b)"/><circle cx="37.7" cy="25.5" r="3.2" fill="var(--bg-2,#0b1a2b)"/><path d="M27.5 33h9" stroke="var(--bg-2,#0b1a2b)" stroke-width="2.3" stroke-linecap="round"/></svg>';

  var PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23132c45'/%3E%3Ccircle cx='50' cy='44' r='16' fill='none' stroke='%23f5b942' stroke-width='3'/%3E%3Cpath d='M50 32c-5 0-8.5 3.5-8.5 7.7 0 3 1.8 5.4 4.2 6.6v3.7l2.4-1.2 1.9 1.8 1.9-1.8 2.4 1.2v-3.7c2.4-1.2 4.2-3.6 4.2-6.6C58.5 35.5 55 32 50 32z' fill='%23f5b942'/%3E%3Cpath d='M30 74h40' stroke='%23f5b942' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E";

  /* ================= i18n ================= */
  var I18N = {
    ko: { patchnote: '패치노트', shortcut: '바로가기', event: '이벤트', community: '커뮤니티', board: '게시판', char: '캐릭터', supportChar: '현질 서폿 캐릭터', favorite: '즐겨찾기', refresh: '새로고침', grade: '등급', attr: '속성', type: '타입', sort: '정렬', charDb: '캐릭터 DB', home: '홈', pvpPatch: 'PvP 패치', cs: '고객센터', comHome: '커뮤니티 홈', mainHome: '메인 홈', login: '로그인', signup: '회원가입' },
    en: { patchnote: 'Patch Notes', shortcut: 'More', event: 'Events', community: 'Community', board: 'Board', char: 'Characters', supportChar: 'Premium Supports', favorite: 'Favorites', refresh: 'Refresh', grade: 'Grade', attr: 'Attr', type: 'Type', sort: 'Sort', charDb: 'Character DB', home: 'Home', pvpPatch: 'PvP Patch', cs: 'Support', comHome: 'Community', mainHome: 'Main Home', login: 'Sign in', signup: 'Sign up' }
  };
  var lang = 'ko';
  try { lang = localStorage.getItem('fpp_lang') || 'ko'; } catch (e) {}
  function t(k) { return (I18N[lang] && I18N[lang][k]) || I18N.ko[k] || k; }
  function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.documentElement.lang = lang === 'en' ? 'en' : 'ko';
  }

  /* ================= 날짜/뱃지 유틸 ================= */
  function fmtDate(v) {
    if (!v) return '';
    var d = FB.tsToDate ? FB.tsToDate(v) : null;
    var key = d ? d.toISOString().slice(0, 10) : String(v).slice(0, 10);
    var p = key.split('-');
    if (p.length !== 3 || !p[0]) return String(v);
    return p[0] + '.' + p[1] + '.' + p[2];
  }
  function isNew(v) {
    var d = FB.tsToDate ? FB.tsToDate(v) : null;
    if (!d) { var k = String(v || '').slice(0, 10); if (k) d = new Date(k + 'T00:00:00'); }
    if (!d || isNaN(d.getTime())) return false;
    return (Date.now() - d.getTime()) < 7 * 864e5;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  /* 본문 렌더: html 문자열이면 그대로, 아니면 문단 변환 */
  function renderContent(c) {
    if (c == null) return '<p style="color:var(--text-3)">본문이 없습니다.</p>';
    if (Array.isArray(c)) {
      return c.map(function (b) {
        if (typeof b === 'string') return '<p>' + esc(b) + '</p>';
        if (b && b.image) return '<img src="' + esc(b.image) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">';
        var tag = b && b.type === 'h' ? 'h3' : 'p';
        return '<' + tag + '>' + esc(b && (b.text || b.content || '') || '') + '</' + tag + '>';
      }).join('');
    }
    var s = String(c);
    if (/<[a-z][\s\S]*>/i.test(s)) return s;
    return s.split(/\n{2,}/).map(function (p) { return '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>'; }).join('');
  }

  /* ================= 토스트 ================= */
  function toast(msg, type) {
    var root = document.getElementById('toastRoot');
    if (!root) return;
    var el = document.createElement('div');
    el.className = 'toast' + (type === 'err' ? ' toast--err' : type === 'ok' ? ' toast--ok' : '');
    el.textContent = msg;
    root.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('show'); });
    setTimeout(function () {
      el.classList.remove('show');
      setTimeout(function () { el.remove(); }, 350);
    }, 3200);
  }

  /* ================= 모달 ================= */
  var modalStack = [];
  function openModal(opts) {
    var back = document.createElement('div');
    back.className = 'modal-back';
    back.innerHTML =
      '<div class="modal ' + (opts.lg ? 'modal--lg' : '') + '" role="dialog" aria-modal="true" aria-label="' + esc(opts.title || '') + '">' +
      '<div class="modal-head"><h3 class="modal-title">' + esc(opts.title || '') + '</h3>' +
      '<button class="modal-x" type="button" aria-label="닫기">' + IC.x + '</button></div>' +
      '<div class="modal-body">' + (opts.body || '') + '</div></div>';
    document.body.appendChild(back);
    var api = {
      el: back,
      body: back.querySelector('.modal-body'),
      close: function () {
        back.classList.remove('show');
        setTimeout(function () { back.remove(); }, 260);
        modalStack = modalStack.filter(function (m) { return m !== api; });
        if (opts.onClose) opts.onClose();
      }
    };
    back.querySelector('.modal-x').addEventListener('click', api.close);
    back.addEventListener('click', function (e) { if (e.target === back) api.close(); });
    modalStack.push(api);
    requestAnimationFrame(function () { back.classList.add('show'); });
    return api;
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (modalStack.length) modalStack[modalStack.length - 1].close();
      else closeAllPopups();
    }
  });

  /* ================= 앵커 팝업 ================= */
  var openPops = [];
  function closeAllPopups() {
    openPops.forEach(function (p) { p.remove(); });
    openPops = [];
  }
  function popup(anchor, contentHTML, opts) {
    opts = opts || {};
    closeAllPopups();
    var pop = document.createElement('div');
    pop.className = 'pop ' + (opts.cls || 'pop--menu');
    pop.innerHTML = contentHTML;
    document.body.appendChild(pop);
    var r = anchor.getBoundingClientRect();
    var pw = opts.width || 230;
    pop.style.width = pw + 'px';
    var left = Math.min(Math.max(8, r.right - pw), window.innerWidth - pw - 8);
    var top = r.bottom + 8;
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    openPops.push(pop);
    requestAnimationFrame(function () {
      pop.classList.add('show');
      var pr = pop.getBoundingClientRect();
      if (pr.bottom > window.innerHeight - 8) pop.style.top = Math.max(8, r.top - pr.height - 8) + 'px';
    });
    var onDoc = function (e) {
      if (!pop.contains(e.target) && !anchor.contains(e.target)) { pop.remove(); openPops = openPops.filter(function (p) { return p !== pop; }); document.removeEventListener('click', onDoc, true); }
    };
    setTimeout(function () { document.addEventListener('click', onDoc, true); }, 0);
    window.addEventListener('resize', function h() { pop.remove(); window.removeEventListener('resize', h); });
    return pop;
  }

  /* ================= 스크롤 리빌 ================= */
  var io = null;
  function watchReveals(root) {
    root = root || document;
    var els = root.querySelectorAll('.rv:not(.on)');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('on'); }); return; }
    if (!io) {
      io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('on'); io.unobserve(en.target); } });
      }, { threshold: 0.08 });
    }
    els.forEach(function (e) { io.observe(e); });
  }

  /* ================= 스켈레톤 / 빈 상태 ================= */
  function skelRows(el, n) {
    var h = '';
    for (var i = 0; i < (n || 4); i++) {
      h += '<div class="skel-row"><div class="skel skel-c" style="width:38px;height:38px;flex:none"></div>' +
        '<div style="flex:1;display:flex;flex-direction:column;gap:7px;justify-content:center">' +
        '<div class="skel" style="height:13px;width:' + (70 - i * 8) + '%"></div>' +
        '<div class="skel" style="height:10px;width:38%"></div></div></div>';
    }
    el.innerHTML = h;
  }
  function skelCards(el, n) {
    var h = '<div class="cards cards--board">';
    for (var i = 0; i < (n || 3); i++) {
      h += '<div class="card"><div class="skel" style="aspect-ratio:16/8.5;border-radius:0"></div>' +
        '<div class="card-body"><div class="skel" style="height:15px;width:82%"></div><div class="skel" style="height:11px;width:45%"></div></div></div>';
    }
    el.innerHTML = h + '</div>';
  }
  function skelGrid(el, n) {
    var h = '';
    for (var i = 0; i < (n || 8); i++) {
      h += '<div class="chcard"><div class="skel" style="aspect-ratio:1/1.08;border-radius:0"></div><div style="padding:9px"><div class="skel" style="height:11px"></div></div></div>';
    }
    el.innerHTML = h;
  }
  function empty(el, o) {
    o = o || {};
    el.innerHTML =
      '<div class="empty"><div class="empty-ic"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8M9 9.5h.01M15 9.5h.01" stroke-linecap="round"/></svg></div>' +
      '<strong>' + esc(o.title || '데이터가 없습니다') + '</strong>' +
      (o.desc ? '<p>' + esc(o.desc) + '</p>' : '') +
      (o.btnText ? (o.btnHref
        ? '<a class="btn btn--ghost btn--sm" href="' + esc(o.btnHref) + '">' + esc(o.btnText) + '</a>'
        : '<button class="btn btn--ghost btn--sm" type="button" data-empty-act>' + esc(o.btnText) + '</button>') : '') +
      '</div>';
    if (o.btnText && !o.btnHref && o.onBtn) {
      var b = el.querySelector('[data-empty-act]');
      if (b) b.addEventListener('click', o.onBtn);
    }
  }

  /* ================= 배너 ================= */
  function fillBanner(mediaEl, dotsEl, banners, onClick) {
    if (!mediaEl) return;
    var list = (banners || []).slice(0, 6);
    mediaEl.innerHTML = '';
    if (dotsEl) dotsEl.innerHTML = '';
    if (!list.length) return; /* fallback 레이어가 노출됨 */
    list.forEach(function (b, i) {
      var img = document.createElement('img');
      img.className = 'bimg' + (i === 0 ? ' on' : '');
      img.src = b.imageUrl || b.image;
      img.alt = b.title || b.name || '배너';
      img.loading = i === 0 ? 'eager' : 'lazy';
      img.onerror = function () { img.style.display = 'none'; };
      if (onClick) img.style.cursor = 'pointer', img.addEventListener('click', function () { onClick(b); });
      mediaEl.appendChild(img);
      if (dotsEl && list.length > 1) {
        var d = document.createElement('button');
        d.type = 'button';
        d.className = i === 0 ? 'on' : '';
        d.setAttribute('aria-label', '배너 ' + (i + 1));
        d.addEventListener('click', function () { show(i); restart(); });
        dotsEl.appendChild(d);
      }
    });
    if (list.length < 2) return;
    var idx = 0, timer = null;
    var imgs = mediaEl.querySelectorAll('.bimg');
    var dots = dotsEl ? dotsEl.querySelectorAll('button') : [];
    function show(n) {
      idx = (n + list.length) % list.length;
      imgs.forEach(function (im, i) { im.classList.toggle('on', i === idx); });
      dots.forEach(function (dd, i) { dd.classList.toggle('on', i === idx); });
    }
    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { show(idx + 1); }, 5200);
    }
    restart();
    var banner = mediaEl.parentElement;
    if (banner) {
      banner.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
      banner.addEventListener('mouseleave', restart);
    }
  }

  /* ================= 티커 ================= */
  function ticker(el, items) {
    if (!el) return;
    if (!items.length) { el.style.display = 'none'; return; }
    var half = items.map(function (it) { return '<span><b>' + esc(it.date || '') + '</b>' + esc(it.title) + '</span>'; }).join('');
    el.innerHTML = '<div class="ticker-track">' + half + half + '</div>';
  }

  /* ================= 공유 ================= */
  function share(title, url) {
    url = url || location.href;
    if (navigator.share) {
      navigator.share({ title: title, url: url }).catch(function () {});
      return;
    }
    var done = function () { toast('링크가 클립보드에 복사되었습니다.', 'ok'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(function () { fallbackCopy(url); done(); });
    } else { fallbackCopy(url); done(); }
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    ta.remove();
  }

  /* ================= 프로필 아이콘 ================= */
  function avatarSVG(c1, c2) {
    return "data:image/svg+xml," + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/><circle cx="50" cy="42" r="15" fill="none" stroke="#fff" stroke-width="3.4"/><path d="M50 30c-5.5 0-9.4 3.9-9.4 8.5 0 3.3 2 6 4.7 7.3v4l2.6-1.3 2.1 2 2.1-2 2.6 1.3v-4c2.7-1.3 4.7-4 4.7-7.3C59.4 33.9 55.5 30 50 30z" fill="#fff"/><path d="M28 74h44" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M36 82h28" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/></svg>');
  }
  var AVATARS = [
    avatarSVG('#0d2440', '#1d4a74'),
    avatarSVG('#8a5a08', '#f5b942'),
    avatarSVG('#7e1d22', '#e8484f'),
    avatarSVG('#0c4a44', '#21b5a5'),
    avatarSVG('#3d2a63', '#8f6fe8'),
    avatarSVG('#1f3d2a', '#3ecf8e')
  ];
  function avatarOf(v) {
    if (v && /^data:/.test(v)) return v;
    if (v && /^https?:/.test(v)) return v;
    var n = parseInt(v, 10);
    if (!isNaN(n) && AVATARS[n]) return AVATARS[n];
    return AVATARS[0];
  }

  /* ================= 인증 상태 ================= */
  var currentUser = null;
  var userDoc = null;
  var authListeners = [];
  function onAuth(fn) { authListeners.push(fn); }
  function boot() {
    renderHeader();
    renderDeskNav();
    renderBottomTabs();
    renderDrawer();
    applyI18n();
    watchReveals();
    if (!FB.ready) {
      toast('Firebase SDK를 불러오지 못했습니다. 네트워크를 확인해 주세요.', 'err');
    } else {
      FB.auth().onAuthStateChanged(function (u) {
        currentUser = u;
        userDoc = null;
        if (u) {
          FB.ensureUserDoc(u).then(function (d) { userDoc = d; emitAuth(); }).catch(function () { emitAuth(); });
        } else { emitAuth(); }
        renderHeader();
      });
    }
  }
  function emitAuth() { authListeners.forEach(function (fn) { fn(currentUser, userDoc); }); }
  function refreshUserDoc() {
    if (!currentUser) return Promise.resolve(null);
    return FB.getUserDoc(currentUser.uid).then(function (d) { userDoc = d; return d; });
  }

  /* ================= 헤더 ================= */
  function isDesktop() { return window.matchMedia('(min-width:768px)').matches; }
  function renderHeader() {
    var hd = document.getElementById('appHeader');
    if (!hd) return;
    var authHtml;
    if (currentUser) {
      authHtml = '<button class="profile-btn" id="hdProfile" type="button" aria-label="프로필 메뉴">' +
        '<img src="' + esc(avatarOf(userDoc && userDoc.profileIcon)) + '" alt="프로필"></button>';
    } else {
      authHtml = '<a class="btn btn--ghost btn--sm" href="Login.html#signup" data-i18n="signup">회원가입</a>' +
        '<a class="btn btn--gold btn--sm" href="Login.html" data-i18n="login">로그인</a>';
    }
    hd.innerHTML =
      '<div class="hd-in"><div class="hd-left">' +
      '<button class="hbtn hamburger" id="hdMenu" type="button" aria-label="전체 메뉴 열기">' + IC.menu + '</button>' +
      '<a class="logo" href="Main.html#home" aria-label="FPP 홈으로 이동"><span class="logo-mark">' + LOGO_SVG + '</span>' +
      '<span class="logo-txt">F<b>P</b>P</span><span class="logo-badge">v2</span></a>' +
      '</div><div class="hd-right">' +
      '<button class="hbtn" id="hdFav" type="button" aria-label="즐겨찾기">' + IC.star + '</button>' +
      '<button class="hbtn" id="hdSet" type="button" aria-label="설정">' + IC.gear + '</button>' +
      '<div class="hd-auth">' + authHtml + '</div></div></div>';

    document.getElementById('hdFav').addEventListener('click', function (e) { openFavPopup(e.currentTarget); });
    document.getElementById('hdSet').addEventListener('click', function (e) {
      if (isDesktop()) openSettingsPopup(e.currentTarget);
      else location.href = 'Setting.html';
    });
    document.getElementById('hdMenu').addEventListener('click', openDrawer);
    var pb = document.getElementById('hdProfile');
    if (pb) pb.addEventListener('click', function (e) { openProfilePopup(e.currentTarget); });
    applyI18n();
  }

  /* ================= 메뉴 구성 ================= */
  var MENUS = {
    main: [
      { k: 'home', label: '홈', href: 'Main.html#home', ic: 'home' },
      { k: 'characters', label: '캐릭터', href: 'Main.html#characters', ic: 'user' },
      { k: 'pvp', label: 'PvP 패치', href: 'Main.html#pvp', ic: 'swords' },
      { k: 'community', label: '커뮤니티', href: 'Community.html', ic: 'chat', ext: true },
      { k: 'cs', label: '고객센터', href: 'CustomerService.html', ic: 'cs', ext: true }
    ],
    community: [
      { k: 'comhome', label: '커뮤니티 홈', href: 'Community.html#home', ic: 'home' },
      { k: 'patch', label: '패치노트', href: 'Community.html#patch', ic: 'note' },
      { k: 'board', label: '게시판', href: 'Community.html#board', ic: 'chat' },
      { k: 'event', label: '이벤트', href: 'Community.html#event', ic: 'star' },
      { k: 'mainhome', label: '메인 홈', href: 'Main.html#home', ic: 'back', ext: true }
    ]
  };
  function menuSet() {
    var page = document.body.getAttribute('data-page');
    if (page === 'community') return MENUS.community;
    return MENUS.main;
  }
  var activeNav = '';
  function setActiveNav(k) {
    activeNav = k;
    document.querySelectorAll('.dnav').forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('data-k') === k); });
    document.querySelectorAll('.btab').forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('data-k') === k); });
    document.querySelectorAll('.ditem').forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('data-k') === k); });
  }
  function renderDeskNav() {
    var nav = document.getElementById('desktopNav');
    if (!nav) return;
    var set = menuSet();
    nav.innerHTML = '<div class="desk-nav-in">' + set.map(function (m) {
      return '<a class="dnav" data-k="' + m.k + '" href="' + m.href + '">' + esc(m.label) + '</a>';
    }).join('') + '</div>';
  }
  function renderBottomTabs() {
    var bt = document.getElementById('bottomTabs');
    if (!bt) return;
    var page = document.body.getAttribute('data-page');
    var set;
    if (page === 'community') set = MENUS.community;
    else set = MENUS.main.slice(0, 4);
    bt.classList.toggle('five', set.length > 4);
    bt.innerHTML = set.map(function (m) {
      var short = m.label.length > 5 ? m.label.replace(' 캐릭터', '').replace('커뮤니티 홈', '커뮤니티') : m.label;
      return '<a class="btab" data-k="' + m.k + '" href="' + m.href + '" aria-label="' + esc(m.label) + '">' + (IC[m.ic] || IC.home) + '<span>' + esc(short) + '</span></a>';
    }).join('');
  }
  function renderDrawer() {
    var d = document.getElementById('navDrawer');
    if (!d) return;
    d.innerHTML = '<div class="drawer-logo">' + LOGO_SVG + '<span>FPP <b style="color:var(--gold)">v2</b></span></div>' +
      '<nav>' + MENUS.main.map(function (m) {
        return '<a class="ditem" data-k="' + m.k + '" href="' + m.href + '">' + (IC[m.ic] || IC.home) + esc(m.label) + '</a>';
      }).join('') + '</nav>' +
      '<div class="drawer-foot">FPP v2 · 팬 커뮤니티<br>데이터 연동: Firebase (fighting-path-patch)</div>';
    document.getElementById('drawerBackdrop').addEventListener('click', closeDrawer);
    d.querySelectorAll('.ditem').forEach(function (a) { a.addEventListener('click', closeDrawer); });
  }
  function openDrawer() {
    var d = document.getElementById('navDrawer'), b = document.getElementById('drawerBackdrop');
    b.hidden = false;
    requestAnimationFrame(function () { d.classList.add('open'); b.classList.add('show'); d.setAttribute('aria-hidden', 'false'); });
  }
  function closeDrawer() {
    var d = document.getElementById('navDrawer'), b = document.getElementById('drawerBackdrop');
    d.classList.remove('open'); b.classList.remove('show'); d.setAttribute('aria-hidden', 'true');
    setTimeout(function () { b.hidden = true; }, 300);
  }

  /* ================= 즐겨찾기 ================= */
  var favCache = { chars: [], supports: [] };
  function loadFavs() {
    return FB.getFavs(currentUser).then(function (f) { favCache = f; return f; });
  }
  function toggleFav(kind, id) {
    var key = kind === 'support' ? 'supports' : 'chars';
    var arr = favCache[key] || [];
    var has = arr.indexOf(id) > -1;
    var next = has ? arr.filter(function (x) { return x !== id; }) : arr.concat([id]);
    if (next.length > 16) { toast('즐겨찾기는 최대 16개까지 가능합니다.', 'err'); return Promise.resolve(false); }
    favCache[key] = next;
    return FB.saveFavs(currentUser, favCache).then(function () {
      toast(has ? '즐겨찾기에서 제거했습니다.' : '즐겨찾기에 추가했습니다.', 'ok');
      document.dispatchEvent(new CustomEvent('fpp:fav-changed'));
      return !has;
    }).catch(function (e) { toast(FB.errMsg(e), 'err'); return has; });
  }
  function openFavPopup(anchor) {
    loadFavs().then(function (favs) {
      var CHARS = window.__CHARS || [], SUP = window.__SUPPORTS || [];
      var ensure = (CHARS.length || SUP.length) ? Promise.resolve() : Promise.all([FB.getCharacters(), FB.getSupportCharacters()]).then(function (r) { window.__CHARS = CHARS = r[0]; window.__SUPPORTS = SUP = r[1]; }).catch(function () {});
      ensure.then(function () {
        var tab = 'char';
        function gridHTML(kind) {
          var ids = kind === 'char' ? favs.chars : favs.supports;
          var src = kind === 'char' ? CHARS : SUP;
          if (!ids.length) {
            return '<div class="empty" style="padding:26px 12px"><strong>즐겨찾기한 캐릭터 없음</strong><p>추가해보세요</p>' +
              '<a class="btn btn--ghost btn--sm" href="Main.html#characters">캐릭터 페이지로 이동</a></div>';
          }
          return '<div class="fav-grid">' + ids.slice(0, 16).map(function (id) {
            var c = src.find(function (x) { return String(x.id) === String(id) || String(x.docId) === String(id); });
            var name = c ? c.name : '캐릭터 ' + id;
            var img = c && c.image ? c.image : PLACEHOLDER_IMG;
            return '<button class="fav-cell" type="button" data-fav-id="' + esc(id) + '" data-fav-kind="' + kind + '" aria-label="' + esc(name) + '">' +
              '<span class="fav-img"><img src="' + esc(img) + '" alt="' + esc(name) + '" loading="lazy" onerror="this.src=\'' + PLACEHOLDER_IMG + '\'"></span>' +
              '<span class="fav-name">' + esc(name) + '</span></button>';
          }).join('') + '</div>';
        }
        function bodyHTML() {
          return '<div class="pop-title">즐겨찾기</div>' +
            '<div class="fav-tabs"><button class="fav-tab' + (tab === 'char' ? ' is-on' : '') + '" type="button" data-ft="char">캐릭터</button>' +
            '<button class="fav-tab' + (tab === 'support' ? ' is-on' : '') + '" type="button" data-ft="support">현질 서폿 캐릭터</button></div>' +
            '<div class="fav-body">' + gridHTML(tab) + '</div>';
        }
        var pop = popup(anchor, bodyHTML(), { width: 292, cls: 'pop pop--fav' });
        function bind() {
          pop.querySelectorAll('.fav-tab').forEach(function (b) {
            b.addEventListener('click', function () { tab = b.getAttribute('data-ft'); pop.innerHTML = bodyHTML(); bind(); });
          });
          pop.querySelectorAll('.fav-cell').forEach(function (b) {
            b.addEventListener('click', function () {
              var kind = b.getAttribute('data-fav-kind'), id = b.getAttribute('data-fav-id');
              closeAllPopups();
              location.href = 'Main.html#characters?tab=' + kind + '&fav=1&char=' + encodeURIComponent(id);
            });
          });
        }
        bind();
      });
    });
  }

  /* ================= 설정 ================= */
  function getNoti() {
    try { return JSON.parse(localStorage.getItem('fpp_noti')) || { patch: true, fav: true, event: true, comment: true }; }
    catch (e) { return { patch: true, fav: true, event: true, comment: true }; }
  }
  function setNoti(v) { try { localStorage.setItem('fpp_noti', JSON.stringify(v)); } catch (e) {} }
  function getTheme() { return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  function setTheme(v) {
    document.documentElement.setAttribute('data-theme', v);
    try { localStorage.setItem('fpp_theme', v); } catch (e) {}
  }
  var APP_ICONS = [
    { k: 'navy', name: '그랜드 라인', cls: 'icon-navy', fg: '#f5b942' },
    { k: 'gold', name: '보물', cls: 'icon-gold', fg: '#3a2a05' },
    { k: 'red', name: '신세계', cls: 'icon-red', fg: '#ffffff' },
    { k: 'teal', name: '올블루', cls: 'icon-teal', fg: '#ffffff' }
  ];
  function iconSVG(fg) {
    return '<svg viewBox="0 0 64 64" width="30" height="30"><circle cx="32" cy="30" r="15" fill="none" stroke="' + fg + '" stroke-width="3"/><path d="M32 18c-5.5 0-9.5 4-9.5 8.7 0 3.4 2 6.1 4.8 7.4v4.2l2.7-1.4 2 2 2-2 2.7 1.4v-4.2c2.8-1.3 4.8-4 4.8-7.4C41.5 22 37.5 18 32 18z" fill="' + fg + '"/><path d="M18 50h28" stroke="' + fg + '" stroke-width="3.4" stroke-linecap="round"/></svg>';
  }
  function getIcon() { try { return localStorage.getItem('fpp_appicon') || 'navy'; } catch (e) { return 'navy'; } }

  function openNoticeModal() {
    var m = openModal({ title: '공지사항', body: '<div id="ntcBox"></div>' });
    FB.skelRows ? FB.skelRows : null;
    skelRows(m.body.querySelector('#ntcBox'), 3);
    FB.getNotices().then(function (list) {
      var box = m.body.querySelector('#ntcBox');
      if (!list.length) { empty(box, { title: '등록된 공지사항이 없습니다.' }); return; }
      box.innerHTML = list.slice(0, 10).map(function (n) {
        return '<button class="ntc-row" type="button" data-ntc="' + esc(n.docId) + '"><span class="ntc-t"><span class="badge badge--patch">공지</span>' + esc(n.title) + '</span><span class="ntc-m">' + esc(n.author) + ' · ' + esc(fmtDate(n.date)) + '</span></button>';
      }).join('');
      box.querySelectorAll('.ntc-row').forEach(function (r) {
        r.addEventListener('click', function () {
          var n = list.find(function (x) { return x.docId === r.getAttribute('data-ntc'); });
          var d = openModal({ title: n.title, lg: true, body: '<div class="detail-meta" style="margin-bottom:12px"><span>' + esc(n.author) + '</span><span>·</span><span>' + esc(fmtDate(n.date)) + '</span></div><div class="detail-body" style="padding:0">' + renderContent(n.content) + '</div>' });
          d.body.querySelectorAll('img').forEach(function (im) { im.onerror = function () { im.style.display = 'none'; }; });
        });
      });
    }).catch(function (e) { empty(m.body.querySelector('#ntcBox'), { title: '공지를 불러오지 못했습니다.', desc: FB.errMsg(e) }); });
  }

  function openAlarmModal() {
    var n = getNoti();
    var rows = [
      ['patch', '패치노트', '새 패치노트가 등록되면 알림'],
      ['fav', '즐겨찾기', '즐겨찾기 캐릭터의 PvP 패치 알림'],
      ['event', '이벤트', '이벤트 시작·종료 알림'],
      ['comment', '댓글', '내 게시글에 댓글이 달리면 알림']
    ];
    var m = openModal({
      title: '알림 설정',
      body: rows.map(function (r) {
        return '<div class="tgl-row"><div class="tgl-tx"><strong>' + r[1] + '</strong><small>' + r[2] + '</small></div>' +
          '<label class="tgl"><input type="checkbox" data-k="' + r[0] + '"' + (n[r[0]] ? ' checked' : '') + ' aria-label="' + r[1] + ' 알림"><i></i></label></div>';
      }).join('')
    });
    m.body.querySelectorAll('input').forEach(function (inp) {
      inp.addEventListener('change', function () {
        var v = getNoti();
        v[inp.getAttribute('data-k')] = inp.checked;
        setNoti(v);
        toast('알림 설정이 저장되었습니다.', 'ok');
      });
    });
  }

  function openThemeModal() {
    var cur = getTheme();
    var m = openModal({
      title: '테마 변경',
      body: '<div class="pick-grid">' +
        '<button class="pick' + (cur === 'dark' ? ' is-on' : '') + '" data-th="dark" type="button"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/></svg>다크</button>' +
        '<button class="pick' + (cur === 'light' ? ' is-on' : '') + '" data-th="light" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" stroke-linecap="round"/></svg>라이트</button>' +
        '</div>'
    });
    m.body.querySelectorAll('.pick').forEach(function (b) {
      b.addEventListener('click', function () {
        setTheme(b.getAttribute('data-th'));
        m.body.querySelectorAll('.pick').forEach(function (x) { x.classList.toggle('is-on', x === b); });
        toast('테마가 적용되었습니다.', 'ok');
      });
    });
  }

  var deferredInstall = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferredInstall = e; });
  function openIconModal() {
    var cur = getIcon();
    function body() {
      return '<div class="pick-grid">' + APP_ICONS.map(function (ic) {
        return '<button class="pick pick--icon' + (cur === ic.k ? ' is-on' : '') + '" data-ic="' + ic.k + '" type="button">' +
          '<span class="icon-prev ' + ic.cls + '">' + iconSVG(ic.fg) + '</span>' + ic.name + '</button>';
      }).join('') + '</div>' +
        '<p class="pick-note">선택한 앱 아이콘은 바탕화면 바로가기 생성 시 적용됩니다.</p>' +
        '<button class="btn btn--gold btn--block mt16" id="mkShortcut" type="button">바탕화면 바로가기 만들기</button>';
    }
    var m = openModal({ title: '앱 아이콘 변경', body: body() });
    function bind() {
      m.body.querySelectorAll('.pick').forEach(function (b) {
        b.addEventListener('click', function () {
          cur = b.getAttribute('data-ic');
          try { localStorage.setItem('fpp_appicon', cur); } catch (e) {}
          m.body.querySelectorAll('.pick').forEach(function (x) { x.classList.toggle('is-on', x === b); });
          toast('앱 아이콘이 변경되었습니다.', 'ok');
        });
      });
      m.body.querySelector('#mkShortcut').addEventListener('click', function () {
        var ic = APP_ICONS.find(function (x) { return x.k === cur; }) || APP_ICONS[0];
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="' + ({ navy: '#0d2440', gold: '#f5b942', red: '#e8484f', teal: '#21b5a5' }[ic.k]) + '"/><circle cx="256" cy="236" r="118" fill="none" stroke="' + ic.fg + '" stroke-width="22"/><path d="M256 142c-44 0-76 32-76 70 0 27 16 49 39 60v33l21-11 16 16 16-16 21 11v-33c23-11 39-33 39-60 0-38-32-70-76-70z" fill="' + ic.fg + '"/><path d="M148 396h216" stroke="' + ic.fg + '" stroke-width="24" stroke-linecap="round"/></svg>';
        var iconUrl = 'data:image/svg+xml,' + encodeURIComponent(svg);
        var manifest = {
          name: 'FPP v2', short_name: 'FPP', start_url: location.origin + '/Main.html',
          display: 'standalone', background_color: '#08131f', theme_color: '#08131f',
          icons: [{ src: iconUrl, sizes: '512x512', type: 'image/svg+xml', purpose: 'any' }]
        };
        var link = document.getElementById('dynManifest') || document.createElement('link');
        link.id = 'dynManifest'; link.rel = 'manifest';
        link.href = URL.createObjectURL(new Blob([JSON.stringify(manifest)], { type: 'application/json' }));
        if (!link.parentNode) document.head.appendChild(link);
        if (deferredInstall) {
          deferredInstall.prompt();
          deferredInstall.userChoice.then(function (r) {
            toast(r.outcome === 'accepted' ? '바로가기가 생성되었습니다.' : '설치가 취소되었습니다.');
            deferredInstall = null;
          });
        } else {
          openModal({
            title: '바로가기 만들기 안내',
            body: '<p style="font-size:14px;line-height:1.8;color:var(--text-2)">이 브라우저는 자동 바로가기 생성을 지원하지 않습니다.<br><br>' +
              '<b style="color:var(--text)">· Chrome/Edge</b> — 주소창 우측 ⋮ 메뉴 → "설치" 또는 "바로가기 만들기"<br>' +
              '<b style="color:var(--text)">· 모바일</b> — 브라우저 메뉴 → "홈 화면에 추가"<br><br>' +
              '선택한 앱 아이콘(<b style="color:var(--gold)">' + ic.name + '</b>)이 바로가기에 적용됩니다.</p>'
          });
        }
      });
    }
    bind();
  }

  function openLangModal() {
    var cur = lang;
    var m = openModal({
      title: '언어 변경',
      body: '<div class="pick-grid">' +
        '<button class="pick' + (cur === 'ko' ? ' is-on' : '') + '" data-lg="ko" type="button">🇰🇷 한국어</button>' +
        '<button class="pick' + (cur === 'en' ? ' is-on' : '') + '" data-lg="en" type="button">🇺🇸 English</button></div>'
    });
    m.body.querySelectorAll('.pick').forEach(function (b) {
      b.addEventListener('click', function () {
        lang = b.getAttribute('data-lg');
        try { localStorage.setItem('fpp_lang', lang); } catch (e) {}
        m.body.querySelectorAll('.pick').forEach(function (x) { x.classList.toggle('is-on', x === b); });
        applyI18n();
        toast(lang === 'ko' ? '한국어로 변경되었습니다.' : 'Language set to English.', 'ok');
      });
    });
  }

  var SET_ACTIONS = { notice: openNoticeModal, alarm: openAlarmModal, theme: openThemeModal, icon: openIconModal, lang: openLangModal };
  function openSettingsPopup(anchor) {
    var items = [
      ['notice', IC.note, '공지사항'],
      ['alarm', IC.bell, '알림 설정'],
      ['theme', IC.info, '테마 변경', getTheme() === 'dark' ? '다크' : '라이트'],
      ['icon', IC.star, '앱 아이콘 변경'],
      ['lang', IC.chat, '언어 변경', lang === 'ko' ? '한국어' : 'EN']
    ];
    var pop = popup(anchor, items.map(function (it) {
      return '<button class="pop-item" type="button" data-act="' + it[0] + '">' + it[1] + it[2] + (it[3] ? '<small>' + it[3] + '</small>' : '') + '</button>';
    }).join(''), { width: 236 });
    pop.querySelectorAll('.pop-item').forEach(function (b) {
      b.addEventListener('click', function () {
        closeAllPopups();
        var fn = SET_ACTIONS[b.getAttribute('data-act')];
        if (fn) fn();
      });
    });
  }

  /* ================= 프로필 ================= */
  function openProfilePopup(anchor) {
    var box = document.createElement('div');
    popup(anchor, '<div style="padding:18px;width:100%"><div class="skel" style="height:120px"></div></div>', { width: 268, cls: 'pop pop--profile' });
    var pop = openPops[openPops.length - 1];
    var p = currentUser;
    FB.getUserStats(p.uid).then(function (st) {
      FB.refreshUserDoc ? null : null;
      return refreshUserDoc().then(function (ud) { return { st: st, ud: ud || {} }; });
    }).catch(function () { return { st: { posts: 0, comments: 0, likes: 0 }, ud: userDoc || {} }; })
      .then(function (r) {
        var nick = r.ud.nickname || p.displayName || (p.email ? p.email.split('@')[0] : '선원');
        pop.innerHTML =
          '<div class="pf-card"><span class="pf-img"><img src="' + esc(avatarOf(r.ud.profileIcon)) + '" alt="프로필 이미지"></span>' +
          '<strong class="pf-nick">' + esc(nick) + '</strong>' +
          '<div class="pf-stats">' +
          '<div class="pf-stat"><b>' + r.st.posts + '</b><small>게시글</small></div>' +
          '<div class="pf-stat"><b>' + r.st.comments + '</b><small>댓글</small></div>' +
          '<div class="pf-stat"><b>' + r.st.likes + '</b><small>좋아요</small></div>' +
          '</div></div>' +
          '<div class="pf-actions">' +
          '<button class="pop-item" type="button" id="pfInfo">' + IC.info + '내 정보</button>' +
          '<button class="pop-item" type="button" id="pfOut">' + IC.logout + '로그아웃</button></div>';
        pop.querySelector('#pfInfo').addEventListener('click', function () { closeAllPopups(); openMyInfoModal(nick, r.ud); });
        pop.querySelector('#pfOut').addEventListener('click', function () {
          FB.auth().signOut().then(function () {
            closeAllPopups();
            toast('로그아웃되었습니다.');
          }).catch(function (e) { toast(FB.errMsg(e), 'err'); });
        });
      });
  }

  function openMyInfoModal(nick, ud) {
    var email = (currentUser && currentUser.email) || '—';
    var m = openModal({
      title: '내 정보',
      body:
        '<div class="fld"><span class="fld-lb">프로필 아이콘</span>' +
        '<div class="pick-grid" style="grid-template-columns:repeat(6,1fr);gap:8px" id="avGrid">' +
        AVATARS.map(function (a, i) {
          return '<button class="pick pick--av' + (String(ud.profileIcon) === String(i) ? ' is-on' : '') + '" data-av="' + i + '" type="button" aria-label="프로필 아이콘 ' + (i + 1) + '"><img src="' + a + '" alt="" style="width:40px;height:40px;border-radius:50%"></button>';
        }).join('') + '</div></div>' +
        '<div class="fld"><span class="fld-lb">닉네임</span><div class="fld-row">' +
        '<input id="miNick" type="text" maxlength="16" value="' + esc(nick) + '" aria-label="닉네임">' +
        '<button class="btn btn--ghost btn--sm" id="miNickSave" type="button" style="min-height:46px">저장</button></div></div>' +
        '<div class="fld"><span class="fld-lb">로그인 이메일</span>' +
        '<div style="padding:12px 14px;background:var(--surface-2);border:1px solid var(--line);border-radius:var(--r-sm);font-size:14px">' + esc(email) + '</div></div>' +
        '<button class="btn btn--danger btn--block mt8" id="miWithdraw" type="button">탈퇴하기</button>'
    });
    m.body.querySelectorAll('.pick--av').forEach(function (b) {
      b.addEventListener('click', function () {
        var idx = b.getAttribute('data-av');
        FB.updateUserDoc(currentUser.uid, { profileIcon: String(idx) }).then(function () {
          m.body.querySelectorAll('.pick--av').forEach(function (x) { x.classList.toggle('is-on', x === b); });
          refreshUserDoc().then(function () { renderHeader(); });
          toast('프로필 아이콘이 변경되었습니다.', 'ok');
        }).catch(function (e) { toast(FB.errMsg(e), 'err'); });
      });
    });
    m.body.querySelector('#miNickSave').addEventListener('click', function () {
      var v = m.body.querySelector('#miNick').value.trim();
      if (!v) { toast('닉네임을 입력해 주세요.', 'err'); return; }
      FB.updateUserDoc(currentUser.uid, { nickname: v }).then(function () {
        refreshUserDoc().then(function () { renderHeader(); });
        toast('닉네임이 저장되었습니다.', 'ok');
      }).catch(function (e) { toast(FB.errMsg(e), 'err'); });
    });
    m.body.querySelector('#miWithdraw').addEventListener('click', function () {
      var c = openModal({
        title: '탈퇴하기',
        body: '<p style="font-size:14px;line-height:1.8;color:var(--text-2)">정말 탈퇴하시겠습니까?<br>탈퇴 시 <b style="color:#ff8b90">계정이 삭제</b>되며, 동일한 이메일로는 24시간 동안 다시 가입할 수 없습니다.<br>작성한 게시글·댓글은 별도로 삭제되지 않을 수 있습니다.</p>' +
          '<div class="fld-row mt16"><button class="btn btn--ghost" id="wdNo" type="button" style="flex:1">취소</button>' +
          '<button class="btn btn--danger" id="wdYes" type="button" style="flex:1">탈퇴 확정</button></div>'
      });
      c.body.querySelector('#wdNo').addEventListener('click', c.close);
      c.body.querySelector('#wdYes').addEventListener('click', function () {
        FB.withdraw(currentUser).then(function () {
          c.close(); m.close();
          toast('탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.');
        }).catch(function (e) { toast(FB.errMsg(e), 'err'); });
      });
    });
  }

  /* ================= 공개 ================= */
  window.UI = {
    IC: IC, LOGO_SVG: LOGO_SVG, PLACEHOLDER_IMG: PLACEHOLDER_IMG,
    t: t, applyI18n: applyI18n,
    fmtDate: fmtDate, isNew: isNew, esc: esc, renderContent: renderContent,
    toast: toast, openModal: openModal, popup: popup, closeAllPopups: closeAllPopups,
    watchReveals: watchReveals,
    skelRows: skelRows, skelCards: skelCards, skelGrid: skelGrid, empty: empty,
    fillBanner: fillBanner, ticker: ticker, share: share,
    avatarOf: avatarOf, AVATARS: AVATARS,
    currentUser: function () { return currentUser; },
    userDoc: function () { return userDoc; },
    onAuth: onAuth, refreshUserDoc: refreshUserDoc,
    setActiveNav: setActiveNav,
    isDesktop: isDesktop,
    loadFavs: loadFavs, toggleFav: toggleFav, favCache: function () { return favCache; },
    SET_ACTIONS: SET_ACTIONS,
    getTheme: getTheme, setTheme: setTheme
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
