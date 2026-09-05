// FitTogether V2.0.35: weight trend chart in statistics.
export const FITTOGETHER_VERSION='V2.0.35'

const read235=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)??JSON.stringify(fallback))}catch{return fallback}}
const esc235=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))

const renderWeightChart235=()=>{
  const stats=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.includes('Statistik'))
  if(!stats)return
  const history=read235('ft-weight-history',[]).filter(x=>Number.isFinite(Number(x?.weight))&&Number.isFinite(Number(x?.date))).sort((a,b)=>a.date-b.date)
  let box=stats.querySelector('.weight-chart-v235')
  if(!box){
    box=document.createElement('section');box.className='weight-chart-v235'
    const historyBlock=stats.querySelector('.weight-history')
    if(historyBlock)historyBlock.insertAdjacentElement('beforebegin',box)
    else stats.appendChild(box)
  }
  const signature=JSON.stringify(history)
  if(box.dataset.signature===signature)return
  box.dataset.signature=signature
  if(history.length<2){
    box.innerHTML='<div class="section-title"><span>Gewichtsverlauf</span></div><div class="weight-chart-empty-v235">Ab zwei Gewichtseinträgen erscheint hier dein Verlauf als Diagramm.</div>'
    return
  }
  const width=720,height=280,padX=44,padTop=28,padBottom=42
  const weights=history.map(x=>Number(x.weight))
  let min=Math.min(...weights),max=Math.max(...weights)
  if(min===max){min-=1;max+=1}
  const margin=Math.max(.5,(max-min)*.12);min-=margin;max+=margin
  const usableW=width-padX*2,usableH=height-padTop-padBottom
  const x=i=>padX+(history.length===1?usableW/2:(i/(history.length-1))*usableW)
  const y=w=>padTop+((max-w)/(max-min))*usableH
  const points=history.map((item,i)=>`${x(i).toFixed(1)},${y(Number(item.weight)).toFixed(1)}`).join(' ')
  const circles=history.map((item,i)=>`<circle cx="${x(i).toFixed(1)}" cy="${y(Number(item.weight)).toFixed(1)}" r="5"><title>${esc235(new Date(item.date).toLocaleDateString('de-DE'))}: ${esc235(item.weight)} kg</title></circle>`).join('')
  const first=history[0],last=history[history.length-1],delta=Number(last.weight)-Number(first.weight)
  box.innerHTML=`<div class="section-title"><span>Gewichtsverlauf</span></div><div class="weight-chart-summary-v235"><div><strong>${esc235(last.weight)} kg</strong><small>Aktuell</small></div><div><strong>${delta>0?'+':''}${delta.toFixed(1)} kg</strong><small>Seit erstem Eintrag</small></div></div><div class="weight-chart-frame-v235"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Gewichtsverlauf"><line x1="${padX}" y1="${padTop}" x2="${padX}" y2="${height-padBottom}" class="gridline-v235"/><line x1="${padX}" y1="${height-padBottom}" x2="${width-padX}" y2="${height-padBottom}" class="gridline-v235"/><text x="${padX}" y="18" class="chart-label-v235">${max.toFixed(1)} kg</text><text x="${padX}" y="${height-10}" class="chart-label-v235">${esc235(new Date(first.date).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'}))}</text><text x="${width-padX}" y="${height-10}" text-anchor="end" class="chart-label-v235">${esc235(new Date(last.date).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'}))}</text><polyline points="${points}" class="weight-line-v235"/>${circles}</svg></div>`
}

const updateVersion235=()=>{
  document.querySelectorAll('body *').forEach(el=>{
    if(el.children.length)return
    const t=el.textContent||''
    if(/V2\.0\.(17|20|24|25|26|27|28|29|30|31|32|33|34)/.test(t))el.textContent=t.replace(/V2\.0\.(17|20|24|25|26|27|28|29|30|31|32|33|34)/g,FITTOGETHER_VERSION)
  })
}

let scheduled235=false
const enhance235=()=>{scheduled235=false;renderWeightChart235();updateVersion235()}
const schedule235=()=>{if(scheduled235)return;scheduled235=true;requestAnimationFrame(enhance235)}
if(typeof document!=='undefined'){
  const observer=new MutationObserver(m=>{if(m.some(x=>[...x.addedNodes].some(n=>n.nodeType===1&&!n.closest?.('.weight-chart-v235'))))schedule235()})
  const start=()=>{enhance235();observer.observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
