const defaultNotices = [
  {
    title: "📢 서버 점검 안내",
    category: "",
    language: "",
    author: "운영팀",
    content: "6월 15일(토) 02:00~04:00 서버 점검이 있습니다.",
    date: "2025-06-01"
  },
  {
    title: "📚 게시판 이용 규칙",
    category: "",
    language: "",
    author: "관리자",
    content: "욕설, 광고, 도배글은 삭제될 수 있습니다.",
    date: "2025-06-03"
  }
];

// 페이지 넘어갈 때 이 변수들로 상태관리 하는거임
let currentBoardType = 'question';
let currentViewIndex = null;
let isEditMode = false;

// 페이지 아이디로 페이지 전환 (리디렉션 아님)
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) page.classList.add('active');
}

// 글 쓰기
function openWritePage(edit = false, post = null, index = null) {
  showPage('write-board-page');
  isEditMode = edit;
  currentViewIndex = index;
  document.getElementById('formTitle').textContent = edit
    ? (currentBoardType === 'notice' ? '공지 수정' : '글 수정')
    : (currentBoardType === 'notice' ? '공지 작성' : '글쓰기');
  // 화면 초기화 (글 수정 탭에서 기존 글 데이터 불러오는거 구현 못했음)
  document.getElementById('title').value = post ? post.title : '';
  document.getElementById('author').value = post ? post.author : '';
  document.getElementById('content').value = post ? post.content : '';
  if (currentBoardType === 'notice') {
    document.getElementById('category').style.display = 'none';
    document.getElementById('language').style.display = 'none';
  } else {
    document.getElementById('category').style.display = '';
    document.getElementById('language').style.display = '';
    document.getElementById('category').value = post ? post.category : '';
    document.getElementById('language').value = post ? post.language : '';
  }
}

// 글 보기 (이 부분 CSS 그대로 옮겨와서 중복된거 무조건 있을거임)
function openViewPage(index) {
  showPage('view-board-page');
  currentViewIndex = index;
  const key = currentBoardType === 'notice' ? 'notices' : 'posts';
  const posts = JSON.parse(localStorage.getItem(key) || '[]');
  const post = posts[index];
  if (!post) {
    document.getElementById('view-board-page').innerHTML = '<p>글을 찾을 수 없습니다.</p>';
    return;
  }
  document.getElementById('viewTitle').textContent = post.title;
  document.getElementById('viewAuthor').textContent = post.author;
  document.getElementById('viewDate').textContent = post.date;
  document.getElementById('viewContent').textContent = post.content;
  const categoryEl = document.getElementById('viewCategory');
  const languageEl = document.getElementById('viewLanguage');
  if (currentBoardType === 'notice') {
    categoryEl.parentElement.style.display = 'none';
    languageEl.parentElement.style.display = 'none';
  } else {
    categoryEl.parentElement.style.display = '';
    languageEl.parentElement.style.display = '';
    categoryEl.textContent = post.category;
    languageEl.textContent = post.language;
  }
}

// 글 저장 (로컬로 구현함)
function savePost(event) {
  event.preventDefault();
  const title = document.getElementById('title').value.trim();
  const category = document.getElementById('category')?.value || '';
  const language = document.getElementById('language')?.value || '';
  const author = document.getElementById('author').value.trim();
  const content = document.getElementById('content').value.trim();
  const date = new Date().toISOString().split('T')[0];
  const newPost = { title, category, language, author, content, date };
  const key = currentBoardType === 'notice' ? 'notices' : 'posts';
  let posts = JSON.parse(localStorage.getItem(key) || '[]');
  if (isEditMode && currentViewIndex !== null) {
    posts[currentViewIndex] = newPost;
  } else {
    posts.push(newPost);
  }
  localStorage.setItem(key, JSON.stringify(posts));
  isEditMode = false;
  currentViewIndex = null;
  renderBoardList(currentBoardType);
  showPage('discussion-page');
}

// 글 삭제 (기능 동작 안됨 ㅅㅂ거)
function deletePost() {
  const key = currentBoardType === 'notice' ? 'notices' : 'posts';
  let posts = JSON.parse(localStorage.getItem(key) || '[]');
  if (currentViewIndex !== null && confirm('정말 삭제하시겠습니까?')) {
    posts.splice(currentViewIndex, 1);
    localStorage.setItem(key, JSON.stringify(posts));
    currentViewIndex = null;
    renderBoardList(currentBoardType);
    showPage('discussion-page');
  }
}

// 목록으로 돌아가기 (글)
function backToList() {
  currentViewIndex = null;
  renderBoardList(currentBoardType);
  showPage('discussion-page');
}

