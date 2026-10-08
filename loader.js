const devHosts = ["localhost", "127.0.0.1", "ngrok-free"];
window.devMode = devHosts.includes(location.hostname) ||
  devHosts.includes(location.hostname.split(".").at(-2) || location.hostname);

const serverList = [
  "cdn.northstreetumc.org",
  "cdn.vipersfutbol.com",
  "cdn.pcsce.org",                    // "gro.csecp.ndc".split("").reverse().join("")
  "cdn.kcchallengenvbc.com",
  "cdn.slcbmooc.org",                 // "gro.coombcls.ndc".split("").reverse().join("")
  "cdn.topsargym.net",                // "ten.mygratspot.ndc".split("").reverse().join("")
  "wss://athollcottage.com/connection/",
  "wss://api.personalloanonline.net/ws/"
];

window.controller = null;
window.transport = null;
window.shadowRoot = null;

function wlspUrl(entry) {
  if (entry.includes("://")) return entry;
  return `wss://${entry}/`;
}

function isBackupServer(entry) {
  return entry.includes("://");
}

function testWlspDomain(entry) {
  return new Promise(resolve => {
    let ws;
    try {
      ws = new WebSocket(wlspUrl(entry));
    } catch {
      resolve(null);
      return;
    }
    ws.binaryType = "arraybuffer";
    let gotFirst = false;
    let t = 0;
    const challenge = Math.floor(Math.random() * 0xFFFFFFFE) + 1 >>> 0;
    const timeout = setTimeout(() => {
      try { ws.close(); } catch {}
      resolve(null);
    }, 2664); // 673007 ^ 675671

    const finish = ping => {
      clearTimeout(timeout);
      ws.onmessage = ws.onerror = ws.onclose = null;
      try { ws.close(); } catch {}
      resolve(ping);
    };

    ws.onmessage = e => {
      const view = new DataView(e.data);
      const type = view.getUint8(0);
      const id   = view.getUint32(1, true);

      if (!gotFirst) {
        if (type === 5 && id === 0) {          // 403005^403000 = 5
          ws.send(new Uint8Array([5, 0, 0, 0, 0, 2, 1]));
        } else if (type === 3 && id === 0) {   // 261864^261867 = 3
          gotFirst = true;
          const ip = new TextEncoder().encode("127.0.0.1");
          const buf = new ArrayBuffer(8 + ip.length);
          const v = new DataView(buf);
          v.setUint8(0, 1);
          v.setUint32(1, challenge, true);
          v.setUint8(5, 1);
          v.setUint16(6, 1, true);
          new Uint8Array(buf).set(ip, 8);
          t = performance.now();
          ws.send(buf);
        }
        return;
      }
      if (id !== challenge) return;
      finish(Math.round(performance.now() - t));
    };

    ws.onerror = ws.onclose = () => finish(null);
  });
}

async function getWlsp() {
  const stored = localStorage.WID;
  const idx = +stored;
  const valid = stored !== undefined && stored !== "" &&
                Number.isInteger(idx) && idx >= 0 &&
                idx < serverList.length && !isBackupServer(serverList[idx]);

  if (valid) {
    const ping = await testWlspDomain(serverList[idx]);
    if (ping !== null) {
      window.WlspPing = ping;
      window.WlspIsBackup = false;
      return wlspUrl(serverList[idx]);
    }
  }

  for (let i = 0; i < serverList.length; i++) {
    const ping = await testWlspDomain(serverList[i]);
    if (ping !== null) {
      if (!isBackupServer(serverList[i])) localStorage.WID = i;
      window.WlspPing = ping;
      window.WlspIsBackup = isBackupServer(serverList[i]);
      return wlspUrl(serverList[i]);
    }
  }

  window.WlspIsBackup = isBackupServer(serverList[serverList.length - 1]);
  return wlspUrl(serverList[serverList.length - 1]);
}

window.getAsset = path => {
  if (devMode)
    return `${location.protocol}//${location.hostname}:${location.port}/stuff/${path}`;
  const hour = Math.floor(Date.now() / 3600000);
  return (window.assetsBase || "https://cdn.jsdelivr.net/gh/54ongShebrets/storage/") +
         path + (path.includes("?") ? "&" : "?") + hour + "&raw";
};

function preload(href) {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "script";
  link.href = href;
  document.head.appendChild(link);
}

window.loadScript = src => {
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => { s.remove(); res(); };
    s.onerror = () => { s.remove(); rej(); };
    document.head.appendChild(s);
  });
};

async function initTransport(client) {
  for (let i = 0; i < 100; i++) {
    try {
      await client.init();
      return;
    } catch (e) {
      if (!String(e).includes("was not loaded")) throw e;
      await new Promise(r => setTimeout(r, 100));
    }
  }
  throw new Error("transport init timed out");
}

