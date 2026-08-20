(function () {
  // 1. 상수 및 상태 관리 정의
  const UI = FPPUI;
  const Data = FPPData;
  
  const appElement = UI.qs("#app");
  const bannerElement = UI.qs("#banner");
  
  const state = { 
    currentQuery: "" 
  };

  // 2. 초기 레이아웃 초기화
  UI.mountShell({ menu: "main", active: "support" });
  UI.renderPageBanner(bannerElement, "SUPPORT", "도움이 필요하신가요?");

  /**
   * 메인 화면(고객센터 목록 및 필터)을 렌더링합니다.
   */
  function renderMainPage() {
    appElement.innerHTML = "";

    // 메인 컨테이너 구조 생성
    const container = UI.el(`
      <div class="container">
        <div class="box">
          <div class="box-head">
            <h1 class="box-title">고객센터</h1>
          </div>
          <div class="filter-row">
            <div class="search-wrap">
              <input type="search" placeholder="궁금한 내용을 검색해 보세요">
              <button class="btn btn-primary btn-search">검색</button>
            </div>
            <button class="btn btn-inquiry">1:1 문의</button>
            <button class="btn btn-my-inquiries">나의 문의</button>
          </div>
          <div id="supportList" class="list borderless"></div>
        </div>
      </div>
    `);
    appElement.appendChild(container);

    // 주요 DOM 요소 선택
    const searchInput = UI.qs("input", container);
    const searchButton = UI.qs(".btn-search", container);
    const inquiryButton = UI.qs(".btn-inquiry", container);
    const myInquiriesButton = UI.qs(".btn-my-inquiries", container);
    const listContainer = UI.qs("#supportList", container);

    /**
     * 데이터를 받아 필터링 후 목록 화면에 그려줍니다.
     */
    function drawList(rows) {
      // 검색어 필터링 리팩토링
      const filteredRows = rows.filter(row => {
        if (!state.currentQuery) return true;
        
        const targetText = `${row.title} ${row.excerpt}`.toLowerCase();
        return targetText.indexOf(state.currentQuery.toLowerCase()) >= 0;
      });

      listContainer.innerHTML = "";

      if (!filteredRows.length) {
        listContainer.innerHTML = UI.empty("등록된 안내가 없습니다");
        return;
      }

      // 목록 아이템 생성 및 이벤트 바인딩
      filteredRows.forEach(rowData => {
        const listRow = UI.listRow(rowData, { badge: "고객센터" });
        listRow.onclick = () => renderDetailPage(rowData.id);
        listContainer.appendChild(listRow);
      });
    }

    // 초기 데이터 로드 및 이벤트 바인딩
    Data.support()
      .then(rows => {
        drawList(rows);

        // [이벤트] 검색 버튼 클릭
        searchButton.onclick = () => {
          state.currentQuery = searchInput.value.trim();
          drawList(rows);
        };

        // [이벤트] 1:1 문의 버튼 클릭
        inquiryButton.onclick = () => handleOpenInquiryModal();

        // [이벤트] 나의 문의 버튼 클릭
        myInquiriesButton.onclick = () => handleFetchMyInquiries(drawList);
      })
      .catch(error => {
        listContainer.innerHTML = UI.failed(error);
      });
  }

  /**
   * 1:1 문의 모달 팝업을 열고 등록 프로세스를 처리합니다.
   */
  function handleOpenInquiryModal() {
    const currentUser = FB.auth && FB.auth.currentUser;
    if (!currentUser) {
      return UI.toast("1:1 문의는 로그인 후 이용할 수 있습니다.");
    }

    const modalBody = UI.el(`
      <div>
        <div class="field">
          <label>제목</label>
          <input id="inqTitle" type="text">
        </div>
        <div class="field">
          <label>내용</label>
          <textarea id="inqBody" rows="6"></textarea>
        </div>
        <button class="btn btn-primary btn-block">문의 등록</button>
      </div>
    `);

    const inquiryModal = UI.modal("1:1 문의", modalBody);
    const submitButton = UI.qs("button", modalBody);

    // 문의 제출 이벤트
    submitButton.onclick = () => {
      const title = UI.qs("#inqTitle", modalBody).value.trim();
      const content = UI.qs("#inqBody", modalBody).value.trim();

      if (!title || !content) {
        return UI.toast("제목과 내용을 입력해 주세요.");
      }

      FB.db.collection("supportInquiries")
        .add({
          title: title,
          content: content,
          authorUid: currentUser.uid,
          authorName: currentUser.displayName || currentUser.email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          status: "접수"
        })
        .then(() => {
          inquiryModal.close();
          UI.toast("문의가 접수되었습니다.");
        });
    };
  }

  /**
   * 내가 작성한 1:1 문의 목록을 조회하여 리스트를 갱신합니다.
   */
  function handleFetchMyInquiries(callbackDrawList) {
    const currentUser = FB.auth && FB.auth.currentUser;
    if (!currentUser) {
      return UI.toast("로그인 후 나의 문의를 확인할 수 있습니다.");
    }

    FB.db.collection("supportInquiries")
      .where("authorUid", "==", currentUser.uid)
      .get()
      .then(snapshot => {
        const myInquiries = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            excerpt: data.status || "접수",
            author: data.authorName || "나",
            dateText: ""
          };
        });
        
        callbackDrawList(myInquiries);
      });
  }

  /**
   * 공지사항 및 안내 상세 페이지를 렌더링합니다.
   * @param {string} id - 상세 조회할 문서 ID
   */
  function renderDetailPage(id) {
    Data.doc("notices", id).then(docData => {
      if (!docData) {
        return UI.toast("상세 내용을 찾을 수 없습니다.");
      }

      const safeTitle = UI.esc(docData.title);
      const safeDate = UI.esc(docData.dateText);
      const detailContent = docData.content || UI.esc(docData.excerpt);

      appElement.innerHTML = `
        <div class="container">
          <article class="box">
            <button class="back-link">‹ 고객센터 목록</button>
            <div class="detail-head">
              <h1>${safeTitle}</h1>
              <div class="detail-meta">${safeDate}</div>
            </div>
            <div class="detail-body">${detailContent}</div>
          </article>
        </div>
      `;

      UI.qs(".back-link").onclick = renderMainPage;
    });
  }

  // 최초 실행
  renderMainPage();
})();
