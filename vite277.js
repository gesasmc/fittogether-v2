export default function trainingMemory277(){
  return {
    name:'training-memory-v277',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/App.jsx'))return null

      const marker="const current=exercises[index],restSeconds=readStore('ft-timer-default',90);"
      if(!code.includes(marker))throw new Error('V2.0.77 ActiveTraining marker not found')
      const loadPatch=marker+"useEffect(()=>{const all=readStore('ft-exercise-loads-v275',{}),saved=all[current?.name]||readStore('ft-exercise-loads-v247',{})[current?.name];if(saved){const first=Array.isArray(saved.sets)?saved.sets[0]:null;const savedReps=Number(first?.reps??saved.reps);const savedWeight=Number(first?.weight??saved.weight);if(savedReps>0)setReps(savedReps);if(savedWeight>=0)setWeight(savedWeight)}else{const planned=Array.isArray(current?.plannedSets)?current.plannedSets[0]:current?.smartRecommendation;if(planned){if(Number(planned.reps)>0)setReps(Number(planned.reps));if(Number(planned.weight)>=0)setWeight(Number(planned.weight))}}},[index,current?.name]);useEffect(()=>{writeStore('ft-active-set-logs-v277',[])},[]);"
      code=code.replace(marker,loadPatch)

      const oldAdjust="const adjust=rir=>{let nr=reps,msg='So weitermachen.';if(rir<=1){nr=Math.max(6,reps-1);msg='Sehr hart – nächste Runde etwas weniger Wiederholungen.'}else if(rir===2)msg='Perfekt – beibehalten.';else if(rir===3){nr=Math.min(15,reps+1);msg='Eine Wiederholung mehr.'}else{nr=Math.min(15,reps+2);msg='Zu leicht – steigern.'}setReps(nr);setTip(msg);setRirOpen(false);advance()}"
      const newAdjust="const adjust=rir=>{const performedReps=reps,performedWeight=weight;let nr=reps,msg='So weitermachen.';if(rir<=1){nr=Math.max(1,reps-1);msg='Sehr hart – nächste Runde etwas weniger Wiederholungen.'}else if(rir===2)msg='Perfekt – beibehalten.';else if(rir===3){nr=reps+1;msg='Eine Wiederholung mehr.'}else{nr=reps+2;msg='Zu leicht – steigern.'}const loads=readStore('ft-exercise-loads-v275',{}),previous=loads[current.name]||{},count=Math.max(1,Number(current.sets)||3),oldSets=Array.isArray(previous.sets)?previous.sets:[];loads[current.name]={...previous,reps:nr,weight:performedWeight,sets:Array.from({length:count},(_,i)=>({...oldSets[i],reps:nr,weight:performedWeight,rirTarget:2}))};writeStore('ft-exercise-loads-v275',loads);const logs=readStore('ft-active-set-logs-v277',[]);logs.push({exercise:current.name,exerciseIndex:index,set,weight:performedWeight,reps:performedReps,rir:rir>=4?'4+':rir,rirTarget:2});writeStore('ft-active-set-logs-v277',logs);setReps(nr);setTip(msg);setRirOpen(false);advance()}"
      if(!code.includes(oldAdjust))throw new Error('V2.0.77 RIR adjust target not found')
      code=code.replace(oldAdjust,newAdjust)

      const oldComplete="const complete=()=>{writeStore('ft-completed-workouts',[...readStore('ft-completed-workouts',[]),{date:Date.now(),exercises:exercises.length}].slice(-100));onComplete()}"
      const newComplete="const complete=()=>{const logs=readStore('ft-active-set-logs-v277',[]),old=readStore('ft-completed-workouts',[]);writeStore('ft-completed-workouts',[...old,{date:Date.now(),exercises:exercises.length,name:'Training',source:'Trainingsplan',kind:'strength',sets:logs,version:'V2.0.77'}].slice(-100));writeStore('ft-active-set-logs-v277',[]);window.FitTogetherCloud?.upload?.();onComplete()}"
      if(!code.includes(oldComplete))throw new Error('V2.0.77 complete target not found')
      code=code.replace(oldComplete,newComplete)

      return {code,map:null}
    }
  }
}
