document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    // 加载用户信息
    loadUserInfo();
    
    // 加载预约记录
    loadAppointments();

    // 导航切换
    const navLinks = document.querySelectorAll('.user-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });

    // 退出登录
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('确定要退出登录吗？')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            window.location.href = 'index.html';
        }
    });

    // 保存个人信息
    document.getElementById('saveProfileBtn').addEventListener('click', saveProfile);

    // 修改密码
    document.getElementById('changePasswordBtn').addEventListener('click', changePassword);

    // 预约记录筛选
    document.getElementById('searchBtn').addEventListener('click', loadAppointments);

    // 添加输入监听，实时验证
    addInputValidation();
});

// 切换内容区域
function switchSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.user-nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    document.querySelector(`.user-nav a[data-section="${sectionId}"]`).classList.add('active');
}

// 加载用户信息
function loadUserInfo() {
    // 从 localStorage 获取用户名
    const username = localStorage.getItem('username');
    if (username) {
        // 更新侧边栏和个人信息表单中的用户名
        document.getElementById('sidebarUsername').textContent = username;
        document.getElementById('username').value = username;
    } else {
        // 如果没有用户名，可能是登录状态异常，重定向到登录页
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
        return;
    }
    
    // 从 localStorage 获取用户详细信息
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    
    // 填充其他个人信息表单字段
    document.getElementById('realName').value = userInfo.realName || '';
    document.getElementById('phone').value = userInfo.phone || '';
    document.getElementById('email').value = userInfo.email || '';

    // 如果有手机号，同步到预约信息中
    if (userInfo.phone) {
        localStorage.setItem('lastUsedPhone', userInfo.phone);
    }
}

// 保存个人信息
function saveProfile() {
    const userInfo = {
        realName: document.getElementById('realName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value
    };

    // 验证手机号
    if (userInfo.phone && !/^1[3-9]\d{9}$/.test(userInfo.phone)) {
        showMessage('请输入正确的手机号码', 'error');
        return;
    }

    // 验证邮箱
    if (userInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
        showMessage('请输入正确的邮箱地址', 'error');
        return;
    }

    try {
        // 保存用户信息
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        // 显示成功提示
        showMessage('个人信息保存成功', 'success');
        
        // 添加保存成功的视觉反馈
        const saveBtn = document.getElementById('saveProfileBtn');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '保存成功';
        saveBtn.style.backgroundColor = '#52c41a';
        saveBtn.disabled = true;
        
        // 3秒后恢复按钮状态
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.backgroundColor = '';
            saveBtn.disabled = false;
        }, 3000);
        
    } catch (error) {
        console.error('保存个人信息失败:', error);
        showMessage('保存失败，请稍后重试', 'error');
    }
}

// 添加输入监听，实时验证
function addInputValidation() {
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    
    phoneInput.addEventListener('input', function() {
        if (this.value && !/^1[3-9]\d{9}$/.test(this.value)) {
            this.classList.add('invalid');
        } else {
            this.classList.remove('invalid');
        }
    });
    
    emailInput.addEventListener('input', function() {
        if (this.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
            this.classList.add('invalid');
        } else {
            this.classList.remove('invalid');
        }
    });
}

// 修改密码
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        showMessage('请填写完整的密码信息', 'warning');
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage('两次输入的新密码不一致', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showMessage('新密码长度不能少于6位', 'warning');
        return;
    }

    // 这里应该与后端验证当前密码是否正确
    // 目前仅做模拟
    showMessage('密码修改成功', 'success');
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

