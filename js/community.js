(function () {
  // 1. 상수 및 DOM 요소 정의
  const UI = FPPUI;
  const Data = FPPData;
  const appElement = UI.qs("#app");
  const bannerElement = UI.qs("#banner");

  /**
   * 브라우저의 URL 해시를 파싱하여 현재 페이지와 쿼리 매개변수를 반환합니다.
   * @example "#board-detail?id=123" -> { page: "board-detail", params: { id: "123" } }
   */
  function parseHashRoute() {
    const [rawPage, rawQuery] = (location.hash || "#home").slice(1).split("?");
    const params = {};

    if (rawQuery) {
      rawQuery.split("&").forEach(paramPair => {
        const [key, value] = paramPair.split("=");
        if (key) {
          params[key] = decodeURIComponent(value || "");
        }
      });
    }

    return {
      page: rawPage || "home",
      params: params
    };
  }

  /**
   * 지정된 해시 경로로 페이지를 이동시킵니다.
   */
  function navigateTo(path) {
    location.hash = path;
  }

  /**
   * 데이터를 리스트(목록형) 구조의 DOM 요소로 생성합니다.
   */
  function createListView(list, kind) {
    const listContainer = UI.el('<div class="list"></div>');
    const badgeMap = { board: "게시판", event: "이벤트", patch: "패치노트" };
    const badgeText = badgeMap[kind] || "커뮤니티";

    list.forEach(item => {
      const listRow = UI.listRow(item, { badge: badgeText });
      listRow.onclick = () => {
        navigateTo(`${kind}-detail?id=${encodeURIComponent(item.id)}`);
      };
      listContainer.appendChild(listRow);
    });

    return listContainer;
  }

  /**
   * 데이터를 카드(그리드형) 구조의 DOM 요소로 생성합니다.
   */
  function createCardView(list, kind) {
    const cardGrid = UI.el('<div class="card-grid"></div>');

    list.forEach(item => {
      const category = item.category || kind;
      const subText = item.excerpt || item.dateText;
      
      const card = UI.el(`
        <button class="event-card">
          <div class="event-thumb"></div>
          <div class="event-body">
            <span class="badge">${UI.esc(category)}</span>
            <h4>${UI.esc(item.title)}</h4>
            <p>${UI.esc(subText)}</p>
          </div>
        </button>
      `);

      if (item.thumb) {
        const safeThumbUrl = item.thumb.replace(/'/g, "%27");
        UI.qs(".event-thumb", card).style.background = `center/cover url('${safeThumbUrl}')`;
      }

      card.onclick = () => {
        navigateTo(`${kind}-detail?id=${encodeURIComponent(item.id)}`);
      };

      cardGrid.appendChild(card);
    });

    return cardGrid;
  }

  /**
   * 상단 필터 및 정렬 바를 생성하고 각 요소의 변경 이벤트를 바인딩합니다.
   */
  function createFilterBar(kind, onFilterChange) {
    const filterWrap = UI.el(`
      <div class="filters">
        <div class="filter-row">
          <div class="chips"></div>
          <select class="select-sort">
            <option value="date">최근등록순</option>
            <option value="likes">좋아요순</option>
            <option value="old">오래된순</option>
          </select>
          <div class="toggle-group">
            <button data-view="list" class="btn-view-toggle active">목록형</button>
            <button data-view="card" class="btn-view-toggle">카드형</button>
          </div>
        </div>
      </div>
    `);

    const chipLabels = kind === "board" 
      ? ["전체", "자유", "정보", "질문", "자랑"] 
      : ["전체", "진행중", "종료됨"];

    const chipsContainer = UI.qs(".chips", filterWrap);
    const sortSelect = UI.qs(".select-sort", filterWrap);

    const triggerChange = () => {
      const activeChipText = UI.qs(".chip.active", filterWrap).textContent;
      const currentSort = sortSelect.value;
      const currentView = UI.qs(".btn-view-toggle.active", filterWrap).dataset.view;
      onFilterChange(activeChipText, currentSort, currentView);
    };

    chipLabels.forEach((label, index) => {
      const chipButton = UI.el(`<button class="chip ${!index ? 'active' : ''}">${label}</button>`);
      chipButton.onclick = () => {
        UI.qsa(".chip", filterWrap).forEach(chip => chip.classList.remove("active"));
        chipButton.classList.add("active");
        triggerChange();
      };
      chipsContainer.appendChild(chipButton);
    });

    sortSelect.onchange = () => triggerChange();

    UI.qsa(".btn-view-toggle", filterWrap).forEach(toggleButton => {
      toggleButton.onclick = () => {
        UI.qsa(".btn-view-toggle", filterWrap).forEach(btn => btn.classList.remove("active"));
        toggleButton.classList.add("active");
        triggerChange();
      };
    });

    return filterWrap;
  }

  /**
   * 커뮤니티 대분류(패치노트/게시판/이벤트) 메인 목록 화면을 렌더링합니다.
   */
  function renderListingPage(kind, title, dataPromise) {
    UI.renderPageBanner(bannerElement, title.toUpperCase(), "FPP v2 커뮤니티");
    appElement.innerHTML = "";

    const wrap = UI.el(`
      <div class="container">
        <div class="box">
          <div class="box-head">
            <h1 class="box-title">${title}</h1>
          </div>
          <div id="filters"></div>
          <div id="list"></div>
        </div>
      </div>
    `);
    appElement.appendChild(wrap);

    const filterContainer = UI.qs("#filters", wrap);
    const listContainer = UI.qs("#list", wrap);

    dataPromise
      .then(allItems => {
        const drawFilteredList = (category, sortType, viewType) => {
          let filteredList = allItems.filter(item => {
            if (category === "전체") return true;
            if (kind === "event") {
              return category === "진행중" ? Data.isOngoing(item) : !Data.isOngoing(item);
            }
            return String(item.category || "").indexOf(category) >= 0;
          });

          if (sortType === "likes") {
            filteredList.sort((a, b) => b.likes - a.likes);
          } else if (sortType === "old") {
            filteredList = [...filteredList].reverse();
          }

          listContainer.innerHTML = "";
          const contentDOM = (viewType === "card") 
            ? createCardView(filteredList, kind) 
            : createListView(filteredList, kind);
            
          listContainer.appendChild(contentDOM);
        };

        const initialView = (kind === "event") ? "card" : "list";
        filterContainer.appendChild(createFilterBar(kind, drawFilteredList));
        drawFilteredList("전체", "date", initialView);
      })
      .catch(error => {
        listContainer.innerHTML = UI.failed(error);
      });
  }

  /**
   * 커뮤니티 아이템 상세 정보를 로드하고 상세 보기 화면을 렌더링합니다.
   */
  function renderDetailPage(kind, id) {
    const collectionMap = { patch: "patchNotes", board: "boards", event: "events" };
    const collectionName = collectionMap[kind] || "boards";

    UI.renderPageBanner(bannerElement, kind.toUpperCase(), "상세 내용을 확인하세요");
    appElement.innerHTML = UI.loading();

    Data.doc(collectionName, id)
      .then(docData => {
        if (!docData) {
          appElement.innerHTML = UI.empty("문서를 찾을 수 없습니다");
          return;
        }

        const category = docData.category || kind;
        const bodyContent = docData.content || UI.esc(docData.excerpt || "내용이 없습니다.");

        const detailWrap = UI.el(`
          <div class="container">
            <article class="box">
              <button class="back-link">‹ 목록으로</button>
              <div class="detail-head">
                <span class="badge">${UI.esc(category)}</span>
                <h1>${UI.esc(docData.title)}</h1>
                <div class="detail-meta">
                  <span>${UI.esc(docData.author)}</span>
                  <span>${UI.esc(docData.dateText)}</span>
                </div>
              </div>
              <div class="detail-body"></div>
            </article>
          </div>
        `);

        UI.qs(".detail-body", detailWrap).innerHTML = bodyContent;
        UI.qs(".back-link", detailWrap).onclick = () => navigateTo(kind);

        const articleElement = UI.qs("article", detailWrap);
        articleElement.appendChild(UI.likeShareBar(kind, id, docData.likes));
        
        if (kind !== "patch") {
          articleElement.appendChild(UI.commentsSection(kind, id));
        }

        appElement.innerHTML = "";
        appElement.appendChild(detailWrap);
        
        Data.bumpView(kind, id);
      })
      .catch(error => {
        appElement.innerHTML = UI.failed(error);
      });
  }

  /**
   * 메인 셸의 활성화 메뉴 탭 상태를 변경합니다.
   */
  function updateShellActiveMenu(page) {
    let activeTab = "chome";
    if (page.startsWith("patch")) activeTab = "patch";
    else if (page.startsWith("board")) activeTab = "board";
    else if (page.startsWith("event")) activeTab = "event";

    UI.mountShell({ menu: "community", active: activeTab });
  }

  /**
   * 파싱된 URL 해시 값에 매칭되는 화면을 그려주는 핵심 라우터 함수입니다.
   */
  function handleRouting() {
    const route = parseHashRoute();
    updateShellActiveMenu(route.page);

    switch (route.page) {
      case "patch":
        renderListingPage("patch", "패치노트", Data.patches());
        break;
      case "patch-detail":
        renderDetailPage("patch", route.params.id);
        break;
        
      case "board":
        renderListingPage("board", "게시판", Data.boards());
        break;
      case "board-detail":
        renderDetailPage("board", route.params.id);
        break;
        
      case "event":
        renderListingPage("event", "이벤트", Data.events());
        break;
      case "event-detail":
        renderDetailPage("event", route.params.id);
        break;

      default:
        // 어떤 해시도 매칭되지 않을 때 노출할 기본 커뮤니티 홈 대시보드
        UI.renderPageBanner(bannerElement, "COMMUNITY", "패치노트 · 게시판 · 이벤트");
        appElement.innerHTML = `
          <div class="container">
            <div class="home-grid" style="grid-template-columns:1fr">
              <section class="box">
                <div class="box-head">
                  <h1 class="box-title">커뮤니티</h1>
                </div>
                <div class="state">
                  <strong>FPP 커뮤니티에 오신 것을 환영합니다.</strong>
                  패치노트와 게시판, 이벤트 소식을 확인해 보세요.
                </div>
              </section>
            </div>
          </div>
        `;
        break;
    }
  }

