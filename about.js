document.addEventListener('DOMContentLoaded', function() {
    // 返回顶部功能
    const backToTop = document.querySelector('.back-to-top');
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 初始化百度地图
    const map = new BMap.Map("map");
    const point = new BMap.Point(114.431843, 30.513856); // 华科经纬度
    map.centerAndZoom(point, 16);
    map.enableScrollWheelZoom();   // 启用滚轮放大缩小
    
    // 添加标记点
    const marker = new BMap.Marker(point);
    map.addOverlay(marker);
    
    // 添加信息窗口
    const infoWindow = new BMap.InfoWindow("华中科技大学");
    marker.addEventListener("click", function(){
        map.openInfoWindow(infoWindow, point);
    });

    // 添加控件
    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.ScaleControl());
}); 