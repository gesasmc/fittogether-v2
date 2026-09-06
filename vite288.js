export default function trainingResume288(){
  return {
    name:'training-resume-v288',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/App.jsx'))return null
      let next=code

      const activeStart="function ActiveTraining({onExit,onComplete,selection}){const[exercises,setExercises]=useState(()=>selection?.length?selection:defaultExercises),[index,setIndex]=useState(0),[set,setSet]=useState(1),[rirOpen,setRirOpen]=useState(false),[finished,setFinished]=useState(false),[weight,setWeight]=useState(10),[reps,setReps]=useState(10),[tip,setTip]=useState('Ziel: RIR 2'),[media,setMedia]=useState(null),[resting,setResting]=useState(false),[swapOpen,setSwapOpen]=useState(false),[dbItems,setDbItems]=useState([]);"
      const activeNew="function ActiveTraining({onExit,onComplete,selection}){const resume288=readStore('ft-active-training-v288',null),[exercises,setExercises]=useState(()=>resume288?.exercises?.length?resume288.exercises:(selection?.length?selection:defaultExercises)),[index,setIndex]=useState(()=>Math.max(0,Number(resume288?.index)||0)),[set,setSet]=useState(()=>Math.max(1,Number(resume288?.set)||1)),[rirOpen,setRirOpen]=useState(false),[finished,setFinished]=useState(false),[weight,setWeight]=useState(()=>Number(resume288?.weight??10)),[reps,setReps]=useState(()=>Math.max(1,Number(resume288?.reps)||10)),[tip,setTip]=useState(()=>resume288?.tip||'Ziel: RIR 2'),[media,setMedia]=useState(null),[resting,setResting]=useState(false),[swapOpen,setSwapOpen]=useState(false),[dbItems,setDbItems]=useState([]),[startedAt288]=useState(()=>Number(resume288?.startedAt)||Date.now()),[elapsed288,setElapsed288]=useState(()=>Math.max(0,Math.floor((Date.now()-(Number(resume288?.startedAt)||Date.now()))/1000)));"
      if(!next.includes(activeStart))throw new Error('V2.0.88 ActiveTraining state target not found')
      next=next.replace(activeStart,activeNew)

      const marker="const current=exercises[index],restSeconds=readStore('ft-timer-default',90);"
      if(!next.includes(marker))throw new Error('V2.0.88 ActiveTraining marker not found')
      const persist="useEffect(()=>{const tick=()=>setElapsed288(Math.max(0,Math.floor((Date.now()-startedAt288)/1000)));tick();const id=setInterval(tick,1000);const vis=()=>tick();document.addEventListener('visibilitychange',vis);return()=>{clearInterval(id);document.removeEventListener('visibilitychange',vis)}},[startedAt288]);useEffect(()=>{writeStore('ft-active-training-v288',{exercises,index,set,weight,reps,tip,startedAt:startedAt288,updatedAt:Date.now()})},[exercises,index,set,weight,reps,tip,startedAt288]);const fmtElapsed288=v=>{const h=Math.floor(v/3600),m=Math.floor(v%3600/60),s=v%60;return h>0?String(h)+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'):String(m)+':'+String(s).padStart(2,'0')};"
      next=next.replace(marker,marker+persist)

      const progress="<div className=\"training-progress\"><span>ÜBUNG {index+1} VON {exercises.length}</span><i><b style={{width:`${Math.max(4,progress)}%`}}/></i></div>"
      const progressNew="<div className=\"training-progress training-progress-v288\"><div><span>ÜBUNG {index+1} VON {exercises.length}</span><em>{fmtElapsed288(elapsed288)}</em></div><i><b style={{width:`${Math.max(4,progress)}%`}}/></i></div>"
      if(!next.includes(progress))throw new Error('V2.0.88 progress target not found')
      next=next.replace(progress,progressNew)

      const completeTarget="writeStore('ft-active-set-logs-v277',[]);window.FitTogetherCloud?.upload?.();onComplete()"
      if(!next.includes(completeTarget))throw new Error('V2.0.88 complete cleanup target not found')
      next=next.replace(completeTarget,"writeStore('ft-active-set-logs-v277',[]);try{localStorage.removeItem('ft-active-training-v288')}catch{};window.FitTogetherCloud?.upload?.();onComplete()")

      const appStart="function App(){const[page,setPage]=useState('home'),[trainingOpen,setTrainingOpen]=useState(false),[activeTraining,setActiveTraining]=useState(false),[selection,setSelection]=useState([]);"
      const appNew="function App(){const resumeApp288=readStore('ft-active-training-v288',null),[page,setPage]=useState('home'),[trainingOpen,setTrainingOpen]=useState(false),[activeTraining,setActiveTraining]=useState(()=>!!resumeApp288?.exercises?.length),[selection,setSelection]=useState(()=>resumeApp288?.exercises||[]);"
      if(!next.includes(appStart))throw new Error('V2.0.88 App state target not found')
      next=next.replace(appStart,appNew)

      return {code:next,map:null}
    }
  }
}
