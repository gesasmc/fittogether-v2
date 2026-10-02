'use strict';

const cutsEl = document.getElementById('cuts');
const results = document.getElementById('results');
const sheetL = document.getElementById('sheetL');
const sheetW = document.getElementById('sheetW');
const marginEl = document.getElementById('margin');
const gapEl = document.getElementById('gap');
const rotateEl = document.getElementById('rotate');
const cutCountEl = document.getElementById('cutCount');
const toastEl = document.getElementById('toast');
let nextId = 1;

function storageGet(key, fallback) {
  try {
    const raw = window.localStorage ? localStorage.getItem(key) : null;
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    if (window.localStorage) localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
}

function esc(s) {
  return String(s).replace(/[&<>'"]/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[c]));
}

function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toastEl.classList.remove('show'), 1300);
}

function updateCount() {
  if (cutCountEl) cutCountEl.textContent = `${cutsEl.children.length} ${cutsEl.children.length === 1 ? 'Teil' : 'Teile'}`;
}

function addCut(v = { name: '', l: '', w: '', mode: 'qty', q: 1 }, focus = false) {
  const id = nextId++;
  const d = document.createElement('div');
  d.className = 'cut';
  d.dataset.id = id;
  d.innerHTML = `
    <div class="name"><label>Bezeichnung</label><input data-k="name" placeholder="z. B. Ortgang" value="${esc(v.name || '')}"></div>
    <div><label>Länge (mm)</label><input data-k="l" inputmode="decimal" type="number" min="1" placeholder="2000" value="${v.l ?? ''}"></div>
    <div><label>Breite (mm)</label><input data-k="w" inputmode="decimal" type="number" min="1" placeholder="330" value="${v.w ?? ''}"></div>
    <div><label>Bedarf als</label><select data-k="mode"><option value="qty" ${v.mode !== 'm' ? 'selected' : ''}>Stück</option><option value="m" ${v.mode === 'm' ? 'selected' : ''}>lfm</option></select></div>
    <div><label>Menge / lfm</label><input data-k="q" inputmode="decimal" type="number" min="0.01" step="0.01" value="${v.q ?? 1}"></div>
    <button type="button" class="danger remove" aria-label="Teil löschen" title="Löschen">×</button>`;

  d.querySelector('.remove').addEventListener('click', () => {
    d.remove();
    if (!cutsEl.children.length) addCut({}, false);
    updateCount();
    save();
  });
  d.querySelectorAll('input,select').forEach(i => {
    i.addEventListener('input', save);
    i.addEventListener('change', save);
  });
  cutsEl.appendChild(d);
  updateCount();
  save();
  if (focus) {
    const input = d.querySelector('[data-k="name"]');
    input?.focus();
    d.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function readCuts(includeIncomplete = false) {
  return [...cutsEl.children].map((d, i) => {
    const o = {};
    d.querySelectorAll('input,select').forEach(x => { o[x.dataset.k] = x.value; });
    return {
      name: o.name || `Teil ${i + 1}`,
      l: +o.l,
      w: +o.w,
      mode: o.mode || 'qty',
      q: +o.q
    };
  }).filter(x => includeIncomplete || (x.l > 0 && x.w > 0 && x.q > 0));
}

function save() {
  storageSet('zinkCuts', readCuts(true));
  storageSet('zinkSettings', {
    l: sheetL.value,
    w: sheetW.value,
    margin: marginEl.value,
    gap: gapEl.value,
    rotate: rotateEl.checked
  });
}

function load() {
  const s = storageGet('zinkSettings', {});
  if (s.l) sheetL.value = s.l;
  if (s.w) sheetW.value = s.w;
  if (s.margin != null) marginEl.value = s.margin;
  if (s.gap != null) gapEl.value = s.gap;
  if (s.rotate != null) rotateEl.checked = !!s.rotate;

  const c = storageGet('zinkCuts', []);
  if (Array.isArray(c) && c.length) c.forEach(v => addCut(v));
  else addCut();
}

function pack(items, W, H, gap, allowRotate) {
  const makeSheet = () => ({ free: [{ x: 0, y: 0, w: W, h: H }], placed: [] });

  function prune(rects) {
    return rects
      .filter(r => r.w > 0 && r.h > 0)
      .filter((a, i, arr) => !arr.some((b, j) => i !== j &&
        a.x >= b.x && a.y >= b.y &&
        a.x + a.w <= b.x + b.w &&
        a.y + a.h <= b.y + b.h));
  }

  function tryPlace(sheet, item) {
    let best = null;
    sheet.free.forEach((r, ri) => {
      const opts = [{ w: item.w, h: item.h, rot: false }];
      if (allowRotate && item.w !== item.h) opts.push({ w: item.h, h: item.w, rot: true });
      opts.forEach(o => {
        if (o.w <= r.w && o.h <= r.h) {
          const shortSide = Math.min(r.w - o.w, r.h - o.h);
          const areaWaste = r.w * r.h - o.w * o.h;
          const score = shortSide * 1e9 + areaWaste;
          if (!best || score < best.score) best = { r, ri, ...o, score };
        }
      });
    });
    if (!best) return false;

    const { r, ri, w, h, rot } = best;
    sheet.free.splice(ri, 1);
    sheet.placed.push({ ...item, x: r.x, y: r.y, w, h, rot });

    const rightW = r.w - w - gap;
    const bottomH = r.h - h - gap;

    // Two guillotine-style split variants; choose the one that leaves the larger useful rectangle.
    const splitA = [];
    if (rightW > 0) splitA.push({ x: r.x + w + gap, y: r.y, w: rightW, h: r.h });
    if (bottomH > 0) splitA.push({ x: r.x, y: r.y + h + gap, w: w, h: bottomH });

    const splitB = [];
    if (rightW > 0) splitB.push({ x: r.x + w + gap, y: r.y, w: rightW, h: h });
    if (bottomH > 0) splitB.push({ x: r.x, y: r.y + h + gap, w: r.w, h: bottomH });

    const quality = rs => Math.max(0, ...rs.map(x => x.w * x.h));
    sheet.free.push(...(quality(splitA) >= quality(splitB) ? splitA : splitB));
    sheet.free = prune(sheet.free);
    return true;
  }

  function run(order) {
    const sheets = [];
    for (const item of order) {
      let placed = false;
      for (const sheet of sheets) {
        if (tryPlace(sheet, item)) { placed = true; break; }
      }
      if (!placed) {
        const sheet = makeSheet();
        if (!tryPlace(sheet, item)) return { error: item };
        sheets.push(sheet);
      }
    }
    return { sheets };
  }

  // Try several sensible orders and keep the solution with the fewest sheets,
  // then the most compact last sheet.
  const orders = [
    [...items].sort((a,b) => b.w*b.h - a.w*a.h),
    [...items].sort((a,b) => Math.max(b.w,b.h)-Math.max(a.w,a.h) || b.w*b.h-a.w*a.h),
    [...items].sort((a,b) => b.h-a.h || b.w-a.w),
    [...items].sort((a,b) => b.w-a.w || b.h-a.h)
  ];
  const candidates = orders.map(run);
  const valid = candidates.filter(x => !x.error);
  if (!valid.length) return candidates[0];

  valid.sort((a,b) => {
    if (a.sheets.length !== b.sheets.length) return a.sheets.length - b.sheets.length;
    const lastArea = x => x.sheets.at(-1).placed.reduce((s,p)=>s+p.w*p.h,0);
    return lastArea(b) - lastArea(a);
  });
  return valid[0];
}

function usefulRests(sheet, minSide = 100, minArea = 50000) {
  return sheet.free
    .filter(r => r.w >= minSide && r.h >= minSide && r.w * r.h >= minArea)
    .sort((a,b) => b.w*b.h - a.w*a.h)
    .slice(0, 6);
}}