const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send(/* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FETCHR — Download & Browse</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #0a0a0f;
      --surface:  #111118;
      --border:   #1e1e2e;
      --accent1:  #7fffd4;   /* aquamarine */
      --accent2:  #ff6b6b;   /* coral */
      --accent3:  #ffd166;   /* amber */
      --text:     #e8e8f0;
      --muted:    #5a5a72;
      --radius:   12px;
    }

    html, body {
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
      font-family: 'Syne', sans-serif;
      overflow-x: hidden;
    }

    /* ── Background grain + glow ── */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse 60% 50% at 20% 10%, rgba(127,255,212,.07) 0%, transparent 70%),
        radial-gradient(ellipse 50% 40% at 80% 80%, rgba(255,107,107,.06) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    /* ── Layout ── */
    .shell {
      position: relative;
      z-index: 1;
      max-width: 860px;
      margin: 0 auto;
      padding: 60px 24px 80px;
    }

    /* ── Header ── */
    header {
      margin-bottom: 52px;
    }

    .wordmark {
      font-size: clamp(2.8rem, 8vw, 5rem);
      font-weight: 800;
      letter-spacing: -0.04em;
      line-height: 1;
      background: linear-gradient(135deg, var(--accent1) 0%, #a8edea 40%, var(--text) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .tagline {
      font-family: 'DM Mono', monospace;
      font-size: .8rem;
      color: var(--muted);
      margin-top: 8px;
      letter-spacing: .12em;
      text-transform: uppercase;
    }

    /* ── Mode switcher ── */
    .mode-bar {
      display: flex;
      gap: 4px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 4px;
      margin-bottom: 28px;
      width: fit-content;
    }

    .mode-btn {
      font-family: 'Syne', sans-serif;
      font-size: .85rem;
      font-weight: 700;
      letter-spacing: .04em;
      padding: 10px 26px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background .2s, color .2s, transform .1s;
      background: transparent;
      color: var(--muted);
    }

    .mode-btn.active[data-mode="download"] {
      background: var(--accent1);
      color: #0a0a0f;
    }

    .mode-btn.active[data-mode="browse"] {
      background: var(--accent2);
      color: #0a0a0f;
    }

    .mode-btn:not(.active):hover {
      color: var(--text);
    }

    /* ── Card ── */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 28px;
    }

    .card-label {
      font-family: 'DM Mono', monospace;
      font-size: .7rem;
      letter-spacing: .14em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 12px;
    }

    /* ── Input row ── */
    .input-row {
      display: flex;
      gap: 10px;
    }

    input[type="text"] {
      flex: 1;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 14px 18px;
      font-family: 'DM Mono', monospace;
      font-size: .9rem;
      color: var(--text);
      outline: none;
      transition: border-color .2s, box-shadow .2s;
    }

    input[type="text"]:focus {
      border-color: var(--accent1);
      box-shadow: 0 0 0 3px rgba(127,255,212,.12);
    }

    input[type="text"]#browseInput:focus {
      border-color: var(--accent2);
      box-shadow: 0 0 0 3px rgba(255,107,107,.12);
    }

    /* ── Action button ── */
    .action-btn {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: .9rem;
      letter-spacing: .03em;
      padding: 14px 28px;
      border: none;
      border-radius: var(--radius);
      cursor: pointer;
      transition: opacity .15s, transform .12s, box-shadow .2s;
      white-space: nowrap;
      position: relative;
      overflow: hidden;
    }

    .action-btn::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,.08);
      opacity: 0;
      transition: opacity .15s;
    }

    .action-btn:hover::after { opacity: 1; }
    .action-btn:active { transform: scale(.97); }

    .btn-download {
      background: var(--accent1);
      color: #0a0a0f;
    }

    .btn-browse {
      background: var(--accent2);
      color: #0a0a0f;
    }

    /* ── Panels ── */
    .panel { display: none; }
    .panel.active { display: block; }

    /* ── Status / feedback ── */
    .status-bar {
      font-family: 'DM Mono', monospace;
      font-size: .8rem;
      padding: 12px 18px;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--muted);
      min-height: 44px;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: border-color .3s;
    }

    .status-bar.ok    { border-color: var(--accent1); color: var(--accent1); }
    .status-bar.error { border-color: var(--accent2); color: var(--accent2); }
    .status-bar.busy  { border-color: var(--accent3); color: var(--accent3); }

    /* ── Spinner ── */
    .spinner {
      width: 14px; height: 14px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin .7s linear infinite;
      flex-shrink: 0;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Browse iframe ── */
    .preview-wrap {
      margin-top: 20px;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--border);
      background: #fff;
      box-shadow: 0 24px 64px rgba(0,0,0,.5);
      display: none;
    }

    .preview-toolbar {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #1a1a24;
      padding: 10px 16px;
      border-bottom: 1px solid var(--border);
    }

    .dot { width: 12px; height: 12px; border-radius: 50%; }
    .dot.r { background: #ff5f57; }
    .dot.y { background: #febc2e; }
    .dot.g { background: #28c840; }

    .preview-url-bar {
      flex: 1;
      font-family: 'DM Mono', monospace;
      font-size: .75rem;
      color: var(--muted);
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 5px 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    iframe#previewFrame {
      width: 100%;
      height: 600px;
      border: none;
      display: block;
      background: #fff;
    }

    /* ── Search results list ── */
    .results-list {
      margin-top: 20px;
      display: none;
      flex-direction: column;
      gap: 12px;
    }

    .result-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 18px 20px;
      cursor: pointer;
      transition: border-color .2s, transform .15s;
      text-decoration: none;
      display: block;
    }

    .result-card:hover {
      border-color: var(--accent2);
      transform: translateX(4px);
    }

    .result-title {
      font-weight: 700;
      font-size: 1rem;
      color: var(--text);
      margin-bottom: 4px;
    }

    .result-url {
      font-family: 'DM Mono', monospace;
      font-size: .72rem;
      color: var(--accent2);
      margin-bottom: 6px;
    }

    .result-snippet {
      font-size: .85rem;
      color: var(--muted);
      line-height: 1.5;
    }

    /* ── Recent downloads ── */
    .history {
      margin-top: 20px;
      display: none;
    }

    .history-label {
      font-family: 'DM Mono', monospace;
      font-size: .7rem;
      letter-spacing: .14em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 10px;
    }

    .history-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid var(--border);
      font-family: 'DM Mono', monospace;
      font-size: .78rem;
    }

    .history-item:last-child { border-bottom: none; }

    .history-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--accent1);
      flex-shrink: 0;
    }

    .history-name { flex: 1; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .history-size { color: var(--muted); flex-shrink: 0; }

    /* ── Footer ── */
    footer {
      margin-top: 60px;
      font-family: 'DM Mono', monospace;
      font-size: .7rem;
      color: var(--muted);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--border);
      padding-top: 20px;
    }

    .status-led {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .led {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: var(--accent1);
      box-shadow: 0 0 6px var(--accent1);
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .4; }
    }

    /* ── Responsive ── */
    @media (max-width: 520px) {
      .input-row { flex-direction: column; }
      .action-btn { width: 100%; }
    }
  </style>
