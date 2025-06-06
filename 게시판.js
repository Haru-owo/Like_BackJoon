// 📌 초기 고정 공지 데이터
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

// 📌 글 저장 함수
function savePost(event) {
  event.preventDefault();

  const title = document.getElementById('title').value.trim();
  const category = document.getElementById('category')?.value || '';
  const language = document.getElementById('language')?.value || '';
  const author = document.getElementById('author').value.trim();
  const content = document.getElementById('content').value.trim();
  const date = new Date().toISOString().split('T')[0];

  const newPost = { title, category, language, author, content, date };

  const params = new URLSearchParams(window.location.search);
  const type = params.get('type') === 'notice' ? 'notice' : 'question';
  const key = type === 'notice' ? 'notices' : 'posts';
  const isEdit = params.get('edit') === '1';

  let posts = JSON.parse(localStorage.getItem(key) || '[]');

  if (isEdit) {
    const editIndex = parseInt(localStorage.getItem('editIndex'), 10);
    posts[editIndex] = newPost;
    localStorage.removeItem('editIndex');
    localStorage.removeItem('editData');
  } else {
    posts.push(newPost);
  }

  localStorage.setItem(key, JSON.stringify(posts));
  window.location.href = `게시판.html?type=${type}`;
}

// ✏️ 작성 페이지: 수정 시 데이터 불러오기 및 UI 설정
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const isEdit = params.get('edit') === '1';
  const type = params.get('type') === 'notice' ? 'notice' : 'question';

  const formTitle = document.getElementById('formTitle');
  if (formTitle) {
    formTitle.textContent = isEdit
      ? (type === 'notice' ? '공지 수정' : '글 수정')
      : (type === 'notice' ? '공지 작성' : '글쓰기');
  }

  if (type === 'notice') {
    const catEl = document.getElementById('category');
    const langEl = document.getElementById('language');
    if (catEl) catEl.style.display = 'none';
    if (langEl) langEl.style.display = 'none';
  }

  if (isEdit) {
    const post = JSON.parse(localStorage.getItem('editData'));
    if (post) {
      document.getElementById('title').value = post.title;
      document.getElementById('author').value = post.author;
      document.getElementById('content').value = post.content;
      if (type !== 'notice') {
        document.getElementById('category').value = post.category;
        document.getElementById('language').value = post.language;
      }
    }
  }
});

// 📝 게시판 목록 표시
document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('postList');
  const title = document.getElementById('boardTitle');
  if (!list || !title) return;

  const params = new URLSearchParams(window.location.search);
  const type = params.get('type') === 'notice' ? 'notice' : 'question';
  const key = type === 'notice' ? 'notices' : 'posts';

  title.textContent = type === 'notice' ? '공지 게시판' : '질문 게시판';

  let posts = JSON.parse(localStorage.getItem(key) || '[]');

  if (type === 'notice') {
    const existingTitles = posts.map(p => p.title);
    defaultNotices.forEach(notice => {
      if (!existingTitles.includes(notice.title)) {
        posts.push(notice); // 저장용
      }
    });
    localStorage.setItem(key, JSON.stringify(posts));
  }
  

  list.innerHTML = posts.map((post, index) => `
    <tr>
      <td><a href="열람.html?type=${type}&index=${index}">${post.title}</a></td>
      <td>${post.category || '-'}</td>
      <td>${post.language || '-'}</td>
      <td>${post.author}</td>
      <td>${post.date}</td>
    </tr>
  `).join('');

  // 버튼 강조 처리
  const qBtn = document.getElementById("questionBtn");
  const nBtn = document.getElementById("noticeBtn");
  if (qBtn && nBtn) {
    if (type === 'question') {
      qBtn.classList.add("btn--primary");
      qBtn.classList.remove("btn--secondary");
      nBtn.classList.add("btn--secondary");
      nBtn.classList.remove("btn--primary");
    } else {
      nBtn.classList.add("btn--primary");
      nBtn.classList.remove("btn--secondary");
      qBtn.classList.add("btn--secondary");
      qBtn.classList.remove("btn--primary");
    }
  }
});

// 🔍 열람 페이지: 글 보기 + 수정/삭제 + 목록 버튼
document.addEventListener('DOMContentLoaded', () => {
  const viewTitle = document.getElementById('viewTitle');
  if (!viewTitle) return;

  const params = new URLSearchParams(window.location.search);
  const type = params.get('type') === 'notice' ? 'notice' : 'question';
  const key = type === 'notice' ? 'notices' : 'posts';
  const index = parseInt(params.get('index'), 10);

  const posts = JSON.parse(localStorage.getItem(key) || '[]');
  const post = posts[index];

  if (!post) {
    document.body.innerHTML = '<p>글을 찾을 수 없습니다.</p>';
    return;
  }

  document.getElementById('viewTitle').textContent = post.title;
  document.getElementById('viewAuthor').textContent = post.author;
  document.getElementById('viewDate').textContent = post.date;
  document.getElementById('viewContent').textContent = post.content;

  const categoryEl = document.getElementById('viewCategory');
  const languageEl = document.getElementById('viewLanguage');

  if (type === 'notice') {
    if (categoryEl) categoryEl.parentElement.style.display = 'none';
    if (languageEl) languageEl.parentElement.style.display = 'none';
  } else {
    categoryEl.textContent = post.category;
    languageEl.textContent = post.language;
  }

  document.getElementById('editBtn')?.addEventListener('click', () => {
    localStorage.setItem('editIndex', index);
    localStorage.setItem('editData', JSON.stringify(post));
    window.location.href = `작성.html?type=${type}&edit=1`;
  });

  document.getElementById('deleteBtn')?.addEventListener('click', () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      posts.splice(index, 1);
      localStorage.setItem(key, JSON.stringify(posts));
      window.location.href = `게시판.html?type=${type}`;
    }
  });

  // 목록 버튼 기능
  document.getElementById('backBtn')?.addEventListener('click', () => {
    window.location.href = `게시판.html?type=${type}`;
  });
});

// 📎 글쓰기 버튼 전환 함수 (제목 아래 버튼에서 사용)
function goToWrite() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type') === 'notice' ? 'notice' : 'question';
  window.location.href = `작성.html?type=${type}`;
}
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // 링크의 기본 동작 막기

      const page = link.dataset.page;

      // 현재 페이지가 "discussion"일 때는 아무 동작 안함 (이미 게시판 페이지)
      if (page === "discussion") return;

      // 다른 페이지는 해시값 변경으로 이동처럼 보이게 처리
      location.hash = page;

      // active 클래스 조정
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // 기본적으로 "토론"을 active로 표시 (게시판에서만)
  document.querySelectorAll('[data-page="discussion"]').forEach(link => {
    link.classList.add("active");
  });
});
document.addEventListener("DOMContentLoaded", () => {
  
  const navLinks = document.querySelectorAll(".nav-link");
  const pages = document.querySelectorAll(".page");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.dataset.page;

      

      pages.forEach(p => p.classList.remove("active"));
      const targetPage = document.getElementById(`${page}-page`);
      if (targetPage) targetPage.classList.add("active");

      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  document.querySelectorAll('[data-page="discussion"]').forEach(link => {
    link.classList.add("active");
  });
});