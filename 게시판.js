// 글쓰기 버튼에서 호출
function goToWrite() {
  location.href = '작성.html';
}

// 게시글 렌더링 함수
function renderPostsByHash() {
  const hash = location.hash.replace('#', '') || 'question';
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');

  // 공지 or 기타 카테고리 필터링
  const filtered = posts.filter(post => {
    if (hash === 'notice') return post.category === '공지';
    return post.category !== '공지'; // 질문, 자유 등
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

// 현재 해시 상태에 따라 버튼 스타일 업데이트
function updateActiveButton() {
  const hash = location.hash.replace('#', '') || 'question';
  const questionBtn = document.querySelector('button[onclick*="question"]');
  const noticeBtn = document.querySelector('button[onclick*="notice"]');

  questionBtn?.classList.remove('btn--primary');
  noticeBtn?.classList.remove('btn--primary');
  questionBtn?.classList.remove('btn--secondary');
  noticeBtn?.classList.remove('btn--secondary');

  if (hash === 'notice') {
    noticeBtn?.classList.add('btn--primary');
    questionBtn?.classList.add('btn--secondary');
  } else {
    questionBtn?.classList.add('btn--primary');
    noticeBtn?.classList.add('btn--secondary');
  }
}

// 초기 로딩 + 해시 변경 시 둘 다 실행
window.addEventListener('DOMContentLoaded', () => {
  renderPostsByHash();
  updateActiveButton();
});
window.addEventListener('hashchange', () => {
  renderPostsByHash();
  updateActiveButton();
});
