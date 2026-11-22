/* Worko site — interactions + live release downloads */
(() => {
  'use strict';

  // Releases are read from the public mirror first (filled by .github/workflows/sync-releases.yml),
  // then from the source repo (works only while it is public).
  const RELEASE_REPOS = ['gyuv/workooffice-official', 'gyuv/worko-office'];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- data ---------- */
  const SCREENS = [
    ['02-dashboard', 'Dashboard', 'Your firm at a glance — My day, workload, collections and compliance.'],
    ['05-tasks', 'Tasks', 'List, kanban, calendar, Gantt and sprint views.'],
    ['07-compliance', 'Compliance', 'A compliance matrix generated from rule packs.'],
    ['08-billing', 'Billing', 'GST invoices, ageing, auto-billing and Tally export.'],
    ['06-clients', 'Clients', 'PAN/GSTIN checks, client groups and per-client access.'],
    ['09-time', 'Time', 'Timers, timesheets and job P&L.'],
    ['10-reports', 'Reports', 'Builder, dashboards, drill-down and schedules.'],
    ['13-documents', 'Documents', 'Versioned store, share links, inward/outward registers.'],
    ['11-team', 'Team', 'Capacity, attendance and leave.'],
    ['12-appearance', 'Appearance', '8 accents, text size, density and motion.'],
    ['15-dashboard-dark', 'Dark mode', 'Glass UI with AA contrast.'],
    ['01-login', 'Sign in', 'Firm-scoped login with step-up auth.'],
  ];
  const ADMIN = [
    ['01-firm-link', 'Firm link'], ['02-team', 'Team'], ['03-add-member', 'Add member'], ['04-roles', 'Roles'],
    ['05-firm-profile', 'Firm profile'], ['06-billing-settings', 'Billing settings'], ['07-services', 'Services'],
    ['08-audit', 'Audit log'], ['09-security', 'Security'], ['10-subscription', 'Subscription'],
  ];
  const MODULES = [
    ['👥', 'Clients & documents', 'GSTIN/PAN validation, client groups, encrypted personal data, versioned documents, credential vault + browser extension for portal logins.'],
    ['✅', 'Tasks & compliance', 'Service catalogue, tasks auto-created from rule packs, checklists and review, UDIN gate on audit tasks, due-date extensions.'],
    ['🧾', 'Billing & collections', 'GST invoices (CGST/SGST/IGST), credit/debit notes, receipts with TDS, ageing, reminders, payment links, Tally XML.'],
    ['⏱️', 'Time & HR', 'Timers, timesheets, cost rates, job P&L, capacity, attendance by location, leave ledger, expenses.'],
    ['💬', 'Communication', 'Email, WhatsApp, SMS respecting consent and quiet hours; broadcasts, timeline, team chat, ICS calendar, booking pages.'],
    ['⚖️', 'Practice', 'Notices & hearings, audit programmes and sign-offs, PBC lists, UDIN, DSC register, licences, e-signature.'],
    ['🤝', 'Client portal & CRM', 'OTP login, upload/answer/pay; leads pipeline, versioned proposals, online acceptance, conversion.'],
    ['🤖', 'Automation & AI', 'Trigger → conditions → actions, prebuilt agents, dry runs. AI off by default, redacts personal data, human approves.'],
    ['📊', 'Reports', 'Catalogue + builder, dashboards, drill-down, CSV/XLSX/PDF, schedules, plain-language questions.'],
    ['🛡️', 'Platform', 'Super-admin console, plans and seats, consent-based support access, DPDP tooling, API keys, signed webhooks.'],
  ];

  /* ---------- render lists ---------- */
  const tabs = $('#tourTabs'), gallery = $('#gallery');
  SCREENS.forEach(([f, name], i) => {
    const b = document.createElement('button');
    b.className = 'tab'; b.role = 'tab'; b.textContent = name; b.dataset.i = i;
    b.innerHTML += '<span class="bar"></span>';
    tabs.append(b);
    gallery.insertAdjacentHTML('beforeend',
      `<figure class="reveal"><img src="assets/img/screens/${f}.jpg" alt="${name}" loading="lazy" width="1600" height="1000"><figcaption>${name}</figcaption></figure>`);
  });
  $('#adminStrip').innerHTML = ADMIN.map(([f, n]) =>
    `<figure><img src="assets/img/admin/${f}.jpg" alt="${n}" loading="lazy"><figcaption>${n}</figcaption></figure>`).join('');
  $('#modCards').innerHTML = MODULES.map(([ic, t, d]) =>
    `<div class="card reveal"><div class="ic">${ic}</div><h4>${t}</h4><p>${d}</p></div>`).join('');

  /* ---------- tour autoplay ---------- */
  let cur = 0, timer;
  const img = $('#tourImg'), DUR = 6000;
  tabs.style.setProperty('--dur', DUR + 'ms');
  function show(i, user) {
    cur = (i + SCREENS.length) % SCREENS.length;
    const [f, name, cap] = SCREENS[cur];
    $$('.tab', tabs).forEach((t, j) => t.setAttribute('aria-selected', j === cur));
    $('#tourTitle').textContent = `worko — ${name}`;
    $('#tourCaption').textContent = cap;
    img.classList.add('out');
    setTimeout(() => { img.src = `assets/img/screens/${f}.jpg`; img.alt = name; img.onload = () => img.classList.remove('out'); }, reduce ? 0 : 250);
    clearTimeout(timer);
    if (!reduce) timer = setTimeout(() => show(cur + 1), user ? DUR * 2 : DUR);
  }
  tabs.addEventListener('click', e => { const t = e.target.closest('.tab'); if (t) show(+t.dataset.i, true); });
  show(0);

  /* ---------- quick add parser demo ---------- */
  const qa = $('#qaInput'), chips = $('#qaChips');
  const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const fmt = d => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  function parse(text) {
    const out = { client: null, user: null, pri: null, date: null, title: [] };
    const now = new Date();
    let m;
    if ((m = text.match(/\bin (\d+) days?\b/i))) { const d = new Date(now); d.setDate(d.getDate() + +m[1]); out.date = fmt(d); }
    text.split(/\s+/).forEach(w => {
      const lw = w.toLowerCase();
      if (/^#\w+/.test(w)) out.client = w.slice(1);
      else if (/^@\w+/.test(w)) out.user = lw === '@me' ? 'Me' : w.slice(1);
      else if (/^!{1,3}$/.test(w)) out.pri = w.length === 3 ? 'Urgent' : 'High';
      else if (lw === 'today') out.date = fmt(now);
      else if (lw === 'tomorrow') { const d = new Date(now); d.setDate(d.getDate() + 1); out.date = fmt(d); }
      else if (DAYS.includes(lw.slice(0, 3)) && lw.length <= 9 && /^[a-z]+$/.test(lw) && DAYS.some(x => (x + 'day').startsWith(lw) || lw.startsWith(x))) {
        const d = new Date(now); const t = DAYS.indexOf(lw.slice(0, 3)); d.setDate(d.getDate() + ((t - d.getDay() + 7) % 7 || 7)); out.date = fmt(d);
      } else if ((m = w.match(/^(\d{1,2})\/(\d{1,2})$/))) { const d = new Date(now.getFullYear(), m[2] - 1, +m[1]); out.date = fmt(d); }
      else if (!/^(in|\d+|days?)$/i.test(w) && w) out.title.push(w);
    });
    return out;
  }
  const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  function highlight(text) {
    return esc(text)
      .replace(/(#\w+)/g, '<span class="t-client">$1</span>')
      .replace(/(@\w+)/g, '<span class="t-user">$1</span>')
      .replace(/(^|\s)(!{1,3})(?=\s|$)/g, '$1<span class="t-pri">$2</span>')
      .replace(/\b(today|tomorrow|mon|tue|wed|thu|fri|sat|sun|\d{1,2}\/\d{1,2}|in \d+ days?)\b/gi, '<span class="t-date">$1</span>');
  }
  function renderChips(text) {
    const p = parse(text);
    const list = [];
    if (p.title.length) list.push(['title', '📝 ' + p.title.join(' ')]);
    if (p.client) list.push(['client', '🏢 ' + p.client]);
    if (p.date) list.push(['date', '📅 ' + p.date]);
    if (p.pri) list.push(['pri', '🚩 ' + p.pri]);
    if (p.user) list.push(['user', '👤 ' + p.user]);
    const key = list.map(c => c.join()).join('|');
    if (chips.dataset.key === key) return;
    chips.dataset.key = key;
    chips.innerHTML = list.map(([c, t]) => `<span class="chip ${c}">${esc(t)}</span>`).join('');
  }
  function caretEnd(el) { const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  qa.addEventListener('input', () => { stopTyping(); const t = qa.textContent; qa.innerHTML = highlight(t); caretEnd(qa); renderChips(t); });
  qa.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); qa.textContent = ''; chips.innerHTML = '<span class="chip title">✓ Task saved — type the next one</span>'; chips.dataset.key = ''; } });
  let typeTimer;
  function stopTyping() { clearTimeout(typeTimer); qa.classList.remove('typing'); }
  function typeOut(str) {
    stopTyping(); let i = 0; qa.classList.add('typing');
    const step = () => {
      const t = str.slice(0, ++i); qa.innerHTML = highlight(t); renderChips(t);
      if (i < str.length) typeTimer = setTimeout(step, reduce ? 0 : 55 + Math.random() * 50); else qa.classList.remove('typing');
    };
    step();
  }
  $$('[data-qa]').forEach(b => b.addEventListener('click', () => typeOut(b.dataset.qa)));
  const qaObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { typeOut('File GSTR-3B #acme tomorrow !! @ravi'); qaObs.disconnect(); } }), { threshold: .6 });
  qaObs.observe(qa);

  /* ---------- my day ticks ---------- */
  $('#myDay').addEventListener('click', e => {
    const b = e.target.closest('.tick'); if (!b) return;
    const li = b.closest('li'); li.classList.add('striking');
    setTimeout(() => li.classList.add('done'), 500);
    setTimeout(() => { li.classList.remove('striking', 'done'); li.parentNode.append(li); }, 3500);
  });

  /* ---------- reveal + counters ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    $$('[data-count]', e.target).forEach(countUp);
  }), { threshold: .12, rootMargin: '0px 0px -40px' });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });
  function countUp(el) {
    const end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now(), d = reduce ? 1 : 1400;
    const f = t => { const p = Math.min(1, (t - t0) / d); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }

  /* ---------- tilt + card glow ---------- */
  if (!reduce && matchMedia('(pointer:fine)').matches) {
    $$('[data-tilt]').forEach(el => {
      const target = el.classList.contains('hero-visual') ? $('.window', el) : el;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        target.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(0)`;
      });
      el.addEventListener('mouseleave', () => target.style.transform = '');
    });
  }
  document.addEventListener('mousemove', e => {
    const c = e.target.closest && e.target.closest('.card'); if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px');
  });

  /* ---------- nav, progress ---------- */
  const nav = $('.nav'), prog = $('.scroll-progress');
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 10);
    prog.style.transform = `scaleX(${scrollY / (document.documentElement.scrollHeight - innerHeight || 1)})`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const toggle = $('.nav-toggle'), links = $('#navLinks');
  toggle.addEventListener('click', () => { const o = links.classList.toggle('open'); toggle.setAttribute('aria-expanded', o); });
  links.addEventListener('click', () => { links.classList.remove('open'); toggle.setAttribute('aria-expanded', false); });
  const secIo = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$('a', links).forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50%' });
  $$('main section[id]').forEach(s => secIo.observe(s));

  /* ---------- lightbox ---------- */
  const lb = $('#lightbox');
  document.addEventListener('click', e => {
    const f = e.target.closest('.shot, .gallery figure, .admin-strip figure, .arch'); if (!f) return;
    const i = $('img', f); $('img', lb).src = i.src; $('img', lb).alt = i.alt; lb.hidden = false;
  });
  lb.addEventListener('click', () => lb.hidden = true);
  addEventListener('keydown', e => { if (e.key === 'Escape') lb.hidden = true; });

  /* ---------- background grid canvas ---------- */
  const cv = $('#grid-bg'), ctx = cv.getContext('2d');
  let W, H, pts = [], mouse = { x: -999, y: -999 };
  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pts = Array.from({ length: Math.round(W * H / 26000) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 }));
  }
  size(); addEventListener('resize', size);
  addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(12,26,19,.035)'; ctx.lineWidth = 1;
    const g = 48, off = (scrollY * .2) % g;
    ctx.beginPath();
    for (let x = 0; x < W; x += g) { ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, H); }
    for (let y = -off; y < H; y += g) { ctx.moveTo(0, y + .5); ctx.lineTo(W, y + .5); }
    ctx.stroke();
    for (const p of pts) {
      if (!reduce) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; }
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      ctx.fillStyle = dm < 160 ? 'rgba(22,163,74,.55)' : 'rgba(22,163,74,.18)';
      ctx.beginPath(); ctx.arc(p.x, p.y, dm < 160 ? 2.2 : 1.4, 0, 7); ctx.fill();
      if (dm < 160) { ctx.strokeStyle = `rgba(22,163,74,${.25 * (1 - dm / 160)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
    }
    if (!reduce) requestAnimationFrame(draw);
  }
  draw();

  /* ---------- OS detection ---------- */
  const ua = navigator.userAgent;
  const os = /Android/i.test(ua) ? 'android' : /Win/i.test(navigator.platform || ua) ? 'windows' : /Mac/i.test(navigator.platform || ua) && !/iPhone|iPad/.test(ua) ? 'mac' : /iPhone|iPad/.test(ua) ? 'web' : 'web';
  const OS_LABEL = { windows: ['🪟', 'Download for Windows'], mac: ['🍎', 'Download for macOS'], android: ['🤖', 'Download for Android'], web: ['🌐', 'Open Worko'] };
  $(`.dl[data-os="${os}"]`)?.classList.add('mine');
  $('#heroDownload .os-icon').textContent = OS_LABEL[os][0];
  $('#heroDownload .label').textContent = OS_LABEL[os][1];

  /* ---------- releases ---------- */
  const MB = n => (n / 1048576).toFixed(1) + ' MB';
  const PICK = {
    win: a => /\.exe$/i.test(a.name),
    'mac-arm': a => /\.dmg$/i.test(a.name) && /arm64/i.test(a.name),
    'mac-intel': a => /\.dmg$/i.test(a.name) && !/arm64/i.test(a.name),
    apk: a => /\.apk$/i.test(a.name),
  };
  async function fetchRelease(repo) {
    const r = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=10`, { headers: { Accept: 'application/vnd.github+json' } });
    if (!r.ok) throw new Error(r.status);
    const list = await r.json();
    const rel = list.find(x => !x.draft && x.assets.some(a => /\.(exe|dmg|apk)$/i.test(a.name)));
    if (!rel) throw new Error('no assets');
    return { repo, rel };
  }
  async function loadReleases() {
    const info = $('#relInfo');
    let found;
    for (const repo of RELEASE_REPOS) { try { found = await fetchRelease(repo); break; } catch (_) { /* try next */ } }
    const relUrl = found ? found.rel.html_url : `https://github.com/${RELEASE_REPOS[0]}/releases`;
    $('#allReleases').href = found ? `https://github.com/${found.repo}/releases` : relUrl;
    if (!found) {
      info.innerHTML = '⚠️ Couldn’t reach the release feed — opening the releases page instead.';
      $$('[data-asset]').forEach(a => { a.href = relUrl; a.target = '_blank'; });
      if (os !== 'web') $('#heroDownload').href = '#download';
      return;
    }
    const { rel } = found;
    const date = new Date(rel.published_at || rel.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    info.innerHTML = `<span class="c-dot"></span> Latest: <b>${esc(rel.tag_name)}</b> · ${date}${rel.prerelease ? ' · pre-release' : ''}`;
    $('#heroMeta').textContent = `${rel.tag_name} · Free · updates itself · Windows · macOS · Android`;
    $$('[data-asset]').forEach(a => {
      const asset = rel.assets.find(PICK[a.dataset.asset]);
      if (asset) {
        a.href = asset.browser_download_url; a.title = asset.name;
        a.closest('.dl').querySelector('.dl-size').textContent = (a.closest('.dl').querySelector('.dl-size').textContent ? a.closest('.dl').querySelector('.dl-size').textContent + ' · ' : '') + MB(asset.size);
      } else { a.href = rel.html_url; a.target = '_blank'; }
    });
    const heroKey = { windows: 'win', mac: /Intel/.test(ua) && !('gpu' in navigator) ? 'mac-intel' : 'mac-arm', android: 'apk' }[os];
    const heroAsset = heroKey && rel.assets.find(PICK[heroKey]);
    if (heroAsset) $('#heroDownload').href = heroAsset.browser_download_url;
    else if (os === 'web') { $('#heroDownload').href = 'https://worko-office.vercel.app'; $('#heroDownload').target = '_blank'; }
  }
  if (os === 'web') { $('#heroDownload').href = 'https://worko-office.vercel.app'; $('#heroDownload').target = '_blank'; }
  loadReleases();
})();
