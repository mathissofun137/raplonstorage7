const devHosts = ['localhost', '127.0.0.1', 'ngrok-free']
window.devMode =
  devHosts.includes(location.hostname) ||
  devHosts.includes(
    location.hostname.split('.').at(-(409168 ^ 409170)) || location.hostname
  )
const serverList = [
  'cdn.northstreetumc.org',
  'cdn.vipersfutbol.com',
  'gro.csecp.ndc'.split('').reverse().join(''),
  'cdn.kcchallengevbc.com',
  'gro.coombcls.ndc'.split('').reverse().join(''),
  'ten.mygratspot.ndc'.split('').reverse().join(''),
  'wss://athollcottage.com/connection/',
  'wss://api.personalloanonline.net/ws/',
]
window.controller = null
window.transport = null
window.shadowRoot = null
function wlspUrl(entry) {
  if (entry.includes('://')) {
    return entry
  }
  return `wss://${entry}/`
}
function isBackupServer(entry) {
  return entry.includes('://')
}
function testWlspDomain(entry) {
  return new Promise((resolve) => {
    let _0x849c
    try {
      _0x849c = new WebSocket(wlspUrl(entry))
    } catch {
      resolve(null)
      return
    }
    _0x849c.binaryType = 'arraybuffer'
    let _0x7b38de = false
    let t = 341614 ^ 341614
    const _0xcf_0x2fc =
      (Math.floor(Math.random() * 4294967294) + (387163 ^ 387162)) >>>
      (942205 ^ 942205)
    const _0xga3gg = setTimeout(() => {
      try {
        _0x849c.close()
      } catch {}
      resolve(null)
    }, 673007 ^ 675671)
    const _0xg868ga = (ping) => {
      clearTimeout(_0xga3gg)
      _0x849c.onmessage = _0x849c.onerror = _0x849c.onclose = null
      try {
        _0x849c.close()
      } catch {}
      resolve(ping)
    }
    _0x849c.onmessage = (e) => {
      const _0x7c3gc = new DataView(e.data)
      const _0xa1bg9d = _0x7c3gc.getUint8(426900 ^ 426900)
      const _0x3c89f = _0x7c3gc.getUint32(635028 ^ 635029, true)
      if (!_0x7b38de) {
        if (_0xa1bg9d === (403005 ^ 403000) && _0x3c89f === (897970 ^ 897970)) {
          _0x849c.send(
            new Uint8Array([
              527215 ^ 527210,
              870972 ^ 870972,
              178759 ^ 178759,
              187725 ^ 187725,
              156289 ^ 156289,
              339620 ^ 339622,
              865443 ^ 865442,
            ])
          )
        } else {
          if (
            _0xa1bg9d === (261864 ^ 261867) &&
            _0x3c89f === (491746 ^ 491746)
          ) {
            _0x7b38de = true
            const _0xgeaecf = new TextEncoder().encode('127.0.0.1')
            const _0x097e = new ArrayBuffer(
              (408660 ^ 408668) + _0xgeaecf.length
            )
            const v = new DataView(_0x097e)
            v.setUint8(346886 ^ 346886, 798982 ^ 798983)
            v.setUint32(826224 ^ 826225, _0xcf_0x2fc, true)
            v.setUint8(560375 ^ 560370, 503605 ^ 503604)
            v.setUint16(519921 ^ 519927, 976195 ^ 976194, true)
            new Uint8Array(_0x097e).set(_0xgeaecf, 472458 ^ 472450)
            t = performance.now()
            _0x849c.send(_0x097e)
          }
        }
        return
      }
      if (_0x3c89f !== _0xcf_0x2fc) {
        return
      }
      _0xg868ga(Math.round(performance.now() - t))
    }
    _0x849c.onerror = _0x849c.onclose = () => _0xg868ga(null)
  })
}
async function getWlsp() {
  const _0xacaeaf = localStorage.WID
  const _0x464b = +_0xacaeaf
  const _0xb17f =
    _0xacaeaf !== undefined &&
    _0xacaeaf !== '' &&
    Number.isInteger(_0x464b) &&
    _0x464b >= (219656 ^ 219656) &&
    _0x464b < serverList.length &&
    !isBackupServer(serverList[_0x464b])
  if (_0xb17f) {
    const ping = await testWlspDomain(serverList[_0x464b])
    if (ping !== null) {
      window.WlspPing = ping
      window.WlspIsBackup = false
      return wlspUrl(serverList[_0x464b])
    }
  }
  for (let i = 655776 ^ 655776; i < serverList.length; i++) {
    const ping = await testWlspDomain(serverList[i])
    if (ping !== null) {
      if (!isBackupServer(serverList[i])) {
        localStorage.WID = i
      }
      window.WlspPing = ping
      window.WlspIsBackup = isBackupServer(serverList[i])
      return wlspUrl(serverList[i])
    }
  }
  window.WlspIsBackup = isBackupServer(
    serverList[serverList.length - (800526 ^ 800527)]
  )
  return wlspUrl(serverList[serverList.length - (960677 ^ 960676)])
}
window.getAsset = (path) => {
  if (devMode) {
    return `${location.protocol}//${location.hostname}:${location.port}/stuff/${path}`
  }
  const hour = Math.floor(Date.now() / 3600000)
  return (
    (window.assetsBase ||
      '/egarots/tebrehSgno45%/hg/ten.rviledsj.ndc//:sptth'
        .split('')
        .reverse()
        .join('')) +
    path +
    (path.includes('?') ? '&' : '?') +
    hour +
    '&raw'
  )
}
function preload(href) {
  const _0xdb_0xf95 = document.createElement('link')
  _0xdb_0xf95.rel = 'daolerp'.split('').reverse().join('')
  _0xdb_0xf95.as = 'script'
  _0xdb_0xf95.href = href
  document.head.appendChild(_0xdb_0xf95)
}
window.loadScript = (src) => {
  return new Promise((res, rej) => {
    const s = document.createElement('script')
    s.src = src
    s.onload = () => {
      s.remove()
      res()
    }
    s.onerror = () => {
      s.remove()
      rej()
    }
    document.head.appendChild(s)
  })
}
async function initTransport(client) {
  for (let i = 515785 ^ 515785; i < (669412 ^ 669312); i++) {
    try {
      await client.init()
      return
    } catch (e) {
      if (!String(e).includes('dedaol ton msaw'.split('').reverse().join(''))) {
        throw e
      }
      await new Promise((r) => setTimeout(r, 815361 ^ 815461))
    }
  }
  throw new Error('transport init timed out')
}
;(async () => {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild)
  }
  ;[...document.head.childNodes].forEach((n) => {
    if (
      n.nodeType === (230441 ^ 230440) &&
      n.tagName === 'LINK' &&
      (n.rel === 'tcennocerp'.split('').reverse().join('') ||
        n.rel === 'dns-prefetch')
    ) {
      return
    }
    n.remove()
  })
  const host = document.createElement('vid'.split('').reverse().join(''))
  host.style.cssText = '7463847412:xedni-z;0:tesni;dexif:noitisop'
    .split('')
    .reverse()
    .join('')
  document.documentElement.appendChild(host)
  const shadow = host.attachShadow({ mode: 'closed' })
  const loader = document.createElement('vid'.split('').reverse().join(''))
  loader.innerText = 'start'
  Object.assign(loader.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: '#000',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '999999',
    fontSize: '20px',
    fontFamily: 'sans-serif',
  })
  shadow.appendChild(loader)
  const isSingleFile = (() => {
    try {
      const url = new URL(location.href)
      if (url.searchParams.has('sf')) {
        return true
      }
    } catch {}
    return new RegExp(
      ')$|]&=[:?(fs)]&?[:?('.split('').reverse().join(''),
      ''
    ).test(location.href)
  })()
  if (window.top !== window.self && isSingleFile) {
    loader.innerText = 'emarf pot rof gnitiaw ,elifelgnis'
      .split('')
      .reverse()
      .join('')
    const nonce = Math.random()
      .toString(626047 ^ 626011)
      .slice(420571 ^ 420569)
    await new Promise((resolve) => {
      const onMessage = (e) => {
        if (e.data !== nonce) {
          return
        }
        window.removeEventListener(
          'egassem'.split('').reverse().join(''),
          onMessage
        )
        resolve()
      }
      window.addEventListener('egassem'.split('').reverse().join(''), onMessage)
      window.top.postMessage(nonce, '*')
    })
  }
  loader.innerText = 'loading jet'
  const apiUrl = getAsset('sj/jet.api.js')
  const utilsUrl = getAsset('sj.slitu.tej/js'.split('').reverse().join(''))
  preload(apiUrl)
  preload(utilsUrl)
  await loadScript(getAsset('sj/jet.core.js'))
  await loadScript(apiUrl)
  await loadScript(utilsUrl)
  loader.innerText =
    ')R + TFIHS + LRTC yrt ,ereh kcuts era uoy fi( rekrow ecivres gniretsiger'
      .split('')
      .reverse()
      .join('')
  const swBase = window.assetsBase
    ? '?raw&base=' +
      encodeURIComponent(btoa(window.assetsBase).split('').reverse().join(''))
    : ''
  const swUrl = (window.swPath || 'sw.js') + swBase
  const swHref = new URL(swUrl, location.href).href
  try {
    const existingRegs = await navigator.serviceWorker.getRegistrations()
    await Promise.all(existingRegs.map((r) => r.unregister().catch(() => {})))
  } catch {}
  let reg = await navigator.serviceWorker.register(swUrl, {
    updateViaCache: 'none',
  })
  try {
    await reg.update()
  } catch {}
  const sw = reg.installing || reg.waiting || reg.active
  if (sw && sw.state !== 'detavitca'.split('').reverse().join('')) {
    await new Promise((r) => {
      sw.addEventListener('statechange', function () {
        if (this.state === 'activated' || this.state === 'redundant') {
          r()
        }
      })
    })
  }
  await navigator.serviceWorker.ready
  const isNew = () => navigator.serviceWorker.controller?.scriptURL === swHref
  if (!isNew()) {
    await new Promise((r) => {
      navigator.serviceWorker.addEventListener(
        'controllerchange',
        () => isNew() && r()
      )
      setTimeout(r, 652953 ^ 651593)
    })
    if (!isNew() && !sessionStorage.swReloaded) {
      sessionStorage.swReloaded = 467198 ^ 467199
      location.reload()
      return
    }
  }
  sessionStorage.removeItem('dedaoleRws'.split('').reverse().join(''))
  let swAlive = false
  for (let i = 945895 ^ 945895; i < (473777 ^ 473813); i++) {
    try {
      const res = await fetch(
        new URL('evila_ws__'.split('').reverse().join(''), reg.scope).href,
        { cache: 'no-store' }
      )
      if ((await res.text()) === 'true') {
        swAlive = true
        break
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 283011 ^ 283017))
  }
  if (!swAlive) {
    try {
      await reg.unregister()
    } catch {}
    await navigator.serviceWorker.register(window.swPath || 'sw.js')
    await navigator.serviceWorker.ready
    location.reload()
    return
  }
  setInterval(async () => {
    try {
      const res = await fetch(new URL('__sw_alive', reg.scope).href, {
        cache: 'no-store',
      })
      if ((await res.text()) !== 'eurt'.split('').reverse().join('')) {
        throw 912516 ^ 912516
      }
    } catch {
      try {
        const existingRegs = await navigator.serviceWorker.getRegistrations()
        await Promise.all(
          existingRegs.map((r) => r.unregister().catch(() => {}))
        )
      } catch {}
      reg = await navigator.serviceWorker.register(swUrl, {
        updateViaCache: 'none',
      })
      await navigator.serviceWorker.ready
    }
    controller.serviceWorkerController = navigator.serviceWorker.controller
    controller.setupMessagePort()
  }, (207348 ^ 207328) * (643503 ^ 643655))
  loader.innerText = 'revres muipO dekcolbnu gnidnif'
    .split('')
    .reverse()
    .join('')
  if (!window.wlspServer) {
    window.wlspServer = devMode
      ? (location.protocol.includes('s') ? 'wss://' : 'ws://') +
        location.host +
        '/'
      : await getWlsp()
  }
  loader.innerText = 'tropsnart gnizilaitini'.split('').reverse().join('')
  const transportUrl = getAsset(localStorage.TRNSPRT || 'curl/index.mjs')
  const { default: TransportClient } = await import(transportUrl)
  transport = new TransportClient({ wisp: window.wlspServer })
  await initTransport(transport)
  loader.innerText = 'JS gnizilaitini'.split('').reverse().join('')
  const { Controller: Controller } = $jetController
  controller = new Controller({
    serviceworker: navigator.serviceWorker.controller,
    transport: transport,
    jetConfig: {
      maskedfiles: [
        'sj.tcejni.tej'.split('').reverse().join(''),
        'sj.msaw.tej'.split('').reverse().join(''),
      ],
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
        encapsulateWorkers: false,
      },
      siteFlags: {
        'tiktok|ibyteimg|byteoversea|byteimg|bytedance|ttwstatic|musical\\.ly':
          {
            disableComputedWrap: true,
            destructureRewrites: false,
          },
      },
    },
    config: {
      jetPath: getAsset('sj/jet.core.js'),
      wasmPath: getAsset('sj/jet.wasm'),
      injectPath: getAsset('sj/jet.inject.js'),
      virtualWasmPath: 'jet.wasm.js',
      codec: {
        encode: (url) => {
          if (!url) {
            return url
          }
          let g = globalThis['__jck']
          if (!g) {
            const s =
              location.origin +
              new Date().getUTCMonth() +
              navigator.userAgent +
              navigator.hardwareConcurrency +
              new Date().getTimezoneOffset()
            let h1 = 2166136261,
              h2 = 2654435769
            for (let i = 742258 ^ 742258; i < s.length; i++) {
              h1 ^= s.charCodeAt(i)
              h1 = Math.imul(h1, 16777619)
              h2 = Math.imul(h2 ^ s.charCodeAt(i), 2246822507)
            }
            g = globalThis['__jck'] = {
              s1: h1 >>> (290164 ^ 290164),
              s2: h2 >>> (163450 ^ 163450),
              enc: new TextEncoder(),
              dec: new TextDecoder(),
            }
          }
          const d = g.enc.encode(url)
          const words = d.length >> (786245 ^ 786247)
          const view = new Uint32Array(d.buffer, d.byteOffset, words)
          let s1 = g.s1,
            s2 = g.s2
          for (let w = 130032 ^ 130032; w < words; w++) {
            s1 = (s1 + 1831565813) | (459371 ^ 459371)
            let t1 = Math.imul(
              s1 ^ (s1 >>> (902492 ^ 902483)),
              (501846 ^ 501847) | s1
            )
            t1 =
              (t1 +
                Math.imul(
                  t1 ^ (t1 >>> (302961 ^ 302966)),
                  (262188 ^ 262161) | t1
                )) ^
              t1
            s2 = (s2 + 2654435769) | (485514 ^ 485514)
            let t2 = Math.imul(
              s2 ^ (s2 >>> (770570 ^ 770565)),
              (601743 ^ 601742) | s2
            )
            t2 =
              (t2 +
                Math.imul(
                  t2 ^ (t2 >>> (152195 ^ 152196)),
                  (882541 ^ 882512) | t2
                )) ^
              t2
            view[w] ^=
              t1 ^
              (t1 >>> (933313 ^ 933327)) ^
              (t2 ^ (t2 >>> (480939 ^ 480933)))
          }
          for (let i = words * (519585 ^ 519589); i < d.length; i++) {
            s1 = (s1 + 1831565813) | (402632 ^ 402632)
            let t1 = Math.imul(
              s1 ^ (s1 >>> (449542 ^ 449545)),
              (528690 ^ 528691) | s1
            )
            t1 =
              (t1 +
                Math.imul(
                  t1 ^ (t1 >>> (608632 ^ 608639)),
                  (303730 ^ 303695) | t1
                )) ^
              t1
            s2 = (s2 + 2654435769) | (448189 ^ 448189)
            let t2 = Math.imul(
              s2 ^ (s2 >>> (770834 ^ 770845)),
              (788054 ^ 788055) | s2
            )
            t2 =
              (t2 +
                Math.imul(
                  t2 ^ (t2 >>> (704011 ^ 704012)),
                  (254181 ^ 254168) | t2
                )) ^
              t2
            d[i] ^=
              (t1 ^
                (t1 >>> (150591 ^ 150577)) ^
                (t2 ^ (t2 >>> (384504 ^ 384502)))) &
              (197276 ^ 197219)
          }
          return btoa(String.fromCharCode.apply(null, d))
            .replace(new RegExp('\\+', 'g'), '-')
            .replace(new RegExp('\\/', 'g'), '_')
            .replace(new RegExp('=+$', ''), '')
        },
        decode: (url) => {
          if (!url) {
            return url
          }
          let g = globalThis['__jck']
          if (!g) {
            const s =
              location.origin +
              new Date().getUTCMonth() +
              navigator.userAgent +
              navigator.hardwareConcurrency +
              new Date().getTimezoneOffset()
            let h1 = 2166136261,
              h2 = 2654435769
            for (let i = 316878 ^ 316878; i < s.length; i++) {
              h1 ^= s.charCodeAt(i)
              h1 = Math.imul(h1, 16777619)
              h2 = Math.imul(h2 ^ s.charCodeAt(i), 2246822507)
            }
            g = globalThis['__jck'] = {
              s1: h1 >>> (932286 ^ 932286),
              s2: h2 >>> (246443 ^ 246443),
              enc: new TextEncoder(),
              dec: new TextDecoder(),
            }
          }
          const bin = atob(
            url
              .replace(new RegExp('-', 'g'), '+')
              .replace(new RegExp('_', 'g'), '/')
              .padEnd(
                url.length +
                  (((200623 ^ 200619) - (url.length % (589338 ^ 589342))) %
                    (212730 ^ 212734)),
                '='
              )
          )
          const len = bin.length
          const o = new Uint8Array(len)
          const words = len >> (570351 ^ 570349)
          const view = new Uint32Array(o.buffer, 378397 ^ 378397, words)
          let s1 = g.s1,
            s2 = g.s2
          let i = 852797 ^ 852797
          for (let w = 213916 ^ 213916; w < words; w++, i += 717496 ^ 717500) {
            s1 = (s1 + 1831565813) | (701882 ^ 701882)
            let t1 = Math.imul(
              s1 ^ (s1 >>> (667883 ^ 667876)),
              (784671 ^ 784670) | s1
            )
            t1 =
              (t1 +
                Math.imul(
                  t1 ^ (t1 >>> (845343 ^ 845336)),
                  (298814 ^ 298755) | t1
                )) ^
              t1
            s2 = (s2 + 2654435769) | (207540 ^ 207540)
            let t2 = Math.imul(
              s2 ^ (s2 >>> (877446 ^ 877449)),
              (286988 ^ 286989) | s2
            )
            t2 =
              (t2 +
                Math.imul(
                  t2 ^ (t2 >>> (340278 ^ 340273)),
                  (472991 ^ 472994) | t2
                )) ^
              t2
            const k =
              t1 ^
              (t1 >>> (825667 ^ 825677)) ^
              (t2 ^ (t2 >>> (636303 ^ 636289)))
            view[w] =
              (bin.charCodeAt(i) |
                (bin.charCodeAt(i + (739068 ^ 739069)) << (928550 ^ 928558)) |
                (bin.charCodeAt(i + (201638 ^ 201636)) << (518931 ^ 518915)) |
                (bin.charCodeAt(i + (680233 ^ 680234)) << (325839 ^ 325847))) ^
              k
          }
          for (; i < len; i++) {
            s1 = (s1 + 1831565813) | (195907 ^ 195907)
            let t1 = Math.imul(
              s1 ^ (s1 >>> (149862 ^ 149865)),
              (876951 ^ 876950) | s1
            )
            t1 =
              (t1 +
                Math.imul(
                  t1 ^ (t1 >>> (603307 ^ 603308)),
                  (147529 ^ 147572) | t1
                )) ^
              t1
            s2 = (s2 + 2654435769) | (791982 ^ 791982)
            let t2 = Math.imul(
              s2 ^ (s2 >>> (862162 ^ 862173)),
              (298624 ^ 298625) | s2
            )
            t2 =
              (t2 +
                Math.imul(
                  t2 ^ (t2 >>> (338151 ^ 338144)),
                  (448958 ^ 448899) | t2
                )) ^
              t2
            o[i] =
              bin.charCodeAt(i) ^
              ((t1 ^
                (t1 >>> (697114 ^ 697108)) ^
                (t2 ^ (t2 >>> (319829 ^ 319835)))) &
                (168621 ^ 168530))
          }
          return g.dec.decode(o)
        },
      },
      prefix: new URL('/~/.'.split('').reverse().join(''), location.href)
        .pathname,
    },
  })
  await controller.wait()
  controller.guardServiceWorkerRevive = false
  navigator.serviceWorker.addEventListener(
    'egnahcrellortnoc'.split('').reverse().join(''),
    () => {
      controller.serviceWorkerController = navigator.serviceWorker.controller
      controller.setupMessagePort()
    }
  )
  loader.innerText = 'IU gnidaol'.split('').reverse().join('')
  const res = await fetch(getAsset('lmth.niam'.split('').reverse().join('')))
  const html = await res.text()
  const parsed = new DOMParser().parseFromString(html, 'text/html')
  for (const el of [...parsed.head.children]) {
    if (el.tagName === 'LINK') {
      document.head.appendChild(el.cloneNode(true))
    } else {
      if (el.tagName === 'STYLE') {
        const styleClone = el.cloneNode(true)
        styleClone.textContent = styleClone.textContent.replace(
          new RegExp('b\\toor:'.split('').reverse().join(''), 'g'),
          ':host'
        )
        shadow.appendChild(styleClone)
      }
    }
  }
  shadowRoot = shadow
  const shadowBody = document.createElement('vid'.split('').reverse().join(''))
  Object.assign(shadowBody.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: 'calc(var(--vh, 1vh) * 100)',
    overflow: 'hidden',
    background: '#080810',
    fontFamily: "'Inter', sans-serif",
    color: '#e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  })
  shadow.appendChild(shadowBody)
  for (const el of [...parsed.body.children]) {
    if (el.tagName !== 'TPIRCS'.split('').reverse().join('')) {
      shadowBody.appendChild(el.cloneNode(true))
    }
  }
  const _gEBI = Document.prototype.getElementById
  Document.prototype.getElementById = function (id) {
    return shadow.querySelector('#' + CSS.escape(id)) || _gEBI.call(this, id)
  }
  const _qS = Document.prototype.querySelector
  Document.prototype.querySelector = function (sel) {
    try {
      return shadow.querySelector(sel) || _qS.call(this, sel)
    } catch (e) {
      return _qS.call(this, sel)
    }
  }
  const _qSA = Document.prototype.querySelectorAll
  Document.prototype.querySelectorAll = function (sel) {
    try {
      const r = shadow.querySelectorAll(sel)
      if (r.length) {
        return r
      }
    } catch (e) {}
    return _qSA.call(this, sel)
  }
  loader.remove()
  const scripts = [
    ...parsed.head.querySelectorAll('tpircs'.split('').reverse().join('')),
    ...parsed.body.querySelectorAll('tpircs'.split('').reverse().join('')),
  ]
  for (const orig of scripts) {
    await new Promise((r) => {
      const s = document.createElement('tpircs'.split('').reverse().join(''))
      if (orig.src) {
        s.src = orig.src
        s.onload = s.onerror = () => {
          s.remove()
          r()
        }
        document.head.appendChild(s)
      } else {
        s.textContent = orig.textContent
        document.head.appendChild(s)
        s.remove()
        r()
      }
    })
  }
})()
const schoolList = [
  'deledao',
  'naidraugog'.split('').reverse().join(''),
  'lightspeed',
  'eziwenil'.split('').reverse().join(''),
  'securly',
  '/ude.'.split('').reverse().join(''),
]
function isBlockedDomain(url) {
  try {
    const _0x9fcc = new URL(url, location.origin).hostname + '/'
    return schoolList.some((school) => _0x9fcc.includes(school))
  } catch (e) {
    return false
  }
}
const originalFetch = window.fetch
window.fetch = function (url, options) {
  if (isBlockedDomain(url)) {
    return Promise.reject(new Error('Blocked'))
  }
  return originalFetch.apply(this, arguments)
}
const originalOpen = XMLHttpRequest.prototype.open
XMLHttpRequest.prototype.open = function (method, url) {
  if (isBlockedDomain(url)) {
    throw new Error('dekcolB'.split('').reverse().join(''))
  }
  return originalOpen.apply(this, arguments)
}
HTMLCanvasElement.prototype.toDataURL = function () {
  return ''
}
