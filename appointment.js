document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    const appointmentForm = document.getElementById('appointmentForm');
    const dateInput = document.getElementById('appointmentDate');
    const timeSelect = document.getElementById('appointmentTime');
    const contactInput = document.getElementById('contact');
    const descriptionInput = document.getElementById('description');
    const submitBtn = document.getElementById('submitBtn');
    const previewSection = document.querySelector('.preview-section');

    // 设置日期限制
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30); // 最多预约30天后
    
    dateInput.min = today.toISOString().split('T')[0];
    dateInput.max = maxDate.toISOString().split('T')[0];

    // 监听日期变化，更新可用时间段
    dateInput.addEventListener('change', updateAvailableTimeSlots);

    // 手机号码输入验证
    contactInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        e.target.value = value;
    });

    // 字数统计
    descriptionInput.addEventListener('input', function(e) {
        const maxLength = 500;
        const currentLength = e.target.value.length;
        const countDisplay = document.getElementById('currentCount');
        
        countDisplay.textContent = currentLength;
        const wordCount = countDisplay.parentElement;
        
        if (currentLength >= maxLength) {
            wordCount.className = 'word-count error';
            e.target.value = e.target.value.slice(0, maxLength);
        } else if (currentLength >= maxLength * 0.8) {
            wordCount.className = 'word-count warning';
        } else {
            wordCount.className = 'word-count';
        }
        
        // 自动保存
        autoSaveForm();
    });

    // 服务类型说明
    const serviceDescriptions = {
        '法律咨询': '提供专业的法律咨询服务，包括民事、刑事、行政等各类法律问题解答',
        '心理咨询': '由专业心理咨询师提供心理疏导、情绪管理、压力缓解等服务',
        '就业指导': '提供职业规划、简历指导、面试技巧等就业相关咨询服务',
        '社会救助': '针对困难群体提供救助政策咨询、申请指导等服务'
    };

    // 时间段容量设置
    const TIME_SLOT_CAPACITY = 2; // 每个时间段最多预约人数

    document.getElementById('serviceName').addEventListener('change', function(e) {
        const description = document.getElementById('serviceDescription');
        const selectedService = e.target.value;
        
        if (selectedService && serviceDescriptions[selectedService]) {
            description.textContent = serviceDescriptions[selectedService];
            description.classList.add('active');
        } else {
            description.classList.remove('active');
        }
    });

    // 修改表单提交事件
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            showPreview();
        }
    });

    // 表单验证
    function validateForm() {
        const serviceName = document.getElementById('serviceName').value;
        if (!serviceName) {
            showMessage('请选择服务类型', 'warning');
            return false;
        }

        if (!dateInput.value) {
            showMessage('请选择预约日期', 'warning');
            return false;
        }

        if (!timeSelect.value) {
            showMessage('请选择预约时间', 'warning');
            return false;
        }

        if (!validatePhoneNumber(contactInput.value)) {
            showMessage('请输入正确的手机号码', 'warning');
            return false;
        }

        if (descriptionInput.value.length < 10) {
            showMessage('问题描述至少10个字', 'warning');
            return false;
        }

        return true;
    }

    // 手机号码格式验证
    function validatePhoneNumber(phone) {
        return /^1[3-9]\d{9}$/.test(phone);
    }

    // 检查重复预约
    async function checkDuplicateAppointment() {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const username = localStorage.getItem('username');
        const selectedDate = dateInput.value;
        const selectedTime = timeSelect.value;

        return appointments.some(app => 
            app.username === username &&
            app.appointmentDate === selectedDate &&
            app.appointmentTime === selectedTime &&
            ['pending', 'approved', 'arranged'].includes(app.status)
        );
    }

    // 更新可用时间段
    function updateAvailableTimeSlots() {
        const selectedDate = dateInput.value;
        const dayOfWeek = new Date(selectedDate).getDay();
        
        // 清空现有选项
        timeSelect.innerHTML = '<option value="">请选择时间段</option>';
        
        // 周末不可预约
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            showMessage('周末不提供预约服务', 'info');
            return;
        }

        // 如果是今天，只显示未过时的时间段
        const timeSlots = [
            { value: '09:00', label: '09:00-10:00' },
            { value: '10:00', label: '10:00-11:00' },
            { value: '14:00', label: '14:00-15:00' },
            { value: '15:00', label: '15:00-16:00' },
            { value: '16:00', label: '16:00-17:00' }
        ];

        const now = new Date();
        const isToday = selectedDate === now.toISOString().split('T')[0];

        timeSlots.forEach(slot => {
            const [hour] = slot.value.split(':').map(Number);
            if (!isToday || hour > now.getHours()) {
                const option = document.createElement('option');
                option.value = slot.value;
                option.textContent = slot.label;
                timeSelect.appendChild(option);
            }
        });

        // 检查并移除已被预约的时间段
        removeBookedTimeSlots(selectedDate);
    }

    // 移除已被预约的时间段
    function removeBookedTimeSlots(selectedDate) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const bookedSlots = appointments.reduce((acc, app) => {
            if (app.appointmentDate === selectedDate) {
                acc[app.appointmentTime] = (acc[app.appointmentTime] || 0) + 1;
            }
            return acc;
        }, {});

        Array.from(timeSelect.options).forEach(option => {
            if (option.value) {
                const count = bookedSlots[option.value] || 0;
                if (count >= TIME_SLOT_CAPACITY) {
                    option.disabled = true;
                    option.textContent += ' (已约满)';
                } else if (count > 0) {
                    option.textContent += ` (剩余${TIME_SLOT_CAPACITY - count}个名额)`;
                }
            }
        });
    }

    // 生成预约单号
    function generateOrderNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `A${year}${month}${day}${hour}${minute}${random}`;
    }

    // 保存预约信息
    function saveAppointment(data) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        appointments.push({
            ...data,
            status: 'pending',
            submitTime: new Date().toISOString()
        });
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }

    // 显示成功提示
    function showSuccessMessage(orderNumber) {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        document.body.appendChild(overlay);

        // 创建成功提示框
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="title">预约成功</div>
            <div class="content">
                您的预约已提交成功！<br>
                请保存以下预约单号，可用于查询预约进度
            </div>
            <div class="order-number">${orderNumber}</div>
            <button class="close-btn">确认</button>
        `;
        document.body.appendChild(modal);

        // 点击确认按钮关闭提示框并跳转
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', function() {
            // 移除提示框和遮罩
            modal.remove();
            overlay.remove();
            // 跳转到基本服务页
            window.location.href = 'service.html';
        });

        // 阻止点击遮罩层关闭
        overlay.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // 显示提示信息
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

    // 表单自动保存
    let autoSaveTimeout;
    function autoSaveForm() {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            const formData = {
                serviceName: document.getElementById('serviceName').value,
                appointmentDate: dateInput.value,
                appointmentTime: timeSelect.value,
                description: descriptionInput.value,
                contact: contactInput.value
            };
            localStorage.setItem('appointmentDraft', JSON.stringify(formData));
            showAutoSaveTip();
        }, 1000);
    }

    function showAutoSaveTip() {
        const tip = document.createElement('div');
        tip.className = 'autosave-tip';
        tip.textContent = '已自动保存草稿';
        document.body.appendChild(tip);
        
        setTimeout(() => tip.classList.add('show'), 100);
        setTimeout(() => {
            tip.classList.remove('show');
            setTimeout(() => tip.remove(), 300);
        }, 2000);
    }

    // 恢复草稿
    function loadDraft() {
        const draft = localStorage.getItem('appointmentDraft');
        if (draft) {
            const formData = JSON.parse(draft);
            Object.entries(formData).forEach(([key, value]) => {
                const element = document.getElementById(key);
                if (element) element.value = value;
            });
            
            // 更新字数统计
            const currentLength = descriptionInput.value.length;
            document.getElementById('currentCount').textContent = currentLength;
        }
    }

    // 显示预览
    function showPreview() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        document.body.appendChild(overlay);

        // 创建预览模态框
        const modal = document.createElement('div');
        modal.className = 'preview-modal';
        modal.innerHTML = `
            <h3>预约信息确认</h3>
            <div class="preview-content">
                ${Object.entries({
                    '服务类型': document.getElementById('serviceName').value,
                    '预约日期': dateInput.value,
                    '预约时间': timeSelect.value,
                    '联系电话': contactInput.value,
                    '问题描述': descriptionInput.value
                }).map(([key, value]) => `
                    <div class="preview-item">
                        <div class="preview-label">${key}</div>
                        <div class="preview-value">${value}</div>
                    </div>
                `).join('')}
            </div>
            <div class="preview-buttons">
                <button type="button" class="back-btn">返回修改</button>
                <button type="button" class="confirm-btn">确认提交</button>
            </div>
        `;
        document.body.appendChild(modal);

        // 返回修改按钮事件
        const backBtn = modal.querySelector('.back-btn');
        backBtn.addEventListener('click', function() {
            modal.remove();
            overlay.remove();
        });

        // 确认提交按钮事件
        const confirmBtn = modal.querySelector('.confirm-btn');
        confirmBtn.addEventListener('click', async function() {
            // 检查是否有重复预约
            if (await checkDuplicateAppointment()) {
                showMessage('您在该时间段已有预约，请选择其他时间', 'error');
                modal.remove();
                overlay.remove();
                return;
            }

            // 确认提交
            const formData = {
                serviceName: document.getElementById('serviceName').value,
                appointmentDate: dateInput.value,
                appointmentTime: timeSelect.value,
                description: descriptionInput.value,
                contact: contactInput.value,
                orderNumber: generateOrderNumber(),
                username: localStorage.getItem('username') || '未知用户'
            };

            try {
                saveAppointment(formData);
                localStorage.removeItem('appointmentDraft');
                modal.remove();
                overlay.remove();
                showSuccessMessage(formData.orderNumber);
            } catch (error) {
                showMessage('预约失败，请稍后重试', 'error');
                console.error('预约失败:', error);
            }
        });

        // 阻止点击遮罩层关闭
        overlay.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // 加载草稿
    loadDraft();
}); 