import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import trainingMemory277 from './vite277.js'
import trainingResume288 from './vite288.js'

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

// Stable pause timer: deadline-based, isolated from parent re-renders and
// persistent ±10 second adjustments for the current and following pauses.
const stableRestOverlay=`function RestOverlay({seconds,onSkip,onDone}){const total=Math.max(10,Number(seconds)||90);const[left,setLeft]=useState(total);const[base,setBase]=useState(total);const[deadline,setDeadline]=useState(()=>Date.now()+total*1000);const[finish]=useState(()=>onDone);const[skip]=useState(()=>onSkip);useEffect(()=>{let fired=false;let id;const tick=()=>{const next=Math.max(0,Math.ceil((deadline-Date.now())/1000));setLeft(next);if(next<=0&&!fired){fired=true;if(id)clearInterval(id);finish?.()}};id=setInterval(tick,250);tick();return()=>{fired=true;if(id)clearInterval(id)}},[deadline,finish]);const adjust=delta=>{const nextBase=Math.max(10,Math.min(600,base+delta));const actual=nextBase-base;if(!actual)return;setBase(nextBase);setDeadline(d=>Math.max(Date.now()+1000,d+actual*1000));setLeft(v=>Math.max(1,v+actual));try{localStorage.setItem('ft-timer-default',JSON.stringify(nextBase))}catch{}};const fmt=v=>Math.floor(v/60)+':'+String(v%60).padStart(2,'0');return <div className="rest-overlay"><small>PAUSE</small><strong>{fmt(left)}</strong><span>Nächste Übung startet danach automatisch</span><div className="rest-adjust-v270"><button type="button" onClick={()=>adjust(-10)}>−10 Sek.</button><button type="button" onClick={()=>adjust(10)}>+10 Sek.</button></div><button onClick={()=>skip?.()}>Pause überspringen <ChevronRight size={18}/></button></div>}`

const stableRestTimer=()=>({
  name:'stable-rest-timer',
  enforce:'pre',
  transform(code,id){
    if(!id.endsWith('/src/App.jsx'))return null
    const restStart=code.indexOf('function RestOverlay(')
    const restEnd=code.indexOf('function SwapExerciseModal(',restStart)
    if(restStart<0||restEnd<0)throw new Error('Stable rest timer patch target not found')
    return {code:code.slice(0,restStart)+stableRestOverlay+'\n'+code.slice(restEnd),map:null}
  },
})

