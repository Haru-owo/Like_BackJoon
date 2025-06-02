// ========== 기본 공지글 초기화 ==========
function initializeDefaultPosts() {
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const hasDefaultNotice = posts.some(post => post.category === '공지' && post.title === '공지사항');
  if (hasDefaultNotice) return;

  const defaultPost = {
    title: '공지사항',
    category: '공지',
    language: '공지',
    author: '관리자',
    content: '이곳은 공지사항 게시판입니다.',
    date: new Date().toLocaleDateString(),
  };

  posts.unshift(defaultPost);
  localStorage.setItem('posts', JSON.stringify(posts));
}

// ========== 글쓰기 저장 ==========
function savePost(event) {
  event.preventDefault();

  const params = new URLSearchParams(window.location.search);
  const editIndex = params.get('edit');

  const post = {
    title: document.getElementById('title').value,
    category: document.getElementById('category').value,
    language: document.getElementById('language').value,
    author: document.getElementById('author').value,
    content: document.getElementById('content').value,
    date: new Date().toLocaleDateString(),
  };

  const posts = JSON.parse(localStorage.getItem('posts') || '[]');

  if (editIndex !== null) {
    posts[editIndex] = post;
  } else {
    posts.push(post);
  }

  localStorage.setItem('posts', JSON.stringify(posts));
  const targetHash = post.category === '공지' ? 'notice' : 'question';
  location.href = `게시판.html#${targetHash}`;
}

// ========== 게시글 목록 출력 ==========
function renderPostsByHash() {
  const hash = location.hash.replace('#', '') || 'question';
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');

  const filtered = posts.filter(post => {
    if (hash === 'notice') return post.category === '공지';
    return post.category !== '공지';
  });

  const postList = document.getElementById('postList');
  if (!postList) return;

  if (filtered.length === 0) {
    postList.innerHTML = `<tr><td colspan="5" style="text-align:center;">게시글이 없습니다.</td></tr>`;
    return;
  }

  postList.innerHTML = filtered.map((post, index) => `
    <tr onclick="location.href='열람.html?index=${index}'" style="cursor:pointer;">
      <td>${post.title}</td>
      <td>${post.category}</td>
      <td>${post.language}</td>
      <td>${post.author}</td>
      <td>${post.date}</td>
    </tr>
  `).join('');
}

// ========== 버튼 스타일 업데이트 ==========
function updateActiveButton() {
  const hash = location.hash.replace('#', '') || 'question';
  const questionBtn = document.querySelector('button[onclick*="question"]');
  const noticeBtn = document.querySelector('button[onclick*="notice"]');

  questionBtn?.classList.remove('btn--primary', 'btn--secondary');
  noticeBtn?.classList.remove('btn--primary', 'btn--secondary');

  if (hash === 'notice') {
    noticeBtn?.classList.add('btn--primary');
    questionBtn?.classList.add('btn--secondary');
  } else {
    questionBtn?.classList.add('btn--primary');
    noticeBtn?.classList.add('btn--secondary');
  }
}

// ========== 글 상세 보기 ==========
function loadPostDetail() {
  const params = new URLSearchParams(window.location.search);
  const index = parseInt(params.get('index'), 10);
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const post = posts[index];

  if (!post) return;

  document.getElementById('viewTitle').textContent = post.title;
  document.getElementById('viewCategory').textContent = post.category;
  document.getElementById('viewLanguage').textContent = post.language;
  document.getElementById('viewAuthor').textContent = post.author;
  document.getElementById('viewDate').textContent = post.date;
  document.getElementById('viewContent').textContent = post.content;

  // ✅ 공지글이면 수정/삭제 버튼 숨김
  if (post.category === '공지') {
    document.getElementById('editBtn').style.display = 'none';
    document.getElementById('deleteBtn').style.display = 'none';
  }

  document.getElementById('editBtn').onclick = () => {
    location.href = `작성.html?edit=${index}`;
  };

  document.getElementById('deleteBtn').onclick = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      posts.splice(index, 1);
      localStorage.setItem('posts', JSON.stringify(posts));
      location.href = '게시판.html';
    }
  };

  // ✅ 공지글이면 #notice로, 아니면 #question으로 이동
  document.getElementById('backBtn').onclick = () => {
    const targetHash = post.category === '공지' ? 'notice' : 'question';
    location.href = `게시판.html#${targetHash}`;
  };
}

// ========== 글 수정 모드 ==========
function loadEditPost() {
  const params = new URLSearchParams(window.location.search);
  const editIndex = params.get('edit');
  if (editIndex === null) return;

  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const post = posts[editIndex];
  if (!post) return;

  document.getElementById('title').value = post.title;
  document.getElementById('category').value = post.category;
  document.getElementById('language').value = post.language;
  document.getElementById('author').value = post.author;
  document.getElementById('content').value = post.content;

  const titleElem = document.getElementById('formTitle');
  if (titleElem) titleElem.textContent = '글 수정';
}

// ========== 글쓰기 이동 ==========
function goToWrite() {
  location.href = '작성.html';
}

// ========== 초기 로딩 ==========
window.addEventListener('DOMContentLoaded', () => {
  initializeDefaultPosts();  // 공지글 자동 등록

  if (document.getElementById('postList')) {
    renderPostsByHash();
    updateActiveButton();
  }

  if (document.getElementById('viewTitle')) {
    loadPostDetail();
  }

  if (document.getElementById('formTitle')) {
    loadEditPost();
  }
});

// ========== 해시 변경 감지 ==========
window.addEventListener('hashchange', () => {
  renderPostsByHash();
  updateActiveButton();
});
