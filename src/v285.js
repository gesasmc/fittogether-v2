// FitTogether V2.0.85: interaction stabilization + single exercise uses the normal training flow.
// Does not modify RestOverlay/timer logic.
const findPlanPage285=()=>[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.trim()==='Trainingspläne')
const stabilizePlans285=()=>{const page=findPlanPage285();if(!page)return;page.querySelectorAll('.plan-card,.plan-days button,.plan-delete-v251').forEach(b=>{b.style.pointerEvents='auto';b.style.touchAction='manipulation'})}
const singleExercise285=e=>{const btn=e.target.closest('button');if(!btn)return;const card=btn.closest('.exercise-card-v2');if(!card)return;/* library cards still open detail normally */}
let queued285=false;const enhance285=()=>{queued285=false;stabilizePlans285()};const schedule285=()=>{if(queued285||document.querySelector('.rest-overlay'))return;queued285=true;requestAnimationFrame(enhance285)}
if(typeof document!=='undefined'){document.addEventListener('click',singleExercise285,true);const obs=new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length||x.removedNodes.length))schedule285()});const start=()=>{enhance285();obs.observe(document.body,{childList:true,subtree:true})};document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})}
