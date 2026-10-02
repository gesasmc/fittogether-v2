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
const jobNameEl = document.getElementById('jobName');
let nextId = 1;
let doneParts = new Set(storageGet('zinkDoneParts', []));
function doneKey(si, pi, p){ return [si,pi,p.name,p.origL,p.origW].join('|'); }
function saveDone(){ storageSet('zinkDoneParts',[...doneParts]); }

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
    rotate: rotateEl.checked,
    jobName: jobNameEl.value
  });
}

function load() {
  const s = storageGet('zinkSettings', {});
  if (s.l) sheetL.value = s.l;
  if (s.w) sheetW.value = s.w;
  if (s.margin != null) marginEl.value = s.margin;
  if (s.gap != null) gapEl.value = s.gap;
  if (s.rotate != null) rotateEl.checked = !!s.rotate;
  if (s.jobName != null) jobNameEl.value = s.jobName;

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
}

function color(i) {
  const colors = ['#f4bd31','#5cc8ff','#ff7a8a','#80df9a','#c792ea','#ffad5a','#7fd1c8','#9da7ff'];
  return colors[i % colors.length];
}

function render() {
  save();
  const L=+sheetL.value, W=+sheetW.value, m=+marginEl.value, g=+gapEl.value, rot=rotateEl.checked;
  const cuts=readCuts(false);
  if (!L || !W || !cuts.length) {
    results.innerHTML='<h2>Ergebnis</h2><div class="error">Bitte Plattengröße und mindestens einen gültigen Zuschnitt eingeben.</div>';
    return;
  }
  const usableL=L-2*m, usableW=W-2*m;
  if (usableL<=0 || usableW<=0) {
    results.innerHTML='<h2>Ergebnis</h2><div class="error">Randabstand ist zu groß.</div>';
    return;
  }

  const items=[];
  cuts.forEach((cut,ci)=>{
    if(cut.mode==='m'){
      let remaining=Math.round(cut.q*1000);
      while(remaining>0){
        const partL=Math.min(cut.l,remaining);
        items.push({name:cut.name,w:partL,h:cut.w,ci,origL:partL,origW:cut.w});
        remaining-=partL;
      }
    } else {
      for(let k=0;k<Math.ceil(cut.q);k++) items.push({name:cut.name,w:cut.l,h:cut.w,ci,origL:cut.l,origW:cut.w});
    }
  });

  const res=pack(items,usableL,usableW,g,rot);
  if(res.error){
    results.innerHTML=`<h2>Ergebnis</h2><div class="error">${esc(res.error.name)} (${res.error.origL} × ${res.error.origW} mm) passt auf keine Platte.</div>`;
    return;
  }

  const totalArea=items.reduce((s,i)=>s+i.w*i.h,0);
  const sheetArea=L*W, totalSheetArea=res.sheets.length*sheetArea;
  const waste=totalSheetArea-totalArea, util=totalArea/totalSheetArea*100;

  const jobTitle=jobNameEl.value.trim();
  let html=`<h2>Ergebnis</h2>${jobTitle?`<div style="font-size:17px;font-weight:800;color:var(--accent);margin:-5px 0 12px">${esc(jobTitle)}</div>`:''}<div class="stats">
    <div class="stat"><b>${res.sheets.length}</b><span>Platten benötigt</span></div>
    <div class="stat"><b>${(totalArea/1e6).toFixed(2)} m²</b><span>Zuschnittfläche</span></div>
    <div class="stat"><b>${(waste/1e6).toFixed(2)} m²</b><span>Rest/Verschnitt</span></div>
    <div class="stat"><b>${util.toFixed(1)} %</b><span>Flächennutzung</span></div>
  </div><div class="legend">Mehrere Anordnungen werden geprüft. Brauchbare Reststücke ab ca. 100 × 100 mm werden je Platte angezeigt.</div>`;

  res.sheets.forEach((s,si)=>{
    const vw=900, vh=Math.max(280,Math.round(vw*W/L)), sx=vw/L, sy=vh/W;
    const rests=usefulRests(s);
    let svg=`<svg viewBox="0 0 ${vw} ${vh}" role="img" aria-label="Schnittplan Platte ${si+1}"><rect x="0" y="0" width="${vw}" height="${vh}" fill="#0d0f11" stroke="#70777f" stroke-width="2"/>`;
    if(m>0) svg+=`<rect x="${m*sx}" y="${m*sy}" width="${usableL*sx}" height="${usableW*sy}" fill="none" stroke="#727982" stroke-dasharray="8 6"/>`;

    rests.forEach(r=>{
      const x=(r.x+m)*sx,y=(r.y+m)*sy,w=r.w*sx,h=r.h*sy;
      svg+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#20252a" stroke="#68717a" stroke-dasharray="6 5"/>
      <text x="${x+w/2}" y="${y+h/2}" text-anchor="middle" fill="#aab2ba" font-size="11">Rest ${Math.round(r.w)}×${Math.round(r.h)}</text>`;
    });

    s.placed.forEach((p,pi)=>{
      const x=(p.x+m)*sx,y=(p.y+m)*sy,w=p.w*sx,h=p.h*sy;
      const key=doneKey(si,pi,p), done=doneParts.has(key);
      svg+=`<g class="part-hit ${done?'done-part':''}" data-done-key="${esc(key)}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color(p.ci)}" fill-opacity=".78" stroke="#111" stroke-width="2"/>
      <circle class="part-check ${done?'done':''}" cx="${x+14}" cy="${y+14}" r="10"/><text x="${x+14}" y="${y+19}" text-anchor="middle" fill="#fff" font-size="14" font-weight="900">${done?'✓':''}</text>
      <text x="${x+w/2}" y="${y+h/2-5}" text-anchor="middle" fill="#101214" font-size="${Math.max(10,Math.min(20,w/8))}" font-weight="700">${pi+1}. ${esc(p.name)}</text>
      <text x="${x+w/2}" y="${y+h/2+15}" text-anchor="middle" fill="#101214" font-size="${Math.max(9,Math.min(16,w/10))}">${p.origL}×${p.origW}${p.rot?' ↻':''}</text></g>`;
    });
    svg+='</svg>';
    const used=s.placed.reduce((a,p)=>a+p.w*p.h,0);
    const doneCount=s.placed.filter((p,i)=>doneParts.has(doneKey(si,i,p))).length;
    const cutList=`<div class="legend"><b>Teile:</b> ${s.placed.map((p,i)=>`${i+1}. ${esc(p.name)} ${p.origL}×${p.origW}${p.rot?' (gedreht)':''}`).join(' · ')}</div>`;
    const resetDone=`<div style="margin-top:10px"><button type="button" class="secondary reset-done" data-sheet="${si}">Haken dieser Platte zurücksetzen</button></div>`;
    const restText=rests.length?`<div class="legend"><b>Brauchbare Reste:</b> ${rests.map(r=>`${Math.round(r.w)} × ${Math.round(r.h)} mm`).join(' · ')}</div>`:'';
    html+=`<div class="sheet"><div class="sheethead"><b>Platte ${si+1} · ${L} × ${W} mm</b><span>${doneCount}/${s.placed.length} fertig ✓ · ${(used/sheetArea*100).toFixed(1)} % belegt</span></div>${svg}${cutList}${restText}${doneCount?resetDone:''}</div>`;
  });
  results.innerHTML=html;
  results.querySelectorAll('.reset-done').forEach(btn=>btn.addEventListener('click',()=>{
    const si=+btn.dataset.sheet;
    [...doneParts].filter(k=>k.startsWith(si+'|')).forEach(k=>doneParts.delete(k));
    saveDone(); render(); showToast('Haken zurückgesetzt');
  }));
  results.querySelectorAll('[data-done-key]').forEach(el=>el.addEventListener('click',()=>{
    const key=el.dataset.doneKey;
    if(doneParts.has(key)) doneParts.delete(key); else doneParts.add(key);
    saveDone();
    render();
  }));
  results.scrollIntoView({behavior:'smooth',block:'start'});
}

document.getElementById('add').addEventListener('click',()=>{
  addCut({},true);
  showToast('Neues Teil hinzugefügt');
});
document.getElementById('calc').addEventListener('click',render);
document.getElementById('demo').addEventListener('click',()=>{
  cutsEl.innerHTML='';
  [
    {name:'Ortgang',l:2000,w:330,mode:'m',q:5.5},
    {name:'Traufe',l:1000,w:250,mode:'qty',q:3},
    {name:'Abdeckung',l:800,w:180,mode:'qty',q:4}
  ].forEach(v=>addCut(v));
  render();
});
document.getElementById('clear').addEventListener('click',()=>{
  doneParts.clear(); saveDone();
  cutsEl.innerHTML='';
  addCut();
  results.innerHTML='<h2>Ergebnis</h2><div class="sub">Noch keine Berechnung.</div>';
  save();
  showToast('Zurückgesetzt');
});
[sheetL,sheetW,marginEl,gapEl,rotateEl,jobNameEl].forEach(el=>{
  el.addEventListener('input',save);
  el.addEventListener('change',save);
});

load();
