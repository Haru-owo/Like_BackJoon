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

// SPA 상태 관리 변수
let currentBoardType = 'question'; // 'question' or 'notice'
let currentViewIndex = null; // 글 보기 인덱스
let isEditMode = false;

// 페이지 전환 함수
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) page.classList.add('active');
}

// 글쓰기 폼 초기화 및 표시
function openWritePage(edit = false, post = null, index = null) {
  showPage('write-board-page');
  isEditMode = edit;
  currentViewIndex = index;
  document.getElementById('formTitle').textContent = edit
    ? (currentBoardType === 'notice' ? '공지 수정' : '글 수정')
    : (currentBoardType === 'notice' ? '공지 작성' : '글쓰기');
  // 폼 초기화
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

// 글 보기 페이지 표시
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

// 글 저장
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

// 글 삭제
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

// 글 목록으로 돌아가기
function backToList() {
  currentViewIndex = null;
  renderBoardList(currentBoardType);
  showPage('discussion-page');
}

// 글쓰기 버튼 이벤트
if (document.getElementById('goToWriteBtn')) {
  document.getElementById('goToWriteBtn').addEventListener('click', () => {
    openWritePage(false);
  });
}
// 글쓰기 폼 제출 이벤트
if (document.getElementById('writeForm')) {
  document.getElementById('writeForm').addEventListener('submit', savePost);
}
// 글쓰기 폼 목록 버튼
if (document.getElementById('writeBackBtn')) {
  document.getElementById('writeBackBtn').addEventListener('click', backToList);
}
// 글 보기 페이지 버튼들
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

// 게시글 목록 렌더링 함수 (SPA)
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
    // 글 제목 클릭 이벤트 (SPA)
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
  // 탭 버튼 스타일
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

// 탭 버튼 이벤트
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

// 메뉴바에서 게시판 탭 클릭 시에만 게시판 목록 렌더링
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

// SPA 네비게이션: 모든 nav-link에 대해 페이지 전환 처리
const navLinks = document.querySelectorAll('.nav-link[data-page]');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const pageId = this.getAttribute('data-page') + '-page';
    // 모든 .page에서 active 제거
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // 해당 페이지만 active
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');
    // 네비게이션 active 처리
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    // 게시판 탭이면 게시판 목록 렌더링
    if (pageId === 'discussion-page') {
      renderBoardList('question');
    }
  });
});