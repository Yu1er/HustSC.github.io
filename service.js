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
            // 构建北大法宝搜索URL
            const searchUrl = `https://alk.12348.gov.cn/LawMultiSearch?searchField=题名&keywords=${encodeURIComponent(searchTerm)}`;
            // 在新标签页中打开搜索结果
            window.open(searchUrl, '_blank');
        }
    }

    // 点击搜索按钮时执行搜索
    searchButton.addEventListener('click', performSearch);

    // 按回车键时也执行搜索
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}); 