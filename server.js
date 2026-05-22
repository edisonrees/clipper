const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send(
    "<!DOCTYPE html>\n" +
    '<html lang="en">\n' +
    "<head>\n" +
    '  <meta charset="UTF-8" />\n' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
    "  <title>FETCHR \u2014 Download &amp; Browse</title>\n" +
    '  <link rel="preconnect" href="https://fonts.googleapis.com" />\n' +
    '  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet" />\n' +
    "  <style>\n" +
    "    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n" +
    "\n" +
    "    :root {\n" +
    "      --bg:       #0a0a0f;\n" +
    "      --surface:  #111118;\n" +
    "      --border:   #1e1e2e;\n" +
    "      --accent1:  #7fffd4;\n" +
    "      --accent2:  #ff6b6b;\n" +
    "      --accent3:  #ffd166;\n" +
    "      --text:     #e8e8f0;\n" +
    "      --muted:    #5a5a72;\n" +
    "      --radius:   12px;\n" +
    "    }\n" +
    "\n" +
    "    html, body {\n" +
    "      min-height: 100vh;\n" +
    "      background: var(--bg);\n" +
    "      color: var(--text);\n" +
    "      font-family: 'Syne', sans-serif;\n" +
    "      overflow-x: hidden;\n" +
    "    }\n" +
    "\n" +
    "    body::before {\n" +
    "      content: '';\n" +
    "      position: fixed;\n" +
    "      inset: 0;\n" +
    "      background:\n" +
    "        radial-gradient(ellipse 60% 50% at 20% 10%, rgba(127,255,212,.07) 0%, transparent 70%),\n" +
    "        radial-gradient(ellipse 50% 40% at 80% 80%, rgba(255,107,107,.06) 0%, transparent 70%);\n" +
    "      pointer-events: none;\n" +
    "      z-index: 0;\n" +
    "    }\n" +
    "\n" +
    "    .shell {\n" +
    "      position: relative;\n" +
    "      z-index: 1;\n" +
    "      max-width: 860px;\n" +
    "      margin: 0 auto;\n" +
    "      padding: 60px 24px 80px;\n" +
    "    }\n" +
    "\n" +
    "    header { margin-bottom: 52px; }\n" +
    "\n" +
    "    .wordmark {\n" +
    "      font-size: clamp(2.8rem, 8vw, 5rem);\n" +
    "      font-weight: 800;\n" +
    "      letter-spacing: -0.04em;\n" +
    "      line-height: 1;\n" +
    "      background: linear-gradient(135deg, var(--accent1) 0%, #a8edea 40%, var(--text) 100%);\n" +
    "      -webkit-background-clip: text;\n" +
    "      -webkit-text-fill-color: transparent;\n" +
    "      background-clip: text;\n" +
    "    }\n" +
    "\n" +
    "    .tagline {\n" +
    "      font-family: 'DM Mono', monospace;\n" +
    "      font-size: .8rem;\n" +
    "      color: var(--muted);\n" +
    "      margin-top: 8px;\n" +
    "      letter-spacing: .12em;\n" +
    "      text-transform: uppercase;\n" +
    "    }\n" +
    "\n" +
    "    .mode-bar {\n" +
    "      display: flex;\n" +
    "      gap: 4px;\n" +
    "      background: var(--surface);\n" +
    "      border: 1px solid var(--border);\n" +
    "      border-radius: var(--radius);\n" +
    "      padding: 4px;\n" +
    "      margin-bottom: 28px;\n" +
    "      width: fit-content;\n" +
    "    }\n" +
    "\n" +
    "    .mode-btn {\n" +
    "      font-family: 'Syne', sans-serif;\n" +
    "      font-size: .85rem;\n" +
    "      font-weight: 700;\n" +
    "      letter-spacing: .04em;\n" +
    "      padding: 10px 26px;\n" +
    "      border: none;\n" +
    "      border-radius: 8px;\n" +
    "      cursor: pointer;\n" +
    "      transition: background .2s, color .2s, transform .1s;\n" +
    "      background: transparent;\n" +
    "      color: var(--muted);\n" +
    "    }\n" +
    "\n" +
    '    .mode-btn.active[data-mode="download"] { background: var(--accent1); color: #0a0a0f; }\n' +
    '    .mode-btn.active[data-mode="browse"]   { background: var(--accent2); color: #0a0a0f; }\n' +
    "    .mode-btn:not(.active):hover { color: var(--text); }\n" +
    "\n" +
    "    .card {\n" +
    "      background: var(--surface);\n" +
    "      border: 1px solid var(--border);\n" +
    "      border-radius: 16px;\n" +
    "      padding: 32px;\n" +
    "      margin-bottom: 28px;\n" +
    "    }\n" +
    "\n" +
    "    .card-label {\n" +
    "      font-family: 'DM Mono', monospace;\n" +
    "      font-size: .7rem;\n" +
    "      letter-spacing: .14em;\n" +
    "      text-transform: uppercase;\n" +
    "      color: var(--muted);\n" +
    "      margin-bottom: 12px;\n" +
    "    }\n" +
    "\n" +
    "    .input-row { display: flex; gap: 10px; }\n" +
    "\n" +
    '    input[type="text"] {\n' +
    "      flex: 1;\n" +
    "      background: var(--bg);\n" +
    "      border: 1px solid var(--border);\n" +
    "      border-radius: var(--radius);\n" +
    "      padding: 14px 18px;\n" +
    "      font-family: 'DM Mono', monospace;\n" +
    "      font-size: .9rem;\n" +
    "      color: var(--text);\n" +
    "      outline: none;\n" +
    "      transition: border-color .2s, box-shadow .2s;\n" +
    "    }\n" +
    "\n" +
    '    input[type="text"]:focus {\n' +
    "      border-color: var(--accent1);\n" +
    "      box-shadow: 0 0 0 3px rgba(127,255,212,.12);\n" +
    "    }\n" +
    "\n" +
    '    input[type="text"]#browseInput:focus {\n' +
    "      border-color: var(--accent2);\n" +
    "      box-shadow: 0 0 0 3px rgba(255,107,107,.12);\n" +
    "    }\n" +
    "\n" +
    "    .action-btn {\n" +
    "      font-family: 'Syne', sans-serif;\n" +
    "      font-weight: 700;\n" +
    "      font-size: .9rem;\n" +
    "      letter-spacing: .03em;\n" +
    "      padding: 14px 28px;\n" +
    "      border: none;\n" +
    "      border-radius: var(--radius);\n" +
    "      cursor: pointer;\n" +
    "      transition: opacity .15s, transform .12s, box-shadow .2s;\n" +
    "      white-space: nowrap;\n" +
    "      position: relative;\n" +
    "      overflow: hidden;\n" +
    "    }\n" +
    "\n" +
    "    .action-btn::after {\n" +
    "      content: '';\n" +
    "      position: absolute;\n" +
    "      inset: 0;\n" +
    "      background: rgba(255,255,255,.08);\n" +
    "      opacity: 0;\n" +
    "      transition: opacity .15s;\n" +
    "    }\n" +
    "\n" +
    "    .action-btn:hover::after { opacity: 1; }\n" +
    "    .action-btn:active { transform: scale(.97); }\n" +
    "    .btn-download { background: var(--accent1); color: #0a0a0f; }\n" +
    "    .btn-browse   { background: var(--accent2); color: #0a0a0f; }\n" +
    "\n" +
    "    .panel { display: none; }\n" +
    "    .panel.active { display: block; }\n" +
    "\n" +
    "    .status-bar {\n" +
    "      font-family: 'DM Mono', monospace;\n" +
    "      font-size: .8rem;\n" +
    "      padding: 12px 18px;\n" +
    "      border-radius: var(--radius);\n" +
    "      border: 1px solid var(--border);\n" +
    "      background: var(--surface);\n" +
    "      color: var(--muted);\n" +
    "      min-height: 44px;\n" +
    "      display: flex;\n" +
    "      align-items: center;\n" +
    "      gap: 10px;\n" +
    "      transition: border-color .3s;\n" +
    "    }\n" +
    "\n" +
    "    .status-bar.ok    { border-color: var(--accent1); color: var(--accent1); }\n" +
    "    .status-bar.error { border-color: var(--accent2); color: var(--accent2); }\n" +
    "    .status-bar.busy  { border-color: var(--accent3); color: var(--accent3); }\n" +
    "\n" +
    "    .spinner {\n" +
    "      width: 14px; height: 14px;\n" +
    "      border: 2px solid currentColor;\n" +
    "      border-top-color: transparent;\n" +
    "      border-radius: 50%;\n" +
    "      animation: spin .7s linear infinite;\n" +
    "      flex-shrink: 0;\n" +
    "    }\n" +
    "\n" +
    "    @keyframes spin { to { transform: rotate(360deg); } }\n" +
    "\n" +
    "    .preview-wrap {\n" +
    "      margin-top: 20px;\n" +
    "      border-radius: 16px;\n" +
    "      overflow: hidden;\n" +
    "      border: 1px solid var(--border);\n" +
    "      background: #fff;\n" +
    "      box-shadow: 0 24px 64px rgba(0,0,0,.5);\n" +
    "      display: none;\n" +
    "    }\n" +
    "\n" +
    "    .preview-toolbar {\n" +
    "      display: flex;\n" +
    "      align-items: center;\n" +
    "      gap: 10px;\n" +
    "      background: #1a1a24;\n" +
    "      padding: 10px 16px;\n" +
    "      border-bottom: 1px solid var(--border);\n" +
    "    }\n" +
    "\n" +
    "    .dot { width: 12px; height: 12px; border-radius: 50%; }\n" +
    "    .dot.r { background: #ff5f57; }\n" +
    "    .dot.y { background: #febc2e; }\n" +
    "    .dot.g { background: #28c840; }\n" +
    "\n" +
    "    .preview-url-bar {\n" +
    "      flex: 1;\n" +
    "      font-family: 'DM Mono', monospace;\n" +
    "      font-size: .75rem;\n" +
    "      color: var(--muted);\n" +
    "      background: var(--bg);\n" +
    "      border: 1px solid var(--border);\n" +
    "      border-radius: 6px;\n" +
    "      padding: 5px 12px;\n" +
    "      white-space: nowrap;\n" +
    "      overflow: hidden;\n" +
    "      text-overflow: ellipsis;\n" +
    "    }\n" +
    "\n" +
    "    iframe#previewFrame {\n" +
    "      width: 100%;\n" +
    "      height: 600px;\n" +
    "      border: none;\n" +
    "      display: block;\n" +
    "      background: #fff;\n" +
    "    }\n" +
    "\n" +
    "    .results-list {\n" +
    "      margin-top: 20px;\n" +
    "      display: none;\n" +
    "      flex-direction: column;\n" +
    "      gap: 12px;\n" +
    "    }\n" +
    "\n" +
    "    .result-card {\n" +
    "      background: var(--surface);\n" +
    "      border: 1px solid var(--border);\n" +
    "      border-radius: var(--radius);\n" +
    "      padding: 18px 20px;\n" +
    "      cursor: pointer;\n" +
    "      transition: border-color .2s, transform .15s;\n" +
    "      text-decoration: none;\n" +
    "      display: block;\n" +
    "    }\n" +
    "\n" +
    "    .result-card:hover { border-color: var(--accent2); transform: translateX(4px); }\n" +
    "    .result-title   { font-weight: 700; font-size: 1rem; color: var(--text); margin-bottom: 4px; }\n" +
    "    .result-url     { font-family: 'DM Mono', monospace; font-size: .72rem; color: var(--accent2); margin-bottom: 6px; }\n" +
    "    .result-snippet { font-size: .85rem; color: var(--muted); line-height: 1.5; }\n" +
    "\n" +
    "    .history { margin-top: 20px; display: none; }\n" +
    "\n" +
    "    .history-label {\n" +
    "      font-family: 'DM Mono', monospace;\n" +
    "      font-size: .7rem;\n" +
    "      letter-spacing: .14em;\n" +
    "      text-transform: uppercase;\n" +
    "      color: var(--muted);\n" +
    "      margin-bottom: 10px;\n" +
    "    }\n" +
    "\n" +
    "    .history-item {\n" +
    "      display: flex;\n" +
    "      align-items: center;\n" +
    "      gap: 12px;\n" +
    "      padding: 10px 0;\n" +
    "      border-bottom: 1px solid var(--border);\n" +
    "      font-family: 'DM Mono', monospace;\n" +
    "      font-size: .78rem;\n" +
    "    }\n" +
    "\n" +
    "    .history-item:last-child { border-bottom: none; }\n" +
    "    .history-dot  { width: 6px; height: 6px; border-radius: 50%; background: var(--accent1); flex-shrink: 0; }\n" +
    "    .history-name { flex: 1; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n" +
    "    .history-size { color: var(--muted); flex-shrink: 0; }\n" +
    "\n" +
    "    footer {\n" +
    "      margin-top: 60px;\n" +
    "      font-family: 'DM Mono', monospace;\n" +
    "      font-size: .7rem;\n" +
    "      color: var(--muted);\n" +
    "      display: flex;\n" +
    "      justify-content: space-between;\n" +
    "      align-items: center;\n" +
    "      border-top: 1px solid var(--border);\n" +
    "      padding-top: 20px;\n" +
    "    }\n" +
    "\n" +
    "    .status-led { display: flex; align-items: center; gap: 6px; }\n" +
    "\n" +
    "    .led {\n" +
    "      width: 7px; height: 7px;\n" +
    "      border-radius: 50%;\n" +
    "      background: var(--accent1);\n" +
    "      box-shadow: 0 0 6px var(--accent1);\n" +
    "      animation: pulse 2s ease-in-out infinite;\n" +
    "    }\n" +
    "\n" +
    "    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }\n" +
    "\n" +
    "    @media (max-width: 520px) {\n" +
    "      .input-row { flex-direction: column; }\n" +
    "      .action-btn { width: 100%; }\n" +
    "    }\n" +
    "  </style>\n" +
    "</head>\n" +
    "<body>\n" +
    '<div class="shell">\n' +
    "\n" +
    "  <header>\n" +
    '    <div class="wordmark">FETCHR</div>\n' +
    '    <div class="tagline">// download anything &nbsp;&middot;&nbsp; browse everywhere</div>\n' +
    "  </header>\n" +
    "\n" +
    '  <div class="mode-bar">\n' +
    '    <button class="mode-btn active" data-mode="download" onclick="switchMode(\'download\')">&#11015; Download</button>\n' +
    '    <button class="mode-btn"        data-mode="browse"   onclick="switchMode(\'browse\')">&#128269; Browse</button>\n' +
    "  </div>\n" +
    "\n" +
    '  <div class="panel active" id="panel-download">\n' +
    '    <div class="card">\n' +
    '      <div class="card-label">// Enter a direct file URL</div>\n' +
    '      <div class="input-row">\n' +
    '        <input type="text" id="downloadUrl" placeholder="https://example.com/file.zip" autocomplete="off" spellcheck="false" />\n' +
    '        <button class="action-btn btn-download" onclick="doDownload()">Download</button>\n' +
    "      </div>\n" +
    "    </div>\n" +
    '    <div class="status-bar" id="dlStatus">Ready \u2014 paste a URL above and hit Download</div>\n' +
    '    <div class="history" id="dlHistory">\n' +
    '      <div class="history-label">// Recent downloads</div>\n' +
    '      <div id="historyItems"></div>\n' +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    '  <div class="panel" id="panel-browse">\n' +
    '    <div class="card">\n' +
    '      <div class="card-label">// Search the web or enter a URL</div>\n' +
    '      <div class="input-row">\n' +
    '        <input type="text" id="browseInput" placeholder="Search query or https://..." autocomplete="off" spellcheck="false"\n' +
    '               onkeydown="if(event.key===\'Enter\') doBrowse()" />\n' +
    '        <button class="action-btn btn-browse" onclick="doBrowse()">Go</button>\n' +
    "      </div>\n" +
    "    </div>\n" +
    '    <div class="status-bar" id="brStatus">Enter a query or URL to explore the web inline</div>\n' +
    '    <div class="results-list" id="resultsList"></div>\n' +
    '    <div class="preview-wrap" id="previewWrap">\n' +
    '      <div class="preview-toolbar">\n' +
    '        <div class="dot r"></div>\n' +
    '        <div class="dot y"></div>\n' +
    '        <div class="dot g"></div>\n' +
    '        <div class="preview-url-bar" id="previewUrlBar">about:blank</div>\n' +
    "      </div>\n" +
    '      <iframe id="previewFrame" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" title="Web Preview"></iframe>\n' +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <footer>\n" +
    "    <span>FETCHR v1.0 &middot; Railway</span>\n" +
    '    <span class="status-led"><span class="led"></span> server online</span>\n' +
    "  </footer>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<script>\n" +
    "/* ─── Mode switcher ─────────────────────────────────────── */\n" +
    "function switchMode(mode) {\n" +
    "  document.querySelectorAll('.mode-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.mode === mode); });\n" +
    "  document.querySelectorAll('.panel').forEach(function(p) { p.classList.toggle('active', p.id === 'panel-' + mode); });\n" +
    "}\n" +
    "\n" +
    "/* ─── Helpers ───────────────────────────────────────────── */\n" +
    "function setStatus(id, msg, type) {\n" +
    "  type = type || '';\n" +
    "  var el = document.getElementById(id);\n" +
    "  el.className = 'status-bar' + (type ? ' ' + type : '');\n" +
    "  el.innerHTML = type === 'busy'\n" +
    "    ? '<div class=\"spinner\"></div><span>' + msg + '</span>'\n" +
    "    : msg;\n" +
    "}\n" +
    "\n" +
    "function isUrl(str) {\n" +
    "  try { return ['http:','https:'].indexOf(new URL(str).protocol) !== -1; }\n" +
    "  catch(e) { return false; }\n" +
    "}\n" +
    "\n" +
    "function escHtml(s) {\n" +
    "  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');\n" +
    "}\n" +
    "\n" +
    "/* ─── DOWNLOAD ──────────────────────────────────────────── */\n" +
    "var dlHistory = [];\n" +
    "\n" +
    "function doDownload() {\n" +
    "  var url = document.getElementById('downloadUrl').value.trim();\n" +
    "  if (!url) { setStatus('dlStatus', 'Please enter a URL first.', 'error'); return; }\n" +
    "  if (!isUrl(url)) { setStatus('dlStatus', 'That doesn\\'t look like a valid URL (must start with http/https).', 'error'); return; }\n" +
    "\n" +
    "  setStatus('dlStatus', 'Fetching file\u2026', 'busy');\n" +
    "\n" +
    "  fetch('/api/download?url=' + encodeURIComponent(url))\n" +
    "    .then(function(res) {\n" +
    "      if (!res.ok) {\n" +
    "        return res.json().catch(function() { return { error: 'Server error ' + res.status }; })\n" +
    "          .then(function(err) { throw new Error(err.error || 'Download failed'); });\n" +
    "      }\n" +
    "      var cd = res.headers.get('content-disposition') || '';\n" +
    "      var filename = 'download';\n" +
    "      var fnMatch = cd.match(/filename[^;=\\n]*=(['\"]?)([^'\"\\n]+)\\1/);\n" +
    "      if (fnMatch) {\n" +
    "        filename = fnMatch[2];\n" +
    "      } else {\n" +
    "        try { filename = decodeURIComponent(new URL(url).pathname.split('/').pop()) || 'download'; } catch(e) {}\n" +
    "      }\n" +
    "      return res.blob().then(function(blob) { return { blob: blob, filename: filename }; });\n" +
    "    })\n" +
    "    .then(function(result) {\n" +
    "      var sizeKb = (result.blob.size / 1024).toFixed(1);\n" +
    "      var a = document.createElement('a');\n" +
    "      a.href = URL.createObjectURL(result.blob);\n" +
    "      a.download = result.filename;\n" +
    "      a.click();\n" +
    "      URL.revokeObjectURL(a.href);\n" +
    "      setStatus('dlStatus', '&#10003; Downloaded <strong>' + escHtml(result.filename) + '</strong> (' + sizeKb + ' KB)', 'ok');\n" +
    "      dlHistory.unshift({ name: result.filename, size: sizeKb + ' KB' });\n" +
    "      if (dlHistory.length > 6) dlHistory.pop();\n" +
    "      renderHistory();\n" +
    "    })\n" +
    "    .catch(function(e) {\n" +
    "      setStatus('dlStatus', '&#10007; ' + escHtml(e.message), 'error');\n" +
    "    });\n" +
    "}\n" +
    "\n" +
    "function renderHistory() {\n" +
    "  var wrap = document.getElementById('dlHistory');\n" +
    "  var items = document.getElementById('historyItems');\n" +
    "  if (!dlHistory.length) { wrap.style.display = 'none'; return; }\n" +
    "  wrap.style.display = 'block';\n" +
    "  items.innerHTML = dlHistory.map(function(h) {\n" +
    "    return '<div class=\"history-item\"><div class=\"history-dot\"></div><div class=\"history-name\">' +\n" +
    "      escHtml(h.name) + '</div><div class=\"history-size\">' + escHtml(h.size) + '</div></div>';\n" +
    "  }).join('');\n" +
    "}\n" +
    "\n" +
    "/* ─── BROWSE ────────────────────────────────────────────── */\n" +
    "function doBrowse() {\n" +
    "  var input = document.getElementById('browseInput').value.trim();\n" +
    "  if (!input) { setStatus('brStatus', 'Enter a search query or URL.', 'error'); return; }\n" +
    "\n" +
    "  document.getElementById('resultsList').style.display = 'none';\n" +
    "  document.getElementById('previewWrap').style.display = 'none';\n" +
    "\n" +
    "  if (isUrl(input)) {\n" +
    "    setStatus('brStatus', 'Loading page\u2026', 'busy');\n" +
    "    fetch('/api/proxy?url=' + encodeURIComponent(input))\n" +
    "      .then(function(res) {\n" +
    "        if (!res.ok) throw new Error('Could not fetch page (status ' + res.status + ')');\n" +
    "        return res.text();\n" +
    "      })\n" +
    "      .then(function(html) {\n" +
    "        showPreview(html, input);\n" +
    "        setStatus('brStatus', '&#10003; Loaded: ' + escHtml(input), 'ok');\n" +
    "      })\n" +
    "      .catch(function(e) { setStatus('brStatus', '&#10007; ' + escHtml(e.message), 'error'); });\n" +
    "  } else {\n" +
    "    setStatus('brStatus', 'Searching\u2026', 'busy');\n" +
    "    fetch('/api/search?q=' + encodeURIComponent(input))\n" +
    "      .then(function(res) {\n" +
    "        if (!res.ok) throw new Error('Search failed (status ' + res.status + ')');\n" +
    "        return res.json();\n" +
    "      })\n" +
    "      .then(function(data) {\n" +
    "        renderResults(data.results, input);\n" +
    "        setStatus('brStatus', '&#10003; ' + data.results.length + ' results for &quot;' + escHtml(input) + '&quot;', 'ok');\n" +
    "      })\n" +
    "      .catch(function(e) { setStatus('brStatus', '&#10007; ' + escHtml(e.message), 'error'); });\n" +
    "  }\n" +
    "}\n" +
    "\n" +
    "function renderResults(results, query) {\n" +
    "  var list = document.getElementById('resultsList');\n" +
    "  if (!results || !results.length) {\n" +
    "    list.innerHTML = '<div style=\"color:var(--muted);font-family:\\'DM Mono\\',monospace;font-size:.85rem;padding:12px 0\">No results found for &quot;' + escHtml(query) + '&quot;</div>';\n" +
    "    list.style.display = 'flex';\n" +
    "    return;\n" +
    "  }\n" +
    "  list.innerHTML = results.map(function(r) {\n" +
    "    // Store URL safely in a data attribute to avoid any quoting issues in onclick\n" +
    "    return '<div class=\"result-card\" data-url=\"' + escHtml(r.url) + '\">' +\n" +
    "      '<div class=\"result-title\">' + escHtml(r.title) + '</div>' +\n" +
    "      '<div class=\"result-url\">'   + escHtml(r.url)   + '</div>' +\n" +
    "      '<div class=\"result-snippet\">' + escHtml(r.snippet) + '</div>' +\n" +
    "      '</div>';\n" +
    "  }).join('');\n" +
    "  list.style.display = 'flex';\n" +
    "\n" +
    "  // Attach click handlers via event delegation (no inline onclick with URLs)\n" +
    "  list.onclick = function(e) {\n" +
    "    var card = e.target.closest('.result-card');\n" +
    "    if (card) loadResult(card.dataset.url);\n" +
    "  };\n" +
    "}\n" +
    "\n" +
    "function loadResult(url) {\n" +
    "  document.getElementById('browseInput').value = url;\n" +
    "  setStatus('brStatus', 'Loading page\u2026', 'busy');\n" +
    "  document.getElementById('resultsList').style.display = 'none';\n" +
    "  fetch('/api/proxy?url=' + encodeURIComponent(url))\n" +
    "    .then(function(res) {\n" +
    "      if (!res.ok) throw new Error('Could not load page');\n" +
    "      return res.text();\n" +
    "    })\n" +
    "    .then(function(html) {\n" +
    "      showPreview(html, url);\n" +
    "      setStatus('brStatus', '&#10003; Loaded: ' + escHtml(url), 'ok');\n" +
    "    })\n" +
    "    .catch(function(e) { setStatus('brStatus', '&#10007; ' + escHtml(e.message), 'error'); });\n" +
    "}\n" +
    "\n" +
    "function showPreview(html, url) {\n" +
    "  var wrap = document.getElementById('previewWrap');\n" +
    "  document.getElementById('previewUrlBar').textContent = url;\n" +
    "  var frame = document.getElementById('previewFrame');\n" +
    "  frame.srcdoc = html;\n" +
    "  wrap.style.display = 'block';\n" +
    "  wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });\n" +
    "}\n" +
    "\n" +
    "/* ─── Enter key on download input ──────────────────────── */\n" +
    "document.getElementById('downloadUrl').addEventListener('keydown', function(e) {\n" +
    "  if (e.key === 'Enter') doDownload();\n" +
    "});\n" +
    "</script>\n" +
    "</body>\n" +
    "</html>"
  );
});

