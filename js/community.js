(function () {
  var U = FPPUI, D = FPPData, app = U.qs("#app"), banner = U.qs("#banner");
  var hash = function () { var x = (location.hash || "#home").slice(1).split("?"); var p = {}; (x[1] || "").split("&").forEach(function (v) { var a = v.split("="); if (a[0]) p[a[0]] = decodeURIComponent(a[1] || ""); }); return { page: x[0] || "home", params: p }; };
  var nav = function (p) { location.hash = p; };
  function rows(list, kind) {
    var box = U.el('<div class="list"></div>');
    list.forEach(function (x) { var r = U.listRow(x, { badge: kind === "board" ? "게시판" : kind === "event" ? "이벤트" : "패치노트" }); r.onclick = function () { nav(kind + "-detail?id=" + encodeURIComponent(x.id)); }; box.appendChild(r); });
    return box;
  }
  function filterBar(kind, list, draw) {
    var wrap = U.el('<div class="filters"><div class="filter-row"><div class="chips"></div><select><option value="date">최근등록순</option><option value="likes">좋아요순</option><option value="old">오래된순</option></select><div class="toggle-group"><button data-v="list" class="active">목록형</button><button data-v="card">카드형</button></div></div></div>');
    var chips = kind === "board" ? ["전체", "자유", "정보", "질문", "자랑"] : ["전체", "진행중", "종료됨"];
    chips.forEach(function (c, i) { var b = U.el('<button class="chip' + (!i ? " active" : "") + '">' + c + "</button>"); b.onclick = function () { U.qsa(".chip", wrap).forEach(function (x) { x.classList.remove("active"); }); b.classList.add("active"); draw(b.textContent, U.qs("select", wrap).value, "list"); }; U.qs(".chips", wrap).appendChild(b); });
    U.qs("select", wrap).onchange = function (e) { draw(U.qs(".chip.active", wrap).textContent, e.target.value, U.qs(".toggle-group .active", wrap).dataset.v); };
    U.qsa(".toggle-group button", wrap).forEach(function (b) { b.onclick = function () { U.qsa(".toggle-group button", wrap).forEach(function (x) { x.classList.remove("active"); }); b.classList.add("active"); draw(U.qs(".chip.active", wrap).textContent, U.qs("select", wrap).value, b.dataset.v); }; });
    return wrap;
  }
  function cards(list, kind) {
    var g = U.el('<div class="card-grid"></div>');
    list.forEach(function (x) { var c = U.el('<button class="event-card"><div class="event-thumb"></div><div class="event-body"><span class="badge">' + U.esc(x.category || kind) + '</span><h4>' + U.esc(x.title) + '</h4><p>' + U.esc(x.excerpt || x.dateText) + '</p></div></button>'); if (x.thumb) U.qs(".event-thumb", c).style.background = "center/cover url('" + x.thumb.replace(/'/g, "%27") + "')"; c.onclick = function () { nav(kind + "-detail?id=" + encodeURIComponent(x.id)); }; g.appendChild(c); }); return g;
  }
  function listing(kind, title, promise) {
    U.renderPageBanner(banner, title.toUpperCase(), "FPP v2 커뮤니티");
    app.innerHTML = ""; var wrap = U.el('<div class="container"><div class="box"><div class="box-head"><h1 class="box-title">' + title + '</h1></div><div id="filters"></div><div id="list"></div></div></div>'); app.appendChild(wrap);
    promise.then(function (all) {
      var draw = function (cat, sort, view) { var list = all.filter(function (x) { if (cat === "전체") return true; if (kind === "event") return cat === "진행중" ? D.isOngoing(x) : !D.isOngoing(x); return String(x.category || "").indexOf(cat) >= 0; }); if (sort === "likes") list.sort(function (a, b) { return b.likes - a.likes; }); if (sort === "old") list.reverse(); U.qs("#list", wrap).innerHTML = ""; U.qs("#list", wrap).appendChild(view === "card" ? cards(list, kind) : rows(list, kind)); };
      U.qs("#filters", wrap).appendChild(filterBar(kind, all, draw)); draw("전체", "date", kind === "event" ? "card" : "list");
    }).catch(function (e) { U.qs("#list", wrap).innerHTML = U.failed(e); });
  }
  function detail(kind, id) {
    var coll = kind === "patch" ? "patchNotes" : kind === "board" ? "boards" : "events";
    U.renderPageBanner(banner, kind.toUpperCase(), "상세 내용을 확인하세요");
    app.innerHTML = U.loading(); D.doc(coll, id).then(function (x) {
      if (!x) { app.innerHTML = U.empty("문서를 찾을 수 없습니다"); return; }
      var wrap = U.el('<div class="container"><article class="box"><button class="back-link">‹ 목록으로</button><div class="detail-head"><span class="badge">' + U.esc(x.category || kind) + '</span><h1>' + U.esc(x.title) + '</h1><div class="detail-meta"><span>' + U.esc(x.author) + '</span><span>' + U.esc(x.dateText) + '</span></div></div><div class="detail-body"></div></article></div>');
      U.qs(".detail-body", wrap).innerHTML = x.content || U.esc(x.excerpt || "내용이 없습니다.");
      U.qs(".back-link", wrap).onclick = function () { nav(kind); };
      var article = U.qs("article", wrap); article.appendChild(U.likeShareBar(kind, id, x.likes)); if (kind !== "patch") article.appendChild(U.commentsSection(kind, id));
      app.innerHTML = ""; app.appendChild(wrap); D.bumpView(kind, id);
    }).catch(function (e) { app.innerHTML = U.failed(e); });
  }
  function route() { var r = hash(); U.mountShell({ menu: "community", active: r.page.indexOf("patch") === 0 ? "patch" : r.page.indexOf("board") === 0 ? "board" : r.page.indexOf("event") === 0 ? "event" : "chome" }); if (r.page === "patch" || r.page === "patch-detail") return r.page === "patch" ? listing("patch", "패치노트", D.patches()) : detail("patch", r.params.id); if (r.page === "board" || r.page === "board-detail") return r.page === "board" ? listing("board", "게시판", D.boards()) : detail("board", r.params.id); if (r.page === "event" || r.page === "event-detail") return r.page === "event" ? listing("event", "이벤트", D.events()) : detail("event", r.params.id); U.renderPageBanner(banner, "COMMUNITY", "패치노트 · 게시판 · 이벤트"); app.innerHTML = '<div class="container"><div class="home-grid" style="grid-template-columns:1fr"><section class="box"><div class="box-head"><h1 class="box-title">커뮤니티</h1></div><div class="state"><strong>FPP 커뮤니티에 오신 것을 환영합니다.</strong>패치노트와 게시판, 이벤트 소식을 확인해 보세요.</div></section></div></div>'; }
  addEventListener("hashchange", route); route();
})();