// 加载预约记录
function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const username = localStorage.getItem('username');
    const statusFilter = document.getElementById('statusFilter').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // 筛选用户的预约记录
    let filteredAppointments = appointments.filter(app => app.username === username);

    // 按状态筛选
    if (statusFilter !== 'all') {
        filteredAppointments = filteredAppointments.filter(app => app.status === statusFilter);
    }

    // 按日期筛选
    if (startDate && endDate) {
        filteredAppointments = filteredAppointments.filter(app => {
            const appointmentDate = new Date(app.appointmentDate);
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59); // 设置结束日期为当天最后一刻
            return appointmentDate >= start && appointmentDate <= end;
        });
    }

    // 按日期排序（默认最新的在前）
    filteredAppointments.sort((a, b) => new Date(b.submitTime) - new Date(a.submitTime));

    // 显示预约记录
    const appointmentsList = document.getElementById('appointmentsList');
    if (filteredAppointments.length) {
        appointmentsList.innerHTML = `
            <div class="appointments-header">
                <div class="total-count">共 ${filteredAppointments.length} 条预约记录</div>
                <div class="sort-options">
                    <select id="sortOption" onchange="sortAppointments(this.value)">
                        <option value="submitTime-desc">按提交时间降序</option>
                        <option value="submitTime-asc">按提交时间升序</option>
                        <option value="appointmentDate-desc">按预约日期降序</option>
                        <option value="appointmentDate-asc">按预约日期升序</option>
                    </select>
                </div>
            </div>
            ${filteredAppointments.map(appointment => createAppointmentItem(appointment)).join('')}
        `;
    } else {
        appointmentsList.innerHTML = '<div class="no-data">暂无预约记录</div>';
    }

    // 添加操作按钮事件
    addAppointmentActions();
}

// 排序预约记录
function sortAppointments(sortOption) {
    const [field, order] = sortOption.split('-');
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const username = localStorage.getItem('username');
    
    // 筛选当前用户的预约
    let userAppointments = appointments.filter(app => app.username === username);
    
    // 排序
    userAppointments.sort((a, b) => {
        let aValue, bValue;
        if (field === 'submitTime') {
            aValue = new Date(a.submitTime);
            bValue = new Date(b.submitTime);
        } else {
            aValue = new Date(a.appointmentDate);
            bValue = new Date(b.appointmentDate);
        }
        return order === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    // 重新渲染预约列表
    const appointmentsList = document.getElementById('appointmentsList');
    appointmentsList.innerHTML = `
        <div class="appointments-header">
            <div class="total-count">共 ${userAppointments.length} 条预约记录</div>
            <div class="sort-options">
                <select id="sortOption" onchange="sortAppointments(this.value)">
                    <option value="submitTime-desc">按提交时间降序</option>
                    <option value="submitTime-asc">按提交时间升序</option>
                    <option value="appointmentDate-desc">按预约日期降序</option>
                    <option value="appointmentDate-asc">按预约日期升序</option>
                </select>
            </div>
        </div>
        ${userAppointments.map(appointment => createAppointmentItem(appointment)).join('')}
    `;
    
    // 重新添加事件监听
    addAppointmentActions();
    
    // 保持选中状态
    document.getElementById('sortOption').value = sortOption;
}

// 创建预约记录项
function createAppointmentItem(appointment) {
    return `
        <div class="appointment-item ${appointment.status}" data-id="${appointment.orderNumber}">
            <div class="appointment-header">
                <div class="appointment-title">${appointment.serviceName}</div>
                <div class="status ${appointment.status}">${getStatusText(appointment.status)}</div>
            </div>
            <div class="appointment-info">
                <div class="info-item">
                    <span class="info-label">预约单号</span>
                    <span class="info-value">${appointment.orderNumber}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">预约时间</span>
                    <span class="info-value">${appointment.appointmentDate} ${appointment.appointmentTime}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">联系电话</span>
                    <span class="info-value">${appointment.contact}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">提交时间</span>
                    <span class="info-value">${formatDate(new Date(appointment.submitTime))}</span>
                </div>
            </div>
            <div class="appointment-description">
                <div class="description-label">问题描述</div>
                <div class="description-content">${appointment.description}</div>
            </div>
            <div class="appointment-actions">
                <button class="detail-btn" data-id="${appointment.orderNumber}">查看详情</button>
                ${appointment.status === 'pending' ? `
                    <button class="modify-btn" data-id="${appointment.orderNumber}">修改预约</button>
                    <button class="cancel-btn" data-id="${appointment.orderNumber}">取消预约</button>
                ` : ''}
                ${appointment.status === 'completed' && !appointment.hasFeedback ? `
                    <button class="feedback-btn" data-id="${appointment.orderNumber}">评价服务</button>
                ` : ''}
                ${appointment.status === 'completed' && appointment.hasFeedback ? `
                    <button class="feedback-btn" data-id="${appointment.orderNumber}" disabled>已评价</button>
                ` : ''}
            </div>
        </div>
    `;
}

// 添加预约操作事件
function addAppointmentActions() {
    // 修改预约
    document.querySelectorAll('.modify-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderNumber = this.getAttribute('data-id');
            if (confirm('修改预约将取消当前预约并创建新预约，是否继续？')) {
                const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
                const appointment = appointments.find(a => a.orderNumber === orderNumber);
                
                if (appointment) {
                    // 取消原预约
                    appointment.status = 'cancelled';
                    appointment.cancelReason = '用户修改预约';
                    appointment.cancelTime = new Date().toISOString();
                    localStorage.setItem('appointments', JSON.stringify(appointments));
                    
                    // 保存预约信息用于新建预约
                    localStorage.setItem('modifyAppointment', JSON.stringify({
                        ...appointment,
                        isModifying: true,
                        originalOrderNumber: orderNumber
                    }));
                    
                    // 跳转到预约页面
                    window.location.href = 'appointment.html?modify=true';
                }
            }
        });
    });

    // 取消预约
    document.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderNumber = this.getAttribute('data-id');
            if (confirm('确定要取消此预约吗？')) {
                const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
                const index = appointments.findIndex(a => a.orderNumber === orderNumber);
                
                if (index !== -1) {
                    appointments[index].status = 'cancelled';
                    appointments[index].cancelTime = new Date().toISOString();
                    localStorage.setItem('appointments', JSON.stringify(appointments));
                    showMessage('预约已取消', 'success');
                    loadAppointments();
                }
            }
        });
    });

    // 评价服务
    document.querySelectorAll('.feedback-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderNumber = this.getAttribute('data-id');
            showFeedbackDialog(orderNumber);
        });
    });

    // 查看详情
    document.querySelectorAll('.detail-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderNumber = this.getAttribute('data-id');
            showAppointmentDetail(orderNumber);
        });
    });
}

