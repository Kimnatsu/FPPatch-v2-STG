/* FPP v2 — Main HTML 스크립트 (홈 / 캐릭터 / PvP 패치) */
(function () {
  var U = window.FPPUI,
    D = window.FPPData;
  var el = U.el,
    qs = U.qs,
    qsa = U.qsa,
    esc = U.esc;

  var app = qs("#app");
  var bannerNode = qs("#banner");

  /* ---------- 라우팅 ---------- */
  function parseHash() {
    var h = (location.hash || "#home").slice(1);
    var parts = h.split("?");
    var params = {};
    (parts[1] || "").split("&").forEach(function (kv) {
      if (!kv) return;
      var a = kv.split("=");
      params[a[0]] = decodeURIComponent(a[1] || "");
    });
    return { page: parts[0] || "home", params: params };
  }

  function setActiveMenu(page) {
    qsa(".mainmenu a, .tabbar a, .drawer-panel a").forEach(function (a) {
      var key = a.getAttribute("data-key") || "";
      a.classList.toggle("active", key === page);
    });
  }

  /* ---------- 날짜 유틸 ---------- */
  function dayKey(d) {
    if (!d) return "";
    var dt = d instanceof Date ? d : new Date(d);
    if (isNaN(dt.getTime())) return "";
    return (
      dt.getFullYear() +
      "-" +
      String(dt.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(dt.getDate()).padStart(2, "0")
    );
  }
  function patchDates(list) {
    var seen = {};
    list.forEach(function (p) {
      var k = dayKey(p.date);
      if (k) seen[k] = 1;
    });
    return Object.keys(seen).sort().reverse();
  }
  function filterByDate(list, key) {
    if (!key) return list;
    return list.filter(function (p) {
      return dayKey(p.date) === key;
    });
  }

  function route() {
    var r = parseHash();
    setActiveMenu(r.page);
    window.scrollTo({ top: 0 });
    if (r.page === "character") return renderCharacter(r.params);
    if (r.page === "pvp") return renderPvp(r.params);
    return renderHome();
  }

  /* =======================================================
     홈
     ======================================================= */
  function renderHome() {
    U.renderBanner(bannerNode, "main");
    app.innerHTML = "";
    var grid = el('<div class="container"><div class="home-grid"></div></div>');
    var g = qs(".home-grid", grid);
    var boxPatch = el('<section class="box box-patch"></section>');
    var boxPvp = el('<section class="box"></section>');
    var boxEvent = el('<section class="box box-event"></section>');
    var boxCommunity = el('<section class="box"></section>');
    g.appendChild(boxPatch);
    g.appendChild(boxPvp);
    g.appendChild(boxEvent);
    g.appendChild(boxCommunity);
    app.appendChild(grid);

    boxHead(boxPatch, "패치노트", function () {
      location.href = "community.html#patch";
    });
    boxHead(boxPvp, "PvP 패치", function () {
      location.hash = "pvp";
    });
    boxHead(boxEvent, "이벤트", function () {
      location.href = "community.html#event";
    });
    boxHead(boxCommunity, "커뮤니티", function () {
      location.href = "community.html#board";
    });

    var patchBody = addBody(boxPatch),
      pvpBody = addBody(boxPvp),
      eventBody = addBody(boxEvent),
      commBody = addBody(boxCommunity);

    /* 이벤트: 진행중만 */
    eventBody.innerHTML = U.loading();
    D.events()
      .then(function (evs) {
        var live = evs.filter(D.isOngoing);
        if (!live.length) {
          boxEvent.classList.add("hidden");
          g.classList.add("no-event");
          loadPatches(patchBody, U.isMobile() ? 5 : 10);
          return;
        }
        loadPatches(patchBody, 5);
        renderEventRolling(eventBody, live);
      })
      .catch(function (e) {
        eventBody.innerHTML = U.failed(e);
        loadPatches(patchBody, 5);
      });

    /* PvP */
    pvpBody.innerHTML = U.loading();
    D.pvpPatches()
      .then(function (list) {
        var dates = patchDates(list);
        if (dates.length) list = filterByDate(list, dates[0]);
        var max = U.isMobile() ? 8 : 12;
        list = list.slice(0, max);
        if (!list.length) {
          pvpBody.innerHTML = U.empty("등록된 PvP 패치가 없습니다");
          return;
        }
        var grid2 = el('<div class="pvp-grid"></div>');
        list.forEach(function (p) {
          var item = el(
            '<button class="pvp-item"><div class="pvp-avatar">' +
              (p.image
                ? '<img alt="' + esc(p.name) + '" loading="lazy" src="' + esc(p.image) + '">'
                : '<div class="ph">' + esc(String(p.name || "?").slice(0, 1)) + "</div>") +
              '<span class="badge badge-' + p.type + '">' + D.patchTypeLabel(p.type) + "</span>" +
              '</div><div class="pvp-name">' + esc(p.name || "-") + "</div></button>"
          );
          item.addEventListener("click", function () {
            location.hash = "pvp?char=" + encodeURIComponent(p.char ? p.char.docId : p.charId);
          });
          grid2.appendChild(item);
        });
        pvpBody.innerHTML = "";
        pvpBody.appendChild(grid2);
      })
      .catch(function (e) {
        pvpBody.innerHTML = U.failed(e);
      });

    /* 커뮤니티 */
    commBody.innerHTML = U.loading();
    D.boards()
      .then(function (rows) {
        if (!rows.length) {
          commBody.innerHTML = U.empty("등록된 게시글이 없습니다");
          return;
        }
        var list = el('<div class="list"></div>');
        rows.slice(0, 5).forEach(function (p) {
          var row = U.listRow(p, { badge: "자유" });
          row.addEventListener("click", function () {
            location.href = "community.html#board-detail?id=" + encodeURIComponent(p.id);
          });
          list.appendChild(row);
        });
        commBody.innerHTML = "";
        commBody.appendChild(list);
      })
      .catch(function (e) {
        commBody.innerHTML = U.failed(e);
      });
  }

  function boxHead(box, title, onMore) {
    var head = el(
      '<div class="box-head"><h2 class="box-title">' + esc(title) + '</h2><button class="box-more">바로가기' + U.icons.chevron + "</button></div>"
    );
    qs(".box-more", head).addEventListener("click", onMore);
    box.appendChild(head);
    return head;
  }
  function addBody(box) {
    var b = el("<div></div>");
    box.appendChild(b);
    return b;
  }

  function loadPatches(node, limit) {
    node.innerHTML = U.loading();
    D.patches()
      .then(function (rows) {
        if (!rows.length) {
          node.innerHTML = U.empty("등록된 패치노트가 없습니다");
          return;
        }
        var list = el('<div class="list"></div>');
        rows.slice(0, limit).forEach(function (p) {
          var item = Object.assign({}, p, { category: p.category || "패치노트" });
          var row = U.listRow(item);
          row.addEventListener("click", function () {
            location.href = "community.html#patch-detail?id=" + encodeURIComponent(p.id);
          });
          list.appendChild(row);
        });
        node.innerHTML = "";
        node.appendChild(list);
      })
      .catch(function (e) {
        node.innerHTML = U.failed(e);
      });
  }

  function renderEventRolling(node, list) {
    node.innerHTML = "";
    var wrap = el('<div class="event-rolling"></div>');
    var slot = el("<div></div>");
    wrap.appendChild(slot);
    var idx = 0;
    function draw() {
      var ev = list[idx];
      slot.innerHTML = "";
      var card = el(
        '<button class="event-card">' +
          (ev.thumb ? '<img class="event-thumb" alt="" loading="lazy" src="' + esc(ev.thumb) + '">' : '<div class="event-thumb"></div>') +
          '<div class="event-body"><span class="badge badge-live">진행중</span><h4>' + esc(ev.title) + "</h4><p>" +
          esc(ev.endAt ? "~ " + D.fmtDate(ev.endAt) : ev.dateText) +
          "</p></div></button>"
      );
      card.addEventListener("click", function () {
        location.href = "community.html#event-detail?id=" + encodeURIComponent(ev.id);
      });
      slot.appendChild(card);
      qsa(".dots i", wrap).forEach(function (d, i) {
        d.classList.toggle("active", i === idx);
      });
    }
    if (list.length > 1) {
      var ctrl = el(
        '<div class="rolling-ctrl"><button class="icon-btn" aria-label="이전">' + U.icons.back + '</button><div class="dots">' +
          list
            .map(function () {
              return "<i></i>";
            })
            .join("") +
          '</div><button class="icon-btn" aria-label="다음">' + U.icons.chevron + "</button></div>"
      );
      wrap.appendChild(ctrl);
      var btns = qsa(".icon-btn", ctrl);
      btns[0].addEventListener("click", function () {
        idx = (idx - 1 + list.length) % list.length;
        draw();
      });
      btns[1].addEventListener("click", function () {
        idx = (idx + 1) % list.length;
        draw();
      });
      setInterval(function () {
        idx = (idx + 1) % list.length;
        draw();
      }, 6000);
    }
    node.appendChild(wrap);
    draw();
  }

  /* =======================================================
     캐릭터
     ======================================================= */
  var charState = { tab: "normal", grade: "", element: "", type: "", sort: "name", fav: false, q: "" };

  function renderCharacter(params) {
    U.renderPageBanner(bannerNode, "CHARACTER", "FPP v2 캐릭터 도감 · 등급 / 속성 / 타입별 탐색");
    if (params.tab) charState.tab = params.tab === "support" ? "support" : "normal";
    if (params.fav) charState.fav = true;

    app.innerHTML = "";
    var wrap = el(
      '<div class="container">' +
        '<div class="tabs"><button data-t="normal">캐릭터</button><button data-t="support">현질 서폿 캐릭터</button></div>' +
        '<div class="filters">' +
        '<div class="filter-row" id="fr1">' +
        '<select id="fGrade"><option value="">등급 전체</option></select>' +
        '<select id="fElement"><option value="">속성 전체</option></select>' +
        '<select id="fType"><option value="">타입 전체</option></select>' +
        '<select id="fSort"><option value="name">이름순</option><option value="grade">등급순</option><option value="fav">즐겨찾기순</option></select>' +
        '<button class="chip" id="fFav">즐겨찾기</button>' +
        '<div class="search-wrap"><input type="search" id="fQ" placeholder="캐릭터 검색"><button class="btn" id="fReset">새로고침</button></div>' +
        "</div></div>" +
        '<div id="charList"></div></div>'
    );
    app.appendChild(wrap);

    /* SM/XS: 필터 2열 분리 */
    function layoutFilters() {
      var filters = qs(".filters", wrap);
      var r1 = qs("#fr1", wrap);
      var r2 = qs("#fr2", wrap);
      if (U.isMobile()) {
        if (!r2) {
          r2 = el('<div class="filter-row" id="fr2"></div>');
          r2.appendChild(qs("#fFav", wrap));
          r2.appendChild(qs(".search-wrap", wrap));
          filters.appendChild(r2);
        }
      } else if (r2) {
        r1.appendChild(qs("#fFav", wrap));
        r1.appendChild(qs(".search-wrap", wrap));
        r2.remove();
      }
    }
    layoutFilters();
    window.addEventListener("resize", layoutFilters);

    qsa(".tabs button", wrap).forEach(function (b) {
      b.classList.toggle("active", b.dataset.t === charState.tab);
      b.addEventListener("click", function () {
        charState.tab = b.dataset.t;
        qsa(".tabs button", wrap).forEach(function (x) {
          x.classList.toggle("active", x === b);
        });
        load();
      });
    });
    qs("#fFav", wrap).classList.toggle("active", charState.fav);
    qs("#fFav", wrap).addEventListener("click", function (e) {
      charState.fav = !charState.fav;
      e.currentTarget.classList.toggle("active", charState.fav);
      draw();
    });
    ["fGrade", "fElement", "fType", "fSort"].forEach(function (id) {
      qs("#" + id, wrap).addEventListener("change", function (e) {
        var key = { fGrade: "grade", fElement: "element", fType: "type", fSort: "sort" }[id];
        charState[key] = e.target.value;
        draw();
      });
    });
    qs("#fQ", wrap).addEventListener("input", function (e) {
      charState.q = e.target.value.trim();
      draw();
    });
    qs("#fReset", wrap).addEventListener("click", function () {
      charState = { tab: charState.tab, grade: "", element: "", type: "", sort: "name", fav: false, q: "" };
      renderCharacter({ tab: charState.tab });
    });
    document.addEventListener("fpp:favchange", function () {
      if (parseHash().page === "character") draw();
    });

    var listNode = qs("#charList", wrap);
    var all = [];

    function fillSelect(id, values) {
      var sel = qs("#" + id, wrap);
      values.forEach(function (v) {
        sel.appendChild(el('<option value="' + esc(v) + '">' + esc(v) + "</option>"));
      });
    }

    function load() {
      listNode.innerHTML = U.loading("캐릭터 불러오는 중...");
      D.characters(charState.tab)
        .then(function (rows) {
          all = rows;
          ["fGrade", "fElement", "fType"].forEach(function (id) {
            var sel = qs("#" + id, wrap);
            sel.innerHTML = sel.options[0].outerHTML;
          });
          fillSelect("fGrade", uniq(rows, "grade"));
          fillSelect("fElement", uniq(rows, "element"));
          fillSelect("fType", uniq(rows, "type"));
          draw();
          if (params.char) {
            var target = rows.filter(function (c) {
              return String(c.docId) === String(params.char) || String(c.id) === String(params.char);
            })[0];
            if (target) openCharPanel(target);
          }
        })
        .catch(function (e) {
          listNode.innerHTML = U.failed(e);
        });
    }

    function draw() {
      var favs = U.favsAll()[charState.tab === "support" ? "support" : "character"];
      var rows = all.filter(function (c) {
        if (charState.grade && String(c.grade) !== charState.grade) return false;
        if (charState.element && String(c.element) !== charState.element) return false;
        if (charState.type && String(c.type) !== charState.type) return false;
        if (charState.q && String(c.name).toLowerCase().indexOf(charState.q.toLowerCase()) < 0) return false;
        if (charState.fav && favs.indexOf(String(c.id)) < 0 && favs.indexOf(String(c.docId)) < 0) return false;
        return true;
      });
      if (charState.sort === "grade")
        rows.sort(function (a, b) {
          return String(b.grade).localeCompare(String(a.grade));
        });
      else if (charState.sort === "fav")
        rows.sort(function (a, b) {
          return (favs.indexOf(String(b.id)) > -1 ? 1 : 0) - (favs.indexOf(String(a.id)) > -1 ? 1 : 0);
        });
      if (!rows.length) {
        listNode.innerHTML = U.empty("조건에 맞는 캐릭터가 없습니다", "필터를 초기화해 보세요.");
        return;
      }
      var grid = el('<div class="char-grid"></div>');
      rows.forEach(function (c) {
        var on = favs.indexOf(String(c.id)) > -1 || favs.indexOf(String(c.docId)) > -1;
        var card = el(
          '<div class="char-card">' +
            (c.image
              ? '<img class="char-thumb" alt="' + esc(c.name) + '" loading="lazy" src="' + esc(c.image) + '">'
              : '<div class="char-thumb">' + esc(String(c.name).slice(0, 1)) + "</div>") +
            '<div class="char-name">' + esc(c.name) + "</div>" +
            '<div class="char-meta">' + esc([c.grade, c.element, c.type].filter(Boolean).join(" · ") || "-") + "</div>" +
            '<button class="fav-star' + (on ? " on" : "") + '" aria-label="즐겨찾기">' + U.icons.star + "</button></div>"
        );
        card.addEventListener("click", function (e) {
          if (e.target.closest(".fav-star")) return;
          openCharPanel(c);
        });
        qs(".fav-star", card).addEventListener("click", function (e) {
          e.stopPropagation();
          var now = U.toggleFav(charState.tab, c.id);
          e.currentTarget.classList.toggle("on", now);
          U.toast(now ? "즐겨찾기에 추가했습니다." : "즐겨찾기에서 제거했습니다.");
        });
        grid.appendChild(card);
      });
      listNode.innerHTML = "";
      listNode.appendChild(grid);
    }

    load();
  }

  function uniq(rows, key) {
    var s = {};
    rows.forEach(function (r) {
      if (r[key]) s[r[key]] = 1;
    });
    return Object.keys(s).sort();
  }

  function openCharPanel(c) {
    var ov = el('<div class="overlay" style="place-items:stretch;justify-content:flex-end;padding:0"></div>');
    var panel = el('<aside class="side-panel"></aside>');
    var on = U.isFav("normal", c.id) || U.isFav("support", c.id);
    panel.appendChild(
      el(
        '<div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;margin-bottom:14px">' +
          '<h3 style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(c.name) + "</h3>" +
          '<button class="icon-btn" id="pClose" aria-label="닫기">' + U.icons.close + "</button></div>"
      )
    );
    panel.appendChild(
      el(
        '<div style="display:flex;gap:14px;align-items:center;margin-bottom:14px">' +
          (c.image
            ? '<img src="' + esc(c.image) + '" alt="' + esc(c.name) + '" style="width:96px;height:96px;border-radius:50%;object-fit:cover;border:2px solid var(--line)">'
            : '<div class="char-thumb" style="width:96px;height:96px;border-radius:50%">' + esc(String(c.name).slice(0, 1)) + "</div>") +
          '<div><div class="char-meta">' + esc([c.grade, c.element, c.type].filter(Boolean).join(" · ") || "-") + "</div>" +
          '<button class="btn' + (on ? " btn-primary" : "") + '" id="pFav" style="margin-top:8px">즐겨찾기</button></div></div>'
      )
    );
    var skills = (c.skills && c.skills.length ? c.skills : c.supportSkills) || [];
    if (skills.length) {
      panel.appendChild(el('<h4 style="margin:16px 0 4px">스킬</h4>'));
      skills.forEach(function (s) {
        panel.appendChild(
          el('<div class="skill"><b>' + esc(D.pick(s, ["name", "title"], "스킬")) + "</b><p>" + esc(D.pick(s, ["desc", "description", "text"], "")) + "</p></div>")
        );
      });
    }
    if (c.recentPatches && c.recentPatches.length) {
      panel.appendChild(el('<h4 style="margin:16px 0 4px">최근 패치</h4>'));
      c.recentPatches.forEach(function (p) {
        var text = typeof p === "string" ? p : D.pick(p, ["desc", "content", "text"], "");
        var t = D.patchType(typeof p === "string" ? p : D.pick(p, ["type", "patchType"], text));
        panel.appendChild(
          el('<div class="skill"><b><span class="badge badge-' + t + '">' + D.patchTypeLabel(t) + "</span></b><p>" + esc(text) + "</p></div>")
        );
      });
    }
    if (c.tips && c.tips.length) {
      panel.appendChild(el('<h4 style="margin:16px 0 4px">꿀팁</h4>'));
      c.tips.forEach(function (t) {
        panel.appendChild(el('<div class="skill"><p>' + esc(typeof t === "string" ? t : D.pick(t, ["content", "text", "desc"], "")) + "</p></div>"));
      });
    }
    ov.appendChild(panel);
    document.body.appendChild(ov);
    qs("#pClose", panel).addEventListener("click", function () {
      ov.remove();
    });
    ov.addEventListener("click", function (e) {
      if (e.target === ov) ov.remove();
    });
    qs("#pFav", panel).addEventListener("click", function (e) {
      var now = U.toggleFav(c.coll === "supportCharacters" ? "support" : "normal", c.id);
      e.currentTarget.classList.toggle("btn-primary", now);
      U.toast(now ? "즐겨찾기에 추가했습니다." : "즐겨찾기에서 제거했습니다.");
    });
  }

  /* =======================================================
     PvP 패치
     ======================================================= */
  function renderPvp(params) {
    U.renderPageBanner(bannerNode, "PVP PATCH", "버프 · 너프 · 기능수정 밸런스 패치 현황");
    app.innerHTML = "";
    var wrap = el(
      '<div class="container">' +
        '<div class="pvp-toolbar"><div class="date-filter"><button type="button" class="date-filter-btn" aria-haspopup="listbox" aria-expanded="false"><span class="date-filter-label">날짜 전체</span>' +
        U.icons.chevron +
        '</button><div class="date-filter-menu" role="listbox" hidden></div></div></div>' +
        '<div class="home-grid" id="pvpBoxes" style="grid-template-columns:repeat(3,minmax(0,1fr))"></div></div>'
    );
    app.appendChild(wrap);
    var boxes = qs("#pvpBoxes", wrap);
    if (U.isMobile()) boxes.style.gridTemplateColumns = "1fr";

    var types = [
      ["buff", "버프"],
      ["nerf", "너프"],
      ["fix", "기능수정"],
    ];
    var bodies = {};
    types.forEach(function (t) {
      var box = el('<section class="box"></section>');
      box.appendChild(
        el('<div class="box-head"><h2 class="box-title"><span class="badge badge-' + t[0] + '">' + t[1] + "</span></h2></div>")
      );
      var body = el("<div></div>");
      body.innerHTML = U.loading();
      box.appendChild(body);
      bodies[t[0]] = body;
      boxes.appendChild(box);
    });

    function renderList(list) {
      types.forEach(function (t) {
        var rows = list.filter(function (p) {
          return p.type === t[0];
        });
        var node = bodies[t[0]];
        if (!rows.length) {
          node.innerHTML = U.empty(t[1] + " 패치가 없습니다");
          return;
        }
        node.innerHTML = "";
        var lst = el('<div class="list"></div>');
        rows.forEach(function (p) {
          var row = el(
            '<button class="list-row"><div class="list-row-main"><div class="row-line1">' +
              '<span class="badge badge-' + p.type + '">' + D.patchTypeLabel(p.type) + '</span><span class="row-title">' +
              esc(p.name || "-") + "</span></div>" +
              '<div class="row-line2"><span>' + esc(D.stripHtml(p.desc).slice(0, 60) || "상세 보기") + "</span></div></div>" +
              (p.date ? '<span class="badge">' + esc(D.fmtDate(p.date)) + "</span>" : "<span></span>") +
              "</button>"
          );
          row.addEventListener("click", function () {
            if (p.char) openCharPanel(p.char);
            else U.toast("연결된 캐릭터 정보가 없습니다.");
          });
          lst.appendChild(row);
        });
        node.appendChild(lst);
      });
    }

    function buildDateFilter(dates, selected) {
      var box = qs(".date-filter", wrap);
      if (!dates.length) {
        qs(".pvp-toolbar", wrap).classList.add("hidden");
        return;
      }
      var btn = qs(".date-filter-btn", box);
      var menu = qs(".date-filter-menu", box);
      qs(".date-filter-label", btn).textContent = selected || "날짜 선택";
      menu.innerHTML = "";
      dates.forEach(function (dk) {
        var it = el(
          '<button type="button" class="date-filter-item' + (dk === selected ? " active" : "") + '" role="option">' + esc(dk) + "</button>"
        );
        it.addEventListener("click", function () {
          menu.hidden = true;
          btn.setAttribute("aria-expanded", "false");
          location.hash = "pvp?date=" + encodeURIComponent(dk);
        });
        menu.appendChild(it);
      });
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        menu.hidden = !menu.hidden;
        btn.setAttribute("aria-expanded", String(!menu.hidden));
      });
      document.addEventListener("click", function (e) {
        if (!menu.hidden && !box.contains(e.target)) {
          menu.hidden = true;
          btn.setAttribute("aria-expanded", "false");
        }
      });
    }

    D.pvpPatches()
      .then(function (list) {
        var dates = patchDates(list);
        var selected = params.date && dates.indexOf(params.date) > -1 ? params.date : dates[0] || "";
        buildDateFilter(dates, selected);
        renderList(filterByDate(list, selected));
        if (params.char) {
          var hit = list.filter(function (p) {
            return p.char && (String(p.char.docId) === String(params.char) || String(p.char.id) === String(params.char));
          })[0];
          if (hit) openCharPanel(hit.char);
        }
      })
      .catch(function (e) {
        types.forEach(function (t) {
          bodies[t[0]].innerHTML = U.failed(e);
        });
      });
  }

  /* ---------- 시작 ---------- */
  U.mountShell({ menu: "main", active: parseHash().page });
  window.addEventListener("hashchange", route);
  route();
})();
