/* ==========================================================================
   Fully de-obfuscated opium proxy + AI client
   (all Unicode escapes, string reversals, and XOR padding removed)
   ========================================================================== */

window.dataLayer = window.dataLayer || [];
window.gtag = function () { dataLayer.push(arguments); };
gtag("js", new Date());
gtag("config", "G-1CC1LKMRS6");

(function () {
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=G-1CC1LKMRS6";
  document.head.appendChild(s);
})();

const sjEncode = url => frame.prefix + controller.config.codec.encode(url);

/* -------------------- Shortcuts -------------------- */
const SHORTCUTS = [
  { label: "YouTube", url: "https://youtube.com/" },
  { label: "TikTok", url: "https://www.tiktok.com/foryou" },
  { label: "Geforce Now", url: "https://play.geforcenow.com/mall/" },
  {
    label: "Roblox",
    faviconHost: "https://www.roblox.com/",
    url: "https://nowgg.fun/apps/a/19900/b.html"
  },
  {
    label: "Geometry Dash",
    url: "https://web-dashers.github.io/",
    faviconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdw5uFI0cIdPEEfg8nXpx-UeHx2SRH5tG-e3OhSB0dfQ&s"
  },
  { label: "Kick", url: "https://kick.com/" },
  { label: "Twitch", url: "https://twitch.tv" },
  { label: "Snapchat", url: "https://www.snapchat.com/web" },
  { label: "Instagram", url: "https://instagram.com" },
  { label: "Discord", url: "https://discord.com/app" }
];

if (!location.hostname.includes(".best")) {
  SHORTCUTS.push({
    label: "Movies",
    url: "https://aether.ist/",
    faviconUrl: "https://cdn-icons-png.flaticon.com/512/10351/10351880.png"
  });
}

