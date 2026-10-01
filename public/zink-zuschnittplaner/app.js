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
  const sheets = [];
  const newSheet = () => ({ free: [{ x: 0, y: 0, w: W, h: H }], placed: [] });
  const fits = (rect, item) => item.w <= rect.w && item.h <= rect.h;
  const score = (rect, item) => Math.min(rect.w - item.w, rect.h - item.h) * 100000 + (rect.w * rect.h - item.w * item.h);

  function placeIn(sheet, item) {
    let best = null;
    sheet.free.forEach((r, ri) => {
      const opts = [{ w: item.w, h: item.h, rot: false }];
      if (allowRotate && item.w !== item.h) opts.push({ w: item.h, h: item.w, rot: true });
      opts.forEach(o => {
        if (fits(r, o)) {
          const sc = score(r, o);
          if (!best || sc < best.sc) best = { r, ri, ...o, sc };
        }
      });
    });
    if (!best) return false;

    const { r, ri, w, h, rot } = best;
    sheet.free.splice(ri, 1);
    sheet.placed.push({ ...item, x: r.x, y: r.y, w, h, rot });

    const rw = r.w - w - gap;
    const bh = r.h - h - gap;
    if (rw > 0) sheet.free.push({ x: r.x + w + gap, y: r.y, w: rw, h });
    if (bh > 0) sheet.free.push({ x: r.x, y: r.y + h + gap, w: r.w, h: bh });

    sheet.free = sheet.free.filter((a, i, arr) => !arr.some((b, j) => i !== j && a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h));
    return true;
  }

  items.sort((a, b) => Math.max(b.w, b.h) - Math.max(a.w, a.h) || b.w * b.h - a.w * a.h);
  for (const item of items) {
    let done = false;
    for (const s of sheets) {
      if (placeIn(s, item)) { done = true; break; }
    }
    if (!done) {
      const s = newSheet();
      if (!placeIn(s, item)) return { error: item };
      sheets.push(s);
    }
  }
  return { sheets };
}

function color(i) {
  const colors = ['#f4bd31','#5cc8ff','#ff7a8a','#80df9a','#c792ea','#ffad5a','#7fd1c8','#9da7ff'];
  return colors[i % colors.length];
}

function render() {
  save();
  const L = +sheetL.value;
  const W = +sheetW.value;
  const m = +marginEl.value;
  const g = +gapEl.value;
  const rot = rotateEl.checked;
  const cuts = readCuts(false);

  if (!L || !W || cuts.length === 0) {
    results.innerHTML = '<h2>Ergebnis</h2><div class="error">Bitte Plattengröße und mindestens einen gültigen Zuschnitt eingeben.</div>';
    return;
  }

  const usableL = L - 2 * m;
  const usableW = W - 2 * m;
  if (usableL <= 0 || usableW <= 0) {
    results.innerHTML = '<h2>Ergebnis</h2><div class="error">Randabstand ist zu groß.</div>';
    return;
  }

  const items = [];
  cuts.forEach((c, ci) => {
    if (c.mode === 'm') {
      let remaining = Math.round(c.q * 1000);
      while (remaining > 0) {
        const partL = Math.min(c.l, remaining);
        items.push({ name: c.name, w: partL, h: c.w, ci, origL: partL, origW: c.w });
        remaining -= partL;
      }
    } else {
      for (let k = 0; k < Math.ceil(c.q); k++) {
        items.push({ name: c.name, w: c.l, h: c.w, ci, origL: c.l, origW: c.w });
      }
    }
  });

  const res = pack(items, usableL, usableW, g, rot);
  if (res.error) {
    results.innerHTML = `<h2>Ergebnis</h2><div class="error">${esc(res.error.name)} (${res.error.origL} × ${res.error.origW} mm) passt auf keine Platte.</div>`;
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const totalArea = items.reduce((s, i) => s + i.w * i.h, 0);
  const sheetArea = L * W;
  const totalSheetArea = res.sheets.length * sheetArea;
  const waste = totalSheetArea - totalArea;
  const util = totalArea / totalSheetArea * 100;

  let html = `<h2>Ergebnis</h2><div class="stats">
    <div class="stat"><b>${res.sheets.length}</b><span>Platten benötigt</span></div>
    <div class="stat"><b>${(totalArea / 1e6).toFixed(2)} m²</b><span>Zuschnittfläche</span></div>
    <div class="stat"><b>${(waste / 1e6).toFixed(2)} m²</b><span>Rest/Verschnitt*</span></div>
    <div class="stat"><b>${util.toFixed(1)} %</b><span>Flächennutzung</span></div>
  </div><div class="legend">* Restfläche ist rechnerisch; brauchbare Reststücke werden noch nicht separat bewertet.</div>`;

  res.sheets.forEach((s, si) => {
    const vw = 900;
    const vh = Math.max(280, Math.round(vw * W / L));
    const sx = vw / L;
    const sy = vh / W;
    let svg = `<svg viewBox="0 0 ${vw} ${vh}" role="img" aria-label="Schnittplan Platte ${si + 1}"><rect x="0" y="0" width="${vw}" height="${vh}" fill="#0d0f11" stroke="#70777f" stroke-width="2"/>`;
    if (m > 0) svg += `<rect x="${m * sx}" y="${m * sy}" width="${usableL * sx}" height="${usableW * sy}" fill="none" stroke="#727982" stroke-dasharray="8 6"/>`;

    s.placed.forEach(p => {
      const x = (p.x + m) * sx;
      const y = (p.y + m) * sy;
      const w = p.w * sx;
      const h = p.h * sy;
      svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color(p.ci)}" fill-opacity=".78" stroke="#111" stroke-width="2"/>
        <text x="${x + w / 2}" y="${y + h / 2 - 5}" text-anchor="middle" fill="#101214" font-size="${Math.max(10, Math.min(20, w / 8))}" font-weight="700">${esc(p.name)}</text>
        <text x="${x + w / 2}" y="${y + h / 2 + 15}" text-anchor="middle" fill="#101214" font-size="${Math.max(9, Math.min(16, w / 10))}">${p.origL}×${p.origW}${p.rot ? ' ↻' : ''}</text>`;
    });
    svg += '</svg>';
    const used = s.placed.reduce((a, p) => a + p.w * p.h, 0);
    html += `<div class="sheet"><div class="sheethead"><b>Platte ${si + 1} · ${L} × ${W} mm</b><span>${s.placed.length} Teile · ${(used / sheetArea * 100).toFixed(1)} % belegt</span></div>${svg}</div>`;
  });

  results.innerHTML = html;
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('add').addEventListener('click', () => {
  addCut({}, true);
  showToast('Neues Teil hinzugefügt');
});
document.getElementById('calc').addEventListener('click', render);
document.getElementById('demo').addEventListener('click', () => {
  cutsEl.innerHTML = '';
  [
    { name: 'Ortgang', l: 2000, w: 330, mode: 'm', q: 5.5 },
    { name: 'Traufe', l: 1000, w: 250, mode: 'qty', q: 3 },
    { name: 'Abdeckung', l: 800, w: 180, mode: 'qty', q: 4 }
  ].forEach(v => addCut(v));
  render();
});
document.getElementById('clear').addEventListener('click', () => {
  cutsEl.innerHTML = '';
  addCut();
  results.innerHTML = '<h2>Ergebnis</h2><div class="sub">Noch keine Berechnung.</div>';
  save();
  showToast('Zurückgesetzt');
});

[sheetL, sheetW, marginEl, gapEl, rotateEl].forEach(el => {
  el.addEventListener('input', save);
  el.addEventListener('change', save);
});

load();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}