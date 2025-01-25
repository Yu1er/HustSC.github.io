document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    const chatMessages = document.querySelector('.chat-messages');
    const textarea = document.querySelector('.input-main textarea');
    const sendBtn = document.querySelector('.send-btn');
    const workerItems = document.querySelectorAll('.worker-item');

    // 发送消息
    function sendMessage() {
        const text = textarea.value.trim();
        if (!text) return;

        const now = new Date();
        const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

        const messageHTML = `
            <div class="message user">
                <div class="message-content">
                    <div class="message-info">我 ${time}</div>
                    <div class="message-text">${text}</div>
                </div>
                <img src="首页Pic/avatar.png" alt="用户头像" class="avatar">
            </div>
        `;

        chatMessages.insertAdjacentHTML('beforeend', messageHTML);
        textarea.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // 模拟社工回复
        setTimeout(() => {
            const replyHTML = `
                <div class="message worker">
                    <img src="首页Pic/avatar.png" alt="社工头像" class="avatar">
                    <div class="message-content">
                        <div class="message-info">华小法 ${time}</div>
                        <div class="message-text">收到您的消息，我们会认真处理您的问题。</div>
                    </div>
                </div>
            `;
            chatMessages.insertAdjacentHTML('beforeend', replyHTML);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }

    // 发送消息事件
    sendBtn.addEventListener('click', sendMessage);
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // 切换社工
    workerItems.forEach(item => {
        item.addEventListener('click', () => {
            workerItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const name = item.querySelector('.worker-name').textContent;
            const status = item.querySelector('.worker-status').classList.contains('online') ? '在线' : '离线';
            
            document.querySelector('.current-worker .name').textContent = name;
            document.querySelector('.current-worker .status').textContent = status;
        });
    });

    // 视频通话和语音通话
    document.querySelector('.video-call').addEventListener('click', () => {
        alert('视频通话功能即将上线');
    });

    document.querySelector('.voice-call').addEventListener('click', () => {
        alert('语音通话功能即将上线');
    });

    // 常见问题列表
    const questionSets = [
        [
            "工伤保险的参保范围是什么？",
            "如何做工伤认定？",
            "工伤认定后就可以做伤残鉴定？",
            "下班后自愿加班猝死算工伤吗？",
            "工伤期间可以享受什么待遇"
        ],
        [
            "劳动合同到期后没续签怎么办？",
            "试用期辞退需要赔偿吗？",
            "年假怎么计算？",
            "加班费如何计算？",
            "工资被拖欠怎么办？"
        ],
        [
            "房屋买卖合同纠纷如何处理？",
            "租房合同纠纷如何解决？",
            "物业服务纠纷怎么办？",
            "装修合同纠纷如何处理？",
            "借贷纠纷如何解决？"
        ]
    ];

    let currentQuestionSet = 0;

    // 更新问题列表
    function updateQuestions() {
        const questions = questionSets[currentQuestionSet];
        const questionLinks = document.querySelector('.question-links');
        if (questionLinks) {
            questionLinks.innerHTML = questions.map(q => 
                `<a href="javascript:void(0)" class="question-link">${q}</a><br>`
            ).join('');

            // 为新的问题链接添加点击事件
            const links = questionLinks.querySelectorAll('.question-link');
            links.forEach(link => {
                link.onclick = function(e) {
                    e.preventDefault();
                    const text = this.textContent;
                    
                    // 模拟用户发送消息
                    const now = new Date();
                    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
                    
                    const messageHTML = `
                        <div class="message user">
                            <div class="message-content">
                                <div class="message-info">我 ${time}</div>
                                <div class="message-text">${text}</div>
                            </div>
                            <img src="首页Pic/avatar.png" alt="用户头像" class="avatar">
                        </div>
                    `;
                    
                    chatMessages.insertAdjacentHTML('beforeend', messageHTML);
                    chatMessages.scrollTop = chatMessages.scrollHeight;

                    // 模拟机器人回复
                    setTimeout(() => {
                        const replyHTML = `
                            <div class="message worker">
                                <img src="首页Pic/robot.png" alt="机器人头像" class="avatar">
                                <div class="message-content">
                                    <div class="message-info">华小法 ${time}</div>
                                    <div class="message-text">我正在查询相关法律条款，请稍候...</div>
                                </div>
                            </div>
                        `;
                        chatMessages.insertAdjacentHTML('beforeend', replyHTML);
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }, 1000);
                };
            });
        }
    }

    // 换一批按钮点击事件
    document.querySelector('.refresh-questions').onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        currentQuestionSet = (currentQuestionSet + 1) % questionSets.length;
        updateQuestions();
    };

    // 初始化问题列表
    updateQuestions();
}); 