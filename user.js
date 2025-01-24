document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    // 侧边栏菜单切换
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    const contentSections = document.querySelectorAll('.content-section');

    menuItems.forEach(item => {
        if (item.id === 'logoutBtn') {
            item.addEventListener('click', () => {
                if (confirm('确定要退出登录吗？')) {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userType');
                    window.location.href = 'index.html';
                }
            });
        } else {
            item.addEventListener('click', () => {
                // 移除所有活动状态
                menuItems.forEach(i => i.classList.remove('active'));
                contentSections.forEach(s => s.classList.remove('active'));

                // 添加新的活动状态
                item.classList.add('active');
                const tabId = item.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        }
    });

    // 表单保存按钮
    const saveBtns = document.querySelectorAll('.save-btn');
    saveBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('保存成功！');
        });
    });

    // 取消预约按钮
    const cancelBtns = document.querySelectorAll('.cancel-btn');
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('确定要取消该预约吗？')) {
                alert('预约已取消！');
                btn.closest('.appointment-item').remove();
            }
        });
    });
}); 