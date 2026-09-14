// FitTogether V2.0.158: touch-friendly plan reordering for days and exercises.
const read322=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write322=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const norm322=s=>String(s||'').toLocaleLowerCase('de-DE').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim()
const esc322=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))
const clone322=v=>JSON.parse(JSON.stringify(v))
const uid322=()=>`rt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`
let pendingPlanIndex322=null

const sessionBase322=s=>`${norm322(s?.day||'')}|${norm322(s?.title||s?.name||'training')}`
const exBase322=x=>`${norm322(x?.name||'uebung')}|${norm322(x?.query||'')}`
const identity322=plan=>{
  const sessions=[]
  const sessionCounts=new Map()
  ;(plan?.sessions||[]).forEach((s,sourceIndex)=>{
    if(!s||typeof s==='string')return
    const base=sessionBase322(s),n=(sessionCounts.get(base)||0)+1
    sessionCounts.set(base,n)
    const sid=`s:${base}:${n}`
    const exCounts=new Map(),exercises=[]
    ;(s.exercises||[]).forEach((x,sourceExerciseIndex)=>{
      const eb=exBase322(x),en=(exCounts.get(eb)||0)+1
      exCounts.set(eb,en)
      exercises.push({id:`e:${sid}:${eb}:${en}`,sourceExerciseIndex,name:x?.name||'Übung',query:x?.query||'',image:x?.thumbUrl||x?.image||x?.gifUrl||x?.imageUrl||''})
    })
    sessions.push({id:sid,sourceIndex,title:s.title||s.name||`Training ${sourceIndex+1}`,day:s.day||'',exercises})
  })
  return sessions
}

const currentPlanIndex322=editor=>{
  if(Number.isInteger(editor?.__ftPlanIndex322))return editor.__ftPlanIndex322
  if(Number.isInteger(pendingPlanIndex322))return pendingPlanIndex322
  const name=editor?.querySelector('header h2')?.textContent?.trim()||''
  const plans=read322('ft-plans',[])
  const matches=plans.map((p,i)=>({p,i})).filter(o=>String(o.p?.name||'').trim()===name)
  return matches.length?matches[0].i:-1
}

const ensureIds322=editor=>{
  const pi=currentPlanIndex322(editor)
  if(pi<0)return null
  editor.__ftPlanIndex322=pi
  const plans=read322('ft-plans',[]),plan=plans[pi]
  if(!plan)return null
  if(!editor.__ftBaseline322){
    editor.__ftBaseline322=identity322(plan)
    editor.__ftMeta322={}
    editor.__ftBaseline322.forEach(s=>{
      editor.__ftMeta322[s.id]={type:'session',sourceSessionId:s.id,title:s.title,day:s.day}
      s.exercises.forEach(x=>editor.__ftMeta322[x.id]={type:'exercise',sourceSessionId:s.id,name:x.name,query:x.query,image:x.image})
    })
    editor.__ftRecipe322={sessions:editor.__ftBaseline322.map(s=>({id:s.id,exercises:s.exercises.map(x=>x.id)}))}
  }
  const baseline=editor.__ftBaseline322,meta=editor.__ftMeta322
  const secs=[...editor.querySelectorAll('.plan-editor-body-v313 > .plan-session-v313')]
  const usedS=new Set()
  secs.forEach((sec,si)=>{
    const title=sec.querySelector('.plan-session-head-v313 strong')?.textContent?.trim()||''
    let match=baseline.find(s=>!usedS.has(s.id)&&norm322(s.title)===norm322(title))
    if(!match)match=baseline.find(s=>!usedS.has(s.id))
    let sid=sec.dataset.ftSessionId322
    if(!sid){sid=match?.id||`s:${norm322(title)}:${uid322()}`;sec.dataset.ftSessionId322=sid}
    usedS.add(sid)
    if(!meta[sid])meta[sid]={type:'session',sourceSessionId:sid,title,day:''}
    const baseEx=baseline.find(s=>s.id===sid)?.exercises||[]
    const usedE=new Set()
    ;[...sec.querySelectorAll('.plan-session-exercises-v313 > .plan-ex-v313')].forEach((row,ri)=>{
      const name=row.querySelector('.plan-ex-title-v313 strong')?.textContent?.trim()||'Übung'
      let ex=row.dataset.ftExerciseId322
      if(!ex){
        const b=baseEx.find(x=>!usedE.has(x.id)&&norm322(x.name)===norm322(name))||baseEx.find(x=>!usedE.has(x.id))
        ex=b?.id||`e:${sid}:${norm322(name)}:${uid322()}`
        row.dataset.ftExerciseId322=ex
      }
      usedE.add(ex)
      if(!meta[ex])meta[ex]={type:'exercise',sourceSessionId:sid,name,query:'',image:row.querySelector('.plan-ex-image-v320 img')?.src||''}
    })
  })
  const recipe=editor.__ftRecipe322
  const knownSessions=new Set(recipe.sessions.map(s=>s.id))
  secs.forEach(sec=>{
    const sid=sec.dataset.ftSessionId322
    if(!knownSessions.has(sid)){recipe.sessions.push({id:sid,exercises:[]});knownSessions.add(sid)}
    const r=recipe.sessions.find(x=>x.id===sid)
    const current=[...sec.querySelectorAll('.plan-session-exercises-v313 > .plan-ex-v313')].map(x=>x.dataset.ftExerciseId322).filter(Boolean)
    const allKnown=new Set(recipe.sessions.flatMap(x=>x.exercises))
    current.forEach(id=>{if(!allKnown.has(id))r.exercises.push(id)})
  })
  return {pi,plan}
}