// 显示预约详情
function showAppointmentDetail(orderNumber) {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const appointment = appointments.find(a => a.orderNumber === orderNumber);
    
    if (!appointment) return;

    // 创建遮罩层和模态框
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'detail-modal';
    modal.innerHTML = `
        <h3>预约详情</h3>
        <div class="detail-content">
            <div class="detail-status">
                <span class="status ${appointment.status}">${getStatusText(appointment.status)}</span>
            </div>
            <div class="detail-info">
                <div class="detail-item">
                    <span class="detail-label">预约单号</span>
                    <span class="detail-value">${appointment.orderNumber}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">服务类型</span>
                    <span class="detail-value">${appointment.serviceName}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">预约时间</span>
                    <span class="detail-value">${appointment.appointmentDate} ${appointment.appointmentTime}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">联系电话</span>
                    <span class="detail-value">${appointment.contact}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">提交时间</span>
                    <span class="detail-value">${formatDate(new Date(appointment.submitTime))}</span>
                </div>
                ${appointment.cancelTime ? `
                    <div class="detail-item">
                        <span class="detail-label">取消时间</span>
                        <span class="detail-value">${formatDate(new Date(appointment.cancelTime))}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">取消原因</span>
                        <span class="detail-value">${appointment.cancelReason || '用户取消'}</span>
                    </div>
                ` : ''}
            </div>
            <div class="detail-description">
                <div class="description-label">问题描述</div>
                <div class="description-content">${appointment.description}</div>
            </div>
        </div>
        <div class="detail-actions">
            <button class="close-btn">关闭</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    
    // 关闭按钮事件
    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.remove();
        overlay.remove();
    });
}

// 显示评价服务对话框
function showFeedbackDialog(orderNumber) {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const appointment = appointments.find(a => a.orderNumber === orderNumber);
    
    if (!appointment) return;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'feedback-modal';
    modal.innerHTML = `
        <h3>服务评价</h3>
        <div class="feedback-content">
            <div class="service-info">
                <div class="service-type">${appointment.serviceName}</div>
                <div class="service-time">${appointment.appointmentDate} ${appointment.appointmentTime}</div>
            </div>
            <div class="rating-section">
                <div class="rating-label">服务评分</div>
                <div class="rating-stars">
                    ${Array(5).fill(0).map((_, i) => `
                        <i class="far fa-star" data-rating="${i + 1}"></i>
                    `).join('')}
                </div>
            </div>
            <div class="feedback-form">
                <textarea placeholder="请输入您的评价内容（最多500字）" maxlength="500"></textarea>
                <div class="word-count">0/500</div>
            </div>
        </div>
        <div class="feedback-actions">
            <button class="cancel-btn">取消</button>
            <button class="submit-btn" disabled>提交评价</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    // 评分功能
    const stars = modal.querySelectorAll('.rating-stars i');
    let currentRating = 0;
    
    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = this.dataset.rating;
            updateStars(rating);
        });
        
        star.addEventListener('click', function() {
            currentRating = this.dataset.rating;
            updateStars(currentRating);
            checkSubmitButton();
        });
    });

    const ratingSection = modal.querySelector('.rating-stars');
    ratingSection.addEventListener('mouseleave', () => {
        updateStars(currentRating);
    });

    // 评价内容字数统计
    const textarea = modal.querySelector('textarea');
    const wordCount = modal.querySelector('.word-count');
    
    textarea.addEventListener('input', function() {
        const length = this.value.length;
        wordCount.textContent = `${length}/500`;
        checkSubmitButton();
    });

    // 检查提交按钮状态
    function checkSubmitButton() {
        const submitBtn = modal.querySelector('.submit-btn');
        submitBtn.disabled = !currentRating || !textarea.value.trim();
    }

    // 更新星星显示
    function updateStars(rating) {
        stars.forEach((star, index) => {
            star.className = index < rating ? 'fas fa-star active' : 'far fa-star';
        });
    }

    // 取消按钮事件
    modal.querySelector('.cancel-btn').addEventListener('click', () => {
        modal.remove();
        overlay.remove();
    });

    // 提交评价
    modal.querySelector('.submit-btn').addEventListener('click', () => {
        const feedback = {
            orderNumber,
            rating: currentRating,
            content: textarea.value.trim(),
            time: new Date().toISOString()
        };

        // 保存评价
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
        feedbacks.push(feedback);
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

        // 更新预约状态
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const index = appointments.findIndex(a => a.orderNumber === orderNumber);
        if (index !== -1) {
            appointments[index].hasFeedback = true;
            localStorage.setItem('appointments', JSON.stringify(appointments));
        }

        showMessage('评价提交成功', 'success');
        modal.remove();
        overlay.remove();
        loadAppointments(); // 刷新预约列表
    });
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'pending': '待审核',
        'approved': '已审核',
        'arranged': '已安排',
        'completed': '已完成',
        'cancelled': '已取消'
    };
    return statusMap[status] || status;
}

// 格式化日期
function formatDate(date) {
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 显示提示消息
function showMessage(message, type = 'info') {
    const messageBox = document.createElement('div');
    messageBox.className = `message-box ${type}`;
    messageBox.innerHTML = `
        <i class="fas fa-${getIconForType(type)}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(messageBox);

    setTimeout(() => {
        messageBox.classList.add('fade-out');
        setTimeout(() => messageBox.remove(), 300);
    }, 3000);
}

// 获取提示图标
function getIconForType(type) {
    const icons = {
        success: 'check-circle',
        error: 'times-circle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
} 