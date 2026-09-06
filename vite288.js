export default function trainingResume288(){
  return {
    name:'training-resume-v289',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/App.jsx'))return null
      let next=code

      const restStart=next.indexOf('function RestOverlay(')
      const restEnd=next.indexOf('function SwapExerciseModal(',restStart)
      if(restStart<0||restEnd<0)throw new Error('V2.0.89 RestOverlay target not found')
      const rest289=`function RestOverlay({seconds,onSkip,onDone}){const total=Math.max(10,Number(seconds)||90);const savedDeadline=(()=>{try{return Number(JSON.parse(localStorage.getItem('ft-rest-deadline-v289')))||0}catch{return 0}})();const initialDeadline=savedDeadline>Date.now()?savedDeadline:Date.now()+total*1000;const[left,setLeft]=useState(()=>Math.max(0,Math.ceil((initialDeadline-Date.now())/1000)));const[base,setBase]=useState(total);const[deadline,setDeadline]=useState(initialDeadline);const[finish]=useState(()=>onDone);const[skip]=useState(()=>onSkip);useEffect(()=>{try{localStorage.setItem('ft-rest-deadline-v289',JSON.stringify(deadline))}catch{};let fired=false;let id;const clear=()=>{try{localStorage.removeItem('ft-rest-deadline-v289')}catch{}};const tick=()=>{const remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));setLeft(remaining);if(remaining<=0&&!fired){fired=true;if(id)clearInterval(id);clear();finish?.()}};const vis=()=>{if(document.visibilityState==='visible')tick()};id=setInterval(tick,250);document.addEventListener('visibilitychange',vis);tick();return()=>{if(id)clearInterval(id);document.removeEventListener('visibilitychange',vis)}},[deadline,finish]);const adjust=delta=>{const nextBase=Math.max(10,Math.min(600,base+delta));const actual=nextBase-base;if(!actual)return;setBase(nextBase);setDeadline(d=>{const nd=Math.max(Date.now()+1000,d+actual*1000);try{localStorage.setItem('ft-rest-deadline-v289',JSON.stringify(nd))}catch{};return nd});setLeft(v=>Math.max(1,v+actual));try{localStorage.setItem('ft-timer-default',JSON.stringify(nextBase))}catch{}};const doSkip=()=>{try{localStorage.removeItem('ft-rest-deadline-v289')}catch{};skip?.()};const fmt=v=>Math.floor(v/60)+':'+String(v%60).padStart(2,'0');return <div className="rest-overlay"><small>PAUSE</small><strong>{fmt(left)}</strong><span>Nächster Satz startet danach automatisch</span><div className="rest-adjust-v270"><button type="button" onClick={()=>adjust(-10)}>−10 Sek.</button><button type="button" onClick={()=>adjust(10)}>+10 Sek.</button></div><button onClick={doSkip}>Pause überspringen <ChevronRight size={18}/></button></div>}`
      next=next.slice(0,restStart)+rest289+'\n'+next.slice(restEnd)

      const activeStart="function ActiveTraining({onExit,onComplete,selection}){const[exercises,setExercises]=useState(()=>selection?.length?selection:defaultExercises),[index,setIndex]=useState(0),[set,setSet]=useState(1),[rirOpen,setRirOpen]=useState(false),[finished,setFinished]=useState(false),[weight,setWeight]=useState(10),[reps,setReps]=useState(10),[tip,setTip]=useState('Ziel: RIR 2'),[media,setMedia]=useState(null),[resting,setResting]=useState(false),[swapOpen,setSwapOpen]=useState(false),[dbItems,setDbItems]=useState([]);"
      const activeNew="function ActiveTraining({onExit,onComplete,selection}){const resume288=readStore('ft-active-training-v288',null),[exercises,setExercises]=useState(()=>resume288?.exercises?.length?resume288.exercises:(selection?.length?selection:defaultExercises)),[index,setIndex]=useState(()=>Math.max(0,Number(resume288?.index)||0)),[set,setSet]=useState(()=>Math.max(1,Number(resume288?.set)||1)),[rirOpen,setRirOpen]=useState(false),[finished,setFinished]=useState(false),[weight,setWeight]=useState(()=>Number(resume288?.weight??10)),[reps,setReps]=useState(()=>Math.max(1,Number(resume288?.reps)||10)),[tip,setTip]=useState(()=>resume288?.tip||'Ziel: RIR 2'),[media,setMedia]=useState(null),[resting,setResting]=useState(()=>!!resume288?.resting),[swapOpen,setSwapOpen]=useState(false),[dbItems,setDbItems]=useState([]),[startedAt288]=useState(()=>Number(resume288?.startedAt)||Date.now()),[elapsed288,setElapsed288]=useState(()=>Math.max(0,Math.floor((Date.now()-(Number(resume288?.startedAt)||Date.now()))/1000)));"
      if(!next.includes(activeStart))throw new Error('V2.0.89 ActiveTraining state target not found')
      next=next.replace(activeStart,activeNew)

      const marker="const current=exercises[index],restSeconds=readStore('ft-timer-default',90);"
      if(!next.includes(marker))throw new Error('V2.0.89 ActiveTraining marker not found')
      const persist="useEffect(()=>{const tick=()=>setElapsed288(Math.max(0,Math.floor((Date.now()-startedAt288)/1000)));tick();const id=setInterval(tick,1000);const vis=()=>tick();document.addEventListener('visibilitychange',vis);window.addEventListener('pageshow',vis);return()=>{clearInterval(id);document.removeEventListener('visibilitychange',vis);window.removeEventListener('pageshow',vis)}},[startedAt288]);useEffect(()=>{writeStore('ft-active-training-v288',{exercises,index,set,weight,reps,tip,resting,startedAt:startedAt288,updatedAt:Date.now()})},[exercises,index,set,weight,reps,tip,resting,startedAt288]);const fmtElapsed288=v=>{const h=Math.floor(v/3600),m=Math.floor(v%3600/60),s=v%60;return h>0?String(h)+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'):String(m)+':'+String(s).padStart(2,'0')};"
      next=next.replace(marker,marker+persist)

      const progress="<div className=\"training-progress\"><span>ÜBUNG {index+1} VON {exercises.length}</span><i><b style={{width:`${Math.max(4,progress)}%`}}/></i></div>"
      const progressNew="<div className=\"training-progress training-progress-v288\"><div><span>ÜBUNG {index+1} VON {exercises.length}</span><em>{fmtElapsed288(elapsed288)}</em></div><i><b style={{width:`${Math.max(4,progress)}%`}}/></i></div>"
      if(!next.includes(progress))throw new Error('V2.0.89 progress target not found')
      next=next.replace(progress,progressNew)

      const completeTarget="writeStore('ft-active-set-logs-v277',[]);window.FitTogetherCloud?.upload?.();onComplete()"
      if(!next.includes(completeTarget))throw new Error('V2.0.89 complete cleanup target not found')
      next=next.replace(completeTarget,"writeStore('ft-active-set-logs-v277',[]);try{localStorage.removeItem('ft-active-training-v288');localStorage.removeItem('ft-rest-deadline-v289')}catch{};window.FitTogetherCloud?.upload?.();onComplete()")

      const appStart="function App(){const[page,setPage]=useState('home'),[trainingOpen,setTrainingOpen]=useState(false),[activeTraining,setActiveTraining]=useState(false),[selection,setSelection]=useState([]);"
      const appNew="function App(){const resumeApp288=readStore('ft-active-training-v288',null),[page,setPage]=useState('home'),[trainingOpen,setTrainingOpen]=useState(false),[activeTraining,setActiveTraining]=useState(false),[selection,setSelection]=useState(()=>resumeApp288?.exercises||[]);"
      if(!next.includes(appStart))throw new Error('V2.0.89 App state target not found')
      next=next.replace(appStart,appNew)

      return {code:next,map:null}
    }
  }
}
