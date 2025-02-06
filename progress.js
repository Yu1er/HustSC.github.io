document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    const searchBtn = document.getElementById('searchBtn');
    const resultSection = document.querySelector('.progress-result-section');

    searchBtn.addEventListener('click', function() {
        const orderNumber = document.getElementById('orderNumber').value.trim();
        if (!orderNumber) {
            alert('请输入预约单号');
            return;
        }

        // 从localStorage获取预约信息
        const appointment = findAppointment(orderNumber);
        if (appointment) {
            displayAppointmentInfo(appointment);
            resultSection.style.display = 'block';
        } else {
            alert('未找到相关预约信息');
            resultSection.style.display = 'none';
        }
    });

    // 查找预约信息
    function findAppointment(orderNumber) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        return appointments.find(app => app.orderNumber === orderNumber);
    }

    // 显示预约信息
    function displayAppointmentInfo(appointment) {
        document.getElementById('resultOrderNumber').textContent = appointment.orderNumber;
        document.getElementById('resultServiceType').textContent = appointment.serviceName;
        document.getElementById('resultDateTime').textContent = 
            `${appointment.appointmentDate} ${appointment.appointmentTime}`;
        
        const statusElement = document.getElementById('resultStatus');
        statusElement.textContent = getStatusText(appointment.status);
        statusElement.className = `value status ${appointment.status}`;

        // 更新时间线
        updateTimeline(appointment);
    }

    // 获取状态文本
    function getStatusText(status) {
        const statusMap = {
            'pending': '待审核',
            'approved': '已审核',
            'arranged': '已安排',
            'completed': '已完成'
        };
        return statusMap[status] || status;
    }

    // 更新时间线
    function updateTimeline(appointment) {
        const submitTime = new Date(appointment.submitTime);
        document.getElementById('submitTime').textContent = 
            formatDateTime(submitTime);

        // 模拟其他时间点
        const reviewTime = new Date(submitTime.getTime() + 4 * 60 * 60 * 1000);
        const arrangeTime = new Date(submitTime.getTime() + 24 * 60 * 60 * 1000);

        document.getElementById('reviewTime').textContent = 
            appointment.status === 'pending' ? '待审核' : formatDateTime(reviewTime);
        
        document.getElementById('arrangeTime').textContent = 
            appointment.status === 'pending' || appointment.status === 'approved' 
            ? '待安排' : formatDateTime(arrangeTime);
        
        document.getElementById('completeTime').textContent = 
            appointment.status === 'completed' 
            ? formatDateTime(new Date(arrangeTime.getTime() + 24 * 60 * 60 * 1000))
            : '待完成';

        // 更新时间线样式
        updateTimelineStyle(appointment.status);
    }

    // 格式化日期时间
    function formatDateTime(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }

    // 更新时间线样式
    function updateTimelineStyle(status) {
        const timelineItems = document.querySelectorAll('.timeline-item');
        const statusIndex = {
            'pending': 0,
            'approved': 1,
            'arranged': 2,
            'completed': 3
        }[status] || 0;

        timelineItems.forEach((item, index) => {
            const point = item.querySelector('.timeline-point');
            if (index <= statusIndex) {
                point.style.background = '#e60012';
            } else {
                point.style.background = '#e8e8e8';
            }
        });
    }
}); 