const syncHeaderCounts322=editor=>{
  const secs=[...editor.querySelectorAll('.plan-editor-body-v313 > .plan-session-v313')]
  secs.forEach((sec,i)=>{
    const small=sec.querySelector('.plan-session-head-v313 small')
    if(small)small.textContent=`TAG ${i+1}`
    const count=sec.querySelectorAll('.plan-session-exercises-v313 > .plan-ex-v313').length
    const span=sec.querySelector('.plan-session-head-v313 > div:last-child > span')
    if(span)span.textContent=`${count} Übungen`
  })
}

const place322=(parent,desired)=>{desired.forEach((el,i)=>{if(!el)return;const current=parent.children[i]||null;if(current!==el)parent.insertBefore(el,current)})}
const applyRecipeDom322=editor=>{
  if(!editor?.isConnected||!editor.__ftRecipe322)return
  ensureIds322(editor)
  const body=editor.querySelector('.plan-editor-body-v313'),recipe=editor.__ftRecipe322
  if(!body)return
  const secMap=new Map([...body.querySelectorAll(':scope > .plan-session-v313')].map(s=>[s.dataset.ftSessionId322,s]))
  place322(body,recipe.sessions.map(r=>secMap.get(r.id)).filter(Boolean))
  const rowMap=new Map([...body.querySelectorAll('.plan-ex-v313')].map(x=>[x.dataset.ftExerciseId322,x]))
  recipe.sessions.forEach(r=>{
    const sec=secMap.get(r.id),list=sec?.querySelector('.plan-session-exercises-v313')
    if(!list)return
    place322(list,r.exercises.map(id=>rowMap.get(id)).filter(Boolean))
  })
  syncHeaderCounts322(editor)
}

const syncRecipeFromOverlay322=(overlay,editor)=>{
  const sessions=[...overlay.querySelectorAll('.reorder-day-v322')].map(day=>({id:day.dataset.sessionId,exercises:[...day.querySelectorAll('.reorder-ex-v322')].map(x=>x.dataset.exerciseId)}))
  editor.__ftRecipe322={sessions}
}

const itemData322=(editor,id)=>editor.__ftMeta322?.[id]||{}
const rowById322=(editor,id)=>[...editor.querySelectorAll('.plan-ex-v313')].find(x=>x.dataset.ftExerciseId322===id)
const sessionById322=(editor,id)=>[...editor.querySelectorAll('.plan-session-v313')].find(x=>x.dataset.ftSessionId322===id)
const rowImage322=(editor,id)=>rowById322(editor,id)?.querySelector('.plan-ex-image-v320 img')?.src||itemData322(editor,id).image||''
const rowName322=(editor,id)=>rowById322(editor,id)?.querySelector('.plan-ex-title-v313 strong')?.textContent?.trim()||itemData322(editor,id).name||'Übung'
const sessionTitle322=(editor,id)=>sessionById322(editor,id)?.querySelector('.plan-session-head-v313 strong')?.textContent?.trim()||itemData322(editor,id).title||'Training'

