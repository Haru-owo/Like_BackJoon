// Enhanced JavaScript for the Programming Learning Platform - 2025 Edition

document.addEventListener('DOMContentLoaded', () => {
    // Application state
    const state = {
        currentPage: 'home',
        user: null,
        theme: 'light'
    };

    // Sample data from the provided JSON
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

    // Initialize the application
    initTheme();
    initNavigation();
    initSignupForm();
    initButtonNavigation();
    initThemeToggle();
    initCounterAnimations();
    initPasswordStrength();
    initScrollAnimations();
    
    // Theme management
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        state.theme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeToggle();
    }

    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
    }

    function toggleTheme() {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', state.theme);
        localStorage.setItem('theme', state.theme);
        updateThemeToggle();
        
        // Add a subtle animation effect
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

    // Navigation system with enhanced transitions
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

    // Button navigation
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

    // Enhanced page navigation with smooth transitions
    function navigateTo(pageName) {
        // Update active state in navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Get current and target pages
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
            
            // Fade in target page
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
                
                // Initialize page-specific features
                if (pageName === 'mypage') {
                    initCounterAnimations();
                }
            }, 150);
        }
    }

    // Counter animations for statistics
    function initCounterAnimations() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            let current = 0;
            const increment = target / 50; // Animation steps
            const duration = 1500; // Total duration in ms
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
            
            // Start animation when element is visible
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

    // Enhanced signup form validation with password strength
    function initSignupForm() {
        const signupForm = document.getElementById('signup-form');
        
        if (signupForm) {
            signupForm.addEventListener('submit', handleSignupSubmit);
            
            // Live validation on input fields
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
                
                // Add focus animations
                input.addEventListener('focus', () => {
                    input.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    input.parentElement.classList.remove('focused');
                });
            });
        }
    }

    // Password strength indicator
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
        
        // Calculate password strength
        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 25;
        
        // Cap at 100
        strength = Math.min(strength, 100);
        
        // Determine label
        if (strength === 0) strengthLabel = '비밀번호를 입력하세요';
        else if (strength < 50) strengthLabel = '약함';
        else if (strength < 75) strengthLabel = '보통';
        else if (strength < 100) strengthLabel = '강함';
        else strengthLabel = '매우 강함';
        
        // Update UI
        strengthBar.style.width = `${strength}%`;
        strengthText.textContent = `비밀번호 강도: ${strengthLabel}`;
        
        // Update color based on strength
        if (strength < 50) {
            strengthBar.style.background = 'var(--color-error)';
        } else if (strength < 75) {
            strengthBar.style.background = 'var(--color-warning)';
        } else {
            strengthBar.style.background = 'var(--gradient-primary)';
        }
    }

    // Form submission with enhanced UX
    function handleSignupSubmit(e) {
        e.preventDefault();
        
        // Reset error messages
        clearErrorMessages();
        
        // Get form values
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validate form
        let isValid = true;
        
        // Username validation
        if (username === '') {
            showError('username', '사용자명을 입력해주세요.');
            isValid = false;
        } else if (username.length < 3) {
            showError('username', '사용자명은 3자 이상이어야 합니다.');
            isValid = false;
        }
        
        // Email validation
        if (email === '') {
            showError('email', '이메일을 입력해주세요.');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', '올바른 이메일 형식이 아닙니다.');
            isValid = false;
        }
        
        // Password validation
        if (password === '') {
            showError('password', '비밀번호를 입력해주세요.');
            isValid = false;
        } else if (password.length < 6) {
            showError('password', '비밀번호는 6자 이상이어야 합니다.');
            isValid = false;
        }
        
        // Confirm password validation
        if (confirmPassword === '') {
            showError('confirm-password', '비밀번호 확인을 입력해주세요.');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirm-password', '비밀번호가 일치하지 않습니다.');
            isValid = false;
        }
        
        // Form submission with enhanced loading state
        if (isValid) {
            const submitButton = e.target.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Enhanced loading state
            submitButton.classList.add('loading');
            submitButton.innerHTML = '<span>처리 중...</span>';
            submitButton.disabled = true;
            
            // Simulate API call with realistic delay
            setTimeout(() => {
                // Reset form
                e.target.reset();
                
                // Show enhanced success message
                const successMessage = document.getElementById('success-message');
                successMessage.classList.remove('hidden');
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    successMessage.style.transition = 'all 0.3s ease';
                    successMessage.style.opacity = '1';
                    successMessage.style.transform = 'translateY(0)';
                }, 10);
                
                // Reset button
                submitButton.classList.remove('loading');
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Clear password strength
                updatePasswordStrength('');
                
                // Set user state
                state.user = {
                    username: username,
                    email: email
                };
                
                // Automatically navigate to home after successful signup
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
    
    // Input validation helper with enhanced visual feedback
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
                    
                    // Check if confirm password needs validation
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

    // Scroll animations for elements
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

    // Smooth scrolling for anchor links
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

    // Add ripple effect to buttons
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
        
        // Add ripple styles
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

    // Add CSS for ripple animation
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

    // Auto-update time stamps (for demo purposes)
    function updateTimeStamps() {
        const timeElements = document.querySelectorAll('.activity-time');
        // This would normally fetch real-time data
        // For demo, we'll just keep the static times
    }

    // Initialize auto-update
    setInterval(updateTimeStamps, 60000); // Update every minute
    
    // Helper functions
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

    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // Escape key to close modals or return to home
        if (e.key === 'Escape') {
            navigateTo('home');
        }
        
        // Tab navigation enhancement
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    // Mouse usage detection
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Add keyboard navigation styles
    const keyboardStyle = document.createElement('style');
    keyboardStyle.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid var(--color-primary) !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(keyboardStyle);

    // Performance optimization: Lazy load non-critical animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (!prefersReducedMotion.matches) {
        // Only add animations if user hasn't requested reduced motion
        initScrollAnimations();
    }

    // Handle reduced motion preference changes
    prefersReducedMotion.addEventListener('change', () => {
        if (prefersReducedMotion.matches) {
            // Disable animations
            document.body.style.setProperty('--duration-fast', '0ms');
            document.body.style.setProperty('--duration-normal', '0ms');
            document.body.style.setProperty('--duration-slow', '0ms');
        } else {
            // Re-enable animations
            document.body.style.removeProperty('--duration-fast');
            document.body.style.removeProperty('--duration-normal');
            document.body.style.removeProperty('--duration-slow');
        }
    });

    // Error handling for the entire application
    window.addEventListener('error', (e) => {
        console.error('Application error:', e.error);
        // In a real application, you might want to send this to a logging service
    });

    // Initialize progressive web app features
    if ('serviceWorker' in navigator) {
        // Service worker registration would go here for offline functionality
    }

    // Add smooth transitions between pages
    const pageTransitions = {
        'home': { from: 'bottom', duration: 400 },
        'signup': { from: 'right', duration: 300 },
        'mypage': { from: 'left', duration: 300 },
        'default': { from: 'top', duration: 250 }
    };

    // Export functions for potential external use
    window.CodingPlatform = {
        navigateTo,
        toggleTheme,
        state
    };

    console.log('🚀 코딩플랫폼이 성공적으로 로드되었습니다!');
});