</head>
<body>
<div class="shell">

  <header>
    <div class="wordmark">FETCHR</div>
    <div class="tagline">// download anything &nbsp;·&nbsp; browse everywhere</div>
  </header>

  <!-- Mode switcher -->
  <div class="mode-bar">
    <button class="mode-btn active" data-mode="download" onclick="switchMode('download')">⬇ Download</button>
    <button class="mode-btn"        data-mode="browse"   onclick="switchMode('browse')">🔍 Browse</button>
  </div>

  <!-- ── DOWNLOAD PANEL ── -->
  <div class="panel active" id="panel-download">
    <div class="card">
      <div class="card-label">// Enter a direct file URL</div>
      <div class="input-row">
        <input type="text" id="downloadUrl" placeholder="https://example.com/file.zip" autocomplete="off" spellcheck="false" />
        <button class="action-btn btn-download" onclick="doDownload()">Download</button>
      </div>
    </div>

    <div class="status-bar" id="dlStatus">Ready — paste a URL above and hit Download</div>

    <div class="history" id="dlHistory">
      <div class="history-label">// Recent downloads</div>
      <div id="historyItems"></div>
    </div>
  </div>

  <!-- ── BROWSE PANEL ── -->
  <div class="panel" id="panel-browse">
    <div class="card">
      <div class="card-label">// Search the web or enter a URL</div>
      <div class="input-row">
        <input type="text" id="browseInput" placeholder="Search query or https://..." autocomplete="off" spellcheck="false"
               onkeydown="if(event.key==='Enter') doBrowse()" />
        <button class="action-btn btn-browse" onclick="doBrowse()">Go</button>
      </div>
    </div>

    <div class="status-bar" id="brStatus">Enter a query or URL to explore the web inline</div>

    <!-- Search results (when query is not a URL) -->
    <div class="results-list" id="resultsList"></div>

    <!-- Inline preview -->
    <div class="preview-wrap" id="previewWrap">
      <div class="preview-toolbar">
        <div class="dot r"></div>
        <div class="dot y"></div>
        <div class="dot g"></div>
        <div class="preview-url-bar" id="previewUrlBar">about:blank</div>
      </div>
      <iframe id="previewFrame" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" title="Web Preview"></iframe>
    </div>
  </div>

  <footer>
    <span>FETCHR v1.0 · Railway</span>
    <span class="status-led"><span class="led"></span> server online</span>
  </footer>

