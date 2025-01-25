document.addEventListener('DOMContentLoaded', function() {
    // 返回顶部功能
    const backToTop = document.querySelector('.back-to-top');
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 搜索框功能
    const searchBox = document.querySelector('.search-box');
    const searchInput = searchBox.querySelector('input');
    const searchButton = searchBox.querySelector('button');

    // 搜索框动画效果
    searchInput.addEventListener('focus', () => {
        searchBox.classList.add('focused');
    });
    searchInput.addEventListener('blur', () => {
        searchBox.classList.remove('focused');
    });

    // 搜索功能
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            const searchUrl = `https://alk.12348.gov.cn/LawMultiSearch?searchField=题名&keywords=${encodeURIComponent(searchTerm)}`;
            window.open(searchUrl, '_blank');
        }
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 初始化登录功能
    if (typeof window.initLoginModal === 'function') {
        window.initLoginModal();
    }
    if (typeof window.checkLoginStatus === 'function') {
        window.checkLoginStatus();
    }

    // 添加检查登录并跳转的函数
    window.checkLoginAndRedirect = function(url) {
        if (localStorage.getItem('isLoggedIn')) {
            window.location.href = url;
        } else {
            alert('请先登录后再使用实时咨询服务');
            document.getElementById('loginBtn').click();
        }
    };
}); 