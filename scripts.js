// 登录弹窗功能
window.initLoginModal = function() {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const closeBtns = document.querySelectorAll('.close-btn');
    const loginTabs = document.querySelectorAll('.login-tabs .tab');
    const loginFormElement = loginForm.querySelector('.login-form');

    // 检查登录状态
    if (localStorage.getItem('isLoggedIn')) {
        loginBtn.textContent = '用户中心';
        loginBtn.href = 'user.html';
    }

    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (localStorage.getItem('isLoggedIn')) {
                // 已登录则跳转到用户中心页面
                window.location.href = 'user.html';
            } else {
                // 未登录则显示登录框
                loginModal.style.display = 'flex';
            }
        });

        // 关闭按钮
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                loginModal.style.display = 'none';
            });
        });

        // 点击弹窗外部关闭
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
            }
        });

        // 登录标签切换
        if (loginTabs) {
            loginTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    loginTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                });
            });
        }

        // 处理登录表单提交
        if (loginFormElement) {
            loginFormElement.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = loginFormElement.querySelector('input[type="text"]').value;
                const password = loginFormElement.querySelector('input[type="password"]').value;
                const isUserTab = loginTabs[0].classList.contains('active');

                if (username === 'hust' && password === '123456') {
                    // 登录成功
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userType', isUserTab ? 'user' : 'worker');
                    
                    loginBtn.textContent = '用户中心';
                    loginBtn.href = 'user.html';
                    loginModal.style.display = 'none';
                    loginFormElement.reset();
                    
                    alert('登录成功！');
                    location.reload();
                } else {
                    alert('账号或密码错误！');
                }
            });
        }
    }
};

// 检查登录状态的函数
window.checkLoginStatus = function() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn && localStorage.getItem('isLoggedIn')) {
        loginBtn.textContent = '用户中心';
        loginBtn.href = 'user.html';
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Banner slider functionality
    const banners = document.querySelectorAll('.banner-img');
    const dots = document.querySelectorAll('.banner-dot');
    const prevBtn = document.querySelector('.banner-arrow.prev');
    const nextBtn = document.querySelector('.banner-arrow.next');
    let currentIndex = 0;
    let timer = null;

    function showBanner(index) {
        banners.forEach(banner => banner.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentIndex = index;
        if (currentIndex >= banners.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = banners.length - 1;
        
        banners[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }

    function startAutoPlay() {
        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            showBanner(currentIndex + 1);
        }, 5000);
    }

    // Banner controls event listeners
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showBanner(index);
            startAutoPlay();
        });
    });

    prevBtn.addEventListener('click', () => {
        showBanner(currentIndex - 1);
        startAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
        showBanner(currentIndex + 1);
        startAutoPlay();
    });

    document.querySelector('.banner-container').addEventListener('mouseenter', () => {
        if (timer) clearInterval(timer);
    });

    document.querySelector('.banner-container').addEventListener('mouseleave', () => {
        startAutoPlay();
    });

    startAutoPlay();

    // 精彩活动图片自动滚动
    const activitiesWrapper = document.querySelector('.activities-wrapper');
    const images = activitiesWrapper.querySelectorAll('img');
    const imageWidth = images[0].offsetWidth + 20; // 图片宽度 + margin
    let scrollPosition = 0;
    let isScrolling = true;
    
    function cloneImages() {
        // 克隆所有图片并添加到末尾
        images.forEach(img => {
            const clone = img.cloneNode(true);
            activitiesWrapper.appendChild(clone);
        });
    }

    function scrollActivities() {
        if (!isScrolling) return;
        
        scrollPosition -= 1; // 每次移动1像素
        
        // 当滚动到第一组图片的末尾时
        if (Math.abs(scrollPosition) >= imageWidth * images.length) {
            // 立即重置到开始位置
            scrollPosition = 0;
            activitiesWrapper.style.transition = 'none';
            activitiesWrapper.style.transform = `translateX(${scrollPosition}px)`;
            // 强制重排
            void activitiesWrapper.offsetWidth;
            // 恢复过渡效果
            activitiesWrapper.style.transition = 'transform 0.5s ease';
        }
        
        activitiesWrapper.style.transform = `translateX(${scrollPosition}px)`;
        requestAnimationFrame(scrollActivities);
    }

    // 初始化滚动
    function initializeScroll() {
        // 克隆图片
        cloneImages();
        // 设置初始过渡效果
        activitiesWrapper.style.transition = 'transform 0.5s ease';
        // 开始滚动
        scrollActivities();
    }
    if (window.innerWidth > 768){
    // 鼠标悬停控制
        activitiesWrapper.addEventListener('mouseenter', () => {
            isScrolling = false;
        });

        activitiesWrapper.addEventListener('mouseleave', () => {
            isScrolling = true;
            scrollActivities();
        });
    }
    // 等待图片加载完成后初始化
    window.addEventListener('load', initializeScroll);

    // 返回顶部功能
    const backToTop = document.querySelector('.back-to-top');
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'  // 平滑滚动
        });
    });

    // 轮播图功能
    function initCarousel() {
        const carousel = document.querySelector('.carousel');
        const carouselInner = carousel.querySelector('.carousel-inner');
        const items = carousel.querySelectorAll('.carousel-item');
        const dots = carousel.querySelectorAll('.dot');
        let currentIndex = 0;
        let intervalId;

        // 更新活动点
        function updateDots() {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        // 滚动到指定索引
        function scrollToIndex(index) {
            currentIndex = index;
            const offset = -index * 100;
            carouselInner.style.transform = `translateX(${offset}%)`;
            updateDots();
        }

        // 自动滚动
        function startAutoScroll() {
            intervalId = setInterval(() => {
                currentIndex = (currentIndex + 1) % items.length;
                scrollToIndex(currentIndex);
            }, 3000);
        }

        // 停止自动滚动
        function stopAutoScroll() {
            clearInterval(intervalId);
        }

        // 重启自动滚动
        function restartAutoScroll() {
            stopAutoScroll();
            startAutoScroll();
        }

        // 点击事件处理
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                scrollToIndex(index);
                restartAutoScroll();
            });
        });

        // 触摸事件处理
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            stopAutoScroll();
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
            touchEndX = e.touches[0].clientX;
        }, { passive: true });

        carousel.addEventListener('touchend', () => {
            const difference = touchStartX - touchEndX;
            if (Math.abs(difference) > 50) { // 最小滑动距离
                if (difference > 0) {
                    // 向左滑动
                    currentIndex = (currentIndex + 1) % items.length;
                } else {
                    // 向右滑动
                    currentIndex = (currentIndex - 1 + items.length) % items.length;
                }
                scrollToIndex(currentIndex);
            }
            startAutoScroll();
        });

        // 鼠标悬停时暂停
        carousel.addEventListener('mouseenter', stopAutoScroll);
        carousel.addEventListener('mouseleave', startAutoScroll);

        // 开始自动滚动
        startAutoScroll();
    }

    // 当DOM加载完成时初始化轮播图
    initCarousel();

    // 初始化登录弹窗和检查登录状态
    initLoginModal();
    checkLoginStatus();
});

// 页面加载完成后也初始化登录弹窗和检查登录状态
window.onload = function() {
    initLoginModal();
    checkLoginStatus();
}; 