// 글쓰기 버튼
if (document.getElementById('goToWriteBtn')) {
  document.getElementById('goToWriteBtn').addEventListener('click', () => {
    openWritePage(false);
  });
}
// 글 제출 이벤트
if (document.getElementById('writeForm')) {
  document.getElementById('writeForm').addEventListener('submit', savePost);
}
// 글 목록 버튼 (글쓰기 탭 내에서 동작)
if (document.getElementById('writeBackBtn')) {
  document.getElementById('writeBackBtn').addEventListener('click', backToList);
}
// 글 보기 페이지 버튼 모음
if (document.getElementById('editBtn')) {
  document.getElementById('editBtn').addEventListener('click', () => {
    const key = currentBoardType === 'notice' ? 'notices' : 'posts';
    const posts = JSON.parse(localStorage.getItem(key) || '[]');
    const post = posts[currentViewIndex];
    openWritePage(true, post, currentViewIndex);
  });
}
if (document.getElementById('deleteBtn')) {
  document.getElementById('deleteBtn').addEventListener('click', deletePost);
}
if (document.getElementById('backBtn')) {
  document.getElementById('backBtn').addEventListener('click', backToList);
}

// 게시글 목록 렌더링 (리디렉션 없이 구현)
function renderBoardList(type) {
  currentBoardType = type;
  showPage('discussion-page');
  const list = document.getElementById('postList');
  const title = document.getElementById('boardTitle');
  const pagination = document.getElementById('pagination');
  if (!list || !title || !pagination) return;
  const key = type === 'notice' ? 'notices' : 'posts';
  title.textContent = type === 'notice' ? '공지 게시판' : '질문 게시판';
  let posts = JSON.parse(localStorage.getItem(key) || '[]');
  if (type === 'notice') {
    const existingTitles = posts.map(p => p.title);
    defaultNotices.forEach(notice => {
      if (!existingTitles.includes(notice.title)) posts.push(notice);
    });
    localStorage.setItem(key, JSON.stringify(posts));
  }
  const postsPerPage = 10;
  let currentPage = 1;
  function renderPosts() {
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const pagePosts = posts.slice(start, end);
    list.innerHTML = pagePosts.map((post, index) => `
      <tr>
        <td><a href="#" class="post-link" data-index="${start + index}">${post.title}</a></td>
        <td>${post.category || '-'}</td>
        <td>${post.language || '-'}</td>
        <td>${post.author}</td>
        <td>${post.date}</td>
      </tr>
    `).join('');
    // 글 제목 클릭했을 때 이벤트 (리디렉션 없이 동작하도록 바꿈)
    document.querySelectorAll('.post-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openViewPage(Number(link.dataset.index));
      });
    });
    renderPagination();
  }
  function renderPagination() {
    const totalPages = Math.ceil(posts.length / postsPerPage);
    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.className = "btn btn--outline";
      btn.textContent = i;
      if (i === currentPage) btn.classList.add("btn--primary");
      btn.addEventListener("click", () => {
        currentPage = i;
        renderPosts();
      });
      pagination.appendChild(btn);
    }
  }
  renderPosts();
  const qBtn = document.getElementById("questionBtn");
  const nBtn = document.getElementById("noticeBtn");
  if (qBtn && nBtn) {
    if (type === 'question') {
      qBtn.classList.add("btn--primary");
      nBtn.classList.remove("btn--primary");
      nBtn.classList.add("btn--secondary");
      qBtn.classList.remove("btn--secondary");
    } else {
      nBtn.classList.add("btn--primary");
      qBtn.classList.remove("btn--primary");
      qBtn.classList.add("btn--secondary");
      nBtn.classList.remove("btn--secondary");
    }
  }
}

if (document.getElementById('questionBtn')) {
  document.getElementById('questionBtn').addEventListener('click', (e) => {
    e.preventDefault();
    renderBoardList('question');
  });
}
if (document.getElementById('noticeBtn')) {
  document.getElementById('noticeBtn').addEventListener('click', (e) => {
    e.preventDefault();
    renderBoardList('notice');
  });
}

// 메뉴바에서 게시판 탭 클릭 시에만 게시판 목록을 렌더링하도록 했음
// 이거 없이 동작하면 탭 이동 계속 했을 때 페이지 망가짐
const discussionNav = document.querySelector('.nav-link[data-page="discussion"]');
if (discussionNav) {
  discussionNav.addEventListener('click', (e) => {
    e.preventDefault();
    renderBoardList('question');
    showPage('discussion-page');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    discussionNav.classList.add('active');
  });
}

