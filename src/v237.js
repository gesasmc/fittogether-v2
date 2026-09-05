// FitTogether V2.0.37: editable/deletable weight history in statistics.
export const FITTOGETHER_VERSION='V2.0.37'
const KEY237='ft-weight-history'
const read237=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)??JSON.stringify(f))}catch{return f}}
const write237=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const esc237=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const sync237=()=>{try{window.FitTogetherCloud?.upload?.()}catch{}}
const dateValue237=ts=>{const d=new Date(Number(ts)||Date.now());const p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`}
const refreshWeightUi237=()=>{
  document.querySelector('.weight-chart-v235')?.remove()
  renderWeightHistory237()
}
const close237=()=>document.querySelector('.weight-editor-modal-v237')?.remove()
const openEditor237=index=>{
  close237()
  const rows=read237(KEY237,[]),item=rows[index];if(!item)return
  const modal=document.createElement('div');modal.className='weight-editor-modal-v237'
  modal.innerHTML=`<div class="weight-editor-v237"><div class="weight-editor-head-v237"><div><small>GEWICHT BEARBEITEN</small><h2>${esc237(item.weight)} kg</h2></div><button type="button" data-close>×</button></div><label><span>Gewicht</span><div class="weight-input-wrap-v237"><input data-weight inputmode="decimal" value="${esc237(item.weight)}"><b>kg</b></div></label><label><span>Datum</span><input data-date type="date" value="${dateValue237(item.date)}"></label><div class="weight-editor-actions-v237"><button class="danger" type="button" data-delete>Löschen</button><button class="primary" type="button" data-save>Speichern</button></div></div>`
  document.body.appendChild(modal)
  modal.querySelector('[data-close]').onclick=close237
  modal.addEventListener('click',e=>{if(e.target===modal)close237()})
  modal.querySelector('[data-save]').onclick=()=>{
    const all=read237(KEY237,[]),x={...all[index]};if(!x)return
    const raw=String(modal.querySelector('[data-weight]').value||'').replace(',','.')
    const weight=Number(raw)
    if(!Number.isFinite(weight)||weight<20||weight>400){alert('Bitte ein gültiges Gewicht eingeben.');return}
    x.weight=Math.round(weight*10)/10
    const ds=modal.querySelector('[data-date]').value
    if(ds){const old=new Date(Number(x.date)||Date.now());const [y,m,d]=ds.split('-').map(Number);old.setFullYear(y,m-1,d);x.date=old.getTime()}
    all[index]=x;all.sort((a,b)=>(Number(a.date)||0)-(Number(b.date)||0));write237(KEY237,all);sync237();close237();refreshWeightUi237()
  }
  modal.querySelector('[data-delete]').onclick=()=>{
    if(!confirm('Diesen Gewichtseintrag wirklich löschen?'))return
    const all=read237(KEY237,[]);all.splice(index,1);write237(KEY237,all);sync237();close237();refreshWeightUi237()
  }
}
const renderWeightHistory237=()=>{
  const stats=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.includes('Statistik'))
  if(!stats)return
  let box=stats.querySelector('.weight-entry-list-v237')
  if(!box){box=document.createElement('section');box.className='weight-entry-list-v237';const chart=stats.querySelector('.weight-chart-v235');if(chart)chart.insertAdjacentElement('afterend',box);else stats.appendChild(box)}
  const rows=read237(KEY237,[])
  const signature=JSON.stringify(rows);if(box.dataset.signature===signature)return;box.dataset.signature=signature
  box.innerHTML=`<div class="section-title"><span>Gewichtseinträge</span></div>${rows.length?`<div class="weight-rows-v237">${rows.map((x,i)=>`<button type="button" data-weight-index="${i}"><span><strong>${esc237(x.weight)} kg</strong><small>${new Date(Number(x.date)||Date.now()).toLocaleDateString('de-DE')}</small></span><b>Bearbeiten</b></button>`).reverse().join('')}</div>`:'<p class="weight-empty-v237">Noch keine Gewichtseinträge vorhanden.</p>'}`
  box.querySelectorAll('[data-weight-index]').forEach(btn=>btn.onclick=()=>openEditor237(Number(btn.dataset.weightIndex)))
}
let scheduled237=false
const enhance237=()=>{scheduled237=false;renderWeightHistory237();document.querySelectorAll('body *').forEach(el=>{if(el.children.length)return;const t=el.textContent||'';if(t.includes('V2.0.36'))el.textContent=t.replaceAll('V2.0.36',FITTOGETHER_VERSION)})}
const schedule237=()=>{if(scheduled237)return;scheduled237=true;requestAnimationFrame(enhance237)}
if(typeof document!=='undefined'){
  const observer=new MutationObserver(m=>{if(m.some(x=>[...x.addedNodes].some(n=>n.nodeType===1&&!n.classList?.contains('weight-entry-list-v237')&&!n.classList?.contains('weight-editor-modal-v237'))))schedule237()})
  const start=()=>{enhance237();observer.observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
