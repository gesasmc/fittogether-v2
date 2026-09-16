export default function trainingMemory277(){
  return {
    name:'training-memory-v287',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/App.jsx'))return null

      const marker="const current=exercises[index],restSeconds=readStore('ft-timer-default',90);"
      if(!code.includes(marker))throw new Error('V2.0.87 ActiveTraining marker not found')
      const loadPatch=marker+"const loadBook279=()=>readStore('ft-exercise-loads-v275',{});const bodyPlan279=item=>{const raw=String(item?.equipment||item?.name||'').toLowerCase();return item?.noWeight===true||/body|none|bodyweight|körpergewicht|liegestütz|klimmzug|pull.?up|push.?up|dip/.test(raw)};const planFor279=(item,setNo)=>{const saved=loadBook279()[item?.name]||{},savedSet=Array.isArray(saved.sets)?saved.sets[setNo-1]:null,direct=item?.plannedSets?.[setNo-1]||item?.smartRecommendation||null;return savedSet||direct||(Object.keys(saved).length?saved:null)};const currentPlan279=planFor279(current,set);const plannedText279=(()=>{if(!currentPlan279)return 'Noch keine Satzhistorie';const p=currentPlan279,r=Math.max(1,Number(p.reps)||10),rir=Number(p.rirTarget??2);if(bodyPlan279(current)){const extra=p.useExtra||Number(p.extraWeight)>0;return extra?r+' Wdh. · +'+(Number(p.extraWeight)||0)+' kg Zusatzgewicht · RIR '+rir:r+' Wdh. · Körpergewicht · RIR '+rir}const raw=String(current?.equipment||'').toLowerCase(),suffix=/dumbbell|kurzhantel/.test(raw)?' kg pro Arm':/barbell|langhantel/.test(raw)?' kg gesamt':' kg';return r+' Wdh. · '+(Number(p.weight)||0)+suffix+' · RIR '+rir})();useEffect(()=>{if(current?.warmup)return;const p=planFor279(current,set);if(!p)return;const savedReps=Number(p.reps),body=bodyPlan279(current);if(savedReps>0)setReps(savedReps);if(body)setWeight(p.useExtra||Number(p.extraWeight)>0?Number(p.extraWeight)||0:0);else if(Number(p.weight)>=0)setWeight(Number(p.weight)||0);setTip(p.reason?'Smart Trainer: '+p.reason:'Geplant · RIR '+Number(p.rirTarget??2))},[index,set,current?.name]);useEffect(()=>{writeStore('ft-active-set-logs-v277',[])},[]);"
      code=code.replace(marker,loadPatch)

      const oldBodyEffect="useEffect(()=>{if(bodyweightExercise)setWeight(0)},[index,bodyweightExercise]);"
      if(!code.includes(oldBodyEffect))throw new Error('V2.0.87 bodyweight target not found')
      code=code.replace(oldBodyEffect,"useEffect(()=>{if(bodyweightExercise&&!currentPlan279?.useExtra&&!Number(currentPlan279?.extraWeight))setWeight(0)},[index,bodyweightExercise,currentPlan279?.useExtra,currentPlan279?.extraWeight]);")

      const oldAdvance="const advance=()=>{if(set<(current.sets||3)){setSet(s=>s+1);return}setResting(true)};"
      const newAdvance="const advance=()=>{setResting(true)};const finishRest287=()=>{setResting(false);if(set<(current.sets||3)){setSet(s=>s+1);return}nextExercise()};"
      if(!code.includes(oldAdvance))throw new Error('V2.0.87 advance target not found')
      code=code.replace(oldAdvance,newAdvance)
      const oldRest="{resting&&<RestOverlay seconds={restSeconds} onSkip={nextExercise} onDone={nextExercise}/>}"
      const newRest="{resting&&<RestOverlay seconds={restSeconds} onSkip={finishRest287} onDone={finishRest287}/>}"
      if(!code.includes(oldRest))throw new Error('V2.0.87 rest overlay target not found')
      code=code.replace(oldRest,newRest)

      const setSlot='<span>SATZ {set} / {current.sets||3}</span><div>'
      if(!code.includes(setSlot))throw new Error('V2.0.87 set card target not found')
      code=code.replace(setSlot,'<span>SATZ {set} / {current.sets||3}</span><div className="planned-set-v279"><small>GEPLANT</small><strong>{plannedText279}</strong></div><div>')

      const oldWeight='<div className="weight-choice-v271">{weight===0?<button type="button" className="no-weight-v271" onClick={()=>setWeight(10)}>Kein Gewicht</button>:<label><input inputMode="decimal" value={weight} onChange={e=>setWeight(Number(e.target.value)||0)}/><small>kg</small></label>}<button type="button" className="weight-toggle-v271" onClick={()=>setWeight(weight===0?10:0)}>{weight===0?\'Gewicht verwenden\':\'Kein Gewicht\'}</button></div>'
      if(!code.includes(oldWeight))throw new Error('V2.0.87 weight field target not found')
      const newWeight='<div className="weight-choice-v271">{bodyweightExercise&&<small className="bodyweight-load-label-v279">{weight===0?\'Nur Körpergewicht\':\'Zusatzgewicht\'}</small>}{weight===0?<button type="button" className="no-weight-v271" onClick={()=>setWeight(bodyweightExercise?1:10)}>{bodyweightExercise?\'Nur Körpergewicht\':\'Kein Gewicht\'}</button>:<label><input inputMode="decimal" value={weight} onChange={e=>setWeight(Number(e.target.value)||0)}/><small>{bodyweightExercise?\'kg Zusatzgewicht\':\'kg\'}</small></label>}<button type="button" className="weight-toggle-v271" onClick={()=>setWeight(weight===0?(bodyweightExercise?1:10):0)}>{weight===0?(bodyweightExercise?\'Zusatzgewicht verwenden\':\'Gewicht verwenden\'):\'Kein Gewicht\'}</button></div>'
      code=code.replace(oldWeight,newWeight)

      const oldAdjust="const adjust=rir=>{let nr=reps,msg='So weitermachen.';if(rir<=1){nr=Math.max(6,reps-1);msg='Sehr hart – nächste Runde etwas weniger Wiederholungen.'}else if(rir===2)msg='Perfekt – beibehalten.';else if(rir===3){nr=Math.min(15,reps+1);msg='Eine Wiederholung mehr.'}else{nr=Math.min(15,reps+2);msg='Zu leicht – steigern.'}setReps(nr);setTip(msg);setRirOpen(false);advance()}"
      const newAdjust="const adjust=rir=>{const planned=currentPlan279||{},body=bodyPlan279(current),raw=String(current?.equipment||'').toLowerCase(),isDb=/dumbbell|kurzhantel/.test(raw),isBb=/barbell|langhantel/.test(raw),available=isDb?readStore('ft-dumbbell-weights',[]):isBb?readStore('ft-barbell-weights',[]):[],sorted=[...new Set((Array.isArray(available)?available:[]).map(Number).filter(v=>v>0))].sort((a,b)=>a-b),stepWeight=(value,dir)=>{if(!sorted.length)return value;let i=sorted.findIndex(v=>v===Number(value));if(i<0)i=sorted.reduce((best,v,j)=>Math.abs(v-Number(value))<Math.abs(sorted[best]-Number(value))?j:best,0);return sorted[Math.max(0,Math.min(sorted.length-1,i+dir))]},actualReps=Math.max(1,Number(reps)||1),actualWeight=Math.max(0,Number(weight)||0);let nr=actualReps,nw=actualWeight,msg='So weitermachen.';if(rir<=1){if(body&&actualWeight>0)nw=Math.max(0,actualWeight-1);else if(sorted.length)nw=stepWeight(actualWeight,-1);else nr=Math.max(1,actualReps-1);msg='Sehr hart – nächster Satz wird etwas leichter.'}else if(rir===2)msg='Perfekt – Belastung passt.';else if(rir===3){nr=actualReps+1;msg='Eine Wiederholung mehr.'}else{if(body&&actualWeight>0)nw=actualWeight+1;else if(sorted.length)nw=stepWeight(actualWeight,1);else nr=actualReps+2;msg='Zu leicht – nächster Satz wird gesteigert.'}const loads=loadBook279(),previous=loads[current.name]||{},count=Math.max(1,Number(current.sets)||3),oldSets=Array.isArray(previous.sets)?previous.sets:[],arr=Array.from({length:count},(_,i)=>({...oldSets[i]})),nextLoad={reps:nr,weight:body?0:nw,extraWeight:body?nw:0,useExtra:body&&nw>0,rirTarget:2};arr[set-1]={...arr[set-1],...nextLoad};if(set<count)arr[set]={...arr[set],...nextLoad};loads[current.name]={...previous,...nextLoad,sets:arr};writeStore('ft-exercise-loads-v275',loads);const logs=readStore('ft-active-set-logs-v277',[]);logs.push({exercise:current.name,exerciseIndex:index,set,plannedReps:Number(planned.reps)||null,plannedWeight:body?0:Number(planned.weight)||0,plannedExtraWeight:body?(Number(planned.extraWeight)||0):0,plannedRir:Number(planned.rirTarget??2),actualReps,actualWeight:body?0:actualWeight,actualExtraWeight:body?actualWeight:0,reps:actualReps,weight:body?0:actualWeight,extraWeight:body?actualWeight:0,loadType:body?(actualWeight>0?'bodyweight+extra':'bodyweight'):(isDb?'dumbbell':isBb?'barbell':'other'),rir:rir>=4?'4+':rir,rirTarget:Number(planned.rirTarget??2)});writeStore('ft-active-set-logs-v277',logs);setReps(nr);setWeight(nw);setTip(msg);setRirOpen(false);advance()}"
      if(!code.includes(oldAdjust))throw new Error('V2.0.87 RIR adjust target not found')
      code=code.replace(oldAdjust,newAdjust)

      const oldComplete="const complete=()=>{writeStore('ft-completed-workouts',[...readStore('ft-completed-workouts',[]),{date:Date.now(),exercises:exercises.length}].slice(-100));onComplete()}"
      const newComplete="const complete=()=>{const logs=readStore('ft-active-set-logs-v277',[]),old=readStore('ft-completed-workouts',[]),smart=selection?.some(x=>x?.smartRecommendation||x?.plannedSets);writeStore('ft-completed-workouts',[...old,{date:Date.now(),exercises:exercises.length,name:smart?'Smart Training':'Training',source:smart?'Smart Trainer':'Trainingsplan',kind:'strength',sets:logs,version:'V2.0.87'}].slice(-100));writeStore('ft-active-set-logs-v277',[]);window.FitTogetherCloud?.upload?.();onComplete()}"
      if(!code.includes(oldComplete))throw new Error('V2.0.87 complete target not found')
      code=code.replace(oldComplete,newComplete)

      return {code,map:null}
    }
  }
}