const workoutExperience271=()=>({
  name:'workout-experience-v271',
  enforce:'pre',
  transform(code,id){
    if(!id.endsWith('/src/App.jsx'))return null

    const workStart=code.indexOf('function Workouts(')
    const workEnd=code.indexOf('function FreeTraining(',workStart)
    if(workStart<0||workEnd<0)throw new Error('V2.0.72 Workouts patch target not found')

    const newWorkouts=`function Workouts({onStart,onOpen}){const plans=readStore('ft-plans',[]),activePlan=plans.at(-1)||null,[quickOpen,setQuickOpen]=useState(false),[focus,setFocus]=useState(()=>readStore('ft-quickstart-settings-v271',{}).focus||'Ganzkörper'),[minutes,setMinutes]=useState(()=>readStore('ft-quickstart-settings-v271',{}).minutes||45),[equipment,setEquipment]=useState(()=>{const saved=readStore('ft-quickstart-settings-v271',{}).equipment||readStore('ft-available-equipment-v238',null);return saved||{bodyweight:true,dumbbell:readStore('ft-dumbbell-weights',[]).length>0,barbell:readStore('ft-barbell-weights',[]).length>0,band:false,machine:false,treadmill:false,bike:false,rower:false}}),[building,setBuilding]=useState(false);const toggleEq=k=>setEquipment(v=>({...v,[k]:!v[k]}));const eqKey=e=>{const s=String(e||'').toLowerCase();if(/treadmill|laufband/.test(s))return'treadmill';if(/stationary bike|exercise bike|bicycle|cycling|cycle|ergometer|fahrrad/.test(s))return'bike';if(/rowing machine|rower|rudergerät/.test(s))return'rower';if(/dumbbell/.test(s))return'dumbbell';if(/barbell|ez bar/.test(s))return'barbell';if(/band/.test(s))return'band';if(/cable|machine|smith|leverage/.test(s))return'machine';if(/body|none|bodyweight|^$/.test(s))return'bodyweight';return'other'};const focusPass=x=>{const m=String(x?.muscle||'').toLowerCase(),b=String(x?.bodyPart||'').toLowerCase(),n=String(x?.name||'').toLowerCase();if(focus==='Ganzkörper')return true;if(focus==='Brust')return /pector|chest/.test(m+' '+b+' '+n);if(focus==='Rücken')return /lat|back|spine|trap/.test(m+' '+b+' '+n);if(focus==='Beine')return /quad|glute|hamstring|calf|adductor|abductor|leg/.test(m+' '+b+' '+n);if(focus==='Schultern')return /delt|shoulder/.test(m+' '+b+' '+n);if(focus==='Arme')return /biceps|triceps|forearm|arm/.test(m+' '+b+' '+n);if(focus==='Push')return /pector|chest|delt|shoulder|triceps/.test(m+' '+b+' '+n);if(focus==='Pull')return /lat|back|trap|biceps|forearm/.test(m+' '+b+' '+n);return true};const buildQuick=async()=>{setBuilding(true);try{const items=await loadExerciseDb(),allowed=items.filter(isStrength).filter(focusPass).filter(x=>{const k=eqKey(x.equipment);return k!=='other'&&equipment[k]!==false});const count=Math.max(3,Math.min(8,Math.round(Number(minutes)/10)+1)),seed=Date.now()%997,used=new Set(),picked=[];for(let i=0;i<allowed.length&&picked.length<count;i++){const x=allowed[(seed+i*37)%allowed.length];const key=String(x.id||x.name);if(used.has(key))continue;used.add(key);picked.push(x)};if(!picked.length)return;const selection=picked.map(x=>({name:germanName(x.name),query:x.name,sets:Number(minutes)<=20?2:3,reps:'8–12',equipment:x.equipment||'',image:x.thumbUrl||x.gifUrl||'',gifUrl:x.gifUrl||'',thumbUrl:x.thumbUrl||'',muscle:x.muscle||'',source:'Quickstart',noWeight:eqKey(x.equipment)==='bodyweight'}));writeStore('ft-quickstart-settings-v271',{focus,minutes,equipment});setQuickOpen(false);onStart(selection)}finally{setBuilding(false)}};const firstSession=activePlan?.sessions?.[0],firstExercises=typeof firstSession==='string'?[ex(firstSession,3,'8–12')]:firstSession?.exercises||[];return <section className="page"><div className="page-head"><small>TRAINING</small><h1>Deine Workouts</h1><p>Krafttraining, Cardio, Yoga, Dehnen oder eigener Plan.</p></div>{activePlan?<button className="plan-first-v271" onClick={()=>firstExercises.length?onStart(firstExercises):onOpen('plans')}><div><small>DEIN TRAININGSPLAN</small><h2>{activePlan.name||'Gespeicherter Plan'}</h2><p>{firstSession?.title?'Nächstes Training · '+firstSession.title:String(activePlan.days||activePlan.sessions?.length||1)+' Trainingstage'}</p></div><span><Play size={20}/></span></button>:null}<button className={activePlan?'quickstart-secondary-v271':'hero-workout'} onClick={()=>setQuickOpen(true)}><div><small>SCHNELLSTART</small><h2>Training zusammenstellen</h2><p>Muskelbereich · Dauer · Ausstattung</p></div><span><Play size={20}/></span></button><button className="coach-card" onClick={()=>onOpen('coach')}><Brain size={24}/><span><small>SMARTER TRAINER</small><strong>Trainingsplan erstellen lassen</strong><em>Mit Zeitvorgabe, Dehn-Aufwärmen und mehreren Übungen</em></span><ChevronRight size={18}/></button><div className="section-title"><span>Bereiche</span></div><div className="menu-list"><button onClick={()=>onOpen('free')}><Dumbbell size={20}/><span><strong>Freies Training</strong><small>Übungen selbst zusammenstellen</small></span><ChevronRight size={18}/></button><button onClick={()=>onOpen('plans')}><List size={22}/><span><strong>Trainingspläne</strong><small>Deine Wochenpläne verwalten</small></span><ChevronRight size={18}/></button><button onClick={()=>onOpen('exercises')}><Search size={20}/><span><strong>Übungen</strong><small>Kraft · Cardio · Yoga · Dehnen</small></span><ChevronRight size={18}/></button></div>{quickOpen&&<div className="quickstart-backdrop-v271"><div className="quickstart-card-v271"><div className="quickstart-head-v271"><div><small>SCHNELLSTART</small><h2>Training zusammenstellen</h2></div><button type="button" onClick={()=>setQuickOpen(false)}><X size={20}/></button></div><label><span>Was möchtest du trainieren?</span><select value={focus} onChange={e=>setFocus(e.target.value)}>{['Ganzkörper','Brust','Rücken','Beine','Schultern','Arme','Push','Pull'].map(x=><option key={x}>{x}</option>)}</select></label><div className="quickstart-section-v271"><span>Dauer</span><div className="quickstart-time-v271">{[15,30,45,60,75,90].map(v=><button type="button" key={v} className={minutes===v?'active':''} onClick={()=>setMinutes(v)}>{v} Min.</button>)}</div></div><div className="quickstart-section-v271"><span>Ausstattung für dieses Training</span><div className="quickstart-equipment-v271">{[['bodyweight','Körpergewicht'],['dumbbell','Kurzhantel'],['barbell','Langhantel'],['band','Band'],['machine','Kabel/Maschine'],['treadmill','Laufband'],['bike','Fahrrad/Ergometer'],['rower','Rudergerät']].map(([k,t])=><button type="button" key={k} className={equipment[k]?'active':''} onClick={()=>toggleEq(k)}>{equipment[k]?'✓ ':''}{t}</button>)}</div></div><button type="button" className="quickstart-build-v271" disabled={building||!Object.values(equipment).some(Boolean)} onClick={buildQuick}>{building?'Training wird erstellt …':'Training erstellen'}</button></div></div>}</section>}`

    let next=code.slice(0,workStart)+newWorkouts+'\n'+code.slice(workEnd)

    const appTarget="{page==='workouts'&&<Workouts onStart={()=>openTraining()} onOpen={go}/>}"
    if(!next.includes(appTarget))throw new Error('V2.0.72 App Workouts target not found')
    next=next.replace(appTarget,"{page==='workouts'&&<Workouts onStart={openTraining} onOpen={go}/>}")

    const activeMarker="const current=exercises[index],restSeconds=readStore('ft-timer-default',90);"
    if(!next.includes(activeMarker))throw new Error('V2.0.72 ActiveTraining marker not found')
    next=next.replace(activeMarker,activeMarker+"const equipmentName=String(media?.equipment||current?.equipment||'').toLowerCase(),bodyweightExercise=current?.noWeight===true||/body|none|bodyweight/.test(equipmentName);useEffect(()=>{if(bodyweightExercise)setWeight(0)},[index,bodyweightExercise]);")

    const weightBlock=`<label><input inputMode="decimal" value={weight} onChange={e=>setWeight(Number(e.target.value)||0)}/><small>kg</small></label>`
    const newWeightBlock=`<div className="weight-choice-v271">{weight===0?<button type="button" className="no-weight-v271" onClick={()=>setWeight(10)}>Kein Gewicht</button>:<label><input inputMode="decimal" value={weight} onChange={e=>setWeight(Number(e.target.value)||0)}/><small>kg</small></label>}<button type="button" className="weight-toggle-v271" onClick={()=>setWeight(weight===0?10:0)}>{weight===0?'Gewicht verwenden':'Kein Gewicht'}</button></div>`
    if(!next.includes(weightBlock))throw new Error('V2.0.72 weight field target not found')
    next=next.replace(weightBlock,newWeightBlock)

    return {code:next,map:null}
  },
})

export default defineConfig({
  plugins: [appBridge286(),exerciseLibrary111(),stableRestTimer(),workoutExperience271(),trainingMemory277(),trainingResume288(),react()],
})