const attachMoveButtons322=overlay=>{
  overlay.querySelectorAll('[data-move]').forEach(btn=>btn.onclick=e=>{
    e.preventDefault();e.stopPropagation()
    const dir=btn.dataset.move,item=btn.closest('.reorder-ex-v322,.reorder-day-v322')
    if(!item)return
    if(dir==='up'&&item.previousElementSibling)item.parentNode.insertBefore(item,item.previousElementSibling)
    if(dir==='down'&&item.nextElementSibling)item.parentNode.insertBefore(item.nextElementSibling.nextSibling)
  })
}

const bindLongDrag322=(overlay,onChanged)=>{
  let drag=null,timer=null,ghost=null,pointerId=null,startX=0,startY=0
  const cleanup=()=>{
    clearTimeout(timer);timer=null
    if(drag)drag.classList.remove('dragging-v322')
    ghost?.remove();ghost=null;drag=null;pointerId=null
    overlay.classList.remove('drag-active-v322')
  }
  const finish=()=>{if(drag)onChanged?.();cleanup()}
  const begin=(handle,e)=>{
    const item=handle.closest('.reorder-ex-v322,.reorder-day-v322');if(!item)return
    pointerId=e.pointerId;startX=e.clientX;startY=e.clientY
    timer=setTimeout(()=>{
      drag=item;overlay.classList.add('drag-active-v322');drag.classList.add('dragging-v322')
      ghost=item.cloneNode(true);ghost.classList.add('drag-ghost-v322');ghost.style.width=`${item.getBoundingClientRect().width}px`;document.body.appendChild(ghost)
      ghost.style.left=`${Math.max(8,e.clientX-28)}px`;ghost.style.top=`${Math.max(8,e.clientY-24)}px`
      try{handle.setPointerCapture(pointerId)}catch{}
      if(navigator.vibrate)try{navigator.vibrate(20)}catch{}
    },220)
  }
  overlay.querySelectorAll('.drag-handle-v322').forEach(handle=>{
    handle.addEventListener('pointerdown',e=>begin(handle,e))
    handle.addEventListener('pointermove',e=>{
      if(!drag){if(timer&&(Math.abs(e.clientX-startX)>8||Math.abs(e.clientY-startY)>8)){clearTimeout(timer);timer=null}return}
      e.preventDefault();if(ghost){ghost.style.left=`${Math.max(8,e.clientX-28)}px`;ghost.style.top=`${Math.max(8,e.clientY-24)}px`}
      ghost?.classList.add('hidden-hit-v322')
      const hit=document.elementFromPoint(e.clientX,e.clientY)
      ghost?.classList.remove('hidden-hit-v322')
      if(!hit)return
      if(drag.classList.contains('reorder-day-v322')){
        const target=hit.closest('.reorder-day-v322');if(!target||target===drag||target.parentNode!==drag.parentNode)return
        const r=target.getBoundingClientRect();target.parentNode.insertBefore(drag,e.clientY<r.top+r.height/2?target:target.nextSibling)
      }else{
        const target=hit.closest('.reorder-ex-v322');
        if(target&&target!==drag){const r=target.getBoundingClientRect();target.parentNode.insertBefore(drag,e.clientY<r.top+r.height/2?target:target.nextSibling);return}
        const list=hit.closest('.reorder-ex-list-v322');if(list)list.appendChild(drag)
      }
    },{passive:false})
    handle.addEventListener('pointerup',e=>{if(e.pointerId!==pointerId)return;clearTimeout(timer);timer=null;if(drag)finish()})
    handle.addEventListener('pointercancel',()=>cleanup())
  })
}