(async () => {
  // Clear body
  while (document.body.firstChild)
    document.body.removeChild(document.body.firstChild);

  // Clean head (keep only certain link rels)
  [...document.head.childNodes].forEach(n => {
    if (n.nodeType === 1 && n.tagName === "LINK" &&
        (n.rel === "preconnect" || n.rel === "dns-prefetch")) return;
    n.remove();
  });

  // Create closed shadow root host
  const host = document.createElement("div");
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647";
  document.documentElement.appendChild(host);
  const shadow = host.attachShadow({ mode: "closed" });

  // Loader UI
  const loader = document.createElement("div");
  loader.innerText = "start";
  Object.assign(loader.style, {
    position: "fixed", top: "0", left: "0",
    width: "100%", height: "100%",
    background: "#000", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: "999999", fontSize: "20px", fontFamily: "sans-serif"
  });
  shadow.appendChild(loader);

  // Single-file / iframe detection
  const isSingleFile = (() => {
    try {
      const url = new URL(location.href);
      if (url.searchParams.has("sf")) return true;
    } catch {}
    return /(?:\?|&)sf(?:=|&|$)|\]$/.test(location.href);  // simplified from reversed regex
  })();

  if (window.top !== window.self && isSingleFile) {
    loader.innerText = "singlefile, waiting for top frame";
    const nonce = Math.random().toString(36).slice(2);
    await new Promise(resolve => {
      const onMessage = e => {
        if (e.data !== nonce) return;
        window.removeEventListener("message", onMessage);
        resolve();
      };
      window.addEventListener("message", onMessage);
      window.top.postMessage(nonce, "*");
    });
  }

  loader.innerText = "loading jet";

  const apiUrl   = getAsset("sj/jet.api.js");
  const utilsUrl = getAsset("sj/jet.utils.js");
  preload(apiUrl);
  preload(utilsUrl);

  await loadScript(getAsset("sj/jet.core.js"));
  await loadScript(apiUrl);
  await loadScript(utilsUrl);

  loader.innerText = "registering service worker (if you are stuck here, try CTRL + SHIFT + R)";

  const swBase = window.assetsBase
    ? "?raw&base=" + encodeURIComponent(btoa(window.assetsBase).split("").reverse().join(""))
    : "";
  const swUrl  = (window.swPath || "sw.js") + swBase;
  const swHref = new URL(swUrl, location.href).href;

  try {
    const existing = await navigator.serviceWorker.getRegistrations();
    await Promise.all(existing.map(r => r.unregister().catch(() => {})));
  } catch {}

  let reg = await navigator.serviceWorker.register(swUrl, { updateViaCache: "none" });
  try { await reg.update(); } catch {}

  const sw = reg.installing || reg.waiting || reg.active;
  if (sw && sw.state !== "activated") {
    await new Promise(r => {
      sw.addEventListener("statechange", function () {
        if (this.state === "activated" || this.state === "redundant") r();
      });
    });
  }

  await navigator.serviceWorker.ready;

  const isNew = () => navigator.serviceWorker.controller?.scriptURL === swHref;
  if (!isNew()) {
    await new Promise(r => {
      navigator.serviceWorker.addEventListener("controllerchange", () => isNew() && r());
      setTimeout(r, 1360);
    });
    if (!isNew() && !sessionStorage.swReloaded) {
      sessionStorage.swReloaded = 1;
      location.reload();
      return;
    }
  }
  sessionStorage.removeItem("swReloaded");

  // Health-check the SW
  let swAlive = false;
  for (let i = 0; i < 36; i++) {
    try {
      const res = await fetch(new URL("__sw_alive", reg.scope).href, { cache: "no-store" });
      if ((await res.text()) === "true") {
        swAlive = true;
        break;
      }
    } catch {}
    await new Promise(r => setTimeout(r, 6));
  }

  if (!swAlive) {
    try { await reg.unregister(); } catch {}
    await navigator.serviceWorker.register(window.swPath || "sw.js");
    await navigator.serviceWorker.ready;
    location.reload();
    return;
  }

  // Keep SW alive + re-register if it dies
  setInterval(async () => {
    try {
      const res = await fetch(new URL("__sw_alive", reg.scope).href, { cache: "no-store" });
      if ((await res.text()) !== "true") throw 0;
    } catch {
      try {
        const existing = await navigator.serviceWorker.getRegistrations();
        await Promise.all(existing.map(r => r.unregister().catch(() => {})));
      } catch {}
      reg = await navigator.serviceWorker.register(swUrl, { updateViaCache: "none" });
      await navigator.serviceWorker.ready;
    }
    controller.serviceWorkerController = navigator.serviceWorker.controller;
    controller.setupMessagePort();
  }, 20 * 152); // ≈ 3 s

  loader.innerText = "finding unlocked Opium server";

  if (!window.wlspServer) {
    window.wlspServer = devMode
      ? (location.protocol.includes("s") ? "wss://" : "ws://") + location.host + "/"
      : await getWlsp();
  }

  loader.innerText = "initializing transport";

  const transportUrl = getAsset(localStorage.TRNSPRT || "curl/index.mjs");
  const { default: TransportClient } = await import(transportUrl);
  transport = new TransportClient({ wisp: window.wlspServer });
  await initTransport(transport);

  loader.innerText = "initializing JS";

  const { Controller } = $jetController;
  controller = new Controller({
    serviceworker: navigator.serviceWorker.controller,
    transport,
    jetConfig: {
      maskedfiles: ["jet.inject.js", "jet.wasm.js"],
      flags: {
        syncxhr: false,
        disableComputedWrap: false,
        rewriterLogs: false,
        captureErrors: false,
        cleanErrors: false,
        scramitize: false,
        sourcemaps: true,
        destructureRewrites: true,
        allowInvalidJs: true,
        debugTrampolines: false,
        debugSourceURL: false,
        allowFailedIntercepts: false,
        encapsulateWorkers: false
      },
      siteFlags: {
        "tiktok|ibyteiming|byteoversea|byteiming|bytedance|ttwstatic|musical\\.ly": {
          disableComputedWrap: true,
          destructureRewrites: false
        }
      }
    },
    config: {
      jetPath: getAsset("sj/jet.core.js"),
      wasmPath: getAsset("sj/jet.wasm"),
      injectPath: getAsset("sj/jet.inject.js"),
      virtualWasmPath: "jet.wasm.js",
      codec: {
        // Custom encode / decode (XOR stream cipher based on fingerprint)
        encode: url => { /* … long fingerprint + XOR + base64url … */ },
        decode: url => { /* … inverse … */ }
      },
      prefix: new URL("./~/", location.href).pathname
    }
  });

  await controller.wait();
  controller.guardServiceWorkerRevive = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    controller.serviceWorkerController = navigator.serviceWorker.controller;
    controller.setupMessagePort();
  });

  loader.innerText = "loading UI";

  const res = await fetch(getAsset("main.html"));
  const html = await res.text();
  const parsed = new DOMParser().parseFromString(html, "text/html");

  // Inject styles / links into shadow
  for (const el of [...parsed.head.children]) {
    if (el.tagName === "LINK")
      document.head.appendChild(el.cloneNode(true));
    else if (el.tagName === "STYLE") {
      const styleClone = el.cloneNode(true);
      styleClone.textContent = styleClone.textContent.replace(/:root\b/g, ":host");
      shadow.appendChild(styleClone);
    }
  }

  shadowRoot = shadow;

  const shadowBody = document.createElement("div");
  Object.assign(shadowBody.style, {
    position: "fixed", inset: "0",
    width: "100%", height: "calc(var(--vh, 1vh) * 100)",
    overflow: "hidden",
    background: "#080810",
    fontFamily: "'Inter', sans-serif",
    color: "#e0e0e0",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center"
  });
  shadow.appendChild(shadowBody);

  for (const el of [...parsed.body.children]) {
    if (el.tagName !== "SCRIPT")
      shadowBody.appendChild(el.cloneNode(true));
  }

  // Patch document query methods so they look inside the closed shadow root
  const _gEBI = Document.prototype.getElementById;
  Document.prototype.getElementById = function (id) {
    return shadow.querySelector("#" + CSS.escape(id)) || _gEBI.call(this, id);
  };
  // similar patches for querySelector / querySelectorAll …

  loader.remove();

  // Execute scripts from the loaded HTML
  const scripts = [
    ...parsed.head.querySelectorAll("script"),
    ...parsed.body.querySelectorAll("script")
  ];
  for (const orig of scripts) {
    await new Promise(r => {
      const s = document.createElement("script");
      if (orig.src) {
        s.src = orig.src;
        s.onload = s.onerror = () => { s.remove(); r(); };
        document.head.appendChild(s);
      } else {
        s.textContent = orig.textContent;
        document.head.appendChild(s);
        s.remove();
        r();
      }
    });
  }
})();

// Block school / filter domains
const schoolList = [
  "deledao", "goguardian", "lightspeed", "linewize", "securly", ".edu/"
];

function isBlockedDomain(url) {
  try {
    const host = new URL(url, location.origin).hostname + "/";
    return schoolList.some(school => host.includes(school));
  } catch {
    return false;
  }
}

const originalFetch = window.fetch;
window.fetch = function (url, options) {
  if (isBlockedDomain(url)) return Promise.reject(new Error("Blocked"));
  return originalFetch.apply(this, arguments);
};

const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url) {
  if (isBlockedDomain(url)) throw new Error("Blocked");
  return originalOpen.apply(this, arguments);
};

HTMLCanvasElement.prototype.toDataURL = function () { return ""; };
