document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    const messageForm = document.getElementById('messageForm');
    const messageList = document.querySelector('.message-list');

    // 分页相关变量
    const itemsPerPage = 5; // 每页显示的留言数
    let currentPage = 1;
    let totalMessages = 0;
    let messagesList = []; // 存储所有留言的数组

    // 预设的留言数据
    const presetMessages = [
        {
            id: 1,
            title: "如何申请法律援助？",
            date: "2024-01-20",
            status: "replied"
        },
        {
            id: 6,
            title: "未成年人打工的法律规定",
            date: "2024-01-15",
            status: "replied"
        },
        {
            id: 7,
            title: "试用期解除劳动合同的补偿",
            date: "2024-01-14",
            status: "replied"
        },
        {
            id: 8,
            title: "租房合同违约金过高怎么办",
            date: "2024-01-13",
            status: "replied"
        },
        {
            id: 9,
            title: "工伤康复期间的工资待遇",
            date: "2024-01-12",
            status: "replied"
        },
        {
            id: 10,
            title: "婚内财产约定需要公证吗",
            date: "2024-01-11",
            status: "replied"
        }
    ];

    // 从localStorage加载已保存的留言
    function loadSavedMessages() {
        // 清空现有留言列表
        messageList.innerHTML = '';
        
        // 获取用户发布的留言
        const savedMessages = JSON.parse(localStorage.getItem('userMessages') || '[]');
        
        // 合并预设留言和用户留言
        const allMessages = [...savedMessages, ...presetMessages];
        
        // 按日期排序（新的在前）
        allMessages.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 添加所有留言
        allMessages.forEach(message => {
            const messageHTML = createMessageHTML(message);
            messageList.insertAdjacentHTML('beforeend', messageHTML);
        });

        // 加载完留言后立即初始化分页
        initPagination();
    }

    // 创建留言HTML
    function createMessageHTML(message) {
        return `
            <div class="message-item">
                <div class="message-title">
                    <span class="status-badge ${message.status}">${message.status === 'pending' ? '待回复' : '已回复'}</span>
                    <a href="message-detail.html?id=${message.id}">${message.title}</a>
                </div>
                <div class="message-meta">
                    <span class="time">${message.date}</span>
                </div>
            </div>
        `;
    }

    // 保存留言到localStorage
    function saveMessage(message) {
        const savedMessages = JSON.parse(localStorage.getItem('userMessages') || '[]');
        savedMessages.unshift(message); // 添加到数组开头
        localStorage.setItem('userMessages', JSON.stringify(savedMessages));
    }

    // 初始化分页
    function initPagination() {
        // 获取所有留言项
        const messageItems = document.querySelectorAll('.message-item');
        messagesList = Array.from(messageItems);
        totalMessages = messagesList.length;
        const totalPages = Math.ceil(totalMessages / itemsPerPage);

        // 更新分页控件
        updatePaginationControls(totalPages);
        // 显示第一页，不滚动
        showPage(1, false);
    }

    // 更新分页控件
    function updatePaginationControls(totalPages) {
        const pagination = document.querySelector('.pagination');
        let paginationHTML = '';

        // 上一页按钮
        paginationHTML += `
            <button class="page-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // 页码按钮
        if (totalPages <= 5) {
            // 如果总页数小于等于5，显示所有页码
            for (let i = 1; i <= totalPages; i++) {
                paginationHTML += `
                    <button class="page-btn ${currentPage === i ? 'active' : ''}" data-page="${i}">
                        ${i}
                    </button>
                `;
            }
        } else {
            // 如果总页数大于5，显示部分页码
            if (currentPage <= 3) {
                // 当前页在前3页
                for (let i = 1; i <= 4; i++) {
                    paginationHTML += `
                        <button class="page-btn ${currentPage === i ? 'active' : ''}" data-page="${i}">
                            ${i}
                        </button>
                    `;
                }
                paginationHTML += '<span class="page-dots">...</span>';
                paginationHTML += `
                    <button class="page-btn" data-page="${totalPages}">${totalPages}</button>
                `;
            } else if (currentPage >= totalPages - 2) {
                // 当前页在后3页
                paginationHTML += `
                    <button class="page-btn" data-page="1">1</button>
                    <span class="page-dots">...</span>
                `;
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    paginationHTML += `
                        <button class="page-btn ${currentPage === i ? 'active' : ''}" data-page="${i}">
                            ${i}
                        </button>
                    `;
                }
            } else {
                // 当前页在中间
                paginationHTML += `
                    <button class="page-btn" data-page="1">1</button>
                    <span class="page-dots">...</span>
                `;
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    paginationHTML += `
                        <button class="page-btn ${currentPage === i ? 'active' : ''}" data-page="${i}">
                            ${i}
                        </button>
                    `;
                }
                paginationHTML += '<span class="page-dots">...</span>';
                paginationHTML += `
                    <button class="page-btn" data-page="${totalPages}">${totalPages}</button>
                `;
            }
        }

        // 下一页按钮
        paginationHTML += `
            <button class="page-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        pagination.innerHTML = paginationHTML;

        // 添加页码点击事件
        const pageButtons = pagination.querySelectorAll('.page-btn');
        pageButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (this.classList.contains('prev-btn')) {
                    if (currentPage > 1) showPage(currentPage - 1, true);
                } else if (this.classList.contains('next-btn')) {
                    if (currentPage < totalPages) showPage(currentPage + 1, true);
                } else {
                    const pageNum = parseInt(this.dataset.page);
                    if (pageNum) showPage(pageNum, true);
                }
            });
        });
    }

    // 显示指定页的留言
    function showPage(pageNum, shouldScroll = false) {
        currentPage = pageNum;
        const start = (pageNum - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        // 隐藏所有留言
        messagesList.forEach(item => item.style.display = 'none');
        
        // 显示当前页的留言
        messagesList.slice(start, end).forEach(item => item.style.display = 'flex');

        // 更新分页控件
        updatePaginationControls(Math.ceil(totalMessages / itemsPerPage));

        // 只在需要时滚动到留言列表顶部
        if (shouldScroll) {
            document.querySelector('.message-list-section').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // 发布留言
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const titleInput = this.querySelector('input[type="text"]');
        const contentTextarea = this.querySelector('textarea');
        const title = titleInput.value.trim();
        const content = contentTextarea.value.trim();
        
        if (!title || !content) return;

        const now = new Date();
        const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        
        // 生成一个临时的唯一ID
        const tempId = Date.now();

        // 创建新留言对象
        const newMessage = {
            id: tempId,
            title: title,
            content: content,
            date: date,
            status: 'pending'
        };

        // 保存到localStorage
        saveMessage(newMessage);

        // 重新加载所有留言并应用分页
        loadSavedMessages();

        // 清空表单
        titleInput.value = '';
        contentTextarea.value = '';

        // 显示发布成功提示
        const messageBox = document.createElement('div');
        messageBox.className = 'message-box success';
        messageBox.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>留言发布成功！</span>
        `;
        document.body.appendChild(messageBox);

        // 2秒后自动消失
        setTimeout(() => {
            messageBox.classList.add('fade-out');
            setTimeout(() => {
                messageBox.remove();
            }, 300);
        }, 2000);
    });

    // 页面加载时显示已保存的留言
    loadSavedMessages();

    // 为所有回复按钮添加事件处理
    function addReplyButtonHandler(messageItem) {
        const replyBtn = messageItem.querySelector('.reply-btn');
        const replyList = messageItem.querySelector('.reply-list');
        
        replyBtn.addEventListener('click', function() {
            const replyForm = document.createElement('div');
            replyForm.className = 'reply-form';
            replyForm.innerHTML = `
                <textarea placeholder="请输入回复内容..."></textarea>
                <button type="button">发送</button>
            `;
            
            replyList.insertAdjacentElement('beforeend', replyForm);
            
            const textarea = replyForm.querySelector('textarea');
            const sendBtn = replyForm.querySelector('button');
            
            sendBtn.addEventListener('click', function() {
                const content = textarea.value.trim();
                if (!content) return;
                
                const now = new Date();
                const time = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                
                const replyHTML = `
                    <div class="reply-item">
                        <div class="reply-header">
                            <img src="首页Pic/avatar.png" alt="用户头像" class="user-avatar">
                            <div class="reply-info">
                                <span class="username">我</span>
                                <span class="time">${time}</span>
                            </div>
                        </div>
                        <div class="reply-content">
                            ${content}
                        </div>
                    </div>
                `;
                
                replyForm.remove();
                replyList.insertAdjacentHTML('beforeend', replyHTML);
            });
        });
    }

    // 为现有的留言添加回复功能
    document.querySelectorAll('.message-item').forEach(addReplyButtonHandler);
}); 