// ─── Timeout helper (node-fetch v2 uses AbortController) ──────────────────────
function fetchWithTimeout(url, options, ms) {
  ms = ms || 20000;
  const controller = new AbortController();
  const timer = setTimeout(function() { controller.abort(); }, ms);
  return fetch(url, Object.assign({}, options, { signal: controller.signal }))
    .finally(function() { clearTimeout(timer); });
}

// ─── API: DOWNLOAD ─────────────────────────────────────────────────────────────
app.get("/api/download", async (req, res) => {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: "Missing url parameter" });

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error();
  } catch {
    return res.status(400).json({ error: "Invalid URL — must be http or https" });
  }

  try {
    const upstream = await fetchWithTimeout(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Fetchr/1.0; +https://fetchr.railway.app)",
        Accept: "*/*",
      },
      redirect: "follow",
    }, 30000);

    if (!upstream.ok) {
      return res
        .status(upstream.status)
        .json({ error: `Upstream returned ${upstream.status} ${upstream.statusText}` });
    }

    const contentType =
      upstream.headers.get("content-type") || "application/octet-stream";
    const contentLength = upstream.headers.get("content-length");
    const upstreamCd = upstream.headers.get("content-disposition");

    let filename = "download";
    if (upstreamCd && upstreamCd.includes("filename")) {
      const m = upstreamCd.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (m) filename = m[1].replace(/['"]/g, "");
    } else {
      const pathname = parsedUrl.pathname;
      const last = pathname.split("/").pop();
      if (last && last.includes(".")) filename = decodeURIComponent(last);
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename.replace(/"/g, '\\"')}"`
    );
    if (contentLength) res.setHeader("Content-Length", contentLength);
    res.setHeader("X-Fetched-From", url);

    upstream.body.pipe(res);
  } catch (err) {
    console.error("Download error:", err.message);
    res.status(500).json({ error: err.name === "AbortError" ? "Request timed out" : (err.message || "Failed to fetch the file") });
  }
});

