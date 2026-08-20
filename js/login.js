(function () {
  // 1. 상수 및 상태 관리 정의
  const UI = FPPUI;
  const appElement = UI.qs("#authApp");

  // 페이지 상태 초기화 (hash 기반 상태 관리)
  let currentMode = (location.hash || "#login").slice(1); // "login" 또는 "signup"
  let isEmailFormVisible = false; // 회원가입 단계에서 이메일 입력 폼 노출 여부

  /**
   * 화면 모드(로그인/회원가입)에 따른 HTML 구조를 반환합니다.
   */
  function generateAuthTemplate() {
    const isSignup = currentMode === "signup";

    // 템플릿 마크업 조립
    return `
      <section class="auth-card">
        <div class="auth-logo">
          <div class="mark">FPP</div>
          <b>FPP v2</b>
        </div>
        
        <h1 class="auth-title">${isSignup ? "회원가입" : "로그인"}</h1>
        
        <!-- 인증 폼 -->
        <form class="box ${isSignup && !isEmailFormVisible ? 'hidden' : ''}">
          <div class="field">
            <label>아이디</label>
            <input id="email" type="email" required placeholder="이메일을 입력하세요">
          </div>
          <div class="field">
            <label>비밀번호</label>
            <input id="password" type="password" minlength="6" required placeholder="6자 이상">
          </div>
          
          <!-- 회원가입 전용 추가 필드 -->
          ${isSignup && isEmailFormVisible ? `
            <div class="field">
              <label>비밀번호 확인</label>
              <input id="password2" type="password" required>
            </div>
            <div class="field">
              <label>인증번호</label>
              <input id="code" inputmode="numeric" placeholder="이메일 인증 후 확인">
            </div>
          ` : ""}
          
          <button type="submit" class="btn btn-primary btn-lg btn-block">
            ${isSignup ? "가입하기" : "로그인"}
          </button>
          
          <p class="form-msg"></p>
        </form>

        <!-- 하단 링크 및 소셜 로그인 영역 -->
        <div class="auth-links">
          <button id="btnSwitchMode">${isSignup ? "로그인으로" : "회원가입"}</button>
          ${!isSignup ? '<button id="btnResetPassword">비밀번호 찾기</button>' : ""}
        </div>
        
        <!-- 이메일 회원가입 진입 버튼 -->
        ${isSignup && !isEmailFormVisible ? `
          <button id="btnEmailStart" class="btn btn-lg btn-block">이메일로 시작</button>
        ` : ""}
        
        <div class="divider">또는</div>
        
        <button id="btnGoogleAuth" class="btn btn-lg btn-block">
          Google로 ${isSignup ? "가입" : "로그인"}
        </button>
        
        <a class="btn btn-ghost btn-block" href="index.html#home" style="margin-top:12px">홈으로</a>
      </section>
    `;
  }

  /**
   * 화면을 새로 그리고 이벤트를 연결합니다.
   */
  function render() {
    appElement.innerHTML = generateAuthTemplate();
    bindEvents();
  }

  /**
   * 생성된 DOM 요소들에 이벤트를 바인딩합니다.
   */
  function bindEvents() {
    const isSignup = currentMode === "signup";
    const form = UI.qs("form", appElement);

    // [이벤트] 로그인 <-> 회원가입 전환 버튼
    UI.qs("#btnSwitchMode", appElement).onclick = () => {
      currentMode = isSignup ? "login" : "signup";
      isEmailFormVisible = false;
      location.hash = currentMode;
      render();
    };

    // [이벤트] 회원가입 단계에서 '이메일로 시작' 버튼
    const emailStartButton = UI.qs("#btnEmailStart", appElement);
    if (emailStartButton) {
      emailStartButton.onclick = () => {
        isEmailFormVisible = true;
        render();
      };
    }

    // [이벤트] Google 소셜 로그인 처리
    UI.qs("#btnGoogleAuth", appElement).onclick = () => {
      if (!FB.auth) return showMessage("Firebase 연결이 필요합니다.", true);

      const provider = new firebase.auth.GoogleAuthProvider();
      FB.auth.signInWithPopup(provider)
        .then(() => {
          location.href = "index.html";
        })
        .catch(error => {
          showMessage(error.message, true);
        });
    };

    // [이벤트] 비밀번호 찾기 메일 전송
    const resetPasswordButton = UI.qs("#btnResetPassword", appElement);
    if (resetPasswordButton) {
      resetPasswordButton.onclick = () => {
        const email = UI.qs("#email", appElement).value.trim();
        if (!email) return showMessage("이메일을 먼저 입력해 주세요.", true);

        FB.auth.sendPasswordResetEmail(email)
          .then(() => {
            showMessage("비밀번호 재설정 메일을 보냈습니다.");
          })
          .catch(error => {
            showMessage(error.message, true);
          });
      };
    }

    // [이벤트] 폼 서브밋 처리 (일반 회원가입 / 로그인)
    form.onsubmit = (e) => {
      e.preventDefault();

      const email = UI.qs("#email", appElement).value.trim();
      const password = UI.qs("#password", appElement).value;

      // 회원가입 비밀번호 2차 검증
      if (isSignup) {
        const passwordConfirm = UI.qs("#password2", appElement)?.value;
        if (password !== passwordConfirm) {
          return showMessage("비밀번호가 일치하지 않습니다.", true);
        }
      }

      // 비동기 태스크 분기 처리
      const authTask = isSignup
        ? FB.auth.createUserWithEmailAndPassword(email, password)
            .then(result => result.user.sendEmailVerification().then(() => result.user))
        : FB.auth.signInWithEmailAndPassword(email, password);

      authTask
        .then(() => {
          const successMsg = isSignup 
            ? "가입 완료. 이메일 인증 링크를 확인해 주세요." 
            : "로그인되었습니다.";
            
          showMessage(successMsg);
          
          setTimeout(() => {
            location.href = "index.html";
          }, 700);
        })
        .catch(error => {
          showMessage(error.message, true);
        });
    };
  }

  /**
   * 하단 메시지 박스에 성공/실패 텍스트를 출력합니다.
   * @param {string} text - 노출할 내용
   * @param {boolean} isError - 에러 여부 (true면 빨간색 스타일링 등)
   */
  function showMessage(text, isError = false) {
    const messageContainer = UI.qs(".form-msg", appElement);
    if (messageContainer) {
      messageContainer.textContent = text;
      messageContainer.className = `form-msg ${isError ? "err" : "ok"}`;
    }
  }

  // 3. 브라우저 뒤로가기/앞으로가기 등으로 해시가 변경될 때 대응
  window.addEventListener("hashchange", () => {
    currentMode = (location.hash || "#login").slice(1);
    render();
  });

  // 초기 셸 탑재 및 최초 화면 렌더링
  UI.mountShell({ menu: "main", active: "" });
  render();
})();
