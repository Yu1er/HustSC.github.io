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

    // 添加问题点击事件
    const questionLinks = document.querySelectorAll('.question-link');
    questionLinks.forEach(link => {
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
                    <img src="服务Pic/avatar.png" alt="用户头像" class="avatar">
                </div>
            `;
            
            chatMessages.insertAdjacentHTML('beforeend', messageHTML);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // 模拟机器人回复
            setTimeout(() => {
                const replyHTML = `
                    <div class="message worker">
                        <img src="服务Pic/robot.png" alt="机器人头像" class="avatar">
                        <div class="message-content">
                            <div class="message-info">华小法 ${time}</div>
                            <div class="message-text">我正在查询相关法律条款，请稍候...</div>
                        </div>
                    </div>
                `;
                chatMessages.insertAdjacentHTML('beforeend', replyHTML);
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // 2秒后显示具体回复内容
                setTimeout(() => {
                    const detailReplyHTML = `
                        <div class="message worker">
                            <img src="服务Pic/robot.png" alt="机器人头像" class="avatar">
                            <div class="message-content">
                                <div class="message-info">华小法 ${time}</div>
                                <div class="message-text">${getReplyContent(text)}</div>
                            </div>
                        </div>
                    `;
                    chatMessages.insertAdjacentHTML('beforeend', detailReplyHTML);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 2000);
            }, 1000);
        };
    });

    // 获取回复内容的函数
    function getReplyContent(question) {
        const replies = {
            "工伤保险的参保范围是什么？": 
                "根据《工伤保险条例》规定，工伤保险的参保范围包括：\n" +
                "1. 各类企业、事业单位\n" +
                "2. 社会团体、民办非企业单位\n" +
                "3. 基金会、律师事务所、会计师事务所等组织\n" +
                "4. 有雇工的个体工商户\n\n" +
                "以上单位的全部职工都应当参加工伤保险。",

            "如何做工伤认定？": 
                "工伤认定的基本流程如下：\n" +
                "1. 在事故发生后48小时内向用人单位报告\n" +
                "2. 用人单位应在30日内向工伤保险行政部门提出工伤认定申请\n" +
                "3. 收集相关证据材料（医疗诊断证明、事故证明等）\n" +
                "4. 等待工伤认定决定书\n\n" +
                "如果用人单位不申请，职工可以直接申请工伤认定。",

            "工伤认定后就可以做伤残鉴定？":
                "不是的，工伤认定和伤残鉴定是两个不同的程序：\n" +
                "1. 必须先有工伤认定决定书\n" +
                "2. 等伤情相对稳定后才能进行伤残鉴定\n" +
                "3. 一般要等待伤情治疗稳定期（通常需要6个月以上）\n" +
                "4. 由指定的伤残鉴定机构进行鉴定\n\n" +
                "建议您等医生确认伤情稳定后再申请伤残鉴定。",

            "下班后自愿加班猝死算工伤吗？":
                "这种情况需要具体分析：\n" +
                "1. 如果是单位安排或默许的加班，可能认定为工伤\n" +
                "2. 需要证明加班与工作有直接关系\n" +
                "3. 要有加班的相关证据（考勤记录、工作记录等）\n" +
                "4. 死亡与工作的因果关系证明\n\n" +
                "建议收集相关证据，申请工伤认定。",

            "工伤期间可以享受什么待遇":
                "工伤期间的待遇主要包括：\n" +
                "1. 工伤医疗费用全额报销\n" +
                "2. 住院伙食补助费\n" +
                "3. 停工留薪期间的工资福利\n" +
                "4. 护理费、交通费、康复费等\n" +
                "5. 住院期间的陪护费\n\n" +
                "具体待遇标准可能因地区不同有所差异。"
        };
        
        return replies[question] || "这个问题比较复杂，建议您详细描述具体情况，以便我为您提供更准确的答复。";
    }

    // 发送消息功能
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
                <img src="服务Pic/avatar.png" alt="用户头像" class="avatar">
            </div>
        `;

        chatMessages.insertAdjacentHTML('beforeend', messageHTML);
        textarea.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // 模拟机器人回复
        setTimeout(() => {
            const replyHTML = `
                <div class="message worker">
                    <img src="服务Pic/robot.png" alt="机器人头像" class="avatar">
                    <div class="message-content">
                        <div class="message-info">华小法 ${time}</div>
                        <div class="message-text">您好，我理解您的问题。请您详细描述具体情况，以便我为您提供更准确的答复。</div>
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
                            <img src="服务Pic/avatar.png" alt="用户头像" class="avatar">
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