// ─── API: PROXY (for Browse mode) ─────────────────────────────────────────────
app.get("/api/proxy", async (req, res) => {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: "Missing url parameter" });

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error();
  } catch {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    const upstream = await fetchWithTimeout(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,*/*;q=0.9",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    }, 20000);

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: `Page returned ${upstream.status} ${upstream.statusText}`,
      });
    }

    const contentType = upstream.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return res.status(400).json({ error: "URL does not return HTML content" });
    }

    let html = await upstream.text();

    const base = `${parsedUrl.protocol}//${parsedUrl.host}`;

    html = html
      .replace(/<head([^>]*)>/i, `<head$1><base href="${base}/">`)
      .replace(/<meta[^>]+http-equiv=["']?(x-frame-options|content-security-policy)["']?[^>]*>/gi, "");

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Proxied-From", url);
    res.send(html);
  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(500).json({ error: err.name === "AbortError" ? "Request timed out" : (err.message || "Failed to fetch the page") });
  }
});

// ─── API: SEARCH ───────────────────────────────────────────────────────────────
app.get("/api/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing q parameter" });

  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
    const upstream = await fetchWithTimeout(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    }, 15000);

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: "Search engine error" });
    }

    const html = await upstream.text();
    const results = parseDDGResults(html);

    res.json({ query: q, results });
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: err.name === "AbortError" ? "Search timed out" : (err.message || "Search failed") });
  }
});

function parseDDGResults(html) {
  const results = [];
  const resultBlocks = html.split('<div class="result ');

  for (let i = 1; i < resultBlocks.length && results.length < 10; i++) {
    const block = resultBlocks[i];

    const titleMatch = block.match(
      /class="result__a"[^>]*href="([^"]+)"[^>]*>([^<]+)</
    );
    const snippetMatch = block.match(
      /class="result__snippet"[^>]*>([\s\S]*?)<\/a>/
    );

    if (!titleMatch) continue;

    let url = titleMatch[1];
    const title = decodeEntities(titleMatch[2].trim());

    if (url.startsWith("//duckduckgo.com/l/")) {
      try {
        const uddg = url.match(/uddg=([^&]+)/);
        if (uddg) url = decodeURIComponent(uddg[1]);
      } catch {}
    }
    if (url.startsWith("/")) url = "https://duckduckgo.com" + url;

    let snippet = "";
    if (snippetMatch) {
      snippet = snippetMatch[1].replace(/<[^>]+>/g, "").trim();
      snippet = decodeEntities(snippet).replace(/\s+/g, " ").trim();
    }

    if (url.startsWith("http") && title) {
      results.push({ title, url, snippet });
    }
  }

  return results;
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n));
}

// ─── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok", ts: Date.now() }));

// ─── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`FETCHR running on http://localhost:${PORT}`);
});
