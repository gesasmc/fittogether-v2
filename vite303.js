export default function trainingCompletion303(){
  return {
    name:'training-completion-v303',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/App.jsx'))return null
      const oldComplete="const complete=()=>{const logs=readStore('ft-active-set-logs-v277',[]),old=readStore('ft-completed-workouts',[]),smart=selection?.some(x=>x?.smartRecommendation||x?.plannedSets);writeStore('ft-completed-workouts',[...old,{date:Date.now(),exercises:exercises.length,name:smart?'Smart Training':'Training',source:smart?'Smart Trainer':'Trainingsplan',kind:logs.length&&logs.every(x=>x?.kind==='cardio')?'cardio':'strength',sets:logs,version:'V2.0.122'}].slice(-100));writeStore('ft-active-set-logs-v277',[]);window.FitTogetherCloud?.upload?.();onComplete()}"
      if(!code.includes(oldComplete))throw new Error('V2.0.124 completion target not found')
      const nextComplete="const complete=()=>{const logs=readStore('ft-active-set-logs-v277',[]),old=readStore('ft-completed-workouts',[]),smart=selection?.some(x=>x?.smartRecommendation||x?.plannedSets),cardioOnly=logs.length>0&&logs.every(x=>x?.kind==='cardio'||x?.loadType==='cardio'),cardioSeconds=cardioOnly?logs.reduce((a,x)=>a+(Number(x?.durationSeconds)||Number(x?.durationMinutes)*60||0),0):0,cardioNames=[...new Set(logs.filter(x=>x?.kind==='cardio'||x?.loadType==='cardio').map(x=>x?.exercise).filter(Boolean))],strengthNames=[...new Set(logs.filter(x=>x?.kind!=='cardio'&&x?.loadType!=='cardio').map(x=>x?.exercise).filter(Boolean))],doneNames=cardioOnly?cardioNames:[...strengthNames,...cardioNames],entry={date:Date.now(),exercises:doneNames.length||exercises.length,name:cardioOnly?(cardioNames.length===1?cardioNames[0]:'Cardio'):(smart?'Smart Training':'Training'),source:cardioOnly?'Cardio':(smart?'Smart Trainer':'Trainingsplan'),kind:cardioOnly?'cardio':'strength',sets:logs,version:'V2.0.124'};if(cardioOnly&&cardioSeconds>0){entry.actualSeconds=cardioSeconds;entry.durationSeconds=cardioSeconds}writeStore('ft-completed-workouts',[...old,entry].slice(-100));writeStore('ft-active-set-logs-v277',[]);window.FitTogetherCloud?.upload?.();onComplete()}"
      return {code:code.replace(oldComplete,nextComplete),map:null}
    }
  }
}
