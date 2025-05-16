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

    // 面板隐藏计时器ID
    let panelHideTimerId = null;
    // 面板显示时间(毫秒)
    const PANEL_DISPLAY_TIME = 5000; // 5秒
    // 面板即将隐藏的警告时间(毫秒)
    const PANEL_WARNING_TIME = 1000; // 1秒

    // 获取DOM元素
    const counterContainer = document.querySelector(".click-counter-container");

    // 添加一个标志用于跟踪用户是否已经点击过
    let hasClickedAny = false;
    // 添加一个标志用于跟踪是否是第一次点击
    let isFirstClick = true;

    // 确保计数器容器初始状态是隐藏的，移除任何可能导致显示的类
    if (counterContainer) {
        counterContainer.classList.remove("hover-active");
        counterContainer.classList.remove("has-counts");
        counterContainer.classList.remove("shown-hint");
    }

    // 尝试从localStorage加载数据
    const savedCounter = localStorage.getItem("starLuckCounter");
    if (savedCounter) {
        try {
            luckCounter = JSON.parse(savedCounter);
            // 检查是否有任何计数大于0
            const hasAnyCount = Object.values(luckCounter).some(value => value > 0);

            // 如果有计数，则设置已点击标志
            if (hasAnyCount) {
                hasClickedAny = true;
                isFirstClick = false; // 不再是第一次点击
                // 更新显示（但保持面板隐藏，直到用户鼠标悬停）
                updateCounterDisplay();
            }
        } catch (e) {
            console.error("Failed to load saved counter", e);
        }
    }

    // 获取其他DOM元素
    const hoverTrigger = document.querySelector(".hover-trigger");
    const topHoverArea = document.querySelector(".top-hover-area");
    const counterAllValues = document.querySelector(".counter-all-values");

    // 为顶部悬停区域添加鼠标事件
    if (topHoverArea && counterContainer) {
        // 当鼠标移入顶部区域时，显示计数器（但仅当用户已经点击过任何星点头像时）
        topHoverArea.addEventListener("mouseenter", function () {
            if (hasClickedAny && counterContainer.classList.contains("has-counts")) {
                counterContainer.classList.add("hover-active");

                // 清除任何现有的隐藏计时器
                if (panelHideTimerId) {
                    clearTimeout(panelHideTimerId);
                    panelHideTimerId = null;
                    counterContainer.classList.remove("about-to-hide");
                }
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
                // 设置定时器，5秒后隐藏面板
                startPanelHideTimer();
            }
        });
    }

    if (counterContainer) {
        // 当鼠标移入计数器时，保持计数器显示（但仅当用户已经点击过任何星点头像时）
        counterContainer.addEventListener("mouseenter", function () {
            if (hasClickedAny && counterContainer.classList.contains("has-counts")) {
                counterContainer.classList.add("hover-active");
                // 当鼠标移入面板时，清除自动隐藏计时器
                if (panelHideTimerId) {
                    clearTimeout(panelHideTimerId);
                    panelHideTimerId = null;
                    counterContainer.classList.remove("about-to-hide");
                }
            }
        });

        // 当鼠标离开计数器时，设置隐藏计时器
        counterContainer.addEventListener("mouseleave", function () {
            // 设置定时器，5秒后隐藏面板
            startPanelHideTimer();
        });
    }

    // 为触发器添加鼠标事件
    if (hoverTrigger && counterContainer) {
        hoverTrigger.addEventListener("mouseenter", function () {
            if (hasClickedAny && counterContainer.classList.contains("has-counts")) {
                counterContainer.classList.add("hover-active");

                // 清除任何现有的隐藏计时器
                if (panelHideTimerId) {
                    clearTimeout(panelHideTimerId);
                    panelHideTimerId = null;
                    counterContainer.classList.remove("about-to-hide");
                }
            }
        });
    }

    // 启动面板隐藏计时器，包括警告效果
    function startPanelHideTimer() {
        if (!counterContainer) return;

        // 清除之前的计时器
        if (panelHideTimerId) {
            clearTimeout(panelHideTimerId);
        }

        // 设置新的计时器，5秒后隐藏面板
        panelHideTimerId = setTimeout(() => {
            counterContainer.classList.remove("hover-active");
            counterContainer.classList.remove("about-to-hide");
            panelHideTimerId = null;
        }, PANEL_DISPLAY_TIME);

        // 设置警告计时器，在隐藏前1秒显示警告效果
        setTimeout(() => {
            if (panelHideTimerId) {
                counterContainer.classList.add("about-to-hide");
            }
        }, PANEL_DISPLAY_TIME - PANEL_WARNING_TIME);
    }

    // 显示面板并重置隐藏计时器
    function showPanelWithTimeout() {
        if (counterContainer) {
            // 显示面板
            counterContainer.classList.add("hover-active");

            // 清除about-to-hide，防止刚显示就有闪烁效果
            counterContainer.classList.remove("about-to-hide");

            // 如果是第一次点击，添加特殊的动画类
            if (isFirstClick) {
                counterContainer.classList.add("first-show");
                isFirstClick = false;

                // 1秒后移除特殊动画类
                setTimeout(() => {
                    counterContainer.classList.remove("first-show");
                }, 1000);
            }

            // 清除之前的计时器和警告效果
            if (panelHideTimerId) {
                clearTimeout(panelHideTimerId);
                counterContainer.classList.remove("about-to-hide");
            }

            // 启动隐藏计时器
            startPanelHideTimer();
        }
    }

    // 更新计数器显示
    function updateCounterDisplay() {
        const container = document.querySelector(".click-counter-container");
        if (!container) return;

        // 计算总数
        const total = Object.values(luckCounter).reduce((sum, value) => sum + value, 0);

        // 更新总数显示
        const totalCounter = document.getElementById("totalLuckCounter");
        if (totalCounter) {
            totalCounter.textContent = total;

            // 给总数添加变化动画
            totalCounter.classList.remove("value-change");
            setTimeout(() => {
                totalCounter.classList.add("value-change");
            }, 10);
        }

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

        // 根据是否有计数来显示/隐藏计数器
        if (total > 0) {
            // 设置已点击标志
            hasClickedAny = true;
            container.classList.add("has-counts");

            // 添加shown-hint标识
            container.classList.add('shown-hint');

            // 不再自动添加hover-active类，只在点击事件中添加
            // 确保默认情况下面板隐藏
        } else {
            container.classList.remove("has-counts");
            container.classList.remove("shown-hint");
            container.classList.remove("hover-active");

            // 如果没有任何计数，重置已点击标志
            hasClickedAny = false;
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
            color: "#ffdf00", // 更亮的金色
            glowColor: "rgba(255, 223, 0, 0.6)"
        },
        kaiyang: {
            text: "健康运 +",
            color: "#7eff7e", // 亮绿色
            glowColor: "rgba(126, 255, 126, 0.6)"
        },
        yuheng: {
            text: "智慧运 +",
            color: "#00bfff", // 亮蓝色
            glowColor: "rgba(0, 191, 255, 0.6)"
        },
        tianji: {
            text: "好运 +",
            color: "#bf00ff", // 亮紫色
            glowColor: "rgba(191, 0, 255, 0.6)"
        },
        tianxuan: {
            text: "福气 +",
            color: "#ff7f50", // 珊瑚色
            glowColor: "rgba(255, 127, 80, 0.6)"
        },
        tianshu: {
            text: "缘分 +",
            color: "#ff4500", // 橙红色
            glowColor: "rgba(255, 69, 0, 0.6)"
        }
    };

    // 主头像点击效果
    const mainAvatar = document.querySelector(".card-inner header img");
    if (mainAvatar) {
        mainAvatar.addEventListener("click", function (e) {
            // 第一次点击时，设置已点击标志
            if (!hasClickedAny) {
                hasClickedAny = true;
            }

            luckCounter.mainAvatar++;

            // 检查连击
            const now = Date.now();
            if (now - comboTracker.lastClickTime < comboTracker.COMBO_TIMEOUT && comboTracker.targetId === "mainAvatar") {
                comboTracker.comboCount++;
                if (comboTracker.comboCount >= 3) {
                    // 连击3次以上显示特殊文本 - 简单文本样式
                    const comboText = `连击 x${comboTracker.comboCount}`;
                    createFloatingText(e, comboText, "#ff013c", true);

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

            // 简化为"桃花运 +1"格式
            const customText = `${starCustomization.mainAvatar.text.replace('+', '').trim()} +${luckCounter.mainAvatar}`;
            const customColor = starCustomization.mainAvatar.color;
            createFloatingText(e, customText, customColor);

            // 更新显示
            updateCounterDisplay();

            // 点击时显示面板并设置5秒后自动隐藏
            showPanelWithTimeout();

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
                // 第一次点击时，设置已点击标志
                if (!hasClickedAny) {
                    hasClickedAny = true;
                }

                luckCounter[starName]++;

                // 检查连击
                const now = Date.now();
                if (now - comboTracker.lastClickTime < comboTracker.COMBO_TIMEOUT && comboTracker.targetId === starName) {
                    comboTracker.comboCount++;
                    if (comboTracker.comboCount >= 3) {
                        // 连击3次以上显示特殊文本 - 简单文本样式
                        const comboText = `连击 x${comboTracker.comboCount}`;
                        createFloatingText(e, comboText, "#ff013c", true);

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

                // 简化为"财运 +1"格式
                const customText = `${starCustomization[starName].text.replace('+', '').trim()} +${luckCounter[starName]}`;
                const customColor = starCustomization[starName].color;
                createFloatingText(e, customText, customColor);

                // 更新显示
                updateCounterDisplay();

                // 点击时显示面板并设置5秒后自动隐藏
                showPanelWithTimeout();

                // 保存到localStorage
                localStorage.setItem("starLuckCounter", JSON.stringify(luckCounter));
            });
        }
    });

    // 创建浮动文本动画
    function createFloatingText(event, text, color = "#ffffff", isCombo = false) {
        // 创建文本元素
        const floatingText = document.createElement("div");

        if (isCombo) {
            floatingText.className = "combo-text";
            // 不再需要设置data-text属性，因为没有伪元素
        } else {
            floatingText.className = "floating-text";
            // 非连击文本时设置颜色和发光效果
            floatingText.style.color = color;
            floatingText.style.textShadow = `0 0 5px rgba(0, 0, 0, 0.8), 
                                            0 0 10px ${color}, 
                                            0 0 15px ${color}, 
                                            0 0 20px ${color}`;
        }

        // 设置文本内容
        floatingText.innerText = text;

        // 计算位置 - 显示在头像的正上方
        const rect = event.target.getBoundingClientRect();

        // 连击特效需要考虑其宽度偏移
        let x, y;

        if (isCombo) {
            // 连击特效居中显示
            x = rect.left + (rect.width / 2) - (floatingText.offsetWidth / 2 || 60);
            // 放置在头像上方更高的位置
            y = rect.top - 80;
        } else {
            // 普通文本使用随机水平偏移
            const randomOffsetX = (Math.random() - 0.5) * 20;
            x = rect.left + (rect.width / 2) - (floatingText.offsetWidth / 2 || 40) + randomOffsetX;
            y = rect.top - 40;
        }

        // 设置初始位置
        floatingText.style.left = `${x}px`;
        floatingText.style.top = `${y}px`;

        // 添加到文档
        document.body.appendChild(floatingText);

        // 动画结束后移除元素
        setTimeout(() => {
            if (document.body.contains(floatingText)) {
                document.body.removeChild(floatingText);
            }
        }, 2000);
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