</div>

<script>
/* ─── Mode switcher ─────────────────────────────────────── */
function switchMode(mode) {
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + mode));
}

/* ─── Helpers ───────────────────────────────────────────── */
function setStatus(id, msg, type = '') {
  const el = document.getElementById(id);
  el.className = 'status-bar' + (type ? ' ' + type : '');
  el.innerHTML = type === 'busy'
    ? '<div class="spinner"></div><span>' + msg + '</span>'
    : msg;
}

function isUrl(str) {
  try { return ['http:','https:'].includes(new URL(str).protocol); }
  catch { return false; }
}

/* ─── DOWNLOAD ──────────────────────────────────────────── */
const dlHistory = [];

async function doDownload() {
  const url = document.getElementById('downloadUrl').value.trim();
  if (!url) { setStatus('dlStatus', 'Please enter a URL first.', 'error'); return; }
  if (!isUrl(url)) { setStatus('dlStatus', 'That doesn\'t look like a valid URL (must start with http/https).', 'error'); return; }

  setStatus('dlStatus', 'Fetching file…', 'busy');

  try {
    const res = await fetch('/api/download?url=' + encodeURIComponent(url));
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Server error ' + res.status }));
      throw new Error(err.error || 'Download failed');
    }

    const cd = res.headers.get('content-disposition') || '';
    let filename = 'download';
    const fnMatch = cd.match(new RegExp(`filename[^;=\\n]*=(['"]?)([^'"\\n]+)\\1`));
    if (fnMatch) filename = fnMatch[2];
    else {
      try { filename = decodeURIComponent(new URL(url).pathname.split('/').pop()) || 'download'; }
      catch {}
    }

    const blob = await res.blob();
    const sizeKb = (blob.size / 1024).toFixed(1);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);

    setStatus('dlStatus', '✓ Downloaded <strong>' + filename + '</strong> (' + sizeKb + ' KB)', 'ok');

    // history
    dlHistory.unshift({ name: filename, size: sizeKb + ' KB' });
    if (dlHistory.length > 6) dlHistory.pop();
    renderHistory();
  } catch (e) {
    setStatus('dlStatus', '✗ ' + e.message, 'error');
  }
}

function renderHistory() {
  const wrap = document.getElementById('dlHistory');
  const items = document.getElementById('historyItems');
  if (!dlHistory.length) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'block';
  items.innerHTML = dlHistory.map(h =>
    '<div class="history-item"><div class="history-dot"></div><div class="history-name">' +
    escHtml(h.name) + '</div><div class="history-size">' + escHtml(h.size) + '</div></div>'
  ).join('');
}

/* ─── BROWSE ────────────────────────────────────────────── */
async function doBrowse() {
  const input = document.getElementById('browseInput').value.trim();
  if (!input) { setStatus('brStatus', 'Enter a search query or URL.', 'error'); return; }

  // Hide old results
  document.getElementById('resultsList').style.display = 'none';
  document.getElementById('previewWrap').style.display = 'none';

  if (isUrl(input)) {
    // Direct URL → proxy into iframe
    setStatus('brStatus', 'Loading page…', 'busy');
    try {
      const res = await fetch('/api/proxy?url=' + encodeURIComponent(input));
      if (!res.ok) throw new Error('Could not fetch page (status ' + res.status + ')');
      const html = await res.text();
      showPreview(html, input);
      setStatus('brStatus', '✓ Loaded: ' + input, 'ok');
    } catch (e) {
      setStatus('brStatus', '✗ ' + e.message, 'error');
    }
  } else {
    // Search query
    setStatus('brStatus', 'Searching…', 'busy');
    try {
      const res = await fetch('/api/search?q=' + encodeURIComponent(input));
      if (!res.ok) throw new Error('Search failed (status ' + res.status + ')');
      const data = await res.json();
      renderResults(data.results, input);
      setStatus('brStatus', '✓ ' + data.results.length + ' results for "' + escHtml(input) + '"', 'ok');
    } catch (e) {
      setStatus('brStatus', '✗ ' + e.message, 'error');
    }
  }
}

