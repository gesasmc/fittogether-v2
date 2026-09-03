// FitTogether V2.0.23: bodyweight mode + stronger progression for RIR 4+.
const read223=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
const write223=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
const norm223=s=>String(s||'').trim().toLowerCase()
const settings223=name=>read223('ft-exercise-settings',{})[norm223(name)]||{}
const patchSettings223=(name,patch)=>{const all=read223('ft-exercise-settings',{}),key=norm223(name);all[key]={...(all[key]||{}),...patch,name,updatedAt:Date.now()};write223('ft-exercise-settings',all)}
const recommendation223=(rir,weight,reps,noWeight=false)=>{const w=Number(weight)||0,r=Number(reps)||0;if(rir<=0)return`Sehr hart – nächstes Mal ${noWeight?'':w?w+' kg halten und ':''}${Math.max(1,r-2)}–${Math.max(1,r-1)} Wdh. anpeilen.`;if(rir===1)return`Hart – ${noWeight?'Wiederholungen halten':w?w+' kg halten':'Gewicht halten'} und etwa ${Math.max(1,r-1)}–${r} Wdh. anpeilen.`;if(rir===2)return`Perfekt – ${noWeight?'bei '+r+' Wdh. bleiben':w?w+' kg und '+r+' Wdh. beibehalten':r+' Wdh. beibehalten'}.`;if(rir===3)return`Noch Reserve – nächster Satz ${r+1} Wdh.${noWeight?'':w?' bei '+w+' kg':''}.`;return noWeight?`Deutlich zu leicht – nächster Satz auf ${r+2} Wdh. erhöhen.`:w?`Deutlich zu leicht – nächster Satz auf ${r+2} Wdh. erhöhen; wenn das weiter leicht bleibt, Gewicht steigern.`:`Deutlich zu leicht – nächster Satz auf ${r+2} Wdh. erhöhen.`}
const findSingle223=()=>document.querySelector('.single-training-v220')
const getSingleName223=overlay=>overlay?.querySelector('h1')?.textContent?.trim()||overlay?.querySelector('.single-head-v220 strong')?.textContent?.trim()||''
const getSingleInputs223=overlay=>[...overlay?.querySelectorAll('.single-inputs-v220 input')||[]]
const setInput223=(input,value)=>{if(!input)return;input.value=String(value);input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}))}
const ensureNoWeight223=overlay=>{
  const name=getSingleName223(overlay),inputs=getSingleInputs223(overlay);if(!name||inputs.length<2)return
  const wrap=overlay.querySelector('.single-inputs-v220');if(!wrap||overlay.querySelector('.no-weight-v223'))return
  const row=document.createElement('label');row.className='no-weight-v223';row.innerHTML='<input type="checkbox"><span>Ohne Zusatzgewicht trainieren</span>'
  wrap.insertAdjacentElement('afterend',row)
  const cb=row.querySelector('input'),saved=settings223(name);cb.checked=Boolean(saved.noWeight)
  const apply=()=>{const active=cb.checked;inputs[0].disabled=active;if(active)setInput223(inputs[0],0);patchSettings223(name,{noWeight:active,weight:active?0:Number(inputs[0].value)||0});wrap.classList.toggle('weight-off-v223',active)}
  cb.onchange=apply;apply()
}
const interceptRir223=e=>{
  const btn=e.target.closest('.rir-options-v222 button');if(!btn)return
  const overlay=findSingle223();if(!overlay)return
  const rir=Number(btn.dataset.rir);if(rir<4)return
  const name=getSingleName223(overlay),inputs=getSingleInputs223(overlay);if(!name||inputs.length<2)return
  const saved=settings223(name),noWeight=Boolean(saved.noWeight),weight=noWeight?0:Number(inputs[0].value)||0,reps=Number(inputs[1].value)||0,nextReps=reps+2
  setTimeout(()=>{
    const current=findSingle223(),nextInputs=getSingleInputs223(current);if(!current||nextInputs.length<2)return
    setInput223(nextInputs[1],nextReps)
    if(noWeight)setInput223(nextInputs[0],0)
    patchSettings223(name,{noWeight,weight:noWeight?0:weight,reps:nextReps,lastRir:rir,lastRecommendation:recommendation223(rir,weight,reps,noWeight)})
    const hist=read223('ft-exercise-history',[]);for(let i=hist.length-1;i>=0;i--){if(norm223(hist[i].exercise)===norm223(name)&&hist[i].rir===4&&Date.now()-Number(hist[i].date||0)<2500){hist[i].recommendation=recommendation223(4,weight,reps,noWeight);break}}write223('ft-exercise-history',hist)
  },80)
}
document.addEventListener('click',interceptRir223,true)
const enhance223=()=>{const overlay=findSingle223();if(overlay)ensureNoWeight223(overlay);document.querySelectorAll('body *').forEach(el=>{if(el.children.length===0&&el.textContent?.includes('V2.0.22'))el.textContent=el.textContent.replaceAll('V2.0.22','V2.0.23')})}
if(typeof document!=='undefined'){const obs223=new MutationObserver(enhance223);const start223=()=>{enhance223();obs223.observe(document.body,{childList:true,subtree:true})};document.body?start223():document.addEventListener('DOMContentLoaded',start223,{once:true})}
