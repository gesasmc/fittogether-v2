// FitTogether V2.0.101: lock the approved stylized muscle-map direction and remove the home muscle-load card.
const hideRecovery2101=()=>{document.querySelectorAll('.recovery-v298').forEach(el=>el.remove())}
const polishMap2101=()=>{const card=document.querySelector('.muscle-map-v2100');if(!card)return;card.classList.add('muscle-map-approved-v2101');const head=card.querySelector('.muscle-map-head-v2100>span');if(head)head.textContent='Vorne · Hinten'}
let q2101=false;const run2101=()=>{if(q2101)return;q2101=true;requestAnimationFrame(()=>{q2101=false;hideRecovery2101();polishMap2101()})}
if(typeof document!=='undefined'){const start=()=>{run2101();new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length||x.removedNodes.length))run2101()}).observe(document.body,{childList:true,subtree:true})};document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})}
