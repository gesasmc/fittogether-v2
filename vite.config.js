import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import trainingMemory277 from './vite277.js'
import trainingResume288 from './vite288.js'
import smartTrainer350 from './vite350.js'

const appBridge286=()=>({
  name:'app-bridge-v286',
  enforce:'pre',
  transform(code,id){
    if(!id.endsWith('/src/App.jsx'))return null
    let next=code.replace("onChange={e=>setProfile({...profile,goal:e.target.value)}>","onChange={e=>setProfile({...profile,goal:e.target.value})}>")
    next=next.replace("useEffect(()=>{window.FitTogetherStartNormalTraining=items=>openTraining(Array.isArray(items)?items:[]);return()=>{delete window.FitTogetherStartNormalTraining}},[]);","")
    const marker="openTraining=(items=[])=>{setSelection(items);setTrainingOpen(true)};"
    if(!next.includes(marker))throw new Error('V2.0.86 openTraining marker not found')
    next=next.replace(marker,marker+"if(typeof window!=='undefined')window.FitTogetherStartNormalTraining=items=>openTraining(Array.isArray(items)?items:[]);")
    return {code:next,map:null}
  },
})

const exerciseLibrary111=()=>({
  name:'exercise-library-v2111',
  enforce:'pre',
  transform(code,id){
    if(!id.endsWith('/src/App.jsx'))return null
    let next=code
    const importLine="import { isYogaExercise111, loadRepDbSupplement111, mergeExerciseSources111 } from './exerciseLibrary111.js'\n"
    if(!next.includes('exerciseLibrary111.js'))next=importLine+next
    const oldLoader="const loadExerciseDb=()=>exerciseDbPromise||(exerciseDbPromise=Promise.all(MUSCLES.map(m=>fetch(`${API_BASE}${m}.json`).then(r=>r.json()))).then(gs=>gs.flatMap(g=>g.exercises||[])))"
    const newLoader="const loadExerciseDb=()=>exerciseDbPromise||(exerciseDbPromise=Promise.all([Promise.all(MUSCLES.map(m=>fetch(`${API_BASE}${m}.json`).then(r=>r.json()))).then(gs=>gs.flatMap(g=>g.exercises||[])),loadRepDbSupplement111()]).then(([primary,extra])=>mergeExerciseSources111(primary,extra)))"
    if(!next.includes(oldLoader))throw new Error('V2.0.111 exercise loader target not found')
    next=next.replace(oldLoader,newLoader)
    const oldKinds="const isCardio=x=>String(x.bodyPart).toLowerCase()==='cardio'||String(x.muscle).toLowerCase()==='cardio'||['cardio','cardiovascular'].includes(String(x.category).toLowerCase())\nconst isStretch=x=>{const n=String(x.name||'').toLowerCase(),c=String(x.category||'').toLowerCase();return !isCardio(x)&&(c==='stretching'||n.includes('stretch'))}\nconst yogaNames=['sphinx','pike to cobra push up','pelvic tilt into bridge']\nconst isYoga=x=>yogaNames.includes(String(x.name||'').toLowerCase())\nconst isStrength=x=>!isCardio(x)&&!isStretch(x)&&!isYoga(x)"
    const newKinds="const isCardio=x=>String(x.bodyPart).toLowerCase()==='cardio'||String(x.muscle).toLowerCase()==='cardio'||['cardio','cardiovascular'].includes(String(x.category).toLowerCase())\nconst isYoga=x=>isYogaExercise111(x)\nconst isStretch=x=>{const n=String(x.name||'').toLowerCase(),c=String(x.category||'').toLowerCase();return !isCardio(x)&&!isYoga(x)&&(c==='stretching'||n.includes('stretch'))}\nconst isStrength=x=>!isCardio(x)&&!isStretch(x)&&!isYoga(x)"
    if(!next.includes(oldKinds))throw new Error('V2.0.111 exercise kind target not found')
    next=next.replace(oldKinds,newKinds)
    const cap='.slice(0,80);if(selected)return <ExerciseDetail'
    if(!next.includes(cap))throw new Error('V2.0.111 exercise cap target not found')
    next=next.replace(cap,';if(selected)return <ExerciseDetail')
    return {code:next,map:null}
  },
})

const workoutExperience271=()=>({
  name:'workout-experience-v271',
  enforce:'pre',
  transform(code,id){
    if(!id.endsWith('/src/App.jsx'))return null
    let next=code
    return {code:next,map:null}
  },
})

export default defineConfig({
  plugins: [appBridge286(),exerciseLibrary111(),workoutExperience271(),smartTrainer350(),trainingMemory277(),trainingResume288(),react()],
})
