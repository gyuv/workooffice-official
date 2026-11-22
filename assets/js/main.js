/* Worko site — interactions + live release downloads */
(() => {
  'use strict';

  // Releases are read from the public mirror first (filled by .github/workflows/sync-releases.yml),
  // then from the source repo (works only while it is public).
  const RELEASE_REPOS = ['gyuv/workooffice-official', 'gyuv/worko-office'];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- icons (line icons, inline SVG) ---------- */
  const P = {
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
    laptop: '<path d="M4 16V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10"/><path d="M2 20h20l-2-4H4z"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"/>',
    book: '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5a2.5 2.5 0 0 0 0 5H20"/><path d="M9 7h7"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M21.5 20a6.5 6.5 0 0 0-4-6"/>',
    tasks: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/><path d="m9 15 2 2 4-4"/>',
    receipt: '<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    scale: '<path d="M12 3v18M7 21h10M5 7h14"/><path d="m5 7-3 7a3.5 3.5 0 0 0 6 0z"/><path d="m19 7-3 7a3.5 3.5 0 0 0 6 0z"/>',
    handshake: '<path d="M8 12 11 9a2.5 2.5 0 0 1 3.5 0L20 14.5"/><path d="M2 9l4-4 4 3"/><path d="M22 9l-4-4-4 3"/><path d="M6 13l4 4a1.5 1.5 0 0 0 2-2M10 17l1.5 1.5a1.5 1.5 0 0 0 2-2M13.5 16.5l1 1a1.5 1.5 0 0 0 2-2"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z"/>',
    chart: '<path d="M3 3v18h18"/><path d="M8 16v-5M12 16V8M16 16v-3M20 16V6"/>',
    server: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01"/>',
    note: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3"/>',
    calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  };
  const svg = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;
  const paintIcons = (root = document) => $$('[data-i]', root).forEach(el => { el.innerHTML = svg(el.dataset.i); });

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
    ['users', 'Clients & documents', 'GSTIN/PAN validation, client groups, encrypted personal data, versioned documents, credential vault + browser extension for portal logins.'],
    ['tasks', 'Tasks & compliance', 'Service catalogue, tasks auto-created from rule packs, checklists and review, UDIN gate on audit tasks, due-date extensions.'],
    ['receipt', 'Billing & collections', 'GST invoices (CGST/SGST/IGST), credit/debit notes, receipts with TDS, ageing, reminders, payment links, Tally XML.'],
    ['clock', 'Time & HR', 'Timers, timesheets, cost rates, job P&L, capacity, attendance by location, leave ledger, expenses.'],
    ['chat', 'Communication', 'Email, WhatsApp, SMS respecting consent and quiet hours; broadcasts, timeline, team chat, ICS calendar, booking pages.'],
    ['scale', 'Practice', 'Notices & hearings, audit programmes and sign-offs, PBC lists, UDIN, DSC register, licences, e-signature.'],
    ['handshake', 'Client portal & CRM', 'OTP login, upload/answer/pay; leads pipeline, versioned proposals, online acceptance, conversion.'],
    ['spark', 'Automation & AI', 'Trigger → conditions → actions, prebuilt agents, dry runs. AI off by default, redacts personal data, human approves.'],
    ['chart', 'Reports', 'Catalogue + builder, dashboards, drill-down, CSV/XLSX/PDF, schedules, plain-language questions.'],
    ['server', 'Platform', 'Super-admin console, plans and seats, consent-based support access, DPDP tooling, API keys, signed webhooks.'],
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
    `<div class="card reveal"><div class="ic">${svg(ic)}</div><h4>${t}</h4><p>${d}</p></div>`).join('');

  paintIcons();

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
    if (p.title.length) list.push(['title', p.title.join(' '), 'note']);
    if (p.client) list.push(['client', p.client, 'building']);
    if (p.date) list.push(['date', p.date, 'calendar']);
    if (p.pri) list.push(['pri', p.pri, 'flag']);
    if (p.user) list.push(['user', p.user, 'user']);
    const key = list.map(c => c.join()).join('|');
    if (chips.dataset.key === key) return;
    chips.dataset.key = key;
    chips.innerHTML = list.map(([c, t, i]) => `<span class="chip ${c}">${svg(i)}${esc(t)}</span>`).join('');
  }
  function caretEnd(el) { const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  qa.addEventListener('input', () => { stopTyping(); const t = qa.textContent; qa.innerHTML = highlight(t); caretEnd(qa); renderChips(t); });
  qa.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); qa.textContent = ''; chips.innerHTML = `<span class="chip title">${svg('check')}Task saved — type the next one</span>`; chips.dataset.key = ''; } });
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
  const OS_LABEL = { windows: ['monitor', 'Download for Windows'], mac: ['laptop', 'Download for macOS'], android: ['phone', 'Download for Android'], web: ['globe', 'Open Worko'] };
  $(`.dl[data-os="${os}"]`)?.classList.add('mine');
  $('#heroDownload .os-icon').innerHTML = svg(OS_LABEL[os][0]);
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
      info.innerHTML = svg('info') + ' Couldn’t reach the release feed — opening the releases page instead.';
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