// 페이지 전환 (리디렉션 없이 전환되는걸 핵심 기능으로 담음)
const pageLinks = document.querySelectorAll('[data-page]');
pageLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const pageName = this.getAttribute('data-page');
    const pageId = pageName + '-page';
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');
    // nav-link만 네비게이션 active 처리 (완료 -> 페이지 넘기면 작동 안됨 -> 수정 완료)
    document.querySelectorAll('.nav-link[data-page]').forEach(l => l.classList.remove('active'));
    const navLink = document.querySelector('.nav-link[data-page="' + pageName + '"]');
    if (navLink) navLink.classList.add('active');
    // 게시판 탭이면 게시판 목록 렌더링 (이거 굳이 필요한가? -> 없이 돌려보니까 렌더 안따라오네. 이거 필요함)
    if (pageId === 'discussion-page') {
      renderBoardList('question');
    }
  });
});

// ================= 회원가입 폼 기능(main_app에서 통합함) =================
document.addEventListener('DOMContentLoaded', function() {
  const signupForm = document.getElementById('signup-form');
  if (!signupForm) return;
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirm-password');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const strengthBar = document.querySelector('.strength-fill');
  const strengthText = document.querySelector('.strength-text');

  function updatePasswordStrength(password) {
    if (!strengthBar || !strengthText) return;
    let strength = 0;
    let label = '';
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 25;
    strength = Math.min(strength, 100);
    if (strength === 0) label = '비밀번호를 입력하세요';
    else if (strength < 50) label = '약함';
    else if (strength < 75) label = '보통';
    else if (strength < 100) label = '강함';
    else label = '매우 강함';
    strengthBar.style.width = strength + '%';
    strengthText.textContent = `비밀번호 강도: ${label}`;
    if (strength < 50) strengthBar.style.background = 'var(--color-error)';
    else if (strength < 75) strengthBar.style.background = 'var(--color-warning)';
    else strengthBar.style.background = 'var(--gradient-primary)';
  }

  passwordInput?.addEventListener('input', function(e) {
    updatePasswordStrength(e.target.value);
  });

  function showError(id, msg) {
    const el = document.getElementById(id+'-error');
    if (el) el.textContent = msg;
  }
  function clearError(id) {
    const el = document.getElementById(id+'-error');
    if (el) el.textContent = '';
  }
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    clearError('username'); clearError('email'); clearError('password'); clearError('confirm-password');
    if (!username) { showError('username', '사용자명을 입력해주세요.'); valid = false; }
    else if (username.length < 3) { showError('username', '사용자명은 3자 이상이어야 합니다.'); valid = false; }
    if (!email) { showError('email', '이메일을 입력해주세요.'); valid = false; }
    else if (!isValidEmail(email)) { showError('email', '올바른 이메일 형식이 아닙니다.'); valid = false; }
    if (!password) { showError('password', '비밀번호를 입력해주세요.'); valid = false; }
    else if (password.length < 6) { showError('password', '비밀번호는 6자 이상이어야 합니다.'); valid = false; }
    if (!confirm) { showError('confirm-password', '비밀번호 확인을 입력해주세요.'); valid = false; }
    else if (password !== confirm) { showError('confirm-password', '비밀번호가 일치하지 않습니다.'); valid = false; }
    if (!valid) return;
    // 성공 메시지
    signupForm.reset();
    updatePasswordStrength('');
    const msg = document.getElementById('success-message');
    msg.classList.remove('hidden');
    msg.style.opacity = '0';
    msg.style.transform = 'translateY(20px)';
    setTimeout(() => {
      msg.style.transition = 'all 0.3s ease';
      msg.style.opacity = '1';
      msg.style.transform = 'translateY(0)';
    }, 10);
    setTimeout(() => {
      msg.classList.add('hidden');
      msg.style.transition = '';
      msg.style.opacity = '';
      msg.style.transform = '';
    }, 2500);
  });

  // 입력 효과 (별로 중요하지 않은 부분)
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', function() {
      input.parentElement.classList.remove('focused');
    });
  });
});