const openReorder322=editor=>{
  ensureIds322(editor);applyRecipeDom322(editor)
  const working=clone322(editor.__ftRecipe322)
  const ov=document.createElement('div');ov.className='plan-reorder-backdrop-v322'
  const days=working.sessions.map((s,si)=>{
    const ex=s.exercises.map(id=>{const img=rowImage322(editor,id),name=rowName322(editor,id);return `<div class="reorder-ex-v322" data-exercise-id="${esc322(id)}"><button type="button" class="drag-handle-v322" aria-label="${esc322(name)} verschieben">☰</button>${img?`<img src="${esc322(img)}" alt="">`:'<span class="reorder-noimg-v322">•</span>'}<strong>${esc322(name)}</strong><span class="reorder-step-v322"><button type="button" data-move="up">↑</button><button type="button" data-move="down">↓</button></span></div>`}).join('')
    return `<section class="reorder-day-v322" data-session-id="${esc322(s.id)}"><header><button type="button" class="drag-handle-v322 day-handle-v322" aria-label="Trainingstag verschieben">☰</button><div><small>TAG ${si+1}</small><strong>${esc322(sessionTitle322(editor,s.id))}</strong></div><span class="reorder-step-v322"><button type="button" data-move="up">↑</button><button type="button" data-move="down">↓</button></span></header><div class="reorder-ex-list-v322">${ex||'<p class="reorder-empty-v322">Übungen hierher ziehen</p>'}</div></section>`
  }).join('')
  ov.innerHTML=`<section class="plan-reorder-v322"><header><div><small>PLAN SORTIEREN</small><h2>Reihenfolge ändern</h2><p>Am Griff gedrückt halten und ziehen. Übungen können auch auf einen anderen Trainingstag gezogen werden.</p></div><button type="button" data-close>×</button></header><div class="reorder-days-v322">${days}</div><footer><button type="button" data-cancel>Abbrechen</button><button type="button" data-apply>Übernehmen</button></footer></section>`
  document.body.appendChild(ov)
  const close=()=>ov.remove();ov.querySelector('[data-close]').onclick=close;ov.querySelector('[data-cancel]').onclick=close
  ov.addEventListener('click',e=>{if(e.target===ov)close()})
  const refreshEmpty=()=>ov.querySelectorAll('.reorder-ex-list-v322').forEach(list=>{list.querySelector('.reorder-empty-v322')?.remove();if(!list.querySelector('.reorder-ex-v322'))list.insertAdjacentHTML('beforeend','<p class="reorder-empty-v322">Übungen hierher ziehen</p>')})
  attachMoveButtons322(ov);bindLongDrag322(ov,refreshEmpty)
  ov.querySelector('[data-apply]').onclick=()=>{syncRecipeFromOverlay322(ov,editor);close();applyRecipeDom322(editor)}
}

const persistedIdentity322=(plan,editor)=>{
  const sessions=identity322(plan),sessionMap=new Map(),exerciseMap=new Map(),reverseDet=new Map()
  sessions.forEach(s=>{
    const real=plan.sessions[s.sourceIndex];sessionMap.set(s.id,real)
    s.exercises.forEach(x=>{const obj=real.exercises?.[x.sourceExerciseIndex];if(obj){exerciseMap.set(x.id,obj);reverseDet.set(obj,x.id)}})
  })
  const recipeIds=new Set((editor.__ftRecipe322?.sessions||[]).flatMap(s=>s.exercises||[])),runtimeUsed=new Set(),meta=editor.__ftMeta322||{}
  Object.entries(meta).filter(([,m])=>m.type==='exercise'&&!exerciseMap.has(m.id)).forEach(([id,m])=>{
    const source=sessionMap.get(m.sourceSessionId);if(!source)return
    const candidates=(source.exercises||[]).filter(x=>norm322(x?.name)===norm322(m.name)&&!runtimeUsed.has(x))
    const obj=candidates.find(x=>!recipeIds.has(reverseDet.get(x)))||candidates[0]
    if(obj){exerciseMap.set(id,obj);runtimeUsed.add(obj)}
  })
  return{sessions,sessionMap,exerciseMap}
}

