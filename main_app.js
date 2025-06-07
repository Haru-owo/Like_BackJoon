document.addEventListener('DOMContentLoaded', () => {
    const state = {
        currentPage: 'home',
        user: null,
        theme: 'light',
        boardType: 'question',
        boardPage: 1,
        editIndex: null,
        editData: null,
        viewIndex: null
    };

    const sampleData = {
        user: {
            name: "김개발",
            email: "dev.kim@example.com",
            joinDate: "2024-03-15",
            streak: 15,
            solvedProblems: 42,
            totalProblems: 100,
            tier: "Silver III",
            points: 1250
        },
        recentActivity: [
            {
                type: "solved",
                problemId: "#1234",
                title: "두 수의 합",
                time: "2시간 전",
                difficulty: "Bronze"
            },
            {
                type: "attempt",
                problemId: "#5678",
                title: "정렬 알고리즘",
                time: "5시간 전",
                difficulty: "Silver"
            },
            {
                type: "solved",
                problemId: "#9012",
                title: "그래프 탐색",
                time: "1일 전",
                difficulty: "Gold"
            }
        ],
        todayProblems: [
            {
                id: "#3456",
                title: "이진 검색",
                difficulty: "Silver",
                category: "알고리즘",
                estimatedTime: "30분"
            },
            {
                id: "#7890",
                title: "스택과 큐",
                difficulty: "Bronze",
                category: "자료구조",
                estimatedTime: "20분"
            }
        ],
        achievements: [
            {
                name: "첫 문제 해결",
                description: "첫 번째 문제를 성공적으로 해결했습니다",
                earned: true,
                date: "2024-03-15"
            },
            {
                name: "연속 학습자",
                description: "7일 연속으로 문제를 해결했습니다",
                earned: true,
                date: "2024-03-22"
            },
            {
                name: "실버 달성",
                description: "실버 티어에 도달했습니다",
                earned: false,
                progress: 75
            }
        ]
    };


    initTheme();
    initNavigation();
    initSignupForm();
    initButtonNavigation();
    initThemeToggle();
    initCounterAnimations();
    initPasswordStrength();
    initScrollAnimations();
    renderHomePage();
    
    function setTheme(theme) {
        // theme 값이 잘못 들어오면 기본값 'light'로
        if (theme !== 'light' && theme !== 'dark') theme = 'light';
        state.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeToggle();
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        let theme = savedTheme;
        if (!theme) {
            // 시스템 테마 감지 활성화
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        setTheme(theme);
    }

    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
    }

    function toggleTheme() {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.body.style.transition = 'background-color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    function updateThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = state.theme === 'light' ? '🌙' : '☀️';
        }
    }

    function initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('data-page');
                navigateTo(targetPage);
            });
        });
    }

    function initButtonNavigation() {
        const navButtons = document.querySelectorAll('button[data-page]');
        
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = button.getAttribute('data-page');
                navigateTo(targetPage);
            });
        });
    }

    function navigateTo(pageName) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        const currentPage = document.querySelector('.page.active');
        const targetPage = document.getElementById(`${pageName}-page`);
        
        if (targetPage && currentPage !== targetPage) {
            // Fade out current page
            if (currentPage) {
                currentPage.style.opacity = '0';
                setTimeout(() => {
                    currentPage.classList.remove('active');
                    currentPage.style.opacity = '';
                }, 150);
            }
            
            setTimeout(() => {
                targetPage.classList.add('active');
                targetPage.style.opacity = '0';
                setTimeout(() => {
                    targetPage.style.opacity = '1';
                }, 10);
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                state.currentPage = pageName;
                if (pageName === 'mypage') {
                    initCounterAnimations();
                }
                if (pageName === 'home') {
                    renderHomePage();
                }
                if (pageName === 'discussion') {
                    renderBoard();
                }
                if (pageName === 'write-board') {
                    renderWriteBoard();
                }
                if (pageName === 'view-board') {
                    renderViewBoard();
                }
            }, 150);
        }
    }

    function renderHomePage() {
        // 연속학습, 문제해결, 티어
        const streak = sampleData.user.streak;
        const solved = sampleData.user.solvedProblems;
        const total = sampleData.user.totalProblems;
        const tier = sampleData.user.tier;
        const points = sampleData.user.points;
        // 연속학습
        const streakEl = document.querySelector('.progress-card .progress-number');
        if (streakEl) streakEl.textContent = streak + '일';
        // 문제해결
        const solvedEl = document.querySelectorAll('.progress-card .progress-number')[1];
        if (solvedEl) solvedEl.innerHTML = `${solved}<span>/${total}</span>`;
        // 티어
        const tierEl = document.querySelector('.tier-badge');
        if (tierEl) tierEl.textContent = tier;
        const tierPointEl = document.querySelector('.tier-points');
        if (tierPointEl) tierPointEl.textContent = points + ' pt';
        // 추천문제
        const recGrid = document.querySelector('.recommendations-grid');
        if (recGrid) {
            recGrid.innerHTML = sampleData.todayProblems.map(p => `
                <div class="problem-card card hover-lift">
                    <div class="card__body">
                        <div class="problem-header">
                            <span class="problem-id">${p.id}</span>
                            <span class="difficulty-badge ${p.difficulty.toLowerCase()}">${p.difficulty}</span>
                        </div>
                        <h3>${p.title}</h3>
                        <p class="problem-category">${p.category}</p>
                        <div class="problem-meta">
                            <span class="time-estimate">⏱️ ${p.estimatedTime}</span>
                        </div>
                        <button class="btn btn--primary btn--sm">도전하기</button>
                    </div>
                </div>
            `).join('');
        }
        // 최근활동
        const timeline = document.querySelector('.activity-timeline');
        if (timeline) {
            timeline.innerHTML = sampleData.recentActivity.map(a => `
                <div class="timeline-item">
                    <div class="timeline-marker ${a.type === 'solved' ? 'solved' : 'attempted'}"></div>
                    <div class="timeline-content">
                        <div class="activity-type">${a.type === 'solved' ? '문제 해결' : '시도'}</div>
                        <h4>${a.problemId} ${a.title} <span class="difficulty-badge ${a.difficulty.toLowerCase()}">${a.difficulty}</span></h4>
                        <div class="activity-time">${a.time}</div>
                    </div>
                </div>
            `).join('');
        }
        // 연속학습 progress bar
        const streakBar = document.querySelector('.progress-card .progress-fill');
        if (streakBar) streakBar.style.width = Math.min(100, Math.round(streak / 20 * 100)) + '%';
        // 문제해결 progress bar
        const solvedBar = document.querySelectorAll('.progress-card .progress-fill')[1];
        if (solvedBar) solvedBar.style.width = Math.min(100, Math.round(solved / total * 100)) + '%';
    }

    function initCounterAnimations() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            let current = 0;
            const increment = target / 50;
            const duration = 1500;
            const stepTime = duration / 50;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    if (current > target) current = target;
                    counter.textContent = Math.floor(current).toLocaleString();
                    setTimeout(updateCounter, stepTime);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    function initSignupForm() {
        const signupForm = document.getElementById('signup-form');
        
        if (signupForm) {
            signupForm.addEventListener('submit', handleSignupSubmit);
            
            const formInputs = signupForm.querySelectorAll('.form-control');
            formInputs.forEach(input => {
                input.addEventListener('input', () => {
                    validateInput(input);
                    if (input.id === 'password') {
                        updatePasswordStrength(input.value);
                    }
                });
                
                input.addEventListener('blur', () => {
                    validateInput(input);
                });
                
                input.addEventListener('focus', () => {
                    input.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    input.parentElement.classList.remove('focused');
                });
            });
        }
    }

    function initPasswordStrength() {
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                updatePasswordStrength(e.target.value);
            });
        }
    }

    function updatePasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthBar || !strengthText) return;
        
        let strength = 0;
        let strengthLabel = '';
        
        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 25;
        
        strength = Math.min(strength, 100);
        
        if (strength === 0) strengthLabel = '비밀번호를 입력하세요';
        else if (strength < 50) strengthLabel = '약함';
        else if (strength < 75) strengthLabel = '보통';
        else if (strength < 100) strengthLabel = '강함';
        else strengthLabel = '매우 강함';
        
        strengthBar.style.width = `${strength}%`;
        strengthText.textContent = `비밀번호 강도: ${strengthLabel}`;
        
        if (strength < 50) {
            strengthBar.style.background = 'var(--color-error)';
        } else if (strength < 75) {
            strengthBar.style.background = 'var(--color-warning)';
        } else {
            strengthBar.style.background = 'var(--gradient-primary)';
        }
    }

    function handleSignupSubmit(e) {
        e.preventDefault();
        
        clearErrorMessages();
        
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        let isValid = true;
        
        if (username === '') {
            showError('username', '사용자명을 입력해주세요.');
            isValid = false;
        } else if (username.length < 3) {
            showError('username', '사용자명은 3자 이상이어야 합니다.');
            isValid = false;
        }
        
        if (email === '') {
            showError('email', '이메일을 입력해주세요.');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', '올바른 이메일 형식이 아닙니다.');
            isValid = false;
        }
        
        if (password === '') {
            showError('password', '비밀번호를 입력해주세요.');
            isValid = false;
        } else if (password.length < 6) {
            showError('password', '비밀번호는 6자 이상이어야 합니다.');
            isValid = false;
        }
        
        if (confirmPassword === '') {
            showError('confirm-password', '비밀번호 확인을 입력해주세요.');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirm-password', '비밀번호가 일치하지 않습니다.');
            isValid = false;
        }
        
        if (isValid) {
            const submitButton = e.target.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.classList.add('loading');
            submitButton.innerHTML = '<span>처리 중...</span>';
            submitButton.disabled = true;
            
            setTimeout(() => {
                e.target.reset();
                
                const successMessage = document.getElementById('success-message');
                successMessage.classList.remove('hidden');
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    successMessage.style.transition = 'all 0.3s ease';
                    successMessage.style.opacity = '1';
                    successMessage.style.transform = 'translateY(0)';
                }, 10);
                
                submitButton.classList.remove('loading');
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                updatePasswordStrength('');
                
                state.user = {
                    username: username,
                    email: email
                };
                
                setTimeout(() => {
                    navigateTo('home');
                    setTimeout(() => {
                        successMessage.classList.add('hidden');
                        successMessage.style.transition = '';
                        successMessage.style.opacity = '';
                        successMessage.style.transform = '';
                    }, 500);
                }, 3000);
            }, 1500);
        }
    }
    
    function validateInput(input) {
        const id = input.id;
        const value = input.value.trim();
        
        switch(id) {
            case 'username':
                if (value === '') {
                    showError(id, '사용자명을 입력해주세요.');
                    setInputState(input, 'error');
                } else if (value.length < 3) {
                    showError(id, '사용자명은 3자 이상이어야 합니다.');
                    setInputState(input, 'error');
                } else {
                    clearError(id);
                    setInputState(input, 'success');
                }
                break;
                
            case 'email':
                if (value === '') {
                    showError(id, '이메일을 입력해주세요.');
                    setInputState(input, 'error');
                } else if (!isValidEmail(value)) {
                    showError(id, '올바른 이메일 형식이 아닙니다.');
                    setInputState(input, 'error');
                } else {
                    clearError(id);
                    setInputState(input, 'success');
                }
                break;
                
            case 'password':
                if (value === '') {
                    showError(id, '비밀번호를 입력해주세요.');
                    setInputState(input, 'error');
                } else if (value.length < 6) {
                    showError(id, '비밀번호는 6자 이상이어야 합니다.');
                    setInputState(input, 'error');
                } else {
                    clearError(id);
                    setInputState(input, 'success');
                    
                    const confirmPassword = document.getElementById('confirm-password');
                    if (confirmPassword && confirmPassword.value !== '') {
                        validateInput(confirmPassword);
                    }
                }
                break;
                
            case 'confirm-password':
                const password = document.getElementById('password').value;
                if (value === '') {
                    showError(id, '비밀번호 확인을 입력해주세요.');
                    setInputState(input, 'error');
                } else if (value !== password) {
                    showError(id, '비밀번호가 일치하지 않습니다.');
                    setInputState(input, 'error');
                } else {
                    clearError(id);
                    setInputState(input, 'success');
                }
                break;
        }
    }

    function initScrollAnimations() {
        const animateElements = document.querySelectorAll('.card, .feature-card, .progress-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.matches('.btn') || e.target.closest('.btn')) {
            const button = e.target.matches('.btn') ? e.target : e.target.closest('.btn');
            createRipple(e, button);
        }
    });

    function createRipple(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    function updateTimeStamps() {
        const timeElements = document.querySelectorAll('.activity-time');
    }

    setInterval(updateTimeStamps, 60000);
    
    function showError(id, message) {
        const errorElement = document.getElementById(`${id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.opacity = '0';
            setTimeout(() => {
                errorElement.style.transition = 'opacity 0.3s ease';
                errorElement.style.opacity = '1';
            }, 10);
        }
    }
    
    function clearError(id) {
        const errorElement = document.getElementById(`${id}-error`);
        if (errorElement) {
            errorElement.style.opacity = '0';
            setTimeout(() => {
                errorElement.textContent = '';
                errorElement.style.transition = '';
                errorElement.style.opacity = '';
            }, 300);
        }
    }
    
    function clearErrorMessages() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.opacity = '';
            element.style.transition = '';
        });
        
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.classList.remove('error', 'success');
        });
    }
    
    function setInputState(input, state) {
        input.classList.remove('error', 'success');
        if (state === 'error' || state === 'success') {
            input.classList.add(state);
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            navigateTo('home');
        }
        
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    const keyboardStyle = document.createElement('style');
    keyboardStyle.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid var(--color-primary) !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(keyboardStyle);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    // 스크롤 애니메이션은 이미 initScrollAnimations에서 한 번만 호출
    prefersReducedMotion.addEventListener('change', () => {
        if (prefersReducedMotion.matches) {
            document.body.style.setProperty('--duration-fast', '0ms');
            document.body.style.setProperty('--duration-normal', '0ms');
            document.body.style.setProperty('--duration-slow', '0ms');
        } else {
            document.body.style.removeProperty('--duration-fast');
            document.body.style.removeProperty('--duration-normal');
            document.body.style.removeProperty('--duration-slow');
        }
    });

    window.addEventListener('error', (e) => {
        console.error('Application error:', e.error);
    });

    if ('serviceWorker' in navigator) {
    }

    const pageTransitions = {
        'home': { from: 'bottom', duration: 400 },
        'signup': { from: 'right', duration: 300 },
        'mypage': { from: 'left', duration: 300 },
        'default': { from: 'top', duration: 250 }
    };

    window.CodingPlatform = {
        navigateTo,
        toggleTheme,
        state
    };

    console.log('로드 성공');

    // =========================
    // 게시판 기능 (board.js 통합)
    // =========================
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

    function savePost(event) {
      event.preventDefault();
      const title = document.getElementById('title').value.trim();
      const category = document.getElementById('category')?.value || '';
      const language = document.getElementById('language')?.value || '';
      const author = document.getElementById('author').value.trim();
      const content = document.getElementById('content').value.trim();
      const date = new Date().toISOString().split('T')[0];
      const newPost = { title, category, language, author, content, date };

      const type = state.boardType === 'notice' ? 'notice' : 'question';
      const key = type === 'notice' ? 'notices' : 'posts';
      const isEdit = !!state.editIndex;

      let posts = JSON.parse(localStorage.getItem(key) || '[]');

      if (isEdit) {
        posts[state.editIndex] = newPost;
        state.editIndex = null;
        state.editData = null;
      } else {
        posts.push(newPost);
      }

      localStorage.setItem(key, JSON.stringify(posts));
      navigateTo('discussion');
      renderBoard();
    }

    function renderBoard() {
      const list = document.getElementById('postList');
      const title = document.getElementById('boardTitle');
      const pagination = document.getElementById('pagination');
      if (!list || !title || !pagination) return;

      const type = state.boardType === 'notice' ? 'notice' : 'question';
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
      let currentPage = state.boardPage || 1;

      function renderPosts() {
        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;
        const pagePosts = posts.slice(start, end);

        list.innerHTML = pagePosts.map((post, index) => `
          <tr>
            <td><a href="#" class="view-post-link" data-index="${start + index}">${post.title}</a></td>
            <td>${post.category || '-'}</td>
            <td>${post.language || '-'}</td>
            <td>${post.author}</td>
            <td>${post.date}</td>
          </tr>
        `).join('');
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
            state.boardPage = i;
            renderPosts();
          });
          pagination.appendChild(btn);
        }
      }

      renderPosts();

      // 게시글 클릭 이벤트
      list.querySelectorAll('.view-post-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          state.viewIndex = parseInt(link.dataset.index, 10);
          navigateTo('view-board');
          renderViewBoard();
        });
      });

      // 버튼 스타일
      const qBtn = document.getElementById("questionBtn");
      const nBtn = document.getElementById("noticeBtn");
      if (qBtn && nBtn) {
        if (type === 'question') {
          qBtn.classList.add("btn--primary");
          nBtn.classList.add("btn--secondary");
        } else {
          nBtn.classList.add("btn--primary");
          qBtn.classList.add("btn--secondary");
        }
      }
    }

    function renderViewBoard() {
      const viewTitle = document.getElementById('viewTitle');
      if (!viewTitle) return;
      const type = state.boardType === 'notice' ? 'notice' : 'question';
      const key = type === 'notice' ? 'notices' : 'posts';
      const index = state.viewIndex;
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
      if (type === 'notice') {
        categoryEl?.parentElement?.style.setProperty('display', 'none');
        languageEl?.parentElement?.style.setProperty('display', 'none');
      } else {
        categoryEl.textContent = post.category;
        languageEl.textContent = post.language;
        categoryEl?.parentElement?.style.removeProperty('display');
        languageEl?.parentElement?.style.removeProperty('display');
      }
      document.getElementById('editBtn')?.addEventListener('click', () => {
        state.editIndex = index;
        state.editData = post;
        navigateTo('write-board');
        renderWriteBoard();
      });
      document.getElementById('deleteBtn')?.addEventListener('click', () => {
        if (confirm('정말 삭제하시겠습니까?')) {
          posts.splice(index, 1);
          localStorage.setItem(key, JSON.stringify(posts));
          navigateTo('discussion');
          renderBoard();
        }
      });
      document.getElementById('backBtn')?.addEventListener('click', () => {
        navigateTo('discussion');
        renderBoard();
      });
    }

    function renderWriteBoard() {
      const form = document.getElementById('writeBoardForm');
      if (!form) return;
      form.reset();
      const type = state.boardType === 'notice' ? 'notice' : 'question';
      const formTitle = document.getElementById('formTitle');
      if (formTitle) {
        formTitle.textContent = state.editIndex != null
          ? (type === 'notice' ? '공지 수정' : '글 수정')
          : (type === 'notice' ? '공지 작성' : '글쓰기');
      }
      if (type === 'notice') {
        document.getElementById('category')?.style.setProperty('display', 'none');
        document.getElementById('language')?.style.setProperty('display', 'none');
      } else {
        document.getElementById('category')?.style.removeProperty('display');
        document.getElementById('language')?.style.removeProperty('display');
      }
      if (state.editIndex != null && state.editData) {
        document.getElementById('title').value = state.editData.title;
        document.getElementById('author').value = state.editData.author;
        document.getElementById('content').value = state.editData.content;
        if (type !== 'notice') {
          document.getElementById('category').value = state.editData.category;
          document.getElementById('language').value = state.editData.language;
        }
      }
      form.onsubmit = savePost;
      document.getElementById('writeBackBtn')?.addEventListener('click', () => {
        navigateTo('discussion');
        renderBoard();
      });
    }

    document.addEventListener('DOMContentLoaded', () => {
      // 게시판 네비 버튼
      document.getElementById('questionBtn')?.addEventListener('click', () => {
        state.boardType = 'question';
        state.boardPage = 1;
        renderBoard();
      });
      document.getElementById('noticeBtn')?.addEventListener('click', () => {
        state.boardType = 'notice';
        state.boardPage = 1;
        renderBoard();
      });
      document.getElementById('goToWriteBtn')?.addEventListener('click', () => {
        state.editIndex = null;
        state.editData = null;
        navigateTo('write-board');
        renderWriteBoard();
      });
      // 페이지 진입 시 게시판 초기화
      if (document.getElementById('discussion-page')) {
        if (!state.boardType) state.boardType = 'question';
        renderBoard();
      }
      if (document.getElementById('write-board-page')) {
        renderWriteBoard();
      }
      if (document.getElementById('view-board-page')) {
        renderViewBoard();
      }
    });
});