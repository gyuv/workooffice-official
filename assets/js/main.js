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
  P.pause = '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>';
  P.play = '<path d="M7 4.5v15l12-7.5z"/>';
  P.wifiOff = '<path d="M2 2l20 20"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M5 12.9a10 10 0 0 1 5.2-2.7"/><path d="M19 12.9a10 10 0 0 0-2.2-1.5"/><path d="M12 20h.01"/>';
  const page = document.body.dataset.page;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- data ---------- */
  const SCREENS = [
    ['02-dashboard', 'Dashboard', 'Your firm at a glance — My day, workload, collections and compliance.', 'work'],
    ['05-tasks', 'Tasks', 'List, kanban, calendar, Gantt and sprint views.', 'work'],
    ['07-compliance', 'Compliance', 'A compliance matrix generated from rule packs.', 'work'],
    ['08-billing', 'Billing', 'GST invoices, ageing, auto-billing and Tally export.', 'money'],
    ['06-clients', 'Clients', 'PAN/GSTIN checks, client groups and per-client access.', 'work'],
    ['09-time', 'Time', 'Timers, timesheets and job P&L.', 'money'],
    ['10-reports', 'Reports', 'Builder, dashboards, drill-down and schedules.', 'money'],
    ['13-documents', 'Documents', 'Versioned store, share links, inward/outward registers.', 'work'],
    ['11-team', 'Team', 'Capacity, attendance and leave.', 'work'],
    ['12-appearance', 'Appearance', '8 accents, text size, density and motion.', 'look'],
    ['15-dashboard-dark', 'Dark mode', 'Glass UI with AA contrast.', 'look'],
    ['01-login', 'Sign in', 'Firm-scoped login with step-up auth.', 'look'],
  ];
  const ADMIN = [
    ['01-firm-link', 'Firm link'], ['02-team', 'Team'], ['03-add-member', 'Add member'], ['04-roles', 'Roles'],
    ['05-firm-profile', 'Firm profile'], ['06-billing-settings', 'Billing settings'], ['07-services', 'Services'],
    ['08-audit', 'Audit log'], ['09-security', 'Security'], ['10-subscription', 'Subscription'],
  ];
  const MODULES = [
    ['users', 'Clients & documents', 'Know every client, keep every file.', ['GSTIN / PAN validation and client groups', 'Per-client visibility, encrypted personal data', 'Versioned document store, share links, inward/outward registers', 'Credential vault + browser extension that fills government-portal logins'], '06-clients'],
    ['tasks', 'Tasks & compliance', 'Deadlines that create themselves.', ['Service catalogue', 'Tasks auto-created from compliance rule packs', 'Checklists and review before done', 'UDIN gate on audit tasks, compliance matrix, due-date extensions'], '07-compliance'],
    ['receipt', 'Billing & collections', 'Invoice, collect, reconcile.', ['GST invoices (CGST / SGST / IGST), credit and debit notes', 'Receipts with TDS', 'Ageing, auto-billing, reminders, payment links', 'Tally XML export'], '08-billing'],
    ['clock', 'Time & HR', 'Know where the hours go.', ['Timers, timesheets, cost rates', 'Job P&L and capacity', 'Attendance by location or office network', 'Leave ledger and expenses'], '09-time'],
    ['chat', 'Communication', 'Reach clients the way they prefer.', ['Email, WhatsApp and SMS respecting consent and quiet hours', 'Broadcasts and client timeline', 'Team chat and ICS calendar', 'Booking pages'], '11-team'],
    ['scale', 'Practice', 'The professional side, organised.', ['Notices and hearings', 'Audit programmes, sign-offs and PBC lists', 'UDIN and DSC register', 'Licences and e-signature'], '13-documents'],
    ['handshake', 'Client portal & CRM', 'Win clients, then serve them.', ['OTP login; clients see only what is granted', 'Upload, answer and pay online', 'Leads pipeline and versioned proposals', 'Online acceptance and conversion'], '06-clients'],
    ['spark', 'Automation & AI', 'Let the routine run itself.', ['Trigger → conditions → actions', 'Prebuilt agents and dry runs', 'AI off by default; redacts personal data', 'Every suggestion needs a human'], '05-tasks'],
    ['chart', 'Reports', 'Answers, not spreadsheets.', ['Catalogue + report builder', 'Dashboards with drill-down', 'CSV / XLSX / PDF and schedules', 'Ask questions in plain language'], '10-reports'],
    ['server', 'Platform', 'Run it like a SaaS.', ['Super-admin console, plans and seat limits', 'Consent-based support access', 'DPDP tooling', 'Public API keys and signed webhooks'], '12-appearance'],
  ];

  paintIcons();

  /* ---------- page transitions (fallback where View Transitions are unsupported) ---------- */
  requestAnimationFrame(() => document.body.classList.add('ready'));
  if (!document.startViewTransition && !reduce) {
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href$=".html"], a[href*=".html#"]');
      if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const url = new URL(a.href, location);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      document.body.classList.add('leaving');
      setTimeout(() => { location.href = a.href; }, 260);
    });
  }
  addEventListener('pageshow', e => { if (e.persisted) document.body.classList.remove('leaving'); });

  /* ---------- split-text headings ---------- */
  $$('.split-text').forEach(h => {
    let i = 0;
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(w => {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.append(w); return; }
          const s = document.createElement('span'); s.className = 'w';
          const inner = document.createElement('span'); inner.textContent = w; inner.style.transitionDelay = `${i++ * 45}ms`;
          s.append(inner); frag.append(s);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
    walk(h);
    h.classList.add('reveal');
  });

  /* ---------- reveal + counters ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    $$('[data-count]', e.target).forEach(countUp);
  }), { threshold: .12, rootMargin: '0px 0px -40px' });
  const observeReveals = (root = document) => $$('.reveal:not(.in)', root).forEach((el, i) => {
    if (!el.classList.contains('split-text')) el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });
  function countUp(el) {
    const end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now(), d = reduce ? 1 : 1400;
    const f = t => { const p = Math.min(1, (t - t0) / d); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }

  /* ---------- nav, progress, parallax ---------- */
  const nav = $('.nav'), prog = $('.scroll-progress'), para = $$('[data-parallax]');
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 10);
    prog.style.transform = `scaleX(${scrollY / (document.documentElement.scrollHeight - innerHeight || 1)})`;
    if (!reduce) para.forEach(el => {
      const r = el.getBoundingClientRect(), c = r.top + r.height / 2 - innerHeight / 2;
      el.style.translate = `0 ${(-c * +el.dataset.parallax).toFixed(1)}px`;
    });
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const toggle = $('.nav-toggle'), links = $('#navLinks');
  toggle.addEventListener('click', () => { const o = links.classList.toggle('open'); toggle.setAttribute('aria-expanded', o); });

  /* ---------- pointer effects: tilt, magnetic, card glow, cursor glow ---------- */
  const fine = matchMedia('(pointer:fine)').matches;
  if (!reduce && fine) {
    $$('[data-tilt]').forEach(el => {
      const target = el.classList.contains('hero-visual') ? $('.window', el) : el;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        target.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(0)`;
      });
      el.addEventListener('mouseleave', () => target.style.transform = '');
    });
    $$('.magnetic').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        b.style.translate = `${(e.clientX - r.left - r.width / 2) * .2}px ${(e.clientY - r.top - r.height / 2) * .3}px`;
      });
      b.addEventListener('mouseleave', () => b.style.translate = '');
    });
    const glow = $('.cursor-glow');
    addEventListener('mousemove', e => { glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; glow.classList.add('on'); });
  }
  document.addEventListener('mousemove', e => {
    const c = e.target.closest && e.target.closest('.card, .bento-card, .dl, .pr, .doc'); if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px');
  });

  /* ---------- lightbox ---------- */
  const lb = $('#lightbox');
  document.addEventListener('click', e => {
    const f = e.target.closest('.shot, .gallery figure, .admin-strip figure, .arch'); if (!f || f.dataset.dragged) return;
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
  const os = /Android/i.test(ua) ? 'android' : /iPhone|iPad/.test(ua) ? 'web' : /Win/i.test(navigator.platform || ua) ? 'windows' : /Mac/i.test(navigator.platform || ua) ? 'mac' : 'web';

  /* ================= page: features ================= */
  const qa = $('#qaInput');
  if (qa) {
    const chips = $('#qaChips');
    const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const fmt = d => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    const parse = text => {
      const out = { client: null, user: null, pri: null, date: null, title: [] }, now = new Date();
      let m;
      if ((m = text.match(/\bin (\d+) days?\b/i))) { const d = new Date(now); d.setDate(d.getDate() + +m[1]); out.date = fmt(d); }
      text.split(/\s+/).forEach(w => {
        const lw = w.toLowerCase();
        if (/^#\w+/.test(w)) out.client = w.slice(1);
        else if (/^@\w+/.test(w)) out.user = lw === '@me' ? 'Me' : w.slice(1);
        else if (/^!{1,3}$/.test(w)) out.pri = w.length === 3 ? 'Urgent' : 'High';
        else if (lw === 'today') out.date = fmt(now);
        else if (lw === 'tomorrow') { const d = new Date(now); d.setDate(d.getDate() + 1); out.date = fmt(d); }
        else if (/^(sun|mon|tue|wed|thu|fri|sat)[a-z]*$/.test(lw) && lw.length <= 9) {
          const d = new Date(now), t = DAYS.indexOf(lw.slice(0, 3)); d.setDate(d.getDate() + ((t - d.getDay() + 7) % 7 || 7)); out.date = fmt(d);
        } else if ((m = w.match(/^(\d{1,2})\/(\d{1,2})$/))) out.date = fmt(new Date(now.getFullYear(), m[2] - 1, +m[1]));
        else if (!/^(in|\d+|days?)$/i.test(w) && w) out.title.push(w);
      });
      return out;
    };
    const highlight = text => esc(text)
      .replace(/(#\w+)/g, '<span class="t-client">$1</span>')
      .replace(/(@\w+)/g, '<span class="t-user">$1</span>')
      .replace(/(^|\s)(!{1,3})(?=\s|$)/g, '$1<span class="t-pri">$2</span>')
      .replace(/\b(today|tomorrow|mon|tue|wed|thu|fri|sat|sun|\d{1,2}\/\d{1,2}|in \d+ days?)\b/gi, '<span class="t-date">$1</span>');
    const renderChips = text => {
      const p = parse(text), list = [];
      if (p.title.length) list.push(['title', p.title.join(' '), 'note']);
      if (p.client) list.push(['client', p.client, 'building']);
      if (p.date) list.push(['date', p.date, 'calendar']);
      if (p.pri) list.push(['pri', p.pri, 'flag']);
      if (p.user) list.push(['user', p.user, 'user']);
      const key = list.map(c => c.join()).join('|');
      if (chips.dataset.key === key) return;
      chips.dataset.key = key;
      chips.innerHTML = list.map(([c, t, i]) => `<span class="chip ${c}">${svg(i)}${esc(t)}</span>`).join('');
    };
    const caretEnd = el => { const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
    let typeTimer;
    const stopTyping = () => { clearTimeout(typeTimer); qa.classList.remove('typing'); };
    const typeOut = str => {
      stopTyping(); let i = 0; qa.classList.add('typing');
      const step = () => {
        const t = str.slice(0, ++i); qa.innerHTML = highlight(t); renderChips(t);
        if (i < str.length) typeTimer = setTimeout(step, reduce ? 0 : 55 + Math.random() * 50); else qa.classList.remove('typing');
      };
      step();
    };
    qa.addEventListener('input', () => { stopTyping(); const t = qa.textContent; qa.innerHTML = highlight(t); caretEnd(qa); renderChips(t); });
    qa.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      e.preventDefault(); qa.textContent = ''; chips.dataset.key = '';
      chips.innerHTML = `<span class="chip title">${svg('check')}Task saved — type the next one</span>`;
    });
    $$('[data-qa]').forEach(b => b.addEventListener('click', () => typeOut(b.dataset.qa)));
    const qaObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { typeOut('File GSTR-3B #acme tomorrow !! @ravi'); qaObs.disconnect(); } }), { threshold: .6 });
    qaObs.observe(qa);
  }

  const myDay = $('#myDay');
  if (myDay) myDay.addEventListener('click', e => {
    const b = e.target.closest('.tick'); if (!b) return;
    const li = b.closest('li'); li.classList.add('striking');
    setTimeout(() => li.classList.add('done'), 500);
    setTimeout(() => { li.classList.remove('striking', 'done'); li.parentNode.append(li); }, 3500);
  });

  const modList = $('#modList');
  if (modList) {
    const panel = $('#modPanel');
    modList.innerHTML = MODULES.map(([ic, t], i) => `<button role="tab" data-i="" data-m="${i}"><span class="mi">${svg(ic)}</span>${esc(t)}</button>`).join('');
    $$('button', modList).forEach(b => b.removeAttribute('data-i'));
    const pick = i => {
      const [ic, t, tag, pts, shot] = MODULES[i];
      $$('button', modList).forEach((b, j) => b.setAttribute('aria-selected', i === j));
      panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
      panel.innerHTML = `<div class="mp-head"><span class="ic-tile">${svg(ic)}</span><div><h3>${esc(t)}</h3><p>${esc(tag)}</p></div></div>
        <ul>${pts.map((p, k) => `<li style="animation-delay:${k * 70}ms">${svg('check')}${esc(p)}</li>`).join('')}</ul>
        <figure class="mp-shot"><img src="assets/img/screens/${shot}.jpg" alt="" loading="lazy"></figure>`;
    };
    modList.addEventListener('click', e => { const b = e.target.closest('button'); if (b) pick(+b.dataset.m); });
    pick(0);
  }

  const kbd = $('#kbdDemo');
  if (kbd) {
    const QUERIES = [['acme', ['Acme Industries — client', 'Acme · GSTR-3B Nov — task', 'Acme · Invoice INV-0412']], ['udin', ['Generate UDIN — action', 'UDIN register — page', 'Audit sign-off · Initech — task']], ['dark', ['Toggle dark mode — setting', 'Appearance — page', 'Accent colour — setting']]];
    const text = $('#kbdText'), res = $('#kbdResults');
    let qi = 0, started = false;
    const run = () => {
      const [q, items] = QUERIES[qi++ % QUERIES.length];
      let i = 0; res.innerHTML = '';
      const type = () => {
        text.textContent = q.slice(0, ++i);
        if (i < q.length) return setTimeout(type, reduce ? 0 : 120);
        res.innerHTML = items.map((t, k) => `<li class="${k ? '' : 'sel'}" style="animation-delay:${k * 80}ms">${esc(t)}<kbd>${k ? '' : '↵'}</kbd></li>`).join('');
        setTimeout(run, 2600);
      };
      type();
    };
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting && !started) { started = true; run(); o.disconnect(); } }, { threshold: .5 }).observe(kbd);
  }

  /* ================= page: tour ================= */
  const tabs = $('#tourTabs');
  if (tabs) {
    SCREENS.forEach(([, name], i) => tabs.insertAdjacentHTML('beforeend', `<button class="tab" role="tab" data-n="${i}">${esc(name)}<span class="bar"></span></button>`));
    let cur = 0, timer, playing = !reduce;
    const img = $('#tourImg'), DUR = 6000, playBtn = $('#tourPlay');
    tabs.style.setProperty('--dur', DUR + 'ms');
    const show = i => {
      cur = (i + SCREENS.length) % SCREENS.length;
      const [f, name, cap] = SCREENS[cur];
      $$('.tab', tabs).forEach((t, j) => { t.setAttribute('aria-selected', j === cur); t.classList.toggle('paused', !playing); });
      $('#tourTitle').textContent = `worko — ${name}`;
      $('#tourCaption').textContent = cap;
      img.classList.add('out');
      setTimeout(() => { img.src = `assets/img/screens/${f}.jpg`; img.alt = name; img.onload = () => img.classList.remove('out'); }, reduce ? 0 : 250);
      clearTimeout(timer);
      if (playing) timer = setTimeout(() => show(cur + 1), DUR);
    };
    tabs.addEventListener('click', e => { const t = e.target.closest('.tab'); if (t) show(+t.dataset.n); });
    playBtn.addEventListener('click', () => {
      playing = !playing;
      playBtn.innerHTML = svg(playing ? 'pause' : 'play');
      playBtn.setAttribute('aria-label', playing ? 'Pause tour' : 'Play tour');
      show(cur);
    });
    if (!playing) playBtn.innerHTML = svg('play');
    show(0);
  }

  const gallery = $('#gallery');
  if (gallery) {
    gallery.innerHTML = SCREENS.map(([f, name, , g]) =>
      `<figure class="reveal" data-g="${g}"><img src="assets/img/screens/${f}.jpg" alt="${esc(name)}" loading="lazy" width="1600" height="1000"><figcaption>${esc(name)}</figcaption></figure>`).join('');
    $('#galleryFilters').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      $$('#galleryFilters button').forEach(x => x.classList.toggle('active', x === b));
      const f = b.dataset.f;
      $$('figure', gallery).forEach((fig, i) => {
        const show = f === 'all' || fig.dataset.g === f;
        fig.classList.toggle('hide', !show);
        if (show) { fig.style.animation = 'none'; void fig.offsetWidth; fig.style.animation = `pop .45s ${i * 30}ms both`; }
      });
    });
  }

  const cmp = $('#compare');
  if (cmp) {
    const range = $('input', cmp), set = v => cmp.style.setProperty('--pos', v + '%');
    range.addEventListener('input', () => set(range.value));
    let auto = !reduce, t0 = performance.now();
    const sweep = t => { if (!auto) return; set(50 + Math.sin((t - t0) / 1400) * 30); requestAnimationFrame(sweep); };
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting && auto) { t0 = performance.now(); requestAnimationFrame(sweep); setTimeout(() => { auto = false; set(range.value = 50); }, 4400); o.disconnect(); } }, { threshold: .5 }).observe(cmp);
    range.addEventListener('pointerdown', () => { auto = false; });
    set(50);
  }

  const strip = $('#adminStrip');
  if (strip) {
    strip.innerHTML = ADMIN.map(([f, n]) => `<figure><img src="assets/img/admin/${f}.jpg" alt="${esc(n)}" loading="lazy" draggable="false"><figcaption>${esc(n)}</figcaption></figure>`).join('');
    let down = false, sx = 0, sl = 0, moved = 0;
    strip.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = strip.scrollLeft; strip.classList.add('grabbing'); });
    addEventListener('pointermove', e => { if (!down) return; moved = Math.abs(e.clientX - sx); strip.scrollLeft = sl - (e.clientX - sx); });
    addEventListener('pointerup', () => {
      if (!down) return; down = false; strip.classList.remove('grabbing');
      $$('figure', strip).forEach(f => moved > 6 ? f.dataset.dragged = 1 : delete f.dataset.dragged);
      setTimeout(() => $$('figure', strip).forEach(f => delete f.dataset.dragged), 50);
    });
  }

  /* ================= page: platform ================= */
  const syncDemo = $('#syncDemo');
  if (syncDemo) {
    const btn = $('#offlineToggle'), st = $('#syncStatus');
    let offline = false, pending = 0, iv;
    btn.addEventListener('click', () => {
      offline = !offline;
      syncDemo.classList.toggle('offline', offline);
      $('span', btn).textContent = offline ? 'Back online' : 'Go offline';
      $('i', btn).innerHTML = svg(offline ? 'wifiOff' : 'globe');
      clearInterval(iv);
      if (offline) {
        iv = setInterval(() => { pending++; st.innerHTML = `<span class="c-dot warn"></span>Offline · ${pending} change${pending > 1 ? 's' : ''} queued in outbox`; }, 900);
        st.innerHTML = '<span class="c-dot warn"></span>Offline · working locally';
      } else {
        const flush = () => {
          st.innerHTML = `<span class="c-dot"></span>Syncing · ${pending} pending`;
          if (pending-- > 0) iv = setTimeout(flush, 220); else { pending = 0; st.innerHTML = '<span class="c-dot"></span>Online · all changes merged'; }
        };
        flush();
      }
    });
  }

  const chain = $('#chain');
  if (chain) {
    const EV = ['Invoice INV-0412 created', 'Task GSTR-3B · done', 'Client Acme · GSTIN edited', 'Vault secret revealed (step-up)', 'Role "Reviewer" changed'];
    let h = 0x9e3779b1;
    const hash = s => { for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 2654435761) >>> 0; return h.toString(16).padStart(8, '0'); };
    let prev = '00000000';
    chain.innerHTML = EV.map((e, i) => { const cur = hash(prev + e); const html = `<div class="blk" style="transition-delay:${i * 120}ms"><small>#${1041 + i}</small><b>${esc(e)}</b><code>prev ${prev}</code><code class="cur">hash ${cur}</code></div>`; prev = cur; return html; }).join('<span class="link-arrow"></span>');
    chain.addEventListener('click', e => {
      const b = e.target.closest('.blk'); if (!b) return;
      const all = $$('.blk', chain), i = all.indexOf(b);
      all.forEach((x, j) => x.classList.toggle('broken', j >= i));
      setTimeout(() => all.forEach(x => x.classList.remove('broken')), 2200);
    });
    chain.title = 'Click a block to tamper with it';
  }

  /* ================= page: download ================= */
  $(`.dl[data-os="${os}"]`)?.classList.add('mine');
  const osTabs = $('#osTabs');
  if (osTabs) {
    const pickOs = o => {
      $$('button', osTabs).forEach(b => b.classList.toggle('active', b.dataset.os === o));
      $$('[data-steps]').forEach(s => { s.hidden = s.dataset.steps !== o; if (!s.hidden) { s.classList.remove('in'); void s.offsetWidth; s.classList.add('in'); } });
    };
    osTabs.addEventListener('click', e => { const b = e.target.closest('button'); if (b) pickOs(b.dataset.os); });
    pickOs(['windows', 'mac', 'android'].includes(os) ? os : 'windows');
  }

  const heroDl = $('#heroDownload');
  if (heroDl) {
    const OS_LABEL = { windows: ['monitor', 'Download for Windows'], mac: ['laptop', 'Download for macOS'], android: ['phone', 'Download for Android'], web: ['globe', 'Open Worko'] };
    $('.os-icon', heroDl).innerHTML = svg(OS_LABEL[os][0]);
    $('.label', heroDl).textContent = OS_LABEL[os][1];
    if (os === 'web') { heroDl.href = 'https://worko-office.vercel.app'; heroDl.target = '_blank'; }
  }

  const MB = n => (n / 1048576).toFixed(1) + ' MB';
  const PICK = {
    win: a => /\.exe$/i.test(a.name),
    'mac-arm': a => /\.dmg$/i.test(a.name) && /arm64/i.test(a.name),
    'mac-intel': a => /\.dmg$/i.test(a.name) && !/arm64/i.test(a.name),
    apk: a => /\.apk$/i.test(a.name),
  };
  const CACHE_KEY = 'worko-releases-v1';
  async function fetchReleases(repo) {
    const r = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=10`, { headers: { Accept: 'application/vnd.github+json' } });
    if (!r.ok) throw new Error(r.status);
    const list = (await r.json()).filter(x => !x.draft && x.assets.some(a => /\.(exe|dmg|apk)$/i.test(a.name)));
    if (!list.length) throw new Error('no assets');
    return { repo, list };
  }
  async function loadReleases() {
    try { const c = JSON.parse(sessionStorage.getItem(CACHE_KEY)); if (c && Date.now() - c.t < 600000) return c.d; } catch (_) { /* no storage */ }
    for (const repo of RELEASE_REPOS) {
      try { const d = await fetchReleases(repo); try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), d })); } catch (_) { /* ignore */ } return d; } catch (_) { /* try next */ }
    }
    return null;
  }
  const needsReleases = $('[data-asset]') || heroDl || $('#timeline');
  if (needsReleases) loadReleases().then(found => {
    const info = $('#relInfo'), tl = $('#timeline');
    const relPage = found ? `https://github.com/${found.repo}/releases` : `https://github.com/${RELEASE_REPOS[0]}/releases`;
    if ($('#allReleases')) $('#allReleases').href = relPage;
    if (!found) {
      if (info) info.innerHTML = svg('info') + ' Couldn’t reach the release feed — the buttons open the releases page instead.';
      $$('[data-asset]').forEach(a => { a.href = relPage; a.target = '_blank'; });
      if (tl) tl.innerHTML = `<li class="muted">See <a href="${relPage}" target="_blank" rel="noopener">all releases on GitHub</a>.</li>`;
      return;
    }
    const rel = found.list[0];
    const dt = r => new Date(r.published_at || r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    if (info) info.innerHTML = `<span class="c-dot"></span> Latest: <b>${esc(rel.tag_name)}</b> · ${dt(rel)}${rel.prerelease ? ' · pre-release' : ''}`;
    if ($('#heroMeta')) $('#heroMeta').textContent = `${rel.tag_name} · Free · updates itself · Windows · macOS · Android`;
    $$('.dl').forEach(card => {
      const sizes = [];
      $$('[data-asset]', card).forEach(a => {
        const asset = rel.assets.find(PICK[a.dataset.asset]);
        if (asset) { a.href = asset.browser_download_url; a.title = asset.name; sizes.push(MB(asset.size)); } else { a.href = rel.html_url; a.target = '_blank'; }
      });
      if (sizes.length) $('.dl-size', card).textContent = sizes.join(' · ');
    });
    const heroKey = { windows: 'win', mac: 'mac-arm', android: 'apk' }[os];
    const heroAsset = heroDl && heroKey && rel.assets.find(PICK[heroKey]);
    if (heroAsset) heroDl.href = heroAsset.browser_download_url;
    if (tl) {
      tl.innerHTML = found.list.slice(0, 6).map((r, i) => `<li class="reveal">
        <span class="tl-dot${i ? '' : ' now'}"></span>
        <div><b>${esc(r.name || r.tag_name)}</b>${i ? '' : '<em>latest</em>'}<small>${dt(r)}${r.prerelease ? ' · pre-release' : ''} · ${r.assets.filter(a => /\.(exe|dmg|apk)$/i.test(a.name)).length} installers</small></div>
        <a href="${esc(r.html_url)}" target="_blank" rel="noopener">Notes →</a></li>`).join('');
      observeReveals(tl);
    }
  });

  observeReveals();
})();
