document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    const searchBtn = document.getElementById('searchBtn');
    const orderInput = document.getElementById('orderNumber');
    const resultSection = document.querySelector('.progress-result-section');

    // 查询按钮点击事件
    searchBtn.addEventListener('click', searchAppointment);
    
    // 回车触发查询
    orderInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchAppointment();
        }
    });

    // 查询预约信息
    function searchAppointment() {
        const orderNumber = document.getElementById('orderNumber').value.trim();
        if (!orderNumber) {
            showMessage('请输入预约单号', 'warning');
            return;
        }
        
        // 从 localStorage 获取预约记录
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const appointment = appointments.find(a => a.orderNumber === orderNumber);
        
        if (!appointment) {
            showMessage('未找到该预约记录', 'error');
            resultSection.style.display = 'none';
            return;
        }
        
        // 显示预约详情
        displayAppointmentDetails(appointment);
    }

    // 显示预约详情
    function displayAppointmentDetails(appointment) {
        console.log('显示预约详情:', appointment); // 添加调试日志

        // 显示基本信息
        document.getElementById('resultOrderNumber').textContent = appointment.orderNumber;
        document.getElementById('resultServiceType').textContent = appointment.serviceName;
        document.getElementById('resultDateTime').textContent = 
            `${appointment.appointmentDate} ${appointment.appointmentTime}`;
        document.getElementById('resultContact').textContent = appointment.contact;
        document.getElementById('resultDescription').textContent = appointment.description;
        
        // 显示状态和预计完成时间
        const statusElement = document.getElementById('resultStatus');
        statusElement.textContent = getStatusText(appointment.status);
        statusElement.className = 'value status ' + appointment.status;
        
        // 处理预计完成时间
        const estimatedTimeElement = document.getElementById('estimatedTime');
        if (appointment.estimatedTime) {
            estimatedTimeElement.textContent = formatDate(new Date(appointment.estimatedTime));
        } else {
            estimatedTimeElement.textContent = '待定';
        }
        
        // 更新时间线
        updateTimeline(appointment);
        
        // 显示结果区域
        const resultSection = document.querySelector('.progress-result-section');
        resultSection.style.display = 'block';
        
        // 根据状态控制按钮显示
        updateOperationButtons(appointment.status);
    }

    // 更新时间线
    function updateTimeline(appointment) {
        const timelineItems = document.querySelectorAll('.timeline-item');
        const times = appointment.timeline || {};
        
        // 重置所有时间线项
        timelineItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // 根据状态更新时间线
        switch(appointment.status) {
            case 'completed':
                timelineItems[3].classList.add('active');
                timelineItems[2].classList.add('active');
                timelineItems[1].classList.add('active');
                timelineItems[0].classList.add('active');
                break;
            case 'arranged':
                timelineItems[2].classList.add('active');
                timelineItems[1].classList.add('active');
                timelineItems[0].classList.add('active');
                break;
            case 'approved':
                timelineItems[1].classList.add('active');
                timelineItems[0].classList.add('active');
                break;
            case 'pending':
                timelineItems[0].classList.add('active');
                break;
        }
        
        // 更新时间显示
        if (times.submit) {
            document.getElementById('submitTime').textContent = formatDate(new Date(times.submit));
        }
        if (times.review) {
            document.getElementById('reviewTime').textContent = formatDate(new Date(times.review));
        }
        if (times.arrange) {
            document.getElementById('arrangeTime').textContent = formatDate(new Date(times.arrange));
        }
        if (times.complete) {
            document.getElementById('completeTime').textContent = formatDate(new Date(times.complete));
        }
    }

    // 根据状态控制操作按钮
    function updateOperationButtons(status) {
        const cancelBtn = document.getElementById('cancelBtn');
        const modifyBtn = document.getElementById('modifyBtn');
        
        // 只有待审核状态可以取消和修改
        if (status === 'pending') {
            cancelBtn.style.display = 'block';
            modifyBtn.style.display = 'block';
        } else {
            cancelBtn.style.display = 'none';
            modifyBtn.style.display = 'none';
        }
    }

    // 格式化日期
    function formatDate(date) {
        if (!(date instanceof Date) || isNaN(date)) {
            return '待定';
        }
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
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

    // 添加取消预约功能
    document.getElementById('cancelBtn').addEventListener('click', function() {
        const orderNumber = document.getElementById('resultOrderNumber').textContent;
        if (confirm('确定要取消此预约吗？')) {
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            const index = appointments.findIndex(a => a.orderNumber === orderNumber);
            
            if (index !== -1) {
                appointments[index].status = 'cancelled';
                localStorage.setItem('appointments', JSON.stringify(appointments));
                showMessage('预约已取消', 'success');
                // 重新显示预约详情
                displayAppointmentDetails(appointments[index]);
            }
        }
    });

    // 修改预约功能
    document.getElementById('modifyBtn').addEventListener('click', function() {
        const orderNumber = document.getElementById('resultOrderNumber').textContent;
        if (confirm('修改预约将取消当前预约并创建新预约，是否继续？')) {
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            const index = appointments.findIndex(a => a.orderNumber === orderNumber);
            
            if (index !== -1) {
                // 将原预约状态改为已取消
                appointments[index].status = 'cancelled';
                appointments[index].cancelReason = '用户修改预约';
                appointments[index].cancelTime = new Date().toISOString();
                localStorage.setItem('appointments', JSON.stringify(appointments));
                
                // 将预约信息存储到 localStorage，用于填充新预约表单
                const appointmentData = {
                    ...appointments[index],
                    isModifying: true,
                    originalOrderNumber: orderNumber
                };
                localStorage.setItem('modifyAppointment', JSON.stringify(appointmentData));
                
                // 跳转到预约页面
                window.location.href = 'appointment.html?modify=true';
            }
        }
    });
}); 