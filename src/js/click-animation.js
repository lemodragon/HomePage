// 点击动画效果
document.addEventListener('DOMContentLoaded', function () {
    // 运势指数计数器 - 保存到localStorage以便在页面刷新后保留
    let luckCounter = {
        mainAvatar: 0, // 桃花运
        yaoguang: 0,  // 财运
        kaiyang: 0,   // 健康运
        yuheng: 0,    // 智慧运
        tianji: 0,    // 好运
        tianxuan: 0,  // 功德
        tianshu: 0    // 天运
    };

    // 连击计数器
    const comboTracker = {
        lastClickTime: 0,
        comboCount: 0,
        targetId: null,
        COMBO_TIMEOUT: 1000 // 连击超时时间（毫秒）
    };

    // 获取DOM元素
    const counterContainer = document.querySelector(".click-counter-container");

    // 确保计数器容器初始状态是隐藏的，移除任何可能导致显示的类
    if (counterContainer) {
        counterContainer.classList.remove("hover-active");
    }

    // 尝试从localStorage加载数据
    const savedCounter = localStorage.getItem("starLuckCounter");
    if (savedCounter) {
        try {
            luckCounter = JSON.parse(savedCounter);
            // 立即更新显示（但保持面板隐藏）
            updateCounterDisplay();
        } catch (e) {
            console.error("Failed to load saved counter", e);
        }
    }

    // 获取其他DOM元素
    const hoverTrigger = document.querySelector(".hover-trigger");
    const topHoverArea = document.querySelector(".top-hover-area");
    const counterDetails = document.querySelector(".counter-details");

    // 为顶部悬停区域添加鼠标事件
    if (topHoverArea && counterContainer) {
        // 当鼠标移入顶部区域时，显示计数器
        topHoverArea.addEventListener("mouseenter", function () {
            if (counterContainer.classList.contains("has-counts")) {
                counterContainer.classList.add("hover-active");
            }
        });

        // 当鼠标离开顶部区域时，检查鼠标是否进入了计数器，如果没有，则隐藏计数器
        topHoverArea.addEventListener("mouseleave", function (e) {
            // 检查鼠标是否进入了计数器
            const rect = counterContainer.getBoundingClientRect();
            if (
                e.clientX < rect.left ||
                e.clientX > rect.right ||
                e.clientY < rect.top ||
                e.clientY > rect.bottom
            ) {
                counterContainer.classList.remove("hover-active");
            }
        });
    }

    if (counterContainer) {
        // 当鼠标移入计数器时，保持计数器显示
        counterContainer.addEventListener("mouseenter", function () {
            if (counterContainer.classList.contains("has-counts")) {
                counterContainer.classList.add("hover-active");
            }
        });

        // 当鼠标离开计数器时，隐藏计数器
        counterContainer.addEventListener("mouseleave", function () {
            counterContainer.classList.remove("hover-active");
        });
    }

    // 为触发器添加鼠标事件
    if (hoverTrigger && counterContainer) {
        hoverTrigger.addEventListener("mouseenter", function () {
            if (counterContainer.classList.contains("has-counts")) {
                counterContainer.classList.add("hover-active");
            }
        });
    }

    // 更新计数器显示
    function updateCounterDisplay() {
        const container = document.querySelector(".click-counter-container");
        if (!container) return;

        // 更新各个星星的计数
        Object.entries(luckCounter).forEach(([key, value]) => {
            const counter = document.getElementById(`${key}Counter`);
            if (counter) {
                counter.textContent = value;

                // 给数字添加变化动画
                counter.classList.remove("value-change");
                setTimeout(() => {
                    counter.classList.add("value-change");
                }, 10);
            }
        });

        // 计算并更新总数
        const total = Object.values(luckCounter).reduce((sum, value) => sum + value, 0);
        const totalCounter = document.getElementById("totalLuckCounter");
        if (totalCounter) {
            totalCounter.textContent = total;

            // 给总数添加变化动画
            totalCounter.classList.remove("value-change");
            setTimeout(() => {
                totalCounter.classList.add("value-change");
            }, 10);
        }

        // 根据是否有计数来显示/隐藏计数器
        if (total > 0) {
            container.classList.add("has-counts");

            // 只添加shown-hint标识，不再自动显示面板
            if (!container.classList.contains('shown-hint')) {
                container.classList.add('shown-hint');
                // 确保不添加hover-active类，这样面板不会自动显示
                container.classList.remove('hover-active');
            }
        } else {
            container.classList.remove("has-counts");
            container.classList.remove("shown-hint");
            container.classList.remove("hover-active");
        }
    }

    // 每个星星的自定义文本和颜色
    const starCustomization = {
        mainAvatar: {
            text: "桃花运 +",
            color: "#ff69b4", // 粉色
            glowColor: "rgba(255, 105, 180, 0.6)"
        },
        yaoguang: {
            text: "财运 +",
            color: "#ffd700", // 金色
            glowColor: "rgba(255, 215, 0, 0.6)"
        },
        kaiyang: {
            text: "健康运 +",
            color: "#90ee90", // 淡绿色
            glowColor: "rgba(144, 238, 144, 0.6)"
        },
        yuheng: {
            text: "智慧运 +",
            color: "#87cefa", // 淡蓝色
            glowColor: "rgba(135, 206, 250, 0.6)"
        },
        tianji: {
            text: "好运 +",
            color: "#ba55d3", // 中等兰花紫
            glowColor: "rgba(186, 85, 211, 0.6)"
        },
        tianxuan: {
            text: "福气+",
            color: "#ff7f50", // 珊瑚色
            glowColor: "rgba(255, 127, 80, 0.6)"
        },
        tianshu: {
            text: "缘分+",
            color: "#ff4500", // 橙红色
            glowColor: "rgba(255, 69, 0, 0.6)"
        }
    };

    // 主头像点击效果
    const mainAvatar = document.querySelector(".card-inner header img");
    if (mainAvatar) {
        mainAvatar.addEventListener("click", function (e) {
            luckCounter.mainAvatar++;

            // 检查连击
            const now = Date.now();
            if (now - comboTracker.lastClickTime < comboTracker.COMBO_TIMEOUT && comboTracker.targetId === "mainAvatar") {
                comboTracker.comboCount++;
                if (comboTracker.comboCount >= 3) {
                    // 连击3次以上显示特殊文本
                    const comboText = `连击 x${comboTracker.comboCount}！`;
                    createFloatingText(e, comboText, "#ff0000", true);

                    if (comboTracker.comboCount >= 10) {
                        // 超过10连击显示彩虹特效
                        createRainbowEffect(e);
                    }
                }
            } else {
                comboTracker.comboCount = 1;
                comboTracker.targetId = "mainAvatar";
            }
            comboTracker.lastClickTime = now;

            const customText = starCustomization.mainAvatar.text + luckCounter.mainAvatar;
            const customColor = starCustomization.mainAvatar.color;
            createFloatingText(e, customText, customColor);

            // 更新显示
            updateCounterDisplay();

            // 保存到localStorage
            localStorage.setItem("starLuckCounter", JSON.stringify(luckCounter));
        });
    }

    // 北斗七星点击效果
    const starMap = {
        ".star.yaoguang img": "yaoguang",
        ".star.kaiyang img": "kaiyang",
        ".star.yuheng img": "yuheng",
        ".star.tianji img": "tianji",
        ".star.tianxuan img": "tianxuan",
        ".star.tianshu img": "tianshu"
    };

    // 为每个星星添加点击事件
    Object.entries(starMap).forEach(([selector, starName]) => {
        const starElement = document.querySelector(selector);
        if (starElement) {
            starElement.addEventListener("click", function (e) {
                luckCounter[starName]++;

                // 检查连击
                const now = Date.now();
                if (now - comboTracker.lastClickTime < comboTracker.COMBO_TIMEOUT && comboTracker.targetId === starName) {
                    comboTracker.comboCount++;
                    if (comboTracker.comboCount >= 3) {
                        // 连击3次以上显示特殊文本
                        const comboText = `连击 x${comboTracker.comboCount}！`;
                        createFloatingText(e, comboText, "#ff0000", true);

                        if (comboTracker.comboCount >= 10) {
                            // 超过10连击显示彩虹特效
                            createRainbowEffect(e);
                        }
                    }
                } else {
                    comboTracker.comboCount = 1;
                    comboTracker.targetId = starName;
                }
                comboTracker.lastClickTime = now;

                const customText = starCustomization[starName].text + luckCounter[starName];
                const customColor = starCustomization[starName].color;
                createFloatingText(e, customText, customColor);

                // 更新显示
                updateCounterDisplay();

                // 保存到localStorage
                localStorage.setItem("starLuckCounter", JSON.stringify(luckCounter));
            });
        }
    });

    // 创建浮动文本动画
    function createFloatingText(event, text, color = "#ff69b4", isCombo = false) {
        // 创建文本元素
        const floatingText = document.createElement("div");
        floatingText.className = "floating-text";
        if (isCombo) floatingText.className += " combo-text";
        floatingText.innerText = text;

        // 设置渐变文本效果
        floatingText.style.background = `linear-gradient(45deg, ${color}, white, ${color})`;
        floatingText.style.webkitBackgroundClip = "text";
        floatingText.style.backgroundClip = "text";
        floatingText.style.webkitTextFillColor = "transparent";
        floatingText.style.textShadow = `0 0 10px ${color}, 0 0 20px ${color}, 0 2px 2px rgba(0, 0, 0, 0.5)`;

        // 计算位置 - 显示在点击位置的上方
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX || rect.left + rect.width / 2;
        const y = (event.clientY || rect.top) - 10;

        // 设置初始位置
        floatingText.style.left = `${x}px`;
        floatingText.style.top = `${y}px`;

        // 添加到文档
        document.body.appendChild(floatingText);

        // 添加微小的随机水平位移和旋转，使动画更生动
        const randomX = (Math.random() - 0.5) * 30;
        const randomRotation = (Math.random() - 0.5) * 15;

        // 应用动画
        setTimeout(() => {
            floatingText.style.transform = `translate(${randomX}px, -60px) rotate(${randomRotation}deg)`;
            floatingText.style.opacity = "0";
        }, 10);

        // 动画结束后移除元素
        setTimeout(() => {
            document.body.removeChild(floatingText);
        }, 1000);
    }

    // 创建彩虹特效
    function createRainbowEffect(event) {
        const rainbow = document.createElement("div");
        rainbow.className = "rainbow-ripple";

        // 设置位置
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX || rect.left + rect.width / 2;
        const y = (event.clientY || rect.top) - 10;

        rainbow.style.left = `${x}px`;
        rainbow.style.top = `${y}px`;

        // 添加到文档
        document.body.appendChild(rainbow);

        // 动画结束后移除
        setTimeout(() => {
            document.body.removeChild(rainbow);
        }, 2000);
    }

    // 添加鼠标点击特效（在任何地方点击都会有效果）
    document.addEventListener("click", function (e) {
        // 创建一个小圆点
        const ripple = document.createElement("div");
        ripple.className = "click-ripple";
        document.body.appendChild(ripple);

        // 设置位置
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;

        // 动画结束后移除
        setTimeout(() => {
            document.body.removeChild(ripple);
        }, 1000);
    });
});
