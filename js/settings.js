(function () {
  // 1. 상수 및 DOM 요소 정의
  const UI = FPPUI;
  const appElement = UI.qs("#settingsApp");

  // 2. 초기 레이아웃 설정
  UI.mountShell({ menu: "main", active: "" });

  /**
   * 설정 페이지의 기본 레이아웃 구조를 렌더링합니다.
   */
  function renderSettingsPage() {
    // 템플릿 리터럴을 사용하여 HTML 구조를 가독성 있게 표현
    appElement.innerHTML = `
      <div class="container">
        <div class="box">
          <div class="box-head">
            <h1 class="box-title">설정</h1>
          </div>
          <div class="settings-list">
            <button class="btn-setting" data-action="noti">
              <span>알림 설정</span><span>›</span>
            </button>
            <button class="btn-setting" data-action="theme">
              <span>테마 변경</span><span>›</span>
            </button>
            <button class="btn-setting" data-action="icon">
              <span>앱 아이콘 변경</span><span>›</span>
            </button>
            <button class="btn-setting" data-action="lang">
              <span>언어 변경</span><span>›</span>
            </button>
            <button class="btn-link" data-href="community.html#patch">
              <span>공지사항</span><span>›</span>
            </button>
          </div>
        </div>
      </div>
    `;

    bindEvents();
  }

  /**
   * 설정 메뉴 아이템들의 클릭 이벤트를 바인딩합니다.
   */
  function bindEvents() {
    // [이벤트] 일반 설정 변경 버튼 처리
    UI.qsa(".btn-setting", appElement).forEach(button => {
      button.onclick = () => {
        const actionType = button.dataset.action;
        UI.openSetting(actionType);
      };
    });

    // [이벤트] 외부 링크(공지사항 등) 이동 버튼 처리
    UI.qsa(".btn-link", appElement).forEach(button => {
      button.onclick = () => {
        const targetUrl = button.dataset.href;
        if (targetUrl) {
          location.href = targetUrl;
        }
      };
    });
  }

  // 최초 실행
  renderSettingsPage();
})();
