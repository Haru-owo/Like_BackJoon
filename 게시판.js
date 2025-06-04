// 기본 공지 글 등록 (최초 실행 시 한 번만)
const defaultPosts = [
  {
    title: "환영합니다! 공지사항입니다.",
    category: "공지",
    language: "전체",
    author: "관리자",
    date: "2025-06-04",
    content: "이 게시판은 다양한 질문과 공지를 위한 공간입니다. 모두가 예의를 지켜주시기 바랍니다."
  }
];

if (!localStorage.getItem('posts')) {
  localStorage.setItem('posts', JSON.stringify(defaultPosts));
}

// 게시글 목록 렌더링
function renderPosts() {
  const postList = document.getElementById('postList');
  const posts = JSON.parse(localStorage.getItem('posts')) || [];

  const hash = location.hash.replace('#', '');
  let filteredPosts;

  if (hash === 'notice') {
    filteredPosts = posts.filter(post => post.category === '공지');
  } else {
    // 기본 또는 질문 게시판 탭일 경우 '공지' 글은 제외
    filteredPosts = posts.filter(post => post.category !== '공지');
  }

  postList.innerHTML = filteredPosts.map((post) => {
    const indexInAllPosts = posts.indexOf(post); // 전체 기준 인덱스
    return `
      <tr onclick="viewPost(${indexInAllPosts})">
        <td>${post.title}</td>
        <td>${post.category}</td>
        <td>${post.language}</td>
        <td>${post.author}</td>
        <td>${post.date}</td>
      </tr>
    `;
  }).join('');
}


// 글 보기 페이지로 이동
function viewPost(index) {
  localStorage.setItem('viewPostIndex', index);
  location.href = '열람.html';
}

// 글쓰기 페이지로 이동
function goToWrite() {
  location.href = '작성.html';
}

// 초기 렌더링 및 해시 변경 대응
window.addEventListener('DOMContentLoaded', renderPosts);
window.addEventListener('hashchange', renderPosts);
window.addEventListener('DOMContentLoaded', () => {
  const index = localStorage.getItem('viewPostIndex');
  const posts = JSON.parse(localStorage.getItem('posts')) || [];

  if (index !== null && posts[index]) {
    const post = posts[index];
    document.getElementById('viewTitle').innerText = post.title;
    document.getElementById('viewCategory').innerText = post.category;
    document.getElementById('viewLanguage').innerText = post.language;
    document.getElementById('viewAuthor').innerText = post.author;
    document.getElementById('viewDate').innerText = post.date;
    document.getElementById('viewContent').innerText = post.content;

    // 버튼 동작 연결
    document.getElementById('backBtn').addEventListener('click', () => {
      location.href = '게시판.html';
    });

    document.getElementById('editBtn').addEventListener('click', () => {
      localStorage.setItem('editPostIndex', index);
      location.href = '작성.html';
    });

    document.getElementById('deleteBtn').addEventListener('click', () => {
      if (confirm("정말 삭제하시겠습니까?")) {
        posts.splice(index, 1);
        localStorage.setItem('posts', JSON.stringify(posts));
        location.href = '게시판.html';
      }
    });
  } else {
    alert('글을 찾을 수 없습니다.');
    location.href = '게시판.html';
  }
});
window.addEventListener('DOMContentLoaded', () => {
  const index = localStorage.getItem('viewPostIndex');
  const posts = JSON.parse(localStorage.getItem('posts')) || [];

  if (index !== null && posts[index]) {
    const post = posts[index];
    document.getElementById('viewTitle').innerText = post.title;
    document.getElementById('viewCategory').innerText = post.category;
    document.getElementById('viewLanguage').innerText = post.language;
    document.getElementById('viewAuthor').innerText = post.author;
    document.getElementById('viewDate').innerText = post.date;
    document.getElementById('viewContent').innerText = post.content;

    // 버튼 동작 연결
    document.getElementById('backBtn').addEventListener('click', () => {
      const target = post.category === '공지' ? '게시판.html#notice' : '게시판.html';
      location.href = target;
    });

    if (post.category !== '공지') {
      // 공지가 아닐 경우에만 수정/삭제 버튼 보이게
      document.getElementById('editBtn').addEventListener('click', () => {
        localStorage.setItem('editPostIndex', index);
        location.href = '작성.html';
      });

      document.getElementById('deleteBtn').addEventListener('click', () => {
        if (confirm("정말 삭제하시겠습니까?")) {
          posts.splice(index, 1);
          localStorage.setItem('posts', JSON.stringify(posts));
          location.href = '게시판.html';
        }
      });
    } else {
      // 공지일 경우 버튼 숨김
      document.getElementById('editBtn').style.display = 'none';
      document.getElementById('deleteBtn').style.display = 'none';
    }
  } else {
    alert('글을 찾을 수 없습니다.');
    location.href = '게시판.html';
  }
});
// === Navbar Page Switch Logic ===
document.querySelectorAll('.nav-link[data-page]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const targetPage = link.dataset.page;

    // Remove active class from all pages and links
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    // Show selected page and highlight nav item
    const pageToShow = document.getElementById(`${targetPage}-page`);
    if (pageToShow) {
      pageToShow.classList.add('active');
      link.classList.add('active');
    }
  });
});

// === SPA Page Navigation ===
document.querySelectorAll('.nav-link[data-page]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const targetPage = link.dataset.page;

    // 페이지 전환
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    const target = document.getElementById(`${targetPage}-page`);
    if (target) target.classList.add('active');

    // 메뉴 강조
    document.querySelectorAll('.nav-link').forEach(nav => {
      nav.classList.remove('active');
    });
    link.classList.add('active');
  });
});

// === 테마 전환 기능 (Light <-> Dark) ===
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-color-scheme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';

    html.setAttribute('data-color-scheme', next);
    themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}

// === URL 해시를 통한 첫 진입 시 페이지 표시 (옵션 기능) ===
window.addEventListener('DOMContentLoaded', () => {
  const hashPage = window.location.hash.replace('#', '');
  const defaultPage = hashPage || 'home';
  const navLink = document.querySelector(`.nav-link[data-page="${defaultPage}"]`);
  if (navLink) navLink.click();
});
document.querySelectorAll('.nav-link[data-page]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const targetPage = link.dataset.page;

    // 페이지 전환
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    const target = document.getElementById(`${targetPage}-page`);
    if (target) target.classList.add('active');

    // 메뉴 강조
    document.querySelectorAll('.nav-link').forEach(nav => {
      nav.classList.remove('active');
    });
    link.classList.add('active');
  });
});
