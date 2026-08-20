/* FPP v2 — 공통 UI (Header, 메뉴, 팝업, 설정, 즐겨찾기, 프로필, 상태 UI) */
(function () {
  var auth = window.FB && FB.auth;
  var db = window.FB && FB.db;

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function isMobile() {
    return window.matchMedia("(max-width: 767px)").matches;
  }
  function toast(msg) {
    var wrap = qs(".toast-wrap");
    if (!wrap) {
      wrap = el('<div class="toast-wrap"></div>');
      document.body.appendChild(wrap);
    }
    var t = el('<div class="toast">' + esc(msg) + "</div>");
    wrap.appendChild(t);
    setTimeout(function () {
      t.remove();
    }, 2600);
  }

  var ICONS = {
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.6l2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8z"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1A1.6 1.6 0 008 19.4a1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H2a2 2 0 110-4h.1A1.6 1.6 0 004.6 8a1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V2a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H22a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1z"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4"/></svg>',
    sword: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M14.5 3H21v6.5L10 20.5 3.5 14z"/><path d="M7 17l-3 3"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M21 12a8 8 0 01-8 8H4l2-3a8 8 0 1115-5z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20s-7-4.4-7-9a4 4 0 017-2.6A4 4 0 0119 11c0 4.6-7 9-7 9z"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.8l7.4-4.2M8.3 13.2l7.4 4.2"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M9 5l7 7-7 7"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M15 5l-7 7 7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  };

  /* ---------- 로컬 환경설정 ---------- */
  var PREF_KEY = "fpp_prefs_v2";
  function prefs() {
    try {
      return JSON.parse(localStorage.getItem(PREF_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }
  function savePrefs(p) {
    localStorage.setItem(PREF_KEY, JSON.stringify(p));
    var u = auth && auth.currentUser;
    if (u && db) {
      db.collection("users").doc(u.uid).set({ prefs: p }, { merge: true }).catch(function () {});
    }
  }
  function applyTheme() {
    var p = prefs();
    document.documentElement.setAttribute("data-theme", p.theme === "light" ? "light" : "dark");
  }
  applyTheme();

  /* ---------- 즐겨찾기 ---------- */
  var FAV_KEY = "fpp_favs_v2";
  function favsAll() {
    try {
      var f = JSON.parse(localStorage.getItem(FAV_KEY) || "{}");
      return { character: f.character || [], support: f.support || [] };
    } catch (e) {
      return { character: [], support: [] };
    }
  }
  function isFav(kind, id) {
    return favsAll()[kind === "support" ? "support" : "character"].indexOf(String(id)) > -1;
  }
  function toggleFav(kind, id) {
    var all = favsAll();
    var k = kind === "support" ? "support" : "character";
    var i = all[k].indexOf(String(id));
    if (i > -1) all[k].splice(i, 1);
    else all[k].push(String(id));
    localStorage.setItem(FAV_KEY, JSON.stringify(all));
    var u = auth && auth.currentUser;
    if (u && db) {
      db.collection("users").doc(u.uid).set({ favorites: all }, { merge: true }).catch(function () {});
    }
    document.dispatchEvent(new CustomEvent("fpp:favchange"));
    return i === -1;
  }
  function syncFavsFromCloud(uid) {
    if (!db) return;
    db.collection("users")
      .doc(uid)
      .get()
      .then(function (s) {
        if (!s.exists) return;
        var d = s.data() || {};
        if (d.favorites) {
          var cur = favsAll();
          var merged = {
            character: Array.from(new Set(cur.character.concat(d.favorites.character || []))),
            support: Array.from(new Set(cur.support.concat(d.favorites.support || []))),
          };
          localStorage.setItem(FAV_KEY, JSON.stringify(merged));
          document.dispatchEvent(new CustomEvent("fpp:favchange"));
        }
        if (d.prefs) {
          localStorage.setItem(PREF_KEY, JSON.stringify(Object.assign(prefs(), d.prefs)));
          applyTheme();
        }
      })
      .catch(function () {});
  }

  /* ---------- 상태 UI ---------- */
  function loading(text) {
    return '<div class="state"><div class="spinner"></div>' + esc(text || "불러오는 중...") + "</div>";
  }
  function empty(text, sub) {
    return (
      '<div class="state"><strong>' + esc(text || "표시할 내용이 없습니다") + "</strong>" + esc(sub || "") + "</div>"
    );
  }
  function failed(e) {
    return (
      '<div class="state"><strong>데이터를 불러오지 못했습니다</strong>' +
      esc((e && e.message) || "네트워크 상태를 확인한 뒤 새로고침해 주세요.") +
      "</div>"
    );
  }

  /* ---------- 배너 ---------- */
  var bannerSeq = 0;
  var bannerTimer = null;
  function beginBanner(node) {
    bannerSeq += 1;
    if (bannerTimer) {
      clearInterval(bannerTimer);
      bannerTimer = null;
    }
    node.classList.add("banner");
    return bannerSeq;
  }
  function renderBanner(node, page) {
    if (!node) return;
    var token = beginBanner(node);
    node.innerHTML = '<div class="banner-fallback">FPP v2</div>';
    if (page === null) return; // 페이지 전용 배너(파이어베이스 미사용)
    FPPData.banners(page)
      .then(function (list) {
        if (token !== bannerSeq) return; // 다른 페이지로 이동함
        if (!list.length) return;
        var track = el('<div class="banner-track"></div>');
        list.forEach(function (b) {
          var slide = el('<div class="banner-slide"></div>');
          var img = el('<img alt="배너" loading="lazy" src="' + esc(b.image) + '">');
          if (b.link)
            slide.style.cursor = "pointer",
              slide.addEventListener("click", function () {
                location.href = b.link;
              });
          slide.appendChild(img);
          track.appendChild(slide);
        });
        node.innerHTML = "";
        node.appendChild(track);
        if (list.length > 1) {
          var dots = el('<div class="banner-dots"></div>');
          list.forEach(function (_, i) {
            var d = el("<button" + (i === 0 ? ' class="active"' : "") + ' aria-label="배너 ' + (i + 1) + '"></button>');
            d.addEventListener("click", function () {
              go(i);
            });
            dots.appendChild(d);
          });
          node.appendChild(dots);
          var idx = 0;
          function go(i) {
            idx = (i + list.length) % list.length;
            track.style.transform = "translateX(" + -idx * 100 + "%)";
            qsa("button", dots).forEach(function (b, bi) {
              b.classList.toggle("active", bi === idx);
            });
          }
          bannerTimer = setInterval(function () {
            go(idx + 1);
          }, 5000);
        }
      })
      .catch(function () {});
  }

  /* 페이지 전용(고정) 배너 */
  function renderPageBanner(node, title, sub) {
    if (!node) return;
    beginBanner(node);
    node.innerHTML =
      '<div class="banner-fallback" style="flex-direction:column;gap:8px;text-align:center;padding:0 18px">' +
      '<div style="font-size:26px;color:var(--brand);letter-spacing:.24em">' +
      esc(title) +
      "</div>" +
      '<div style="font-size:13px;letter-spacing:.04em;text-transform:none;font-weight:600">' +
      esc(sub || "") +
      "</div></div>";
  }

  /* ---------- Header / 메뉴 ---------- */
  var MAIN_MENU = [
    { key: "home", label: "홈", href: "index.html#home", icon: "home" },
    { key: "character", label: "캐릭터", href: "index.html#character", icon: "user" },
    { key: "pvp", label: "PvP 패치", href: "index.html#pvp", icon: "sword" },
    { key: "community", label: "커뮤니티", href: "community.html#home", icon: "chat" },
    { key: "support", label: "고객센터", href: "support.html", icon: "chat" },
  ];
  var COMMUNITY_MENU = [
    { key: "chome", label: "커뮤니티 홈", href: "community.html#home", icon: "home" },
    { key: "patch", label: "패치노트", href: "community.html#patch", icon: "chat" },
    { key: "board", label: "게시판", href: "community.html#board", icon: "chat" },
    { key: "event", label: "이벤트", href: "community.html#event", icon: "star" },
    { key: "mainhome", label: "메인 홈", href: "index.html#home", icon: "home" },
  ];

  function mountShell(opts) {
    opts = opts || {};
    var menu = opts.menu === "community" ? COMMUNITY_MENU : MAIN_MENU;
    var tabs = opts.menu === "community" ? COMMUNITY_MENU : MAIN_MENU.filter(function (m) {
      return m.key !== "support";
    });

    var header = el(
      '<header class="header"><div class="container header-inner">' +
        '<div class="header-left">' +
        '<button class="icon-btn hamburger" id="btnMenu" aria-label="메뉴 열기">' + ICONS.menu + "</button>" +
        '<a class="logo" href="index.html#home" aria-label="FPP 홈"><span class="logo-text">FPP<span style="color:var(--text)">v2</span></span></a>' +
        "</div>" +
        '<div class="header-right">' +
        '<button class="icon-btn" id="btnFav" aria-label="즐겨찾기" aria-expanded="false">' + ICONS.star + "</button>" +
        '<button class="icon-btn" id="btnSet" aria-label="설정" aria-expanded="false">' + ICONS.gear + "</button>" +
        '<div id="authArea" style="display:flex;gap:6px;align-items:center"></div>' +
        "</div></div></header>"
    );

    var nav = el('<nav class="mainmenu"><div class="container mainmenu-inner"></div></nav>');
    var navInner = qs(".mainmenu-inner", nav);
    menu.forEach(function (m) {
      var a = el('<a href="' + m.href + '" data-key="' + m.key + '"' + (m.key === opts.active ? ' class="active"' : "") + ">" + esc(m.label) + "</a>");
      navInner.appendChild(a);
    });

    var tabbar = el('<nav class="tabbar"><div class="tabbar-inner"></div></nav>');
    var tabInner = qs(".tabbar-inner", tabbar);
    tabs.forEach(function (m) {
      tabInner.appendChild(
        el(
          '<a href="' + m.href + '" data-key="' + m.key + '"' + (m.key === opts.active ? ' class="active"' : "") + ">" +
            ICONS[m.icon] +
            "<span>" + esc(m.label) + "</span></a>"
        )
      );
    });

    var mount = qs("[data-shell]") || document.body;
    mount.prepend(tabbar);
    mount.prepend(nav);
    mount.prepend(header);

    /* 햄버거 드로어 */
    qs("#btnMenu", header).addEventListener("click", function () {
      var drawer = el('<div class="drawer"><div class="drawer-panel"></div></div>');
      var panel = qs(".drawer-panel", drawer);
      panel.appendChild(el('<div class="popover-title" style="font-size:16px">메뉴</div>'));
      MAIN_MENU.concat(opts.menu === "community" ? COMMUNITY_MENU.slice(0, 4) : []).forEach(function (m) {
        panel.appendChild(
          el('<a href="' + m.href + '" data-key="' + m.key + '"' + (m.key === opts.active ? ' class="active"' : "") + ">" + esc(m.label) + "</a>")
        );
      });
      drawer.addEventListener("click", function (e) {
        if (e.target === drawer) drawer.remove();
      });
      document.body.appendChild(drawer);
    });

    qs("#btnFav", header).addEventListener("click", function (e) {
      togglePopover(e.currentTarget, favoritePopover);
    });
    qs("#btnSet", header).addEventListener("click", function (e) {
      if (isMobile()) {
        location.href = "settings.html";
        return;
      }
      togglePopover(e.currentTarget, settingsPopover);
    });

    watchAuth();
    return header;
  }

  /* ---------- Popover 관리 ---------- */
  var openPop = null;
  function closePopover() {
    if (openPop) {
      openPop.node.remove();
      openPop.anchor.setAttribute("aria-expanded", "false");
      openPop = null;
    }
  }
  function togglePopover(anchor, builder) {
    var same = openPop && openPop.anchor === anchor;
    closePopover();
    if (same) return;
    var node = builder();
    document.body.appendChild(node);
    var r = anchor.getBoundingClientRect();
    if (!isMobile()) {
      node.style.top = r.bottom + window.scrollY + 8 + "px";
      var left = Math.min(r.right - node.offsetWidth, window.innerWidth - node.offsetWidth - 12);
      node.style.left = Math.max(12, left) + "px";
    }
    anchor.setAttribute("aria-expanded", "true");
    openPop = { node: node, anchor: anchor };
  }
  document.addEventListener("click", function (e) {
    if (!openPop) return;
    if (openPop.node.contains(e.target) || openPop.anchor.contains(e.target)) return;
    closePopover();
  });

  /* ---------- 모달 ---------- */
  function modal(title, bodyNode) {
    var ov = el('<div class="overlay"><div class="modal"><div class="modal-head"><h3></h3><button class="icon-btn" aria-label="닫기">' + ICONS.close + '</button></div><div class="modal-body"></div></div></div>');
    qs("h3", ov).textContent = title;
    qs(".modal-body", ov).appendChild(bodyNode);
    function close() {
      ov.remove();
    }
    qs(".modal-head .icon-btn", ov).addEventListener("click", close);
    ov.addEventListener("click", function (e) {
      if (e.target === ov) close();
    });
    document.body.appendChild(ov);
    return { node: ov, close: close };
  }

  /* ---------- 즐겨찾기 팝업 ---------- */
  function favoritePopover() {
    var pop = el(
      '<div class="popover"><div class="popover-title">즐겨찾기</div>' +
        '<div class="tabs" style="margin:0 0 12px"><button class="active" data-k="character">캐릭터</button><button data-k="support">현질 서폿 캐릭터</button></div>' +
        '<div class="fav-body"></div></div>'
    );
    var body = qs(".fav-body", pop);
    function draw(kind) {
      body.innerHTML = loading();
      FPPData.characters(kind === "support" ? "support" : "normal")
        .then(function (chars) {
          var favs = favsAll()[kind === "support" ? "support" : "character"];
          var list = chars
            .filter(function (c) {
              return favs.indexOf(String(c.id)) > -1 || favs.indexOf(String(c.docId)) > -1;
            })
            .slice(0, 16);
          if (!list.length) {
            body.innerHTML =
              '<div class="state"><strong>즐겨찾기한 캐릭터 없음</strong>마음에 드는 캐릭터를 추가해보세요</div>';
            var b = el('<button class="btn btn-primary btn-block">추가하러 가기</button>');
            b.addEventListener("click", function () {
              location.href = "index.html#character?tab=" + (kind === "support" ? "support" : "normal");
            });
            body.appendChild(b);
            return;
          }
          var grid = el('<div class="fav-grid"></div>');
          list.forEach(function (c) {
            var item = el(
              '<button class="pvp-item"><div class="pvp-avatar">' +
                (c.image
                  ? '<img alt="' + esc(c.name) + '" src="' + esc(c.image) + '">'
                  : '<div class="ph">' + esc(String(c.name).slice(0, 1)) + "</div>") +
                '</div><div class="pvp-name">' + esc(c.name) + "</div></button>"
            );
            item.addEventListener("click", function () {
              location.href =
                "index.html#character?tab=" + (kind === "support" ? "support" : "normal") + "&fav=1&char=" + encodeURIComponent(c.docId);
              location.reload();
            });
            grid.appendChild(item);
          });
          body.innerHTML = "";
          body.appendChild(grid);
        })
        .catch(function (e) {
          body.innerHTML = failed(e);
        });
    }
    qsa(".tabs button", pop).forEach(function (b) {
      b.addEventListener("click", function () {
        qsa(".tabs button", pop).forEach(function (x) {
          x.classList.remove("active");
        });
        b.classList.add("active");
        draw(b.dataset.k);
      });
    });
    draw("character");
    return pop;
  }

  /* ---------- 설정 팝업 & 모달들 ---------- */
  function settingsPopover() {
    var pop = el(
      '<div class="popover"><div class="popover-title">설정</div><div class="menu-list">' +
        '<button data-a="notice">공지사항' + ICONS.chevron + "</button>" +
        '<button data-a="noti">알림 설정' + ICONS.chevron + "</button>" +
        '<button data-a="theme">테마 변경' + ICONS.chevron + "</button>" +
        '<button data-a="icon">앱 아이콘 변경' + ICONS.chevron + "</button>" +
        '<button data-a="lang">언어 변경' + ICONS.chevron + "</button>" +
        "</div></div>"
    );
    qsa("button", pop).forEach(function (b) {
      b.addEventListener("click", function () {
        closePopover();
        openSetting(b.dataset.a);
      });
    });
    return pop;
  }

  function openSetting(action) {
    if (action === "notice") {
      location.href = "community.html#patch";
      return;
    }
    if (action === "noti") return notificationModal();
    if (action === "theme") return themeModal();
    if (action === "icon") return appIconModal();
    if (action === "lang") return langModal();
  }

  function notificationModal() {
    var p = prefs();
    p.noti = p.noti || { patch: true, fav: true, event: true, comment: true };
    var items = [
      ["patch", "패치노트 알림"],
      ["fav", "즐겨찾기 알림"],
      ["event", "이벤트 알림"],
      ["comment", "댓글 알림"],
    ];
    var body = el("<div></div>");
    items.forEach(function (it) {
      var row = el(
        '<div class="switch-row"><span>' + it[1] + '</span><button class="switch' + (p.noti[it[0]] ? " on" : "") + '" role="switch" aria-label="' + it[1] + '"></button></div>'
      );
      qs(".switch", row).addEventListener("click", function (e) {
        p.noti[it[0]] = !p.noti[it[0]];
        e.currentTarget.classList.toggle("on", p.noti[it[0]]);
        savePrefs(p);
      });
      body.appendChild(row);
    });
    modal("알림 설정", body);
  }

  function themeModal() {
    var p = prefs();
    var body = el('<div class="option-grid"><button class="option" data-v="dark">다크</button><button class="option" data-v="light">라이트</button></div>');
    qsa("button", body).forEach(function (b) {
      if ((p.theme || "dark") === b.dataset.v) b.classList.add("active");
      b.addEventListener("click", function () {
        p.theme = b.dataset.v;
        savePrefs(p);
        applyTheme();
        qsa("button", body).forEach(function (x) {
          x.classList.toggle("active", x === b);
        });
        toast("테마를 변경했습니다.");
      });
    });
    modal("테마 변경", body);
  }

  function appIconModal() {
    var p = prefs();
    var icons = ["🏴‍☠️", "⚔️", "🔥", "⭐", "🧭", "🛡️", "🍖", "🌊"];
    var body = el("<div></div>");
    var grid = el('<div class="icon-choice"></div>');
    icons.forEach(function (ic) {
      var b = el("<button" + (p.appIcon === ic ? ' class="active"' : "") + ">" + ic + "</button>");
      b.addEventListener("click", function () {
        p.appIcon = ic;
        savePrefs(p);
        qsa("button", grid).forEach(function (x) {
          x.classList.toggle("active", x === b);
        });
      });
      grid.appendChild(b);
    });
    body.appendChild(grid);
    body.appendChild(el('<p class="hint">선택한 앱 아이콘은 바탕화면 바로가기 생성 시 적용됩니다.</p>'));
    var mk = el('<button class="btn btn-primary btn-block">바탕화면 바로가기 만들기</button>');
    mk.addEventListener("click", function () {
      createShortcut(prefs().appIcon || "🏴‍☠️");
    });
    body.appendChild(mk);
    modal("앱 아이콘 변경", body);
  }

  function createShortcut(icon) {
    if (window.__fppInstallPrompt) {
      window.__fppInstallPrompt.prompt();
      return;
    }
    var url = location.origin + "/fpp/index.html";
    var content =
      "[InternetShortcut]\r\nURL=" + url + "\r\nIconIndex=0\r\n";
    var blob = new Blob([content], { type: "text/plain" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "FPP v2 " + icon + ".url";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("바탕화면 바로가기를 생성했습니다.");
  }

  function langModal() {
    var p = prefs();
    var body = el('<div class="option-grid"><button class="option" data-v="ko">한국어</button><button class="option" data-v="en">English</button></div>');
    qsa("button", body).forEach(function (b) {
      if ((p.lang || "ko") === b.dataset.v) b.classList.add("active");
      b.addEventListener("click", function () {
        p.lang = b.dataset.v;
        savePrefs(p);
        qsa("button", body).forEach(function (x) {
          x.classList.toggle("active", x === b);
        });
        toast(b.dataset.v === "ko" ? "한국어로 설정했습니다." : "Language set to English.");
      });
    });
    modal("언어 변경", body);
  }

  /* ---------- 인증 / 프로필 ---------- */
  function userName(u) {
    return u.displayName || (u.email || "").split("@")[0] || "사용자";
  }
  function watchAuth() {
    var area = qs("#authArea");
    if (!area) return;
    if (!auth) {
      area.innerHTML = '<span class="badge">오프라인</span>';
      return;
    }
    auth.onAuthStateChanged(function (u) {
      area.innerHTML = "";
      if (!u) {
        var s = el('<a class="btn btn-ghost" href="login.html#signup">회원가입</a>');
        var l = el('<a class="btn btn-primary" href="login.html#login">로그인</a>');
        area.appendChild(s);
        area.appendChild(l);
        return;
      }
      syncFavsFromCloud(u.uid);
      var btn = el('<button class="icon-btn" id="btnProfile" aria-label="프로필" aria-expanded="false"></button>');
      var av = el(
        u.photoURL
          ? '<span class="avatar"><img alt="프로필" src="' + esc(u.photoURL) + '" style="width:100%;height:100%;object-fit:cover"></span>'
          : '<span class="avatar">' + esc(userName(u).slice(0, 1).toUpperCase()) + "</span>"
      );
      btn.appendChild(av);
      btn.addEventListener("click", function (e) {
        togglePopover(e.currentTarget, function () {
          return profilePopover(u);
        });
      });
      area.appendChild(btn);
      document.dispatchEvent(new CustomEvent("fpp:auth", { detail: u }));
    });
  }

  function countUserDocs(coll, field, uid) {
    if (!db) return Promise.resolve(0);
    return db
      .collection(coll)
      .where(field, "==", uid)
      .get()
      .then(function (s) {
        return s.size;
      })
      .catch(function () {
        return 0;
      });
  }

  function profilePopover(u) {
    var pop = el(
      '<div class="popover"><div class="profile-card">' +
        (u.photoURL
          ? '<span class="avatar"><img alt="프로필" src="' + esc(u.photoURL) + '" style="width:100%;height:100%;object-fit:cover"></span>'
          : '<span class="avatar">' + esc(userName(u).slice(0, 1).toUpperCase()) + "</span>") +
        "<b>" + esc(userName(u)) + "</b>" +
        '<div class="profile-stats"><div><b data-s="posts">-</b>게시글</div><div><b data-s="comments">-</b>댓글</div><div><b data-s="likes">-</b>좋아요</div></div>' +
        "</div>" +
        '<div class="menu-list"><button data-a="me">내 정보' + ICONS.chevron + '</button><button data-a="out">로그아웃' + ICONS.chevron + "</button></div></div>"
    );
    countUserDocs("boards", "authorUid", u.uid).then(function (n) {
      qs('[data-s="posts"]', pop).textContent = n;
    });
    Promise.all([
      countUserDocs("boardComments", "authorUid", u.uid),
      countUserDocs("eventComments", "authorUid", u.uid),
    ]).then(function (r) {
      qs('[data-s="comments"]', pop).textContent = r[0] + r[1];
    });
    var likedLocal = (function () {
      try {
        return Object.keys(JSON.parse(localStorage.getItem("fpp_liked_v2") || "{}")).length;
      } catch (e) {
        return 0;
      }
    })();
    qs('[data-s="likes"]', pop).textContent = likedLocal;

    qs('[data-a="me"]', pop).addEventListener("click", function () {
      closePopover();
      myInfoModal(u);
    });
    qs('[data-a="out"]', pop).addEventListener("click", function () {
      closePopover();
      auth.signOut().then(function () {
        toast("로그아웃되었습니다.");
        location.reload();
      });
    });
    return pop;
  }

  function myInfoModal(u) {
    var body = el("<div></div>");
    var avatarRow = el(
      '<div style="display:grid;justify-items:center;gap:8px;margin-bottom:16px">' +
        '<button class="avatar" id="chgPhoto" style="width:72px;height:72px;font-size:24px;cursor:pointer">' +
        (u.photoURL ? '<img alt="프로필" src="' + esc(u.photoURL) + '" style="width:100%;height:100%;object-fit:cover">' : esc(userName(u).slice(0, 1).toUpperCase())) +
        '</button><span class="hint" style="margin:0">프로필 아이콘을 선택해 변경</span></div>'
    );
    body.appendChild(avatarRow);

    var nick = el(
      '<div class="field"><label>닉네임</label><div style="display:flex;gap:8px"><input type="text" id="nickInput" value="' +
        esc(userName(u)) +
        '"><button class="btn" id="nickSave">변경</button></div></div>'
    );
    body.appendChild(nick);
    body.appendChild(
      el('<div class="field"><label>로그인 이메일</label><input type="text" value="' + esc(u.email || "Google 계정") + '" readonly></div>')
    );
    var del = el('<button class="btn btn-block" style="color:var(--nerf);border-color:var(--nerf)">탈퇴하기</button>');
    body.appendChild(del);
    var m = modal("내 정보", body);

    qs("#chgPhoto", body).addEventListener("click", function () {
      var icons = ["🏴‍☠️", "⚔️", "🔥", "⭐", "🧭", "🛡️", "🍖", "🌊"];
      var pickBody = el('<div class="icon-choice"></div>');
      icons.forEach(function (ic) {
        var b = el("<button>" + ic + "</button>");
        b.addEventListener("click", function () {
          var url =
            "data:image/svg+xml;utf8," +
            encodeURIComponent(
              '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" fill="#1c222c"/><text x="50%" y="58%" font-size="52" text-anchor="middle">' + ic + "</text></svg>"
            );
          u.updateProfile({ photoURL: url }).then(function () {
            toast("프로필 아이콘을 변경했습니다.");
            location.reload();
          });
        });
        pickBody.appendChild(b);
      });
      modal("프로필 아이콘 변경", pickBody);
    });
    qs("#nickSave", body).addEventListener("click", function () {
      var v = qs("#nickInput", body).value.trim();
      if (!v) return toast("닉네임을 입력해 주세요.");
      u.updateProfile({ displayName: v })
        .then(function () {
          if (db) db.collection("users").doc(u.uid).set({ nickname: v }, { merge: true });
          toast("닉네임을 변경했습니다.");
          location.reload();
        })
        .catch(function (e) {
          toast(e.message);
        });
    });
    del.addEventListener("click", function () {
      if (!confirm("정말 탈퇴하시겠습니까? 계정 정보가 삭제됩니다.")) return;
      u.delete()
        .then(function () {
          toast("탈퇴가 완료되었습니다.");
          location.href = "index.html";
        })
        .catch(function (e) {
          toast("재로그인 후 다시 시도해 주세요.");
          console.warn(e);
        });
    });
    return m;
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    window.__fppInstallPrompt = e;
  });

  /* ---------- 공용 리스트 렌더러 ---------- */
  function listRow(item, opts) {
    opts = opts || {};
    var badge = item.category
      ? '<span class="badge badge-patch">' + esc(item.category) + "</span>"
      : opts.badge
      ? '<span class="badge badge-patch">' + esc(opts.badge) + "</span>"
      : "";
    var row = el(
      '<button class="list-row"><div class="list-row-main">' +
        '<div class="row-line1">' + badge + '<span class="row-title">' + esc(item.title) + "</span></div>" +
        '<div class="row-line2"><span>' + esc(item.author) + "</span><span>" + esc(item.dateText) + "</span></div>" +
        "</div>" +
        (item.isNew ? '<span class="badge badge-new">NEW</span>' : "<span></span>") +
        "</button>"
    );
    return row;
  }

  function likeShareBar(kind, id, initial) {
    var likedMap = (function () {
      try {
        return JSON.parse(localStorage.getItem("fpp_liked_v2") || "{}");
      } catch (e) {
        return {};
      }
    })();
    var liked = !!likedMap[id];
    var bar = el(
      '<div class="detail-actions">' +
        '<button class="btn" id="btnLike">' + ICONS.heart + ' <span id="likeCnt">' + (initial || 0) + "</span></button>" +
        '<button class="btn" id="btnShare">' + ICONS.share + " 공유하기</button></div>"
    );
    var likeBtn = qs("#btnLike", bar);
    if (liked) likeBtn.style.color = "var(--nerf)";
    FPPData.likeCount(id).then(function (n) {
      qs("#likeCnt", bar).textContent = n;
    });
    likeBtn.addEventListener("click", function () {
      FPPData.toggleLike(id, liked)
        .then(function (n) {
          liked = !liked;
          likedMap[id] = liked;
          if (!liked) delete likedMap[id];
          localStorage.setItem("fpp_liked_v2", JSON.stringify(likedMap));
          likeBtn.style.color = liked ? "var(--nerf)" : "";
          qs("#likeCnt", bar).textContent = n;
        })
        .catch(function (e) {
          toast(e.message);
        });
    });
    qs("#btnShare", bar).addEventListener("click", function () {
      var url = location.href;
      if (navigator.share) {
        navigator.share({ title: document.title, url: url }).catch(function () {});
      } else {
        navigator.clipboard.writeText(url).then(function () {
          toast("링크를 복사했습니다.");
        });
      }
    });
    return bar;
  }

  function commentsSection(kind, id) {
    var wrap = el('<section class="comments"><h3 style="margin:0 0 12px;font-size:16px">댓글</h3><div class="comment-form"></div><div class="comment-list"></div></section>');
    var form = qs(".comment-form", wrap);
    var listNode = qs(".comment-list", wrap);

    function drawForm() {
      form.innerHTML = "";
      var u = auth && auth.currentUser;
      if (!u) {
        form.appendChild(el('<div class="state" style="padding:16px">댓글을 작성하려면 <a href="login.html#login" style="color:var(--brand);font-weight:800">로그인</a>이 필요합니다.</div>'));
        return;
      }
      var ta = el('<textarea rows="3" placeholder="댓글을 입력하세요"></textarea>');
      var btn = el('<button class="btn btn-primary" style="justify-self:end">등록</button>');
      btn.addEventListener("click", function () {
        var v = ta.value.trim();
        if (!v) return toast("내용을 입력해 주세요.");
        btn.disabled = true;
        FPPData.addComment(kind, id, v)
          .then(function () {
            ta.value = "";
            draw();
          })
          .catch(function (e) {
            toast(e.message);
          })
          .then(function () {
            btn.disabled = false;
          });
      });
      form.appendChild(ta);
      form.appendChild(btn);
    }
    function draw() {
      listNode.innerHTML = loading("댓글 불러오는 중...");
      FPPData.comments(kind, id)
        .then(function (rows) {
          if (!rows.length) {
            listNode.innerHTML = empty("첫 댓글을 남겨보세요", "");
            return;
          }
          listNode.innerHTML = "";
          rows.forEach(function (c) {
            listNode.appendChild(
              el(
                '<div class="comment"><span class="avatar" style="width:34px;height:34px">' +
                  (c.photo ? '<img alt="" src="' + esc(c.photo) + '" style="width:100%;height:100%;object-fit:cover">' : esc(c.author.slice(0, 1))) +
                  '</span><div><span class="who">' + esc(c.author) + '</span> <span class="when">' + esc(c.dateText) + "</span><p>" + esc(c.text) + "</p></div></div>"
              )
            );
          });
        })
        .catch(function (e) {
          listNode.innerHTML = failed(e);
        });
    }
    drawForm();
    draw();
    if (auth) auth.onAuthStateChanged(drawForm);
    return wrap;
  }

  window.FPPUI = {
    esc: esc,
    el: el,
    qs: qs,
    qsa: qsa,
    icons: ICONS,
    isMobile: isMobile,
    toast: toast,
    prefs: prefs,
    savePrefs: savePrefs,
    applyTheme: applyTheme,
    favsAll: favsAll,
    isFav: isFav,
    toggleFav: toggleFav,
    loading: loading,
    empty: empty,
    failed: failed,
    renderBanner: renderBanner,
    renderPageBanner: renderPageBanner,
    mountShell: mountShell,
    modal: modal,
    openSetting: openSetting,
    listRow: listRow,
    likeShareBar: likeShareBar,
    commentsSection: commentsSection,
    closePopover: closePopover,
  };
})();
