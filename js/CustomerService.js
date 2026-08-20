--- public/js/CustomerService.js (原始)


+++ public/js/CustomerService.js (修改后)
/* ============================================================
   FPP v2 — CustomerService.js
   검색 / 1:1 문의 / 나의 문의 / FAQ 목록·상세
   ============================================================ */
(function () {
  'use strict';

  var S = { items: [], banners: [], q: '', loaded: false };

  function loadAll() {
    if (S.loaded) return Promise.resolve();
    if (!FB.ready) return Promise.reject(new Error('Firebase SDK 없음'));
    return Promise.all([FB.getNotices(), FB.getBanners().catch(function () { return []; })])
      .then(function (r) { S.items = r[0]; S.banners = r[1]; S.loaded = true; });
  }

  function filtered() {
    var q = S.q.trim().toLowerCase();
    if (!q) return S.items;
    return S.items.filter(function (n) {
      return String(n.title || '').toLowerCase().indexOf(q) > -1 ||
        String(n.author || '').toLowerCase().indexOf(q) > -1 ||
        String(typeof n.content === 'string' ? n.content : '').toLowerCase().indexOf(q) > -1;
    });
  }

  function catOf(n) {
    var c = String(n.category || '').toLowerCase();
    if (c.indexOf('faq') > -1 || c.indexOf('문의') > -1) return { tx: 'FAQ', cls: 'badge--info' };
    if (c.indexOf('점검') > -1) return { tx: '점검', cls: 'badge--nerf' };
    if (c.indexOf('이벤트') > -1) return { tx: '이벤트', cls: 'badge--brag' };
    return { tx: '안내', cls: 'badge--patch' };
  }

  function renderList() {
    var el = document.getElementById('csContent');
    var list = filtered();
    if (!list.length) {
      UI.empty(el, {
        title: S.q ? '검색 결과가 없습니다' : '등록된 고객센터 정보가 없습니다',
        desc: S.q ? '\'' + S.q + '\' 에 대한 안내를 찾지 못했어요. 1:1 문의로 남겨주세요.' : '관리자가 안내를 등록하면 이곳에 표시됩니다.'
      });
      return;
    }
    el.innerHTML = '<div class="cs-list">' + list.map(function (n, i) {
      var c = catOf(n);
      return '<div class="cs-row" data-i="' + i + '" tabindex="0" role="button" aria-label="' + UI.esc(n.title) + '">' +
        '<span class="cs-row-ic"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.2 9.2a2.8 2.8 0 1 1 3.9 2.6c-.7.3-1.1.8-1.1 1.6v.4M12 17h.01" stroke-linecap="round"/></svg></span>' +
        '<div class="cs-row-main"><div class="cs-row-t">' + UI.esc(n.title) + '</div>' +
        '<div class="cs-row-m"><span class="badge ' + c.cls + '">' + c.tx + '</span><span>' + UI.esc(UI.fmtDate(n.date)) + '</span></div></div>' +
        '<span class="cs-row-ar">›</span></div>';
    }).join('') + '</div>';
    el.querySelectorAll('.cs-row').forEach(function (r) {
      var open = function () { renderDetail(list[Number(r.getAttribute('data-i'))]); };
      r.addEventListener('click', open);
      r.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
    });
    UI.watchReveals(el);
  }

  function renderDetail(n) {
    var el = document.getElementById('csContent');
    var c = catOf(n);
    el.innerHTML =
      '<button class="detail-back" type="button" id="csBack">' + UI.IC.back + ' 고객센터 목록</button>' +
      '<article class="detail cs-detail"><div class="detail-head">' +
      '<span class="badge ' + c.cls + '">' + c.tx + '</span>' +
      '<h2 class="detail-title">' + UI.esc(n.title) + '</h2>' +
      '<div class="detail-meta"><span>' + UI.esc(n.author) + '</span><span>·</span><span>' + UI.esc(UI.fmtDate(n.date)) + '</span></div></div>' +
      '<div class="detail-body">' + UI.renderContent(n.content) + '</div></article>' +
      '<div class="box detail-list-box"><div class="box-head"><h2 class="box-title">고객센터</h2>' +
      '<button class="box-go" type="button" id="csBack2">목록으로</button></div>' +
      '<div class="box-body"><ul class="lst">' + S.items.slice(0, 6).map(function (x) {
        var cc = catOf(x);
        return '<li class="lst-row" data-doc="' + UI.esc(x.docId) + '" tabindex="0" role="button">' +
          '<div class="lst-main"><div class="lst-l1"><span class="badge ' + cc.cls + '">' + cc.tx + '</span>' +
          '<span class="lst-title">' + UI.esc(x.title) + '</span></div>' +
          '<div class="lst-l2"><span>' + UI.esc(x.author) + '</span><span>·</span><span>' + UI.esc(UI.fmtDate(x.date)) + '</span></div></div></li>';
      }).join('') + '</ul></div></div>';
    el.querySelectorAll('#csBack,#csBack2').forEach(function (b) { b.addEventListener('click', renderList); });
    el.querySelectorAll('.lst-row').forEach(function (r) {
      var go = function () {
        var x = S.items.find(function (it) { return it.docId === r.getAttribute('data-doc'); });
        if (x) renderDetail(x);
      };
      r.addEventListener('click', go);
      r.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
    });
    el.querySelectorAll('.detail-body img').forEach(function (im) { im.onerror = function () { im.style.display = 'none'; }; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ===== 1:1 문의 ===== */
  function openInquiryModal() {
    var u = UI.currentUser();
    if (!u) {
      UI.toast('로그인 후 1:1 문의를 남길 수 있습니다.');
      setTimeout(function () { location.href = 'Login.html'; }, 700);
      return;
    }
    var m = UI.openModal({
      title: '1:1 문의',
      body:
        '<div class="inq-fld fld"><span class="fld-lb">제목</span><input id="inqTitle" type="text" maxlength="60" placeholder="문의 제목"></div>' +
        '<div class="inq-fld fld"><span class="fld-lb">내용</span><textarea id="inqText" maxlength="1000" placeholder="문제 상황을 자세히 남겨주시면 빠르게 답변드릴 수 있습니다."></textarea></div>' +
        '<button class="btn btn--gold btn--block" id="inqSend" type="button">문의 등록</button>'
    });
    m.body.querySelector('#inqSend').addEventListener('click', function () {
      var t = m.body.querySelector('#inqTitle').value.trim();
      var v = m.body.querySelector('#inqText').value.trim();
      if (!t || !v) { UI.toast('제목과 내용을 모두 입력해 주세요.', 'err'); return; }
      FB.addInquiry(u, UI.userDoc(), t, v).then(function () {
        m.close();
        UI.toast('1:1 문의가 접수되었습니다.', 'ok');
      }).catch(function (e) {
        UI.toast('문의 등록에 실패했습니다 — ' + FB.errMsg(e), 'err');
      });
    });
  }

  function openMyInquiryModal() {
    var u = UI.currentUser();
    if (!u) {
      UI.toast('로그인 후 문의 내역을 볼 수 있습니다.');
      setTimeout(function () { location.href = 'Login.html'; }, 700);
      return;
    }
    var m = UI.openModal({ title: '나의 문의 보기', body: '<div id="myInq"></div>' });
    UI.skelRows(m.body.querySelector('#myInq'), 3);
    FB.getMyInquiries(u.uid).then(function (list) {
      var box = m.body.querySelector('#myInq');
      if (!list.length) { UI.empty(box, { title: '접수된 문의가 없습니다.', desc: '1:1 문의로 궁금한 점을 남겨보세요.' }); return; }
      box.innerHTML = list.map(function (q) {
        return '<div class="ntc-row" style="cursor:default"><span class="ntc-t"><span class="badge badge--ing">' + UI.esc(q.status || '접수') + '</span>' + UI.esc(q.title) + '</span>' +
          '<span class="ntc-m">' + UI.esc(UI.fmtDate(q.createdAt ? FB.dateKey(q.createdAt) : '')) + '</span>' +
          '<p style="font-size:13px;color:var(--text-2);margin-top:6px">' + UI.esc(q.text) + '</p></div>';
      }).join('');
    }).catch(function (e) {
      UI.empty(m.body.querySelector('#myInq'), { title: '문의 내역을 불러오지 못했습니다.', desc: FB.errMsg(e) + ' — 고객센터 정책을 확인해 주세요.' });
    });
  }

  /* ===== 부팅 ===== */
  function start() {
    UI.setActiveNav('cs');
    UI.skelRows(document.getElementById('csContent'), 6);
    document.getElementById('csSearch').addEventListener('input', function (e) {
      S.q = e.target.value;
      renderList();
    });
    document.getElementById('btnInquiry').addEventListener('click', openInquiryModal);
    document.getElementById('btnMyInquiry').addEventListener('click', openMyInquiryModal);

    loadAll().then(function () {
      var cb = S.banners.filter(function (b) { return String(b.page || b.type || b.location || '').toLowerCase().indexOf('cs') > -1 || String(b.page || b.type || b.location || '').toLowerCase().indexOf('support') > -1; });
      UI.fillBanner(document.getElementById('csBannerMedia'), null, cb.length ? cb : S.banners.slice(0, 1));
      renderList();
    }).catch(function (e) {
      UI.toast(FB.errMsg(e) + ' — 고객센터 데이터를 불러오지 못했습니다.', 'err');
      UI.empty(document.getElementById('csContent'), { title: '고객센터 정보를 불러오지 못했습니다.', desc: '네트워크 또는 Firebase 연결을 확인해 주세요.' });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
