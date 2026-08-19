/* FPP v2 — Firestore 데이터 레이어 (유연한 필드/컬렉션 매핑)
   기존 데이터를 그대로 읽어 쓰며, 컬렉션/필드 이름이 다를 수 있으므로 후보를 순차 탐색한다. */
(function () {
  var db = window.FB && FB.db;

  /* ---------- 공통 유틸 ---------- */
  function pick(o, keys, dflt) {
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (o && o[k] !== undefined && o[k] !== null && o[k] !== "") return o[k];
    }
    return dflt;
  }
  function toDate(v) {
    if (!v) return null;
    if (typeof v.toDate === "function") return v.toDate();
    if (v instanceof Date) return v;
    if (typeof v === "number") return new Date(v);
    var d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }
  function fmtDate(d) {
    if (!d) return "-";
    var p = function (n) {
      return n < 10 ? "0" + n : "" + n;
    };
    return d.getFullYear() + "." + p(d.getMonth() + 1) + "." + p(d.getDate());
  }
  function isNew(d, days) {
    if (!d) return false;
    return Date.now() - d.getTime() < (days || 3) * 86400000;
  }
  function stripHtml(html) {
    if (!html) return "";
    var t = document.createElement("div");
    t.innerHTML = String(html);
    return (t.textContent || "").replace(/\s+/g, " ").trim();
  }

  var cache = {};
  function memo(key, fn) {
    if (cache[key]) return cache[key];
    cache[key] = fn().catch(function (e) {
      delete cache[key];
      throw e;
    });
    return cache[key];
  }

  /* 컬렉션 후보 중 데이터가 존재하는 첫 컬렉션을 사용 */
  var resolved = {};
  function fetchFirst(candidates, limit) {
    if (!db) return Promise.reject(new Error("Firebase 연결 실패"));
    var key = candidates.join("|");
    var order = resolved[key] ? [resolved[key]] : candidates;
    var i = 0;
    function attempt() {
      if (i >= order.length) return Promise.resolve([]);
      var name = order[i++];
      var q = db.collection(name);
      if (limit) q = q.limit(limit);
      return q
        .get()
        .then(function (snap) {
          if (snap.empty) return attempt();
          resolved[key] = name;
          return snap.docs.map(function (d) {
            var o = d.data() || {};
            o.__id = d.id;
            o.__coll = name;
            return o;
          });
        })
        .catch(function () {
          return attempt();
        });
    }
    return attempt();
  }

  var COLL = {
    banners: ["banners"],
    eventBanners: ["eventBanners"],
    characters: ["characters"],
    supportCharacters: ["supportCharacters"],
    patches: ["patchNotes", "patches", "patchnotes", "patch"],
    pvp: ["pvpPatches", "pvpPatch", "pvp", "balancePatches", "patchCharacters"],
    events: ["events"],
    boards: ["boards", "posts", "community"],
    support: ["notices", "support", "supports", "faq", "customerCenter", "helpCenter"],
    boardComments: ["boardComments"],
    eventComments: ["eventComments"],
    patchComments: ["patchComments"],
  };

  /* ---------- 노멀라이저 ---------- */
  function normBanner(b) {
    return {
      id: b.__id,
      image: pick(b, ["imageUrl", "image", "url", "src", "bannerUrl"], ""),
      link: pick(b, ["link", "linkUrl", "href"], ""),
      page: String(pick(b, ["page", "target", "type"], "main")).toLowerCase(),
      order: Number(pick(b, ["order", "sort", "index"], 999)),
      active:
        pick(b, ["isActive"], true) !== false &&
        pick(b, ["visible"], true) !== false &&
        pick(b, ["pendingDelete"], false) !== true,
    };
  }
  function normChar(c) {
    return {
      id: pick(c, ["id", "charId"], c.__id),
      docId: c.__id,
      coll: c.__coll,
      name: pick(c, ["name", "title", "krName"], "이름 없음"),
      image: pick(c, ["imageUrl", "image", "thumbnail", "thumb", "icon", "portrait", "img"], ""),
      grade: pick(c, ["grade", "rarity", "tier", "star"], ""),
      element: pick(c, ["element", "attribute", "attr", "property"], ""),
      type: pick(c, ["type", "role", "class", "category"], ""),
      visible: pick(c, ["visible"], true) !== false,
      skills: pick(c, ["skills"], []) || [],
      supportSkills: pick(c, ["supportSkills"], []) || [],
      recentPatches: pick(c, ["recentPatches"], []) || [],
      tips: pick(c, ["tips"], []) || [],
      likes: Number(pick(c, ["likes", "likeCount"], 0)),
    };
  }
  function normPost(p) {
    var d = toDate(pick(p, ["createdAt", "publishedAt", "date", "createdDate", "writtenAt", "updatedAt"], null));
    var end = toDate(pick(p, ["endAt", "endDate", "endsAt", "period_end", "finishAt"], null));
    var start = toDate(pick(p, ["startAt", "startDate", "startsAt", "period_start"], null));
    var content = pick(p, ["content", "body", "html", "contentHtml", "text", "desc", "description"], "");
    return {
      id: p.__id,
      coll: p.__coll,
      title: pick(p, ["title", "subject", "name", "headline"], "제목 없음"),
      category: pick(p, ["category", "prefix", "boardType", "tag", "type", "patchType"], ""),
      author: pick(p, ["authorName", "publishedName", "author", "nickname", "writer", "userName"], "운영팀"),
      authorUid: pick(p, ["authorUid", "uid", "userId"], ""),
      authorPhoto: pick(p, ["authorPhoto", "photoURL", "avatar"], ""),
      thumb: pick(p, ["thumbnail", "imageUrl", "thumb", "image", "coverUrl", "bannerUrl"], ""),
      content: content,
      excerpt: stripHtml(content).slice(0, 120),
      likes: Number(pick(p, ["likes", "likeCount", "like"], 0)),
      views: Number(pick(p, ["views", "viewCount"], 0)),
      comments: Number(pick(p, ["commentCount", "comments"], 0)),
      createdAt: d,
      dateText: fmtDate(d),
      startAt: start,
      endAt: end,
      isNew: isNew(d, 3),
      pinned: pick(p, ["pinned", "isPinned", "isNotice"], false) === true,
      visible: pick(p, ["visible", "isActive"], true) !== false,
      raw: p,
    };
  }
  function sortByDateDesc(a, b) {
    return (b.createdAt ? b.createdAt.getTime() : 0) - (a.createdAt ? a.createdAt.getTime() : 0);
  }

  /* ---------- 조회 API ---------- */
  var API = {
    pick: pick,
    toDate: toDate,
    fmtDate: fmtDate,
    stripHtml: stripHtml,

    banners: function (page) {
      return memo("banners:" + (page || "main"), function () {
        var want = (page || "main").toLowerCase();
        return fetchFirst(want === "main" ? COLL.banners : COLL.eventBanners).then(function (rows) {
          return rows.length ? rows : fetchFirst(COLL.banners);
        });
      }).then(function (rows) {
        var list = rows.map(normBanner).filter(function (b) {
          return b.active && b.image;
        });
        var want = (page || "main").toLowerCase();
        var filtered = list.filter(function (b) {
          return b.page === want || b.page === "all" || b.page === "";
        });
        if (!filtered.length && want === "main") filtered = list;
        return filtered.sort(function (a, b) {
          return a.order - b.order;
        });
      });
    },

    characters: function (kind) {
      var support = kind === "support";
      return memo(support ? "supportChars" : "chars", function () {
        return fetchFirst(support ? COLL.supportCharacters : COLL.characters);
      }).then(function (rows) {
        return rows
          .map(normChar)
          .filter(function (c) {
            return c.visible;
          })
          .sort(function (a, b) {
            return String(a.name).localeCompare(String(b.name), "ko");
          });
      });
    },

    patches: function () {
      return memo("patches", function () {
        return fetchFirst(COLL.patches);
      }).then(function (rows) {
        return rows
          .map(normPost)
          .filter(function (p) {
            return p.visible;
          })
          .sort(sortByDateDesc);
      });
    },

    events: function () {
      return memo("events", function () {
        return fetchFirst(COLL.events);
      }).then(function (rows) {
        return rows
          .map(normPost)
          .filter(function (p) {
            return p.visible;
          })
          .sort(sortByDateDesc);
      });
    },

    boards: function () {
      return memo("boards", function () {
        return fetchFirst(COLL.boards);
      }).then(function (rows) {
        return rows
          .map(normPost)
          .filter(function (p) {
            return p.visible;
          })
          .sort(sortByDateDesc);
      });
    },

    support: function () {
      return memo("support", function () {
        return fetchFirst(COLL.support);
      }).then(function (rows) {
        return rows.map(normPost).sort(sortByDateDesc);
      });
    },

    /* PvP 패치: 전용 컬렉션이 있으면 사용, 없으면 캐릭터의 recentPatches에서 파생 */
    pvpPatches: function () {
      return memo("pvp", function () {
        return fetchFirst(COLL.pvp)
          .then(function (rows) {
            if (rows.length) {
              return rows.map(function (r) {
                return {
                  charId: pick(r, ["charId", "characterId", "id"], r.__id),
                  name: pick(r, ["charName", "name", "character"], ""),
                  image: pick(r, ["imageUrl", "image", "icon", "thumbnail"], ""),
                  type: API.patchType(pick(r, ["patchType", "type", "kind", "change"], "")),
                  desc: pick(r, ["desc", "content", "description", "detail"], ""),
                  date: toDate(pick(r, ["createdAt", "date", "patchedAt", "updatedAt"], null)),
                };
              });
            }
            return null;
          })
          .then(function (list) {
            if (list) return API.attachChars(list);
            return API.characters().then(function (chars) {
              var out = [];
              chars.forEach(function (c) {
                (c.recentPatches || []).forEach(function (p) {
                  if (typeof p === "string") {
                    out.push({
                      charId: c.id,
                      name: c.name,
                      image: c.image,
                      type: API.patchType(p),
                      desc: p,
                      date: null,
                      char: c,
                    });
                  } else if (p) {
                    out.push({
                      charId: c.id,
                      name: c.name,
                      image: c.image,
                      type: API.patchType(pick(p, ["type", "patchType", "kind"], pick(p, ["desc", "content"], ""))),
                      desc: pick(p, ["desc", "content", "text", "detail"], ""),
                      date: toDate(pick(p, ["date", "createdAt", "updatedAt"], null)),
                      char: c,
                    });
                  }
                });
              });
              return out;
            });
          });
      });
    },

    attachChars: function (list) {
      return Promise.all([API.characters(), API.characters("support")]).then(function (r) {
        var map = {};
        r[0].concat(r[1]).forEach(function (c) {
          map[String(c.id)] = c;
          map[String(c.docId)] = c;
          map[String(c.name)] = c;
        });
        list.forEach(function (p) {
          var c = map[String(p.charId)] || map[String(p.name)];
          if (c) {
            p.char = c;
            if (!p.name) p.name = c.name;
            if (!p.image) p.image = c.image;
          }
        });
        return list;
      });
    },

    patchType: function (v) {
      var s = String(v || "").toLowerCase();
      if (/버프|buff|상향|up/.test(s)) return "buff";
      if (/너프|nerf|하향|down/.test(s)) return "nerf";
      if (/기능|수정|fix|change|리워크|rework/.test(s)) return "fix";
      return "fix";
    },
    patchTypeLabel: function (t) {
      return t === "buff" ? "버프" : t === "nerf" ? "너프" : "기능수정";
    },

    /* 단일 문서 */
    doc: function (coll, id) {
      if (!db) return Promise.reject(new Error("Firebase 연결 실패"));
      return db
        .collection(coll)
        .doc(id)
        .get()
        .then(function (s) {
          if (!s.exists) return null;
          var o = s.data() || {};
          o.__id = s.id;
          o.__coll = coll;
          return normPost(o);
        });
    },

    /* 진행중 이벤트 여부 */
    isOngoing: function (ev) {
      var now = Date.now();
      var status = String(pick(ev.raw || {}, ["status", "state"], "")).toLowerCase();
      if (/end|종료|closed/.test(status)) return false;
      if (/ing|진행|open|active/.test(status)) return true;
      if (ev.endAt) return ev.endAt.getTime() >= now;
      if (ev.startAt) return ev.startAt.getTime() <= now;
      return true;
    },

    /* ---------- 좋아요 ---------- */
    likeCount: function (id) {
      if (!db) return Promise.resolve(0);
      return db
        .collection("likes")
        .doc(String(id))
        .get()
        .then(function (s) {
          return s.exists ? Number(s.data().count || 0) : 0;
        })
        .catch(function () {
          return 0;
        });
    },
    toggleLike: function (id, liked) {
      if (!db) return Promise.reject(new Error("Firebase 연결 실패"));
      var ref = db.collection("likes").doc(String(id));
      return ref
        .set(
          { count: firebase.firestore.FieldValue.increment(liked ? -1 : 1) },
          { merge: true }
        )
        .then(function () {
          return API.likeCount(id);
        });
    },

    /* ---------- 댓글 ---------- */
    commentColl: function (kind) {
      return kind === "event" ? "eventComments" : kind === "patch" ? "patchComments" : "boardComments";
    },
    commentField: function (kind) {
      return kind === "event" ? "eventId" : kind === "patch" ? "patchId" : "boardId";
    },
    comments: function (kind, id) {
      if (!db) return Promise.reject(new Error("Firebase 연결 실패"));
      return db
        .collection(API.commentColl(kind))
        .where(API.commentField(kind), "==", String(id))
        .get()
        .then(function (snap) {
          return snap.docs
            .map(function (d) {
              var o = d.data() || {};
              var dt = toDate(o.createdAt);
              return {
                id: d.id,
                text: pick(o, ["content", "text", "comment", "body"], ""),
                author: pick(o, ["authorName", "author", "nickname"], "익명"),
                photo: pick(o, ["authorPhoto", "photoURL", "avatar"], ""),
                uid: pick(o, ["authorUid", "uid"], ""),
                createdAt: dt,
                dateText: dt ? fmtDate(dt) : "",
              };
            })
            .sort(function (a, b) {
              return (a.createdAt ? a.createdAt.getTime() : 0) - (b.createdAt ? b.createdAt.getTime() : 0);
            });
        });
    },
    addComment: function (kind, id, text) {
      var u = FB.auth && FB.auth.currentUser;
      if (!u) return Promise.reject(new Error("로그인이 필요합니다."));
      var payload = {
        content: text,
        authorUid: u.uid,
        authorName: u.displayName || (u.email || "").split("@")[0] || "사용자",
        authorPhoto: u.photoURL || "",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        likedBy: [],
        dislikedBy: [],
      };
      payload[API.commentField(kind)] = String(id);
      return db.collection(API.commentColl(kind)).add(payload);
    },

    /* ---------- 조회수 ---------- */
    bumpView: function (kind, id) {
      if (!db) return Promise.resolve();
      var coll = kind === "event" ? "eventViews" : kind === "patch" ? "patchViews" : "boardViews";
      return db
        .collection(coll)
        .doc(String(id))
        .set({ count: firebase.firestore.FieldValue.increment(1) }, { merge: true })
        .catch(function () {});
    },
  };

  window.FPPData = API;
})();
