// FitTogether V2.0.117: home-only resume card with minimal DOM activity.
const r289=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const fmt289=sec=>{sec=Math.max(0,Math.floor(sec||0));const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60);return h?`${h} Std. ${m} Min.`:`${m} Min.`}
const state289=()=>r289('ft-active-training-v288',null)
const discard289=card=>{try{localStorage.removeItem('ft-active-training-v288');localStorage.removeItem('ft-rest-deadline-v289');localStorage.removeItem('ft-active-set-logs-v277')}catch{};card?.remove()}
const bind289=(card,state)=>{const resume=card.querySelector('[data-resume289]'),discard=card.querySelector('[data-discard289]');if(resume)resume.onclick=()=>{window.__FT_RESUME_289=true;window.FitTogetherStartNormalTraining?.(state.exercises)};if(discard)discard.onclick=()=>discard289(card)}
const render289=()=>{
  let card=document.querySelector('.resume-training-v289')
  if(document.querySelector('.active-training,.rest-overlay,.training-overlay,.rir-backdrop,.swap-backdrop')){card?.remove();return}
  const welcome=document.querySelector('.welcome')
  if(!welcome){card?.remove();return}
  const state=state289()
  if(!state?.exercises?.length){card?.remove();return}
  const home=welcome.parentElement,i=Math.min(state.exercises.length,Math.max(1,(Number(state.index)||0)+1)),set=Math.max(1,Number(state.set)||1),sets=Math.max(1,Number(state.exercises?.[i-1]?.sets)||3),name=state.exercises?.[i-1]?.name||'Training',sig=[name,i,state.exercises.length,set,sets,Number(state.startedAt)||0].join('|')
  if(!card){card=document.createElement('section');card.className='resume-training-v289';welcome.insertAdjacentElement('afterend',card)}
  if(card.dataset.sig!==sig){card.dataset.sig=sig;card.innerHTML=`<div class="resume-copy-v289"><small>TRAINING LÄUFT</small><strong>${name}</strong><span data-meta289></span></div><button type="button" class="resume-main-v289" data-resume289>Fortsetzen <b>›</b></button><button type="button" class="resume-discard-v289" data-discard289 aria-label="Training verwerfen">×</button>`;bind289(card,state)}
  const elapsed=Math.max(0,(Date.now()-(Number(state.startedAt)||Date.now()))/1000),meta=card.querySelector('[data-meta289]');if(meta)meta.textContent=`${fmt289(elapsed)} · Übung ${i}/${state.exercises.length} · Satz ${set}/${sets}`
}
let q289=false
const schedule289=()=>{if(q289)return;q289=true;requestAnimationFrame(()=>{q289=false;render289()})}
if(typeof document!=='undefined'){
  const touchesHome289=node=>node?.nodeType===1&&(node.matches?.('.welcome,.active-training,.training-overlay,.rir-backdrop,.swap-backdrop,.rest-overlay')||node.querySelector?.('.welcome,.active-training,.training-overlay,.rir-backdrop,.swap-backdrop,.rest-overlay'))
  const start=()=>{render289();new MutationObserver(m=>{if(m.some(x=>[...x.addedNodes,...x.removedNodes].some(touchesHome289)))schedule289()}).observe(document.body,{childList:true,subtree:true});window.addEventListener('pageshow',schedule289);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedule289()});setInterval(()=>{if(document.querySelector('.resume-training-v289'))render289()},30000)}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