/* -------------------- Search engines -------------------- */
const SEARCH_ENGINES = [
  { name: "Google", url: "https://www.google.com/search?q=" },
  { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
  { name: "Bing", url: "https://www.bing.com/search?q=" },
  { name: "Brave", url: "https://search.brave.com/search?q=" },
  { name: "Yahoo", url: "https://search.yahoo.com/search?p=" },
  { name: "Startpage", url: "https://www.startpage.com/sp/search?q=" },
  { name: "Ecosia", url: "https://www.ecosia.org/search?q=" },
  { name: "Ask", url: "https://www.ask.com/web?q=" }
];

const isMobileDevice = true;
const DEFAULT_TRANSPORT = isMobileDevice
  ? { name: "libcurl", src: "curl/index.mjs" }
  : { name: "epoxy", src: "pox/index.mjs" };

/* -------------------- Settings -------------------- */
const SETTINGS = {
  Appearance: {
    Stars: {
      type: "toggle",
      default: true,
      callback: val => { starsEnabled = val; }
    },
    "Shooting Stars": {
      type: "toggle",
      default: true,
      callback: val => { shootingStarsEnabled = val; }
    },
    "Prevent Close": {
      type: "toggle",
      default: true,
      callback: val => { preventCloseEnabled = val; }
    },
    "Title Changer": {
      type: "toggle",
      default: true,
      callback: (val, init) => {
        titleChangerEnabled = val;
        if (init) return;
        if (!val) {
          try { clearTimeout(focusTimeout); } catch {}
          focusTimeout = null;
          document.title = "opium";
        } else if (document.hidden) {
          document.title = "New Tab";
        }
      }
    }
  },
  Privacy: {
    "About:Blank Cloak": {
      type: "toggle",
      default: false,
      callback: (val, init) => {
        if (init) return;
        if (val) triggerCloak();
      }
    },
    "Clientsided Ad Block": {
      type: "toggle",
      default: true,
      callback: () => {}
    }
  },
  Proxy: {
    Transport: {
      type: "dropdown",
      default: DEFAULT_TRANSPORT,
      options: [
        { name: "libcurl", src: "curl/index.mjs" },
        { name: "epoxy", src: "pox/index.mjs" }
      ],
      callback: async val => {
        try {
          if (localStorage.TRANSPORT === val.src) return;
          localStorage.TRANSPORT = val.src;
          const { default: TransportClient } = await import(val.src);
          transport = new TransportClient({ wisp: window.wispServer });
          await initTransport(transport);
          controller.setTransport(transport);
        } catch {}
      }
    },
    "Search Engine": {
      type: "dropdown",
      default: { name: "Brave", url: "https://search.brave.com/search?q=" },
      options: SEARCH_ENGINES,
      callback: () => {}
    }
  },
  Advanced: {
    "Force Update/Clear Data": {
      type: "button",
      label: "Clear",
      action: async () => {
        if (!confirm("This will clear all data and force update the client. Are you sure?")) return;

        try {
          const names = await caches.keys();
          await Promise.all(names.map(n => caches.delete(n)));
        } catch (e) {}

        try { localStorage.clear(); } catch (e) {}
        try { sessionStorage.clear(); } catch (e) {}

        try {
          document.cookie.split(";").forEach(c => {
            const name = c.split("=")[0].trim();
            const domain = location.hostname;
            const pathParts = location.pathname.split("/");
            for (let i = pathParts.length; i >= 0; i--) {
              const path = pathParts.slice(0, i).join("/") || "/";
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};domain=${domain}`;
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;
            }
          });
        } catch (e) {}

        try {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map(r => r.unregister()));
        } catch (e) {}

        try {
          const forceDelDb = name => new Promise(res => {
            const open = indexedDB.open(name);
            open.onsuccess = () => { open.result.close(); deleteTs(); };
            open.onerror = deleteTs;
            const deleteTs = () => {
              const req = indexedDB.deleteDatabase(name);
              req.onsuccess = req.onerror = req.onblocked = res;
            };
          });
          await forceDelDb("__jet_controller");
          if (indexedDB.databases) {
            const dbs = await indexedDB.databases();
            await Promise.all(dbs.map(db => forceDelDb(db.name)));
          }
        } catch (e) {}

        allowUnload = true;
        alert("done! after the page reloads, please wait for the client to update and load");
        location.reload(true);
      }
    }
  }
};

/* -------------------- Extensions -------------------- */
const EXTENSIONS = [
  {
    name: "Youtube Ad Blocker",
    domain: ["youtube.com", "*.youtube.com"],
    code: `(function () {
  'use strict';
  var cssArrObject = [
    '#masthead-ad',
    'ytd-rich-item-renderer.style-scope.ytd-rich-grid-row #content:has(.ytd-display-ad-renderer)',
    '.video-ads.ytp-ad-module',
    'tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)',
    'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',
    '#related #player-ads',
    '#related ytd-ad-slot-renderer',
    'ytd-ad-slot-renderer',
    'yt-mealbar-promo-renderer',
    'ytd-popup-container:has(a[href="/premium"])',
    'ad-slot-renderer',
    'ytm-companion-ad-renderer',
    '#related #-ad-'
  ];
  function removeNonVideoAds(arry) {
    arry.forEach((selector, index) => {
      arry[index] = \`\${selector}{display:none!important}\`;
    });
    const premiumContainers = [...document.querySelectorAll('ytd-popup-container')];
    const matchingContainers = premiumContainers.filter(container => container.querySelector('a[href="/premium"]'));
    if (matchingContainers.length > 0) {
      matchingContainers.forEach(container => container.remove());
    }
    const backdrops = document.querySelectorAll('tp-yt-iron-overlay-backdrop');
    const targetBackdrop = Array.from(backdrops).find(backdrop => backdrop.style.zIndex === '2201');
    if (targetBackdrop) {
      targetBackdrop.className = '';
      targetBackdrop.removeAttribute('opened');
    }
    let style = document.createElement('style');
    (document.head || document.body).appendChild(style);
    style.appendChild(document.createTextNode(arry.join(' ')));
  }
  function skipAd(video) {
    const adIndicator = document.querySelector('.ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern, .video-ads.ytp-ad-module .ytp-ad-player-overlay, .ytp-ad-button-icon');
    if (adIndicator && !window.location.href.includes('https://m.youtube.com/')) {
      video.muted = true;
      video.currentTime = video.duration - 0.1;
    }
  }
  function removeAdblockWarning() {
    var warningInterval = setInterval(function () {
      var popupExists = document.getElementsByClassName('style-scope ytd-popup-container').length > 0;
      var dismissButton = document.getElementById('dismiss-button');
      var divider = document.getElementById('divider');
      if (popupExists && dismissButton && divider) {
        setTimeout(function () {
          dismissButton.click();
          const playButton = document.getElementsByClassName('ytp-play-button ytp-button')[0];
          if (playButton) playButton.click();
          clearInterval(warningInterval);
        }, Math.random() * 3000);
      }
    }, Math.random() * 500);
  }
  setInterval(() => {
    if (document.readyState !== 'loading') {
      removeNonVideoAds(cssArrObject);
      removeAdblockWarning();
      var adsVideo = document.querySelector('.ad-showing video');
      var mainVideo = document.querySelector('video');
      if (mainVideo) {
        var playerStatus = {
          currentTime: mainVideo.currentTime,
          isPaused: mainVideo.paused,
          speed: mainVideo.playbackRate
        };
        if (playerStatus.currentTime <= 5 && playerStatus.isPaused == true) {
          mainVideo.play().catch(error => {
            console.error('Failed to play video:', error);
          });
        }
      }
      if (adsVideo) {
        skipAd(adsVideo);
      }
    }
  }, 500);
})();`
  },
  {
    name: "GeForce NOW Ad Blocker",
    domain: ["geforcenow.com", "*.geforcenow.com"],
    code: `(function () {
  Object.defineProperty(document, 'hidden', { get: () => false });
  function checkForVideo() {
    const video = document.getElementById('preStreamVideo');
    if (video) {
      video.style.width = '0.1px';
      video.style.height = '0.1px';
      video.muted = true;
      const observer = new MutationObserver(() => {
        if (!document.contains(video)) {
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
  const interval = setInterval(() => {
    if (document.getElementById('preStreamVideo')) {
      clearInterval(interval);
      checkForVideo();
    }
  }, 1000);
})();`
  },
  {
    name: "nowgg.fun fat fat",
    domain: "*.ip.nowgg.fun",
    code: `window.alert = () => {};`,
    prompt: false
  }
];

const _extApproved = new Set();
const _extDismissed = new Set();

function _domainMatches(pattern, hostname) {
  if (pattern === "*") return true;
  if (pattern.startsWith("*.")) {
    const suffix = pattern.slice(2);
    return hostname === suffix || hostname.endsWith("." + suffix);
  }
  return hostname === pattern;
}

function _extMatchesDomain(ext, hostname) {
  const domains = Array.isArray(ext.domain) ? ext.domain : [ext.domain];
  return domains.some(p => _domainMatches(p, hostname));
}

function _runExtension(ext) {
  try {
    frame.element.contentWindow.eval(ext?.code?.toString());
  } catch {}
}

function _showExtPrompt(ext, idx) {
  const id = "_ep" + idx;
  if (document.getElementById(id)) return;

  const box = document.createElement("div");
  box.id = id;
  box.className = "ext-prompt";

  const eyebrow = document.createElement("div");
  eyebrow.className = "ext-prompt-eyebrow";
  eyebrow.textContent = "Extension available";

  const nameEl = document.createElement("div");
  nameEl.className = "ext-prompt-name";
  nameEl.textContent = ext.name;

  const question = document.createElement("div");
  question.className = "ext-prompt-question";
  question.textContent = "Run it on this site?";

  const btns = document.createElement("div");
  btns.className = "ext-prompt-btns";

  const yes = document.createElement("button");
  yes.className = "ext-prompt-btn yes";
  yes.textContent = "Yes";

  const no = document.createElement("button");
  no.className = "ext-prompt-btn no";
  no.textContent = "No";

  const close = () => {
    box.classList.remove("open");
    box.addEventListener("transitionend", () => box.remove(), { once: true });
    setTimeout(() => box.remove(), 350);
  };

  yes.onclick = () => {
    close();
    _extApproved.add(idx);
    _runExtension(ext);
  };
  no.onclick = () => {
    close();
    _extDismissed.add(idx);
  };

  btns.append(yes, no);
  box.append(eyebrow, nameEl, question, btns);
  (shadowRoot || document.body).appendChild(box);
  requestAnimationFrame(() => box.classList.add("open"));
}

function _checkExtensions(href, hostname) {
  try {
    hostname = new URL(href).hostname;
  } catch (e) {
    return;
  }
  if (!hostname) return;

  EXTENSIONS.forEach((ext, i) => {
    if (ext.enabled === false) return;
    if (!_extMatchesDomain(ext, hostname)) return;
    if (_extApproved.has(i)) {
      _runExtension(ext);
    } else if (ext.prompt === false) {
      _runExtension(ext);
    } else if (!_extDismissed.has(i)) {
      _showExtPrompt(ext, i);
    }
  });
}

/* -------------------- Global state -------------------- */
let frame = null;
let starsEnabled = true;
let shootingStarsEnabled = true;
let preventCloseEnabled = true;
let titleChangerEnabled = true;
var allowUnload = false;

window.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key.toLowerCase() === "r") {
    allowUnload = true;
    setTimeout(() => { allowUnload = false; }, 40);
  }
});

window.addEventListener("beforeunload", e => {
  if (allowUnload || !preventCloseEnabled) return;
  e.preventDefault();
  e.returnValue = "";
});

/* -------------------- Settings persistence -------------------- */
const saved = (() => {
  try {
    return JSON.parse(localStorage.getItem("SETTINGS") || "{}");
  } catch (e) {
    return {};
  }
})();

function saveSettings() {
  const out = {};
  Object.entries(SETTINGS).forEach(([cat, s]) => {
    out[cat] = {};
    Object.entries(s).forEach(([k, v]) => {
      out[cat][k] = v._value !== undefined ? v._value : v.default;
    });
  });
  localStorage.setItem("SETTINGS", JSON.stringify(out));
}

Object.entries(SETTINGS).forEach(([cat, settings]) => {
  Object.entries(settings).forEach(([key, s]) => {
    s._value = saved[cat]?.[key] !== undefined ? saved[cat][key] : s.default;
    if (s.callback) s.callback(s._value, true);
  });
});

/* -------------------- About:blank cloak -------------------- */
function cloakAboutBlank() {
  if (window.self !== window.top) return true;
  const win = window.open("about:blank", "_blank");
  if (!win) return false;
  allowUnload = true;
  win.document.open();
  win.document.write(cloakWrapperHtml(window.location.href));
  win.document.close();
  location.replace("https://clever.com/");
  setTimeout(() => { allowUnload = false; }, 400);
  return true;
}

let cloakPending = false;
function triggerCloak() {
  if (cloakAboutBlank()) return;
  if (cloakPending) return;
  cloakPending = true;
  const handler = () => {
    if (!cloakAboutBlank()) return;
    document.removeEventListener("click", handler, true);
    document.removeEventListener("keydown", handler, true);
    document.removeEventListener("pointerdown", handler, true);
    cloakPending = false;
  };
  document.addEventListener("click", handler, true);
  document.addEventListener("keydown", handler, true);
  document.addEventListener("pointerdown", handler, true);
}

function cloakWrapperHtml(originalUrl) {
  const titleChangerOn = !!SETTINGS.Appearance["Title Changer"]._value;
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>New Tab</title>
<style>html,body{margin:0;padding:0;height:100vh;overflow:hidden}iframe{border:0}</style>
</head>
<body>
<iframe id="cloakFrame" width="100%" height="100%" src="${window.location.href}"></iframe>
<script>
(function () {
  var originalUrl = ${JSON.stringify(originalUrl)};
  var titleChangerOnNow = ${titleChangerOn};
  function applyTitle() {
    document.title = (!titleChangerOnNow || document.hidden) ? "New Tab" : "opium";
  }
  document.addEventListener("visibilitychange", applyTitle);
  applyTitle();
  window.addEventListener("storage", function (e) {
    if (e.key !== "SETTINGS") return;
    var s;
    try { s = JSON.parse(localStorage.getItem("SETTINGS") || "{}"); } catch (err) { s = {}; }
    titleChangerOnNow = !!(s.Appearance && s.Appearance["Title Changer"]);
    applyTitle();
    if (!(s.Privacy && s.Privacy["About:Blank Cloak"])) {
      try { document.getElementById("cloakFrame").contentWindow.allowUnload = true; } catch (e) {}
      window.location.href = originalUrl;
    }
  });
})();
<\/script>
</body>
</html>`;
}

if (window.self === window.top && SETTINGS.Privacy["About:Blank Cloak"]._value) {
  triggerCloak();
}

/* -------------------- Tagline -------------------- */
const taglineEl = document.getElementById("tagline");
const taglineLink = document.createElement("a");
taglineLink.href = "https://dsc.gg/opiumbest";
taglineLink.target = "_blank";
taglineLink.rel = "noopener noreferrer";
taglineLink.textContent = "dsc.gg/opiumbest";
taglineEl.appendChild(taglineLink);

/* -------------------- Bookmarks / Shortcuts rendering -------------------- */
let _oDBPromise = null;
let _oMigratePromise = null;
const grid = document.getElementById("shortcuts");
let _bookmarks = [];

function _renderShortcuts() {
  grid.innerHTML = "";

  SHORTCUTS.forEach(({ label, url, faviconHost, faviconUrl }) => {
    const el = document.createElement("div");
    el.className = "shortcut";

    const img = document.createElement("img");
    img.className = "shortcut-icon";
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = faviconUrl ||
      "https://www.google.com/s2/favicons?domain=" +
      new URL(faviconHost || url).hostname +
      "&sz=128";
    img.onerror = () => img.removeAttribute("src");

    const span = document.createElement("span");
    span.textContent = label;

    el.append(img, span);
    el.onclick = () => navigate(url);
    grid.appendChild(el);
  });

  _bookmarks.forEach(bm => {
    const el = document.createElement("div");
    el.className = "shortcut";

    const img = document.createElement("img");
    img.className = "shortcut-icon";
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = bm.faviconUrl;
    img.onerror = () => img.removeAttribute("src");

    const span = document.createElement("span");
    span.textContent = bm.label;

    const del = document.createElement("button");
    del.className = "shortcut-delete";
    del.type = "button";
    del.title = "Remove bookmark";
    del.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>`;

    del.onclick = async e => {
      e.stopPropagation();
      await _bookmarksReady;
      _bookmarks = _bookmarks.filter(b => b.id !== bm.id);
      _renderShortcuts();
      _updateBookmarkIcon(document.getElementById("addrInput").value.trim());
      _deleteBookmark(bm.id);
    };

    el.append(img, span, del);
    el.onclick = () => navigate(bm.url);
    grid.appendChild(el);
  });
}

_renderShortcuts();

const _bookmarksReady = _loadAllBookmarks().then(bookmarks => {
  _bookmarks = bookmarks;
  _renderShortcuts();
  _updateBookmarkIcon(document.getElementById("addrInput").value.trim());
});

/* -------------------- Settings UI construction -------------------- */
const sidebar  = document.getElementById("settingsSidebar");
const tabsEl   = document.getElementById("settingsTabs");
const panelsEl = document.getElementById("settingsPanels");
const categories = Object.keys(SETTINGS);
const sectionEls = [];

function setActive(cat) {
  sidebar.querySelectorAll(".sidebar-item")
    .forEach(el => el.classList.toggle("active", el.dataset.cat === cat));
  tabsEl.querySelectorAll(".tab-item")
    .forEach(el => el.classList.toggle("active", el.dataset.cat === cat));
}

let scrollLock = false;
let scrollLockTimer = null;

function scrollToCategory(cat) {
  setActive(cat);
  const section = panelsEl.querySelector(`[data-section="${cat}"]`);
  if (!section) return;

  scrollLock = true;
  clearTimeout(scrollLockTimer);

  const secRect = section.getBoundingClientRect();
  const panRect = panelsEl.getBoundingClientRect();

  panelsEl.scrollTo({
    top: panelsEl.scrollTop + secRect.top - panRect.top,
    behavior: "smooth"
  });

  scrollLockTimer = setTimeout(() => {
    scrollLock = false;
  }, 700);
}

panelsEl.addEventListener("scroll", () => {
  if (scrollLock) return;

  const containerTop = panelsEl.getBoundingClientRect().top;
  let active = categories[0];

  sectionEls.forEach(el => {
    if (el.getBoundingClientRect().top - containerTop < 4) {
      active = el.dataset.section;
    }
  });

  setActive(active);
});

categories.forEach((cat, i) => {
  const sItem = document.createElement("div");
  sItem.className = "sidebar-item" + (i === 0 ? " active" : "");
  sItem.textContent = cat;
  sItem.dataset.cat = cat;
  sItem.onclick = () => scrollToCategory(cat);
  sidebar.appendChild(sItem);

  const tItem = document.createElement("button");
  tItem.className = "tab-item" + (i === 0 ? " active" : "");
  tItem.textContent = cat;
  tItem.dataset.cat = cat;
  tItem.onclick = () => scrollToCategory(cat);
  tabsEl.appendChild(tItem);

  const section = document.createElement("div");
  section.className = "settings-panel-section";
  section.dataset.section = cat;
  sectionEls.push(section);

  const lbl = document.createElement("div");
  lbl.className = "category-label";
  lbl.textContent = cat;
  section.appendChild(lbl);

  const rows = document.createElement("div");
  rows.className = "category-rows";

  Object.entries(SETTINGS[cat]).forEach(([key, s]) => {
    const row = document.createElement("div");
    row.className = "setting-row";

    const label = document.createElement("span");
    label.className = "setting-label";
    label.textContent = key;
    row.appendChild(label);

    if (s.type === "toggle") {
      const btn = document.createElement("button");
      btn.className = "toggle" + (s._value ? " on" : "");
      btn.onclick = () => {
        btn.classList.toggle("on");
        s._value = btn.classList.contains("on");
        s.callback(s._value);
        saveSettings();
      };
      row.appendChild(btn);
    } else if (s.type === "input") {
      const inp = document.createElement("input");
      inp.className = "setting-input";
      inp.placeholder = key;
      inp.value = s._value || "";
      inp.onchange = () => {
        s._value = inp.value;
        s.callback(inp.value);
        saveSettings();
      };
      row.appendChild(inp);
    } else if (s.type === "button") {
      const btn = document.createElement("button");
      btn.className = "setting-action-btn";
      btn.textContent = s.label;
      btn.onclick = () => s.action();
      row.appendChild(btn);
    } else if (s.type === "dropdown") {
      const sel = document.createElement("select");
      sel.className = "setting-select";
      s.options.forEach(opt => {
        const o = document.createElement("option");
        o.textContent = opt.name;
        o.value = JSON.stringify(opt);
        if (opt.name === s._value?.name) o.selected = true;
        sel.appendChild(o);
      });
      sel.onchange = () => {
        s._value = JSON.parse(sel.value);
        s.callback(s._value);
        saveSettings();
      };
      row.appendChild(sel);
    }
    rows.appendChild(row);
  });

  section.appendChild(rows);
  panelsEl.appendChild(section);
});

const spacer = document.createElement("div");
spacer.className = "settings-spacer";
panelsEl.appendChild(spacer);

/* -------------------- Viewport height helper -------------------- */
function setVh() {
  document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
}
setVh();
window.addEventListener("resize", setVh);

/* -------------------- Starfield canvas -------------------- */
let canvas = document.getElementById("stars");
let ctx = canvas.getContext("2d");
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const starObjs = Array.from({ length: 180 }, () => {
  const base = Math.random() * 0.28 + 0.05;
  return {
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 0.85 + 0.2,
    base,
    alpha: base,
    blinking: Math.random() < 0.3,
    blinkPeak: 0,
    blinkDir: 1,
    blinkSpeed: 0.012 + Math.random() * 0.022,
    pauseMs: Math.random() * 2800
  };
});

let shoots = [];

const homeStateEls = ["panel", "gamesScreen", "gamePlayer", "effectsScreen"]
  .map(id => document.getElementById(id));

function starsShouldRun() {
  return !document.hidden && document.hasFocus() && isOpiumMenu(true);
}

const OPIUM_EXTERNAL_SCREENS = ["panel", "gamePlayer"];
const OPIUM_HOME_ONLY_SCREENS = ["gamesScreen", "effectsScreen"];

function isOpiumMenu(homePageOnly = false) {
  const ids = homePageOnly
    ? [...OPIUM_EXTERNAL_SCREENS, ...OPIUM_HOME_ONLY_SCREENS]
    : OPIUM_EXTERNAL_SCREENS;
  return !ids.some(id => document.getElementById(id)?.classList.contains("open"));
}
globalThis.isOpiumMenu = isOpiumMenu;

const navActiveMap = [
  ["gamesScreen",   "navGames"],
  ["effectsScreen", "navEffects"],
  ["settingsScreen","navSettings"]
];

function updateNavActive() {
  navActiveMap.forEach(([screenId, navId]) => {
    const screen = document.getElementById(screenId);
    const nav    = document.getElementById(navId);
    if (screen && nav) {
      nav.classList.toggle("active", screen.classList.contains("open"));
    }
  });
}
updateNavActive();

let starsRafPending = false;
let last = 0;
let starsGen = 0;
let starsActive = null;

function stopStars() {
  starsGen++;
  starsRafPending = false;
  last = 0;
  shoots = [];
  if (W && H) ctx.clearRect(0, 0, W, H);
}

function startStars() {
  if (starsRafPending) return;
  starsRafPending = true;
  const gen = starsGen;
  requestAnimationFrame(ts => doFrame(ts, gen));
}

function updateStarsActive() {
  const should = starsShouldRun();
  if (should === starsActive) return;
  starsActive = should;
  if (should) {
    startStars();
    if (!shootTimer) scheduleShoot();
  } else {
    stopStars();
  }
}

function spawnShoot() {
  const x  = Math.random() * W * 1.4 - W * 0.2;
  const y  = Math.random() * H * 0.5;
  const a  = Math.PI / 4 * (4 + Math.random() * 10);
  const sp = 3 + Math.random() * 8;
  shoots.push({
    x, y,
    vx: Math.cos(a) * sp,
    vy: Math.sin(a) * sp,
    len: 60 + Math.random() * 100,
    life: 1,
    decay: 0.016 + Math.random() * 0.014
  });
}

let nextShootAt = 0;
let shootTimer = null;

function scheduleShoot() {
  shootTimer = null;
  if (!starsShouldRun()) return;

  const now = Date.now();
  if (shootingStarsEnabled && now >= nextShootAt) {
    spawnShoot();
    nextShootAt = now + 180 + Math.random() * 220;
  }
  shootTimer = setTimeout(scheduleShoot, 400 + Math.random() * 800);
}

document.addEventListener("visibilitychange", updateStarsActive);
window.addEventListener("blur",  updateStarsActive);
window.addEventListener("focus", updateStarsActive);

const screenClassObserver = new MutationObserver(() => {
  updateNavActive();
  updateStarsActive();
});

const settingsScreenEl = document.getElementById("settingsScreen");
[...homeStateEls, settingsScreenEl].forEach(el => {
  if (el) {
    screenClassObserver.observe(el, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }
});

setInterval(updateStarsActive, 1000);

const STARS_MAX_DT = 48;

function doFrame(ts, gen) {
  if (gen !== starsGen) return;
  if (!starsRafPending || !starsShouldRun()) {
    stopStars();
    return;
  }

  if (!last) {
    last = ts;
    requestAnimationFrame(t => doFrame(t, gen));
    return;
  }

  const dt = ts - last;
  if (dt < 16) {
    requestAnimationFrame(t => doFrame(t, gen));
    return;
  }

  last = ts;
  const clamped = Math.min(dt, STARS_MAX_DT);

  ctx.clearRect(0, 0, W, H);

  if (starsEnabled) {
    for (const s of starObjs) {
      if (s.blinking) {
        s.blinkPeak += s.blinkDir * s.blinkSpeed * (clamped / 16);
        if (s.blinkPeak >= 1) {
          s.blinkPeak = 1;
          s.blinkDir = -1;
        } else if (s.blinkPeak <= 0) {
          s.blinkPeak = 0;
          s.blinkDir = 1;
          s.pauseMs -= clamped;
          if (s.pauseMs <= 0) {
            s.pauseMs = Math.random() * 2800;
          } else {
            s.blinkDir = 0;
          }
        }
        s.alpha = s.base + (1 - s.base) * s.blinkPeak;
      }

      const px = s.x * W;
      const py = s.y * H;
      const r  = s.r;

      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
      ctx.fill();
    }
  }

  for (let i = shoots.length - 1; i >= 0; i--) {
    const sh = shoots[i];
    sh.x += sh.vx * (clamped / 16);
    sh.y += sh.vy * (clamped / 16);
    sh.life -= sh.decay * (clamped / 16);

    if (sh.life <= 0) {
      shoots.splice(i, 1);
      continue;
    }

    const tailX = sh.x - sh.vx * sh.len * 0.15;
    const tailY = sh.y - sh.vy * sh.len * 0.15;

    const grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY);
    grad.addColorStop(0, `rgba(255,255,255,${sh.life})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");

    ctx.beginPath();
    ctx.moveTo(sh.x, sh.y);
    ctx.lineTo(tailX, tailY);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.6;
    ctx.lineCap = "round";
    ctx.stroke();
  }

  requestAnimationFrame(t => doFrame(t, gen));
}

updateStarsActive();

/* -------------------- AI Chat + Screenshare system -------------------- */
let _aiWs = null;
let _aiWsReady = false;
let _aiStreaming = false;
let _aiCurrentChatId = null;
let _aiChats = [];
let _aiSelectedModel = "gpt-4o-mini";
let _aiWebSearchEnabled = false;

let _streamAsstId = null;
let _streamPlaceholder = null;
let _streamMedia = null;
let _pendingUserMsg = null;

const AI_MEDIA_CHUNK_CHARS = 12000;
const SOLVE_QUESTION_PROMPT = "Solve the question shown on this page. Be concise and show your work.";

function _newId() {
  return crypto.randomUUID ? crypto.randomUUID() :
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

function _toast(msg) {
  console.log("[toast]", msg);
}

async function _fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      resolve(dataUrl.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function _oDB() {
  if (_oDBPromise) return _oDBPromise;
  _oDBPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open("opium_ai", 1);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("chats")) {
        db.createObjectStore("chats", { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return _oDBPromise;
}

async function _persistChat(chat) {
  try {
    const db = await _oDB();
    const tx = db.transaction("chats", "readwrite");
    tx.objectStore("chats").put(chat);
  } catch (e) {
    console.error("[AI] failed to persist chat", e);
  }
}

async function _loadAllChats() {
  try {
    const db = await _oDB();
    const tx = db.transaction("chats", "readonly");
    const store = tx.objectStore("chats");
    return new Promise(resolve => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

function _getChat(id) {
  let chat = _aiChats.find(c => c.id === id);
  if (!chat) {
    chat = { id, title: "", messages: [] };
    _aiChats.unshift(chat);
  }
  return chat;
}

function _deleteChatRecord(id) {
  _oDB().then(db => {
    const tx = db.transaction("chats", "readwrite");
    tx.objectStore("chats").delete(id);
  }).catch(e => console.error("[AI] delete failed", id, e));
}

function _ensureAIWs() {
  if (_aiWs && (_aiWs.readyState === WebSocket.OPEN || _aiWs.readyState === WebSocket.CONNECTING)) {
    return;
  }

  const protocol = location.protocol === "https:" ? "wss://" : "ws://";
  const wsUrl = (window.aiWsUrl || (protocol + location.host + "/ai"));

  _aiWs = new WebSocket(wsUrl);
  _aiWs.binaryType = "arraybuffer";

  _aiWs.onopen = () => {
    _aiWsReady = true;
    _setAIStatus("");
  };

  _aiWs.onclose = () => {
    _aiWsReady = false;
    _aiStreaming = false;
    _setAIStatus("disconnected");
    setTimeout(_ensureAIWs, 2000);
  };

  _aiWs.onerror = () => {
    _aiWsReady = false;
  };

  _aiWs.onmessage = e => {
    let msg;
    try {
      msg = JSON.parse(e.data);
    } catch {
      return;
    }
    _handleAIMessage(msg);
  };
}

function _setAIStatus(text) {
  const el = document.getElementById("aiStatus");
  if (el) el.textContent = text || "";
}

function _handleAIMessage(m) {
  switch (m.type) {
    case "message": {
      _aiCurrentChatId = m.conversationId;
      if (_pendingUserMsg) {
        const chat = _getChat(_aiCurrentChatId);
        if (!chat.title) chat.title = m.title || "New chat";
        chat.model = m.model || _aiSelectedModel;
        const id = m.messageId || _pendingUserMsg.id;
        chat.messages.push({
          id,
          role: "user",
          content: _pendingUserMsg.content,
          media: _pendingUserMsg.media
        });
        _persistChat(chat);
        _pendingUserMsg = null;
      }
      _renderRecents();
      break;
    }
    case "thinking":
      break;
    case "content":
      break;
    case "done":
      _aiStreaming = false;
      _streamAsstId = null;
      _streamPlaceholder = null;
      break;
    case "error":
      _aiStreaming = false;
      _toast(m.text || "error");
      break;
  }
}

function _renderMarkdown(el, text) {
  el.innerHTML = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>");
}

function _createAssistantShell() {
  const messageDiv = document.createElement("div");
  messageDiv.className = "ai-message assistant";

  const reasoningDetails = document.createElement("div");
  reasoningDetails.className = "ai-reasoning";
  reasoningDetails.style.display = "none";

  const reasoningBody = document.createElement("div");
  reasoningBody.className = "ai-reasoning-body";
  reasoningDetails.appendChild(reasoningBody);

  const textDiv = document.createElement("div");
  textDiv.className = "ai-message-text";

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "ai-message-actions";

  const statsDiv = document.createElement("div");
  statsDiv.className = "ai-message-stats";

  const waitDiv = document.createElement("div");
  waitDiv.className = "ai-thinking-dots";
  waitDiv.innerHTML = `<span class="ai-typing-dot"></span><span class="ai-typing-dot"></span><span class="ai-typing-dot"></span>`;

  const statusDiv = document.createElement("div");
  statusDiv.className = "ai-message-status";
  statusDiv.style.display = "none";

  messageDiv.append(reasoningDetails, waitDiv, statusDiv, textDiv, actionsDiv, statsDiv);

  return {
    messageDiv,
    reasoningDetails,
    reasoningBody,
    textDiv,
    actionsDiv,
    statsDiv,
    waitDiv,
    statusDiv
  };
}

function _showThinkingIndicator() {
  const container = document.getElementById("aiMessages");
  const el = document.createElement("div");
  el.className = "ai-message assistant";

  if (_aiWebSearchEnabled) {
    const status = document.createElement("div");
    status.className = "ai-message-status";
    status.textContent = "Searching the web…";
    el.appendChild(status);
  }

  const dots = document.createElement("div");
  dots.className = "ai-thinking-dots";
  dots.innerHTML = `<span class="ai-typing-dot"></span><span class="ai-typing-dot"></span><span class="ai-typing-dot"></span>`;
  el.appendChild(dots);

  container.appendChild(el);
  _scrollChatToBottom();
  return el;
}

function _scrollChatToBottom() {
  const container = document.getElementById("aiMessages");
  if (container) container.scrollTop = container.scrollHeight;
}

function _renderUserMessage(id, content, mediaUrl) {
  const container = document.getElementById("aiMessages");
  const el = document.createElement("div");
  el.className = "ai-message user";
  el.dataset.msgId = id;

  const text = document.createElement("div");
  text.className = "ai-message-text";
  text.textContent = content;
  el.appendChild(text);

  if (mediaUrl) {
    const media = document.createElement("div");
    media.className = "ai-message-media";
    const img = document.createElement("img");
    img.src = mediaUrl;
    img.style.maxWidth = "100%";
    img.style.borderRadius = "12px";
    media.appendChild(img);
    el.appendChild(media);
  }

  container.appendChild(el);
  _scrollChatToBottom();
}

function _renderAssistantMessage(msg) {
  const container = document.getElementById("aiMessages");
  const shell = _createAssistantShell();
  shell.messageDiv.dataset.msgId = msg.id;

  if (msg.reasoning) {
    shell.reasoningDetails.style.display = "block";
    shell.reasoningBody.textContent = msg.reasoning;
  }

  shell.waitDiv.style.display = "none";
  _mountTextDiv(shell);
  _renderMarkdown(shell.textDiv, msg.content);

  if (msg.media) {
    _appendMedia(shell.textDiv, msg.media.kind, msg.media.url);
  }

  _addCopyAction(shell.actionsDiv, () => msg.media ? msg.media.url : msg.content);
  _addRetryAction(shell.actionsDiv, () => _retryMessage(msg.id));

  container.appendChild(shell.messageDiv);
  _scrollChatToBottom();
  return shell.messageDiv;
}

function _mountTextDiv(shell) {
  if (!shell.textDiv.isConnected) {
    shell.messageDiv.insertBefore(shell.textDiv, shell.actionsDiv);
  }
}

function _appendMedia(parent, kind, url) {
  const wrap = document.createElement("div");
  wrap.className = "ai-message-media";

  const encoded = sjEncode(url);

  if (kind === "image") {
    const img = document.createElement("img");
    img.src = encoded;
    img.alt = "";
    img.style.cssText = "max-width:100%;border-radius:12px;display:block;margin-top:8px;cursor:zoom-in";
    img.onclick = () => window.open(encoded, "_blank");
    wrap.appendChild(img);
  } else {
    const video = document.createElement("video");
    video.src = encoded;
    video.controls = true;
    video.playsInline = true;
    video.style.cssText = "max-width:100%;border-radius:12px;display:block;margin-top:8px";
    wrap.appendChild(video);
  }
  parent.appendChild(wrap);
}

function _addCopyAction(container, getText) {
  const btn = document.createElement("button");
  btn.textContent = "Copy";
  btn.onclick = () => {
    navigator.clipboard.writeText(getText()).then(() => _toast("copied"));
  };
  container.appendChild(btn);
}

function _addRetryAction(container, onRetry) {
  const btn = document.createElement("button");
  btn.textContent = "Retry";
  btn.onclick = onRetry;
  container.appendChild(btn);
}

function _renderRecents() {
  const list = document.getElementById("aiRecentList");
  if (!list) return;
  list.innerHTML = "";

  if (_aiChats.length === 0) {
    const empty = document.createElement("div");
    empty.className = "ai-empty-state";
    empty.textContent = "No recent chats";
    list.appendChild(empty);
    return;
  }

  _aiChats.forEach(chat => {
    const item = document.createElement("div");
    item.className = "ai-recent-item" + (chat.id === _aiCurrentChatId ? " active" : "");
    item.dataset.chatId = chat.id;

    const title = document.createElement("span");
    title.className = "ai-recent-item-title";
    title.textContent = chat.title || "untitled";
    title.onclick = () => _loadChat(chat.id);
    item.appendChild(title);

    const del = document.createElement("button");
    del.className = "ai-recent-item-delete";
    del.type = "button";
    del.title = "Delete conversation";
    del.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>`;
    del.onclick = e => {
      e.stopPropagation();
      _deleteChat(chat.id);
    };
    item.appendChild(del);

    list.appendChild(item);
  });
}

function _loadChat(chatId) {
  if (_aiStreaming) return;
  const chat = _aiChats.find(c => c.id === chatId);
  if (!chat) return;

  _aiCurrentChatId = chatId;
  _showAIWelcome(false);

  const container = document.getElementById("aiMessages");
  if (container) container.innerHTML = "";

  chat.messages.forEach(msg => {
    if (msg.role === "user") {
      _renderUserMessage(msg.id, msg.content, msg.media ? msg.media.url : null);
    } else {
      _renderAssistantMessage(msg);
    }
  });

  if (chat.model) {
    _aiSelectedModel = chat.model;
    const sel = document.getElementById("aiModelSelect");
    if (sel && [...sel.options].some(o => o.value === chat.model)) {
      sel.value = chat.model;
    }
  }
  _renderRecents();
}

function _deleteChat(chatId) {
  if (!chatId) return;
  if (!_aiWsReady || !_aiWs) {
    _setAIStatus("not connected");
    _ensureAIWs();
    return;
  }
  _aiWs.send(JSON.stringify({
    type: "deleteConversation",
    conversationId: chatId
  }));
}

function _onConversationDeleted(conversationId) {
  if (!conversationId) return;
  _aiChats = _aiChats.filter(c => c.id !== conversationId);
  _deleteChatRecord(conversationId);

  if (_aiCurrentChatId === conversationId) {
    _aiCurrentChatId = null;
    _clearAIMessages();
    _showAIWelcome(true);
  }
  _renderRecents();
}

function _clearAIMessages() {
  const container = document.getElementById("aiMessages");
  if (container) container.innerHTML = "";
}

function _showAIWelcome(show) {
  const welcome = document.getElementById("aiWelcome");
  if (welcome) welcome.style.display = show ? "" : "none";
}

/* -------------------- Screenshare / Picture-in-Picture -------------------- */
let _screenshareStream = null;
let _screenshareVideo = null;
let _screenshareWin = null;
let _screenshareUi = null;
let _screenshareStreaming = false;
let _screenshareChatId = null;
let _screenshareAsstId = null;
let _screenshareContent = "";
let _screenshareReasoning = "";
let _pendingScreenshareUserMsg = null;
let _pendingScreenshareMediaResolve = null;

function _startScreenshare() {
  if (_screenshareStream) {
    _toast("screenshare already active");
    return;
  }
  if (!(window.documentPictureInPicture && window.documentPictureInPicture.requestWindow)) {
    _toast("Picture-in-Picture is not supported in this browser");
    return;
  }

  alert("Choose the tab or window to screenshare, NOT your entire screen.\nThe model currently selected will be used for screenshare.");

  navigator.mediaDevices.getDisplayMedia({
    video: { displaySurface: "browser" },
    audio: false
  }).then(stream => _initScreenshareStream(stream))
    .catch(err => {
      if (err && err.name !== "NotAllowedError") {
        _toast("screenshare failed: " + (err.message || err));
      }
    });
}

async function _initScreenshareStream(stream) {
  _screenshareStream = stream;
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.srcObject = stream;
  try { await video.play(); } catch (e) {}
  _screenshareVideo = video;

  const track = stream.getVideoTracks()[0];
  if (track) track.addEventListener("ended", _stopScreenshare);

  _screenshareChatId = null;
  await _openScreenshareWindow();
}

function _stopScreenshare() {
  if (_screenshareStream) {
    _screenshareStream.getTracks().forEach(t => t.stop());
    _screenshareStream = null;
  }
  _screenshareVideo = null;
  if (_screenshareWin) {
    try { _screenshareWin.close(); } catch (e) {}
    _screenshareWin = null;
  }
  _screenshareUi = null;
  _screenshareStreaming = false;
  _screenshareChatId = null;
  _screenshareAsstId = null;
  _screenshareContent = "";
  _screenshareReasoning = "";
  _pendingScreenshareUserMsg = null;
  _pendingScreenshareMediaResolve = null;
}

function _captureScreenshot() {
  return new Promise((resolve, reject) => {
    try {
      const video = _screenshareVideo;
      if (!video) {
        reject(new Error("no active screenshare"));
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width  = video.videoWidth  || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error("capture failed"));
      }, "image/png");
    } catch (e) {
      reject(e);
    }
  });
}

async function _openScreenshareWindow() {
  let win;
  try {
    win = await window.documentPictureInPicture.requestWindow({
      width: 380,
      height: 520
    });
  } catch (e) {
    _toast("could not open the AI screenshare window");
    _stopScreenshare();
    return;
  }

  _screenshareWin = win;

  const style = win.document.createElement("style");
  style.textContent = `
    * { box-sizing: border-box; }
    html, body { margin: 0; height: 100%; background: #0c0c14; color: #e8e8f0; font-family: 'Inter', system-ui, sans-serif; }
    .ss-wrap { display: flex; flex-direction: column; height: 100%; }
    .ss-header { padding: 10px 12px; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.5); letter-spacing: .02em; border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
    .ss-messages { flex: 1; overflow-y: auto; padding: 10px 12px; display: flex; flex-direction: column; gap: 12px; }
    .ss-turn { display: flex; flex-direction: column; gap: 6px; }
    .ss-user { font-size: 12px; color: rgba(255,255,255,0.45); font-style: italic; white-space: pre-wrap; }
    .ss-assistant { font-size: 13.5px; line-height: 1.5; color: rgba(255,255,255,0.92); word-wrap: break-word; }
    .ss-assistant a { color: #a78bfa; }
    .ss-assistant p { margin: 0 0 8px; }
    .ss-assistant p:last-child { margin-bottom: 0; }
    .ss-status { font-size: 11px; color: rgba(255,255,255,0.4); padding: 0 12px 4px; min-height: 14px; flex-shrink: 0; }
    .ss-inputrow { display: flex; gap: 6px; padding: 8px 10px; border-top: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
    .ss-textarea { flex: 1; resize: none; min-height: 34px; max-height: 90px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; color: #fff; padding: 8px 10px; font-family: inherit; font-size: 13px; }
    .ss-textarea:focus { outline: none; border-color: rgba(167,139,250,0.5); }
    .ss-btn { border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .ss-send { width: 34px; height: 34px; background: #8b7cf6; color: #fff; }
    .ss-send:disabled, .ss-solve:disabled { opacity: .4; cursor: default; }
    .ss-solverow { padding: 0 10px 8px; flex-shrink: 0; }
    .ss-solve { width: 100%; padding: 8px; background: rgba(167,139,250,0.15); color: #cbb8ff; font-size: 12.5px; font-weight: 500; border: 1px solid rgba(167,139,250,0.3); }
    .ss-solve:hover:not(:disabled) { background: rgba(167,139,250,0.25); }
    .ss-dots { display: flex; gap: 4px; padding: 2px 0; }
    .ss-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.4); animation: ssBlink 1.2s infinite ease-in-out; }
    .ss-dot:nth-child(2) { animation-delay: .15s; }
    .ss-dot:nth-child(3) { animation-delay: .3s; }
    @keyframes ssBlink { 0%, 80%, 100% { opacity: .25; } 40% { opacity: 1; } }
  `;
  win.document.head.appendChild(style);

  const wrap = win.document.createElement("div");
  wrap.className = "ss-wrap";

  const header = win.document.createElement("div");
  header.className = "ss-header";
  header.textContent = "opium AI - screenshare";
  wrap.appendChild(header);

  const messages = win.document.createElement("div");
  messages.className = "ss-messages";
  wrap.appendChild(messages);

  const status = win.document.createElement("div");
  status.className = "ss-status";
  wrap.appendChild(status);

  const solveRow = win.document.createElement("div");
  solveRow.className = "ss-solverow";
  const solveBtn = win.document.createElement("button");
  solveBtn.type = "button";
  solveBtn.className = "ss-btn ss-solve";
  solveBtn.textContent = "Solve question on this page";
  solveRow.appendChild(solveBtn);
  wrap.appendChild(solveRow);

  const inputRow = win.document.createElement("div");
  inputRow.className = "ss-inputrow";
  const textarea = win.document.createElement("textarea");
  textarea.className = "ss-textarea";
  textarea.placeholder = "Ask about this tab…";
  textarea.rows = 1;

  const sendBtn = win.document.createElement("button");
  sendBtn.type = "button";
  sendBtn.className = "ss-btn ss-send";
  sendBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 7-7 7 7M12 19V5"/></svg>`;

  inputRow.append(textarea, sendBtn);
  wrap.appendChild(inputRow);
  win.document.body.appendChild(wrap);

  const send = () => {
    const text = textarea.value.trim();
    if (!text || _screenshareStreaming) return;
    textarea.value = "";
    _sendScreenshareMessage(text);
  };

  sendBtn.onclick = send;
  textarea.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  solveBtn.onclick = () => {
    if (!_screenshareStreaming) _sendScreenshareMessage(SOLVE_QUESTION_PROMPT);
  };

  win.addEventListener("pagehide", _stopScreenshare, { once: true });

  _screenshareUi = {
    messages,
    status,
    sendBtn,
    solveBtn,
    textarea,
    currentTurn: null,
    currentAssistantEl: null,
    currentDots: null
  };
}

function _screenshareSetStatus(text) {
  if (_screenshareUi && _screenshareUi.status) {
    _screenshareUi.status.textContent = text || "";
  }
}

function _screenshareRenderUser(text) {
  if (!_screenshareUi || !_screenshareWin) return;
  const doc = _screenshareWin.document;
  const turn = doc.createElement("div");
  turn.className = "ss-turn";

  const user = doc.createElement("div");
  user.className = "ss-user";
  user.textContent = "📷 " + text;
  turn.appendChild(user);

  _screenshareUi.messages.appendChild(turn);
  _screenshareUi.currentTurn = turn;
  _screenshareUi.messages.scrollTop = _screenshareUi.messages.scrollHeight;
}

function _screenshareShowThinking() {
  if (!_screenshareUi || !_screenshareUi.currentTurn || !_screenshareWin) return;
  const dots = _screenshareWin.document.createElement("div");
  dots.className = "ss-dots";
  dots.innerHTML = `<span class="ss-dot"></span><span class="ss-dot"></span><span class="ss-dot"></span>`;
  _screenshareUi.currentTurn.appendChild(dots);
  _screenshareUi.currentDots = dots;
}

function _screenshareUpdateResponse() {
  if (!_screenshareUi || !_screenshareUi.currentTurn || !_screenshareWin) return;

  if (_screenshareUi.currentDots) {
    _screenshareUi.currentDots.remove();
    _screenshareUi.currentDots = null;
  }

  if (!_screenshareUi.currentAssistantEl) {
    const el = _screenshareWin.document.createElement("div");
    el.className = "ss-assistant";
    _screenshareUi.currentTurn.appendChild(el);
    _screenshareUi.currentAssistantEl = el;
  }

  _renderMarkdown(_screenshareUi.currentAssistantEl, _screenshareContent || "");
  _screenshareUi.messages.scrollTop = _screenshareUi.messages.scrollHeight;
}

async function _sendScreenshareMessage(promptText) {
  if (_screenshareStreaming) return;
  if (!promptText) return;
  if (_aiStreaming) {
    _screenshareSetStatus("main chat is busy, try again in a moment");
    return;
  }
  if (!_screenshareVideo) {
    _screenshareSetStatus("no tab is being shared");
    return;
  }
  if (!_aiWsReady || !_aiWs) {
    _ensureAIWs();
    _screenshareSetStatus("not connected");
    return;
  }

  if (_screenshareUi) {
    if (_screenshareUi.sendBtn) _screenshareUi.sendBtn.disabled = true;
    if (_screenshareUi.solveBtn) _screenshareUi.solveBtn.disabled = true;
  }

  _screenshareSetStatus("capturing screenshot…");

  let blob;
  try {
    blob = await _captureScreenshot();
  } catch (e) {
    _screenshareOnError("screenshot failed");
    return;
  }

  const file = new File([blob], "screenshot.png", { type: "image/png" });
  const objectUrl = URL.createObjectURL(blob);

  _screenshareRenderUser(promptText);
  _screenshareShowThinking();
  _screenshareStreaming = true;
  _screenshareContent = "";
  _screenshareReasoning = "";
  _screenshareAsstId = _newId();
  _pendingScreenshareUserMsg = {
    id: _newId(),
    content: promptText,
    media: { url: objectUrl, blob: file }
  };

  _screenshareSetStatus("uploading screenshot…");

  try {
    const base64 = await _fileToBase64(file);
    const mediaId = await new Promise((resolve, reject) => {
      _pendingScreenshareMediaResolve = resolve;
      _aiWs.send(JSON.stringify({
        type: "mediaStart",
        model: _aiSelectedModel,
        mime: file.type,
        conversationId: _screenshareChatId || undefined
      }));
      setTimeout(() => {
        if (_pendingScreenshareMediaResolve === resolve) {
          _pendingScreenshareMediaResolve = null;
          reject(new Error("upload timed out"));
        }
      }, 15000);
    });

    for (let i = 0; i < base64.length; i += AI_MEDIA_CHUNK_CHARS) {
      _aiWs.send(JSON.stringify({
        type: "mediaChunk",
        mediaId,
        chunk: base64.slice(i, i + AI_MEDIA_CHUNK_CHARS)
      }));
    }

    _aiWs.send(JSON.stringify({
      type: "mediaDone",
      mediaId,
      prompt: promptText
    }));

    _screenshareSetStatus("");
  } catch (err) {
    _screenshareOnError(err.message || "upload failed");
  }
}

function _handleScreenshareMessage(m) {
  switch (m.type) {
    case "message": {
      _screenshareChatId = m.conversationId;
      if (_pendingScreenshareUserMsg) {
        const chat = _getChat(_screenshareChatId);
        if (!chat.title) chat.title = m.title || "Screenshare";
        chat.model = m.model || _aiSelectedModel;
        const id = m.messageId || _pendingScreenshareUserMsg.id;
        chat.messages.push({
          id,
          role: "user",
          content: _pendingScreenshareUserMsg.content,
          media: _pendingScreenshareUserMsg.media
        });
        _persistChat(chat);
        _pendingScreenshareUserMsg = null;
      }
      _renderRecents();
      break;
    }
    case "thinking":
      if (!_screenshareReasoning) _screenshareSetStatus("Reasoning…");
      _screenshareReasoning += m.delta || "";
      break;
    case "content":
      if (!_screenshareContent) _screenshareSetStatus("");
      _screenshareContent += m.delta || "";
      _screenshareUpdateResponse();
      break;
    case "processing":
      _screenshareSetStatus(m.text || "");
      break;
    case "usage":
      break;
    case "image":
    case "video":
      _screenshareContent += (_screenshareContent ? "\n\n" : "") + `[${m.type}](${m.url})`;
      _screenshareUpdateResponse();
      break;
    case "done":
      _screenshareFinish();
      break;
    case "error":
      if (_pendingScreenshareMediaResolve) _pendingScreenshareMediaResolve = null;
      _screenshareOnError(m.text || "error");
      break;
  }
}

function _screenshareFinish() {
  const chat = _getChat(_screenshareChatId);
  if (chat) {
    chat.messages.push({
      id: _screenshareAsstId,
      role: "assistant",
      content: _screenshareContent,
      reasoning: _screenshareReasoning || undefined
    });
    _persistChat(chat);
  }
  _renderRecents();

  if (_screenshareUi) {
    _screenshareUi.currentTurn = null;
    _screenshareUi.currentAssistantEl = null;
    _screenshareUi.currentDots = null;
    if (_screenshareUi.sendBtn) _screenshareUi.sendBtn.disabled = false;
    if (_screenshareUi.solveBtn) _screenshareUi.solveBtn.disabled = false;
  }
  _screenshareStreaming = false;
  _screenshareSetStatus("");
}

function _screenshareOnError(text) {
  _screenshareSetStatus(text);
  if (_screenshareUi) {
    if (_screenshareUi.currentDots) {
      _screenshareUi.currentDots.remove();
      _screenshareUi.currentDots = null;
    }
    _screenshareUi.currentTurn = null;
    _screenshareUi.currentAssistantEl = null;
    if (_screenshareUi.sendBtn) _screenshareUi.sendBtn.disabled = false;
    if (_screenshareUi.solveBtn) _screenshareUi.solveBtn.disabled = false;
  }
  _pendingScreenshareUserMsg = null;
  _pendingScreenshareMediaResolve = null;
  _screenshareStreaming = false;
}

/* -------------------- Initialisation -------------------- */
(async () => {
  _aiChats = await _loadAllChats();
  _renderRecents();
  _ensureAIWs();
})();