function renderResults(results, query) {
  const list = document.getElementById('resultsList');
  if (!results || !results.length) {
    list.innerHTML = '<div style="color:var(--muted);font-family:DM Mono,monospace;font-size:.85rem;padding:12px 0">No results found for "' + escHtml(query) + '"</div>';
    list.style.display = 'flex';
    return;
  }
  list.innerHTML = results.map((r, i) => \`
    <div class="result-card" onclick="loadResult('\${escAttr(r.url)}')">
      <div class="result-title">\${escHtml(r.title)}</div>
      <div class="result-url">\${escHtml(r.url)}</div>
      <div class="result-snippet">\${escHtml(r.snippet)}</div>
    </div>
  \`).join('');
  list.style.display = 'flex';
}

async function loadResult(url) {
  document.getElementById('browseInput').value = url;
  setStatus('brStatus', 'Loading page…', 'busy');
  document.getElementById('resultsList').style.display = 'none';
  try {
    const res = await fetch('/api/proxy?url=' + encodeURIComponent(url));
    if (!res.ok) throw new Error('Could not load page');
    const html = await res.text();
    showPreview(html, url);
    setStatus('brStatus', '✓ Loaded: ' + url, 'ok');
  } catch (e) {
    setStatus('brStatus', '✗ ' + e.message, 'error');
  }
}

function showPreview(html, url) {
  const wrap = document.getElementById('previewWrap');
  document.getElementById('previewUrlBar').textContent = url;
  const frame = document.getElementById('previewFrame');
  frame.srcdoc = html;
  wrap.style.display = 'block';
  wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ─── Escape helpers ────────────────────────────────────── */
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escAttr(s) {
  return String(s).replace(/'/g,"\\'");
}

/* ─── Enter key on download input ──────────────────────── */
document.getElementById('downloadUrl').addEventListener('keydown', e => {
  if (e.key === 'Enter') doDownload();
});
</script>
</body>
</html>`);
});

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
    const upstream = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Fetchr/1.0; +https://fetchr.railway.app)",
        Accept: "*/*",
      },
      redirect: "follow",
      timeout: 30000,
    });

    if (!upstream.ok) {
      return res
        .status(upstream.status)
        .json({ error: `Upstream returned ${upstream.status} ${upstream.statusText}` });
    }

    const contentType =
      upstream.headers.get("content-type") || "application/octet-stream";
    const contentLength = upstream.headers.get("content-length");
    const upstreamCd = upstream.headers.get("content-disposition");

    // Derive filename
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
    res.status(500).json({ error: err.message || "Failed to fetch the file" });
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
    const upstream = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,*/*;q=0.9",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      timeout: 20000,
    });

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

    // ── Rewrite relative URLs to absolute so assets load ──
    const base = `${parsedUrl.protocol}//${parsedUrl.host}`;
    const origin = url.split("?")[0].replace(/\/[^/]*$/, "");

    html = html
      // inject <base> tag right after <head>
      .replace(/<head([^>]*)>/i, `<head$1><base href="${base}/">`)
      // remove X-Frame-Options / CSP that would break iframe
      .replace(/<meta[^>]+http-equiv=["']?(x-frame-options|content-security-policy)["']?[^>]*>/gi, "");

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Proxied-From", url);
    res.send(html);
  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(500).json({ error: err.message || "Failed to fetch the page" });
  }
});

// ─── API: SEARCH ───────────────────────────────────────────────────────────────
// Uses DuckDuckGo HTML scraping (no API key required)
app.get("/api/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing q parameter" });

  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
    const upstream = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      timeout: 15000,
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: "Search engine error" });
    }

    const html = await upstream.text();
    const results = parseDDGResults(html);

    res.json({ query: q, results });
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: err.message || "Search failed" });
  }
});

/**
 * Parse DuckDuckGo HTML results without cheerio (pure regex — keeps deps light)
 */
function parseDDGResults(html) {
  const results = [];

  // Each result is in a <div class="result results_links ...">
  const resultBlocks = html.split('<div class="result ');

  for (let i = 1; i < resultBlocks.length && results.length < 10; i++) {
    const block = resultBlocks[i];

    // Title + URL
    const titleMatch = block.match(
      /class="result__a"[^>]*href="([^"]+)"[^>]*>([^<]+)</
    );
    // Snippet
    const snippetMatch = block.match(
      /class="result__snippet"[^>]*>([\s\S]*?)<\/a>/
    );

    if (!titleMatch) continue;

    let url = titleMatch[1];
    const title = decodeEntities(titleMatch[2].trim());

    // DDG wraps URLs — unwrap if needed
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