// ================= 문제 리스트(탭/검색/단계별) 기능(list에서 통합함) =================
// 문제 분류 데이터 하드코딩 (이거 Json으로 바꿔봐도 될 것 같음 -> *포기*)
const stepProblems = {
  math: [
    { id: "0101", title: "A+B", level: "Bronze 5" },
    { id: "0102", title: "A-B", level: "Bronze 5" },
    { id: "0103", title: "A/B", level: "Bronze 5" },
    { id: "0104", title: "A*B", level: "Bronze 5" },
    { id: "0105", title: "약수", level: "Bronze 1" },
    { id: "0106", title: "최소공배수", level: "Bronze 1" },
  ],
  string: [
    { id: "0207", title: "펠린드롬 문장", level: "Silver 4" },
    { id: "0210", title: "문자열 반복", level: "Bronze 2" },
    { id: "0211", title: "문자와 문자열", level: "Bronze 5" },
    { id: "0212", title: "알파벳 찾기", level: "Bronze 2" },
  ],
  array: [
    { id: "0301", title: "배열의 평균", level: "Bronze 4" },
    { id: "0302", title: "2차원 배열 탐색", level: "Bronze 2" },
    { id: "2738", title: "행렬 덧셈", level: "Bronze 3" },
    { id: "16926", title: "배열 돌리기 1", level: "Silver 5" },
    { id: "1845", title: "배열 회전", level: "Ruby 1" }
  ],
  structure: [
    { id: "0401", title: "학생 정보 구조체", level: "Bronze 3" },
    { id: "0402", title: "도서 관리 구조체", level: "Silver 5" },
    { id: "10814", title: "나이순 정렬", level: "Bronze 2" },
    { id: "10825", title: "국영수", level: "Silver 4" }
  ]
};

function showStepDetail(category) {
  document.getElementById("step").classList.add("hidden");
  document.getElementById("step-detail").classList.remove("hidden");

  const table = document.getElementById("step-detail-table");
  const rows = stepProblems[category].map((p, idx) => `
    <tr class="spa-problem-row" data-category="${category}" data-idx="${idx}">
      <td>${p.id}</td>
      <td>${p.title}</td>
      <td>${p.level}</td>
    </tr>`).join("");

  table.innerHTML = `
    <thead><tr><th>📌문제</th><th>문제제목</th><th>정보</th></tr></thead>
    <tbody>${rows}</tbody>`;

  // 문제 클릭 이벤트 연결 수정함. (정상작동 체크 완료)
  document.querySelectorAll('.spa-problem-row').forEach(row => {
    row.addEventListener('click', function(e) {
      e.preventDefault();
      const cat = this.getAttribute('data-category');
      const idx = this.getAttribute('data-idx');
      openProblemDetail(cat, idx);
    });
  });
}

// 문제 리스트(전체/난이도순) 클릭 이벤트 (리디렉션 없음)
function addProblemListSPAEvents() {
  // 전체/난이도순 문제 tr 구현
  document.querySelectorAll('.tab-content#all .problem-table tbody tr, .tab-content#category1 .problem-table tbody tr').forEach(row => {
    row.addEventListener('click', function(e) {
      e.preventDefault();
      const tds = this.querySelectorAll('td');
      if (tds.length < 2) return;
      const title = tds[1].textContent;
      const id = tds[0].textContent;
      const info = tds[2]?.textContent || '';
      openProblemDetailByTitle(title, id, info);
    });
  });
  // 주제
  document.querySelectorAll('.tab-content#step .problem-table tbody tr[data-category]').forEach(row => {
    row.addEventListener('click', function(e) {
      e.preventDefault();
      const cat = this.getAttribute('data-category');
      if (cat) showStepDetail(cat);
    });
  });
  // 하위 문제
  document.querySelectorAll('.spa-problem-row').forEach(row => {
    row.addEventListener('click', function(e) {
      e.preventDefault();
      const cat = this.getAttribute('data-category');
      const idx = this.getAttribute('data-idx');
      openProblemDetail(cat, idx);
    });
  });
}

