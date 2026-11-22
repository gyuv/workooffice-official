#!/usr/bin/env python3
"""Builds the static pages from one shared layout. Run: python3 scripts/build-pages.py
Edit page bodies in scripts/pages/*.html, the layout lives here."""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'scripts' / 'pages'

NAV = [('index', 'Home'), ('features', 'Features'), ('tour', 'Tour'), ('platform', 'Platform'), ('guides', 'Guides')]

HEAD = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="icon" href="assets/img/icon.png">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="assets/img/screens/02-dashboard.jpg">
<meta name="view-transition" content="same-origin">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body data-page="{page}">
<div class="scroll-progress" aria-hidden="true"></div>
<div class="aurora" aria-hidden="true"><b></b><b></b><b></b></div>
<canvas id="grid-bg" aria-hidden="true"></canvas>
<div class="cursor-glow" aria-hidden="true"></div>

<header class="nav">
  <a class="brand" href="index.html"><img src="assets/img/icon.png" alt="" width="30" height="30"><span>Worko</span></a>
  <nav class="nav-links" id="navLinks">
{links}
  </nav>
  <a class="btn btn-primary btn-sm magnetic" href="download.html"><i data-i="download"></i>Download</a>
  <button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="navLinks"><span></span><span></span></button>
</header>

<main id="top" class="page-main">
'''

FOOT = '''</main>

<section class="cta-band">
  <div class="cta-inner reveal">
    <h2>Ready when your firm is.</h2>
    <p>Free to install on Windows, macOS and Android — or open it in your browser.</p>
    <div class="hero-cta center">
      <a class="btn btn-primary magnetic" href="download.html"><i data-i="download"></i>Download Worko</a>
      <a class="btn btn-ghost magnetic" href="https://worko-office.vercel.app" target="_blank" rel="noopener">Open in browser →</a>
    </div>
  </div>
</section>

<footer class="foot">
  <div class="foot-grid">
    <div>
      <a class="brand" href="index.html"><img src="assets/img/icon.png" alt="" width="24" height="24"><span>Worko</span></a>
      <p>Practice and office management for Indian CA / CS firms.</p>
    </div>
    <div><h5>Product</h5><a href="features.html">Features</a><a href="tour.html">Tour</a><a href="platform.html">Platform</a></div>
    <div><h5>Get it</h5><a href="download.html">Download</a><a href="https://worko-office.vercel.app" target="_blank" rel="noopener">Web app</a><a href="download.html#releases">Release history</a></div>
    <div><h5>Help</h5><a href="guides.html">Guides</a><a href="guides.html#faq">FAQ</a><a href="assets/Worko-User-Guide.pdf" target="_blank">User guide PDF</a></div>
  </div>
  <p class="foot-note">Made for Indian practices · Money in paise · Dates in IST · Your data, your firm.</p>
</footer>

<div class="lightbox" id="lightbox" hidden><button aria-label="Close">×</button><img alt=""></div>
<script src="assets/js/main.js" defer></script>
</body>
</html>
'''

for src in sorted(SRC.glob('*.html')):
    page = src.stem
    raw = src.read_text()
    meta = dict(re.findall(r'^<!--\s*(\w+):\s*(.*?)\s*-->$', raw, re.M))
    body = re.sub(r'^<!--\s*\w+:.*?-->\n', '', raw, flags=re.M)
    links = '\n'.join(
        f'    <a href="{p}.html"{" class=\"active\" aria-current=\"page\"" if p == page else ""}>{n}</a>' for p, n in NAV)
    html = HEAD.format(title=meta['title'], desc=meta['desc'], page=page, links=links) + body + FOOT
    (ROOT / f'{page}.html').write_text(html)
    print('built', page + '.html')