const applyPersisted322=editor=>{
  const recipe=editor.__ftRecipe322,pi=editor.__ftPlanIndex322
  if(!recipe||!Number.isInteger(pi))return
  const plans=read322('ft-plans',[]),plan=plans[pi];if(!plan)return
  const stringSessions=(plan.sessions||[]).filter(s=>typeof s==='string')
  const {sessions,sessionMap,exerciseMap}=persistedIdentity322(plan,editor)
  const originalWeekdays=Array.isArray(plan.weekdays)?plan.weekdays:[]
  const dayBySid=new Map(sessions.map(s=>[s.id,sessionMap.get(s.id)?.day||originalWeekdays[s.sourceIndex]||null]))
  const originalExercises=new Map(sessions.map(s=>[s.id,[...(sessionMap.get(s.id)?.exercises||[])]]))
  const target=new Map(),newSessions=[]
  recipe.sessions.forEach(r=>{const s=sessionMap.get(r.id);if(s&&!target.has(r.id)){s.exercises=[];target.set(r.id,s);newSessions.push(s)}})
  sessions.forEach(s=>{if(!target.has(s.id)){const real=sessionMap.get(s.id);if(real){real.exercises=[];target.set(s.id,real);newSessions.push(real)}}})
  const placed=new Set()
  recipe.sessions.forEach(r=>{const dest=target.get(r.id);if(!dest)return;(r.exercises||[]).forEach(id=>{const obj=exerciseMap.get(id);if(obj&&!placed.has(obj)){dest.exercises.push(obj);placed.add(obj)}})})
  sessions.forEach(s=>{const dest=target.get(s.id);(originalExercises.get(s.id)||[]).forEach(obj=>{if(!placed.has(obj)){dest?.exercises.push(obj);placed.add(obj)}})})
  const sidByObject=new Map([...target.entries()].map(([sid,obj])=>[obj,sid]))
  plan.sessions=[...newSessions,...stringSessions]
  plan.days=plan.sessions.length
  plan.weekdays=[...newSessions.map(s=>dayBySid.get(sidByObject.get(s))||s.day||null),...stringSessions.map(()=>null)]
  plans[pi]=plan;write322('ft-plans',plans)
  try{window.FitTogetherCloud?.upload?.()}catch{}
}

const enhanceEditor322=editor=>{
  if(!editor?.isConnected)return
  ensureIds322(editor)
  if(!editor.dataset.reorder322){
    editor.dataset.reorder322='1'
    const header=editor.querySelector('.plan-editor-v313 > header'),close=header?.querySelector('[data-close]')
    if(header&&close){
      const actions=document.createElement('div');actions.className='plan-editor-actions-v322'
      const sort=document.createElement('button');sort.type='button';sort.className='plan-reorder-launch-v322';sort.innerHTML='<span>↕</span> Sortieren';sort.onclick=e=>{e.preventDefault();e.stopPropagation();openReorder322(editor)}
      close.insertAdjacentElement('beforebegin',actions);actions.append(sort,close)
    }
    const save=editor.querySelector('[data-save]')
    save?.addEventListener('click',()=>queueMicrotask(()=>applyPersisted322(editor)))
  }
  if(editor.__ftApplying322)return
  editor.__ftApplying322=true
  requestAnimationFrame(()=>{try{ensureIds322(editor);applyRecipeDom322(editor)}finally{editor.__ftApplying322=false}})
}

let q322=false
const scan322=()=>{if(q322)return;q322=true;requestAnimationFrame(()=>{q322=false;document.querySelectorAll('.plan-editor-backdrop-v313').forEach(enhanceEditor322)})}
if(typeof document!=='undefined'){
  window.addEventListener('click',e=>{
    const edit=e.target.closest?.('.plan-edit-v301');if(!edit)return
    const page=edit.closest('.page'),wrap=edit.closest('.plan-wrap'),wraps=page?[...page.querySelectorAll('.plan-wrap')]:[]
    const idx=wraps.indexOf(wrap);if(idx>=0)pendingPlanIndex322=idx
  },true)
  const start=()=>{scan322();new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length||x.removedNodes.length))scan322()}).observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
