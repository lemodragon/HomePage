// Add randomized breathing effect to stars
document.addEventListener('DOMContentLoaded', function () {
    // 检测是否为移动设备
    const isMobile = window.innerWidth <= 768;

    // 在移动设备上，只保留主头像动画，不执行其他北斗七星相关代码
    if (isMobile) {
        // 确保主头像动画正常
        const mainAvatar = document.querySelector('.card-inner header img');
        if (mainAvatar) {
            // 随机化动画时间，增加自然感
            const randomDelay = Math.random() * 0.5;
            mainAvatar.style.animationDelay = `${randomDelay}s`;
        }
        return; // 移动设备下不执行后续北斗七星相关代码
    }

    // PC端完整北斗七星效果
    // Get all star elements
    const stars = document.querySelectorAll('.star img');
    // Get the main avatar (to be used as tianshu)
    const mainAvatar = document.querySelector('.card-inner header img');

    // Apply slight randomization to the animation-delay
    stars.forEach(star => {
        // Get current delay and add small random variation
        const currentDelay = parseFloat(getComputedStyle(star).animationDelay) || 0;
        const randomFactor = Math.random() * 0.5; // Small random factor
        const newDelay = currentDelay + randomFactor;

        // Apply new delay
        star.style.animationDelay = `${newDelay}s`;

        // Also slightly randomize animation duration for more natural effect
        const baseDuration = 4.5 + Math.random() * 1.5; // 4.5s to 6s
        star.style.animationDuration = `${baseDuration}s`;
    });

    // Add subtle random movement to stars
    const starContainers = document.querySelectorAll('.star');
    starContainers.forEach(container => {
        const originalTop = parseFloat(getComputedStyle(container).top);
        const originalLeft = parseFloat(getComputedStyle(container).left);

        // Create gentle floating effect with anime.js
        anime({
            targets: container,
            translateY: [
                { value: -3 + Math.random() * 6, duration: 4000 + Math.random() * 2000, easing: 'easeInOutSine' },
                { value: 3 + Math.random() * 6, duration: 4000 + Math.random() * 2000, easing: 'easeInOutSine' }
            ],
            translateX: [
                { value: -2 + Math.random() * 4, duration: 5000 + Math.random() * 2000, easing: 'easeInOutSine' },
                { value: 2 + Math.random() * 4, duration: 5000 + Math.random() * 2000, easing: 'easeInOutSine' }
            ],
            loop: true,
            direction: 'alternate'
        });
    });

    // Position the connecting lines based on the main avatar position
    function updateLinePositions() {
        // Get main avatar position
        const avatarRect = mainAvatar.getBoundingClientRect();
        const avatarCenterX = avatarRect.left + avatarRect.width / 2;
        const avatarCenterY = avatarRect.top + avatarRect.height / 2;

        // Update yuheng-line (to connect to main avatar)
        const yuhengLine = document.querySelector('.yuheng-line');
        const yuheng = document.querySelector('.yuheng');
        if (yuhengLine && yuheng) {
            const yuhengRect = yuheng.getBoundingClientRect();
            const yuhengCenterX = yuhengRect.left + yuhengRect.width / 2;
            const yuhengCenterY = yuhengRect.top + yuhengRect.height / 2;

            // Calculate distance and angle
            const dx = avatarCenterX - yuhengCenterX;
            const dy = avatarCenterY - yuhengCenterY;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;

            // Apply to line
            yuhengLine.style.width = `${length}px`;
            yuhengLine.style.transform = `rotate(${angle}deg)`;
        }

        // Update tianshu-line (to connect from main avatar to tianji)
        const tianshuLine = document.querySelector('.tianshu-line');
        const tianji = document.querySelector('.tianji');
        if (tianshuLine && tianji) {
            const tianjiRect = tianji.getBoundingClientRect();
            const tianjiCenterX = tianjiRect.left + tianjiRect.width / 2;
            const tianjiCenterY = tianjiRect.top + tianjiRect.height / 2;

            // Calculate distance and angle
            const dx = tianjiCenterX - avatarCenterX;
            const dy = tianjiCenterY - avatarCenterY;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;

            // Apply to line
            tianshuLine.style.width = `${length}px`;
            tianshuLine.style.transform = `rotate(${angle}deg)`;
            tianshuLine.style.top = `${avatarCenterY}px`;
            tianshuLine.style.left = `${avatarCenterX}px`;
        }
    }

    // Update line positions on load and on window resize
    updateLinePositions();
    window.addEventListener('resize', function () {
        // 检查窗口大小变化，如果变成移动设备大小，停止处理
        if (window.innerWidth <= 768) return;
        updateLinePositions();
    });
    window.addEventListener('scroll', function () {
        // 在滚动时也检查窗口大小
        if (window.innerWidth <= 768) return;
        updateLinePositions();
    });

    // Subtle pulse effect for lines
    const lines = document.querySelectorAll('.dipper-line');
    lines.forEach(line => {
        // Randomize opacity animation slightly
        const randomDelay = Math.random() * 3;
        line.style.animationDelay = `${randomDelay}s`;

        // Adjust line animation duration
        const baseDuration = 5 + Math.random() * 3;
        line.style.animationDuration = `${baseDuration}s`;
    });
}); 