// 단계별 문제 상세 (얘는 js에서 처리중인 데이터라 따로 분리했음)
function openProblemDetail(category, idx) {
  const problem = stepProblems[category][idx];
  if (!problem) return;
  showPage('problem-detail-page');
  setProblemDetail(problem.title, problem.id, problem.level, '문제 설명 준비중');
}
// 전체랑 난이도순 문제 상세 (이건 리스트 하드코딩이라 걍 합쳐도 됨)
function openProblemDetailByTitle(title, id, info) {
  showPage('problem-detail-page');
  setProblemDetail(title, id, info, '문제 설명 준비중');
}
// 문제 상세 정보 세팅 (동작 안함 -> 수정 완료)
function setProblemDetail(title, id, info, desc) {
  document.getElementById('problem-title').textContent = title;
  document.getElementById('problem-info').textContent = `${info} / ${id}`;
  document.getElementById('problem-description').textContent = desc;
  showProblemTab('desc');
}
// 탭 전환 수정 완료
function showProblemTab(tab) {
  const desc = document.getElementById('problem-desc-section');
  const submit = document.getElementById('problem-submit-section');
  const status = document.getElementById('problem-status-section');
  desc.style.display = tab === 'desc' ? '' : 'none';
  submit.style.display = tab === 'submit' ? '' : 'none';
  status.style.display = tab === 'status' ? '' : 'none';
  
  document.querySelectorAll('#problem-detail-tabs .tab-btn').forEach(btn => {
    btn.classList.remove('btn--primary');
    btn.classList.add('btn--outline');
  });
  const activeBtn = document.querySelector(`#problem-detail-tabs .tab-btn[data-tab="${tab}"]`);
  if (activeBtn) {
    activeBtn.classList.add('btn--primary');
    activeBtn.classList.remove('btn--outline');
  }
}
// 이벤트 (탭 버튼)
if (document.getElementById('problem-detail-tabs')) {
  document.querySelectorAll('#problem-detail-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      showProblemTab(this.getAttribute('data-tab'));
    });
    btn.addEventListener('mouseover', function() {
      this.classList.add('btn--secondary');
    });
    btn.addEventListener('mouseout', function() {
      this.classList.remove('btn--secondary');
    });
  });
}

// 제출 폼 처리 (이거 없어도 될것 같은데, 일단 냅둠)
if (document.getElementById('submit-form')) {
  document.getElementById('submit-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const msg = document.getElementById('submit-success-msg');
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 1500);
    this.reset();
  });
}
// 문제 상세에서 목록 복귀 (이거 같은 기능 중복임, 시간 남으면 고칠 예정)
if (document.getElementById('problem-back-btn')) {
  document.getElementById('problem-back-btn').addEventListener('click', function() {
    showPage('problems-page');
  });
}

// 하위 문제에서 리스트로 돌아가기 기능 동작 안해서 그냥 임시로 해결한 부분
function backToStep() {
  document.getElementById('step-detail').classList.add('hidden');
  document.getElementById('step').classList.remove('hidden');
}

// 문제 리스트 이벤트 (탭 전환)
document.addEventListener('DOMContentLoaded', () => {
  addProblemListSPAEvents();
  // 탭 전환이 발생할 때 이벤트 (단순연결)
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      setTimeout(() => {
        addProblemListSPAEvents();
        // 단계별 하위 문제에도 이벤트 연결 (리디렉션 뺌)
        if (document.getElementById('step-detail-table')) {
          document.querySelectorAll('.spa-problem-row').forEach(row => {
            row.addEventListener('click', function(e) {
              e.preventDefault();
              const cat = this.getAttribute('data-category');
              const idx = this.getAttribute('data-idx');
              openProblemDetail(cat, idx);
            });
          });
        }
      }, 10);
    });
  });
});

// 문제 탭(전체/단계/난이도순) 전환 기능 (동작 안함 -> 수정 완료)
document.addEventListener('DOMContentLoaded', function() {
  // 문제 탭(전체/단계/난이도순) 전환 기능 (동작 안함 -> 수정 완료)
  document.querySelectorAll('.tabs .tab').forEach(tabBtn => {
    tabBtn.addEventListener('click', function(e) {
      e.preventDefault();

      // 이거 뭐임?
      document.querySelectorAll('.tabs .tab').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      // 탭 컨텐츠 show/hide (이거 매우 중요)
      const tabName = this.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach(tc => {
        if (tc.id === tabName) tc.classList.remove('hidden');
        else tc.classList.add('hidden');
      });
      // 단계별 메인에서 하위 문제 영역 숨기기 (이거 위치 바꿔야할듯 -> 수정 완료)
      if (tabName !== 'step-detail' && document.getElementById('step-detail')) {
        document.getElementById('step-detail').classList.add('hidden');
      }
      // 페이지 전환 이벤트 재연결 -> 임시 구현
      setTimeout(addProblemListSPAEvents, 10);
    });
  });
});

// ================= 코드 입력창 C언어 하이라이트 =================
document.addEventListener('DOMContentLoaded', function() {
  const textarea = document.getElementById('source-code');
  const highlighted = document.getElementById('highlighted-code')?.querySelector('code');
  if (textarea && highlighted && window.hljs) {
    function syncHighlight() {
      highlighted.textContent = textarea.value;
      hljs.highlightElement(highlighted);
    }
    textarea.addEventListener('input', syncHighlight);
    syncHighlight();
    textarea.addEventListener('scroll', function() {
      document.getElementById('highlighted-code').scrollTop = textarea.scrollTop;
      document.getElementById('highlighted-code').scrollLeft = textarea.scrollLeft;
    });
  }
});