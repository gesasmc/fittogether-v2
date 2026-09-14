// FitTogether V2.0.157: import a complete training plan from pasted text and map exercises to the existing library.
const MUSCLES321=['abductors','abs','adductors','biceps','calves','cardio','delts','forearms','glutes','hamstrings','lats','levator-scapulae','pectorals','quads','serratus-anterior','spine','traps','triceps','upper-back']
const API321='https://raw.githubusercontent.com/JahelCuadrado/ExerciseGymGifsDB/main/api/en/muscles/'
const read321=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write321=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const norm321=s=>String(s||'').toLocaleLowerCase('de-DE').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim()
const pretty321=name=>String(name||'').replaceAll('-',' ').replace(/\bstationary bike\b/gi,'Fahrradergometer').replace(/\bexercise bike\b/gi,'Fahrradergometer').replace(/\bcycling\b/gi,'Radfahren').replace(/\browing machine\b/gi,'Rudergerät').replace(/\btreadmill\b/gi,'Laufband').replace(/\bbarbell\b/gi,'Langhantel').replace(/\bdumbbell\b/gi,'Kurzhantel').replace(/\bbench press\b/gi,'Bankdrücken').replace(/\bshoulder press\b/gi,'Schulterdrücken').replace(/\bbiceps curl\b/gi,'Bizeps-Curl').replace(/\btriceps\b/gi,'Trizeps').replace(/\bsquat\b/gi,'Kniebeuge').replace(/\bdeadlift\b/gi,'Kreuzheben').replace(/\blateral raise\b/gi,'Seitheben').replace(/\bpush up\b/gi,'Liegestütz').replace(/\bpull up\b/gi,'Klimmzug').replace(/\bleg press\b/gi,'Beinpresse').replace(/\bleg extension\b/gi,'Beinstrecken').replace(/\bleg curl\b/gi,'Beinbeugen').replace(/\bcalf raise\b/gi,'Wadenheben')
const isCardio321=x=>/cardio|cardiovascular|bike|bicycle|cycling|treadmill|rowing machine|rower/.test(`${x?.bodyPart||''} ${x?.muscle||''} ${x?.category||''} ${x?.name||''}`.toLowerCase())
const dayMap321={montag:'Mo',mo:'Mo',monday:'Mo',dienstag:'Di',di:'Di',tuesday:'Di',mittwoch:'Mi',mi:'Mi',wednesday:'Mi',donnerstag:'Do',do:'Do',thursday:'Do',freitag:'Fr',fr:'Fr',friday:'Fr',samstag:'Sa',sa:'Sa',saturday:'Sa',sonntag:'So',so:'So',sunday:'So'}
const fullDay321={Mo:'Montag',Di:'Dienstag',Mi:'Mittwoch',Do:'Donnerstag',Fr:'Freitag',Sa:'Samstag',So:'Sonntag'}
const alias321={
  'bankdruecken':['bench press'],'kurzhantel bankdruecken':['dumbbell bench press'],'langhantel bankdruecken':['barbell bench press'],
  'schraegbankdruecken':['incline bench press'],'kurzhantel schraegbankdruecken':['incline dumbbell bench press'],'langhantel schraegbankdruecken':['incline barbell bench press'],
  'schulterdruecken':['shoulder press'],'seitheben':['lateral raise'],'frontheben':['front raise'],'latziehen':['lat pulldown','pulldown'],
  'klimmzug':['pull up'],'klimmzuege':['pull up'],'rudern':['row'],'langhantelrudern':['barbell bent over row','barbell row'],'kurzhantelrudern':['dumbbell row'],
  'kniebeuge':['squat'],'kniebeugen':['squat'],'kreuzheben':['deadlift'],'rumaenisches kreuzheben':['romanian deadlift'],'beinpresse':['leg press'],
  'beinbeugen':['leg curl'],'beinstrecken':['leg extension'],'wadenheben':['calf raise'],'hip thrust':['hip thrust'],'hueftheben':['hip thrust'],
  'brust fliegende':['chest fly','dumbbell fly'],'fliegende':['fly'],'trizepsdruecken':['triceps pushdown'],'bizeps curl':['biceps curl'],'bizepscurls':['biceps curl'],
  'liegestuetz':['push up'],'liegestuetze':['push up'],'dips':['dip'],'plank':['plank'],'fahrrad':['stationary bike','exercise bike','cycling'],
  'fahrradergometer':['stationary bike','exercise bike'],'ergometer':['stationary bike','exercise bike'],'radfahren':['cycling'],'rudergeraet':['rowing machine','rower'],
  'laufband':['treadmill'],'laufen':['treadmill','running']
}
let db321=null
let dbPromise321=null
const loadDb321=()=>{
  if(db321)return Promise.resolve(db321)
  if(dbPromise321)return dbPromise321
  dbPromise321=Promise.all(MUSCLES321.map(m=>fetch(`${API321}${m}.json`).then(r=>r.ok?r.json():{exercises:[]}).then(g=>(g.exercises||[]).map(x=>({...x,muscle:x.muscle||m}))).catch(()=>[]))).then(parts=>{
    const map=new Map()
    parts.flat().forEach(x=>{const k=String(x?.id||x?.name||'').toLowerCase();if(k&&!map.has(k))map.set(k,x)})
    db321=[...map.values()]
    return db321
  }).catch(()=>[])
  return dbPromise321
}
const aliasesFor321=name=>{
  const n=norm321(name),out=[n]
  Object.entries(alias321).forEach(([k,vals])=>{if(n===k||n.includes(k)||k.includes(n))vals.forEach(v=>out.push(norm321(v)))})
  return[...new Set(out.filter(Boolean))]
}
const equipmentHint321=name=>{
  const n=norm321(name)
  if(/kurzhantel|dumbbell/.test(n))return'dumbbell'
  if(/langhantel|barbell/.test(n))return'barbell'
  if(/kabel|cable/.test(n))return'cable'
  if(/maschine|machine/.test(n))return'machine'
  if(/koerpergewicht|bodyweight/.test(n))return'body'
  return''
}
const rank321=(raw,items)=>{
  const variants=aliasesFor321(raw),hint=equipmentHint321(raw)
  return items.map(x=>{
    const en=norm321(x?.name),de=norm321(pretty321(x?.name)),eq=norm321(x?.equipment)
    let score=0
    variants.forEach(q=>{
      if(!q)return
      if(en===q||de===q)score=Math.max(score,120)
      else if(en.includes(q)||de.includes(q)||q.includes(en)||q.includes(de))score=Math.max(score,82)
      const qt=q.split(' ').filter(t=>t.length>2),hay=`${en} ${de}`,hits=qt.filter(t=>hay.includes(t)).length
      if(qt.length)score=Math.max(score,Math.round(hits/qt.length*55))
    })
    if(hint){if(eq.includes(hint))score+=18;else if(hint==='machine'&&/leverage|smith/.test(eq))score+=14;else score-=6}
    return{x,score}
  }).sort((a,b)=>b.score-a.score).slice(0,10)
}
const parseDay321=line=>{
  const clean=String(line||'').replace(/^#+\s*/,'').trim()
  const m=clean.match(/^(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|mo|di|mi|do|fr|sa|so|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b\s*(?:[-–—:|]\s*(.*))?$/i)
  if(m){const day=dayMap321[norm321(m[1])];return{day,title:m[2]?.trim()||fullDay321[day]}}
  const t=clean.match(/^tag\s*(\d+)\s*(?:[-–—:|]\s*(.*))?$/i)
  if(t)return{day:'',title:t[2]?.trim()||`Training ${t[1]}`}
  if(/^(push|pull|beine|legs|oberkoerper|unterkoerper|ganzkoerper|upper|lower)(\s+[a-z0-9]+)?$/i.test(norm321(clean)))return{day:'',title:clean}
  return null
}
const parseExercise321=line=>{
  let s=String(line||'').trim().replace(/^[•·▪◦*-]\s*/,'').replace(/^\d+[.)]\s*/,'').trim()
  if(!s)return null
  const raw=s
  let duration=null,sets=null,repsMin=null,repsMax=null,weight=null,rir=null
  const dur=s.match(/(\d+(?:[.,]\d+)?)\s*(min(?:ute[n]?)?|mins?)\b/i)
  if(dur){duration=Math.max(1,Math.round(Number(dur[1].replace(',','.'))));s=s.replace(dur[0],' ')}
  const sr=s.match(/(\d+)\s*[x×]\s*(\d+)(?:\s*[-–]\s*(\d+))?/i)||s.match(/(\d+)\s*(?:saetze|sätze|sets?)\s*(?:x|×|a|à)?\s*(\d+)(?:\s*[-–]\s*(\d+))?/i)
  if(sr){
    sets=Math.max(1,Math.min(8,Number(sr[1])))
    repsMin=Math.max(1,Number(sr[2]))
    repsMax=sr[3]?Math.max(repsMin,Number(sr[3])):repsMin
    s=s.replace(sr[0],' ')
  }else{
    const rr=s.match(/(\d+)(?:\s*[-–]\s*(\d+))?\s*(?:wdh\.?|wiederholungen|reps?)\b/i)
    if(rr){repsMin=Math.max(1,Number(rr[1]));repsMax=rr[2]?Math.max(repsMin,Number(rr[2])):repsMin;s=s.replace(rr[0],' ')}
  }
  const rirM=s.match(/\bRIR\s*[:=]?\s*(4\+|[0-4])/i)
  if(rirM){rir=rirM[1]==='4+'?4:Number(rirM[1]);s=s.replace(rirM[0],' ')}
  const kg=s.match(/([+]?[0-9]+(?:[.,][0-9]+)?)\s*kg(?:\s*\/\s*arm|\s*pro\s*arm|\s*je\s*arm|\s*gesamt)?/i)
  if(kg){weight=Number(kg[1].replace(',','.').replace('+',''));s=s.replace(kg[0],' ')}
  s=s.replace(/[(),;]+/g,' ').replace(/\s*[-–—|]\s*$/,'').replace(/\s{2,}/g,' ').trim()
  const name=s.replace(/\b(?:RIR|Gewicht|Dauer|Sätze|Saetze|Wdh)\b\s*[:=]?\s*$/i,'').trim()
  if(!name)return null
  return{raw,rawName:name,duration,sets:sets||3,repsMin:repsMin||10,repsMax:repsMax||repsMin||10,weight,rir:rir??2}
}
const parseText321=text=>{
  const lines=String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean)
  let name='',sessions=[],current=null
  for(let i=0;i<lines.length;i++){
    const line=lines[i]
    const planLine=line.match(/^(?:plan|trainingsplan)\s*[:\-–]\s*(.+)$/i)
    if(planLine&&!sessions.length){name=planLine[1].trim();continue}
    const day=parseDay321(line)
    if(day){current={title:day.title,day:day.day,exercises:[]};sessions.push(current);continue}
    const parsed=parseExercise321(line)
    if(!parsed)continue
    if(!current){
      if(!name&&sessions.length===0&&i===0&&!/\d/.test(line)){name=line;continue}
      current={title:'Training 1',day:'',exercises:[]}
      sessions.push(current)
    }
    current.exercises.push(parsed)
  }
  sessions=sessions.filter(s=>s.exercises.length)
  return{name:name||'Importierter Trainingsplan',sessions}
}
const mappedExercise321=(parsed,match)=>{
  if(!match)return null
  const cardio=isCardio321(match),image=match?.thumbUrl||match?.gifUrl||''
  const base={name:pretty321(match?.name||parsed.rawName),query:match?.name||parsed.rawName,equipment:match?.equipment||'',image,gifUrl:match?.gifUrl||image,thumbUrl:match?.thumbUrl||image,muscle:match?.muscle||'',bodyPart:match?.bodyPart||'',category:match?.category||''}
  if(cardio)return{...base,kind:'cardio',sets:1,reps:'',duration:parsed.duration||20}
  const repsText=parsed.repsMax!==parsed.repsMin?`${parsed.repsMin}–${parsed.repsMax}`:String(parsed.repsMin)
  const unilateral=/je seite|pro arm|je arm|einarm|einbein|single arm|single leg|one arm|one leg/i.test(`${parsed.raw} ${match?.name||''}`)
  const body=/body.?weight|körpergewicht|koerpergewicht/.test(String(match?.equipment||'').toLowerCase())
  const plannedSets=Array.from({length:parsed.sets},()=>({reps:parsed.repsMin,weight:body?0:(parsed.weight||0),extraWeight:body?(parsed.weight||0):0,useExtra:body&&!!parsed.weight,rirTarget:parsed.rir}))
  return{...base,sets:parsed.sets,reps:repsText,unilateral,plannedSets}
}
const el321=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!=null)el.textContent=text;return el}
const parsedMeta321=p=>p.duration?`${p.duration} Min.`:`${p.sets}×${p.repsMin}${p.repsMax!==p.repsMin?`–${p.repsMax}`:''} · RIR ${p.rir}${p.weight?` · ${p.weight} kg`:''}`
const refreshPlans321=()=>{
  const page=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.trim()==='Trainingspläne')
  const back=page?.querySelector('.sub-head button')
  if(!back)return
  back.click()
  setTimeout(()=>{const btn=[...document.querySelectorAll('.menu-list button')].find(b=>b.querySelector('strong')?.textContent?.trim()==='Trainingspläne');btn?.click()},80)
}
const saveImported321=(state,result,close)=>{
  const sessions=state.sessions.map((s,si)=>({
    title:s.day?(s.title&&norm321(s.title)!==norm321(fullDay321[s.day])?`${fullDay321[s.day]} · ${s.title}`:fullDay321[s.day]):s.title||`Training ${si+1}`,
    day:s.day||undefined,
    exercises:s.exercises.map(e=>mappedExercise321(e.parsed,e.match)).filter(Boolean),
  }))
  const plan={name:state.name.trim()||'Importierter Trainingsplan',days:sessions.length,minutes:60,sessions,weekdays:sessions.map(s=>s.day||null),createdAt:Date.now(),imported:true,source:'Textimport'}
  write321('ft-plans',[...read321('ft-plans',[]),plan])
  try{window.FitTogetherCloud?.upload?.()}catch{}
  result.replaceChildren(el321('div','plan-import-success-v321','✓ Plan gespeichert und mit der FitTogether-Übungsbibliothek verknüpft.'))
  setTimeout(()=>{close();refreshPlans321()},450)
}
const renderPreview321=(result,state,close)=>{
  result.replaceChildren()
  const rows=state.sessions.flatMap(s=>s.exercises)
  const unresolved=rows.filter(e=>!e.match).length
  const review=rows.filter(e=>e.match&&e.score<100).length
  const top=el321('div','plan-import-preview-head-v321')
  const label=el321('label')
  label.append(el321('span',null,'Planname'))
  const nameInput=el321('input')
  nameInput.value=state.name
  nameInput.oninput=()=>{state.name=nameInput.value}
  label.append(nameInput)
  const counts=el321('div')
  counts.append(el321('b',null,`${state.sessions.length} Tage`),el321('span',null,`${rows.length} Übungen`))
  top.append(label,counts)
  result.append(top)
  state.sessions.forEach((session,si)=>{
    const section=el321('section','plan-import-day-v321')
    const head=el321('div','plan-import-day-head-v321')
    const headText=el321('span')
    headText.append(el321('small',null,session.day?(fullDay321[session.day]||session.day):`TAG ${si+1}`),el321('strong',null,session.title))
    head.append(headText,el321('b',null,String(session.exercises.length)))
    section.append(head)
    session.exercises.forEach(entry=>{
      const cls=!entry.match?'bad':entry.score>=100?'good':'review'
      const row=el321('div',`plan-import-ex-v321 ${cls}`)
      const imageUrl=entry.match&&(entry.match.thumbUrl||entry.match.gifUrl)
      if(imageUrl){const img=el321('img');img.src=imageUrl;img.alt='';img.loading='lazy';row.append(img)}else row.append(el321('div','plan-import-noimg-v321','?'))
      const copy=el321('div','plan-import-ex-copy-v321')
      copy.append(el321('strong',null,entry.parsed.rawName),el321('small',null,parsedMeta321(entry.parsed)))
      const select=el321('select')
      const empty=el321('option',null,'Übung auswählen …');empty.value='';select.append(empty)
      let selected=''
      entry.ranked.forEach((r,ri)=>{const op=el321('option',null,`${pretty321(r.x.name)} · ${r.x.equipment||''}`);op.value=String(ri);if(entry.match===r.x)selected=op.value;select.append(op)})
      select.value=selected
      select.onchange=()=>{const idx=select.value===''?-1:Number(select.value);entry.match=idx>=0?entry.ranked[idx]?.x:null;entry.score=idx>=0?(entry.ranked[idx]?.score||0):0;renderPreview321(result,state,close)}
      copy.append(select)
      const status=!entry.match?'Nicht erkannt':entry.score>=100?'Erkannt':'Bitte prüfen'
      row.append(copy,el321('em',null,status))
      section.append(row)
    })
    result.append(section)
  })
  const summary=el321('div','plan-import-summary-v321')
  const status=unresolved?`${unresolved} nicht erkannt`:review?`${review} Zuordnung${review===1?'':'en'} bitte prüfen`:'Alle Übungen erkannt'
  const save=el321('button',null,'Plan speichern')
  save.type='button';save.disabled=unresolved>0
  save.onclick=()=>saveImported321(state,result,close)
  summary.append(el321('span',null,status),save)
  result.append(summary)
}
const openImport321=()=>{
  document.querySelector('.plan-import-backdrop-v321')?.remove()
  const ov=el321('div','plan-import-backdrop-v321')
  const sheet=el321('section','plan-import-v321')
  const head=el321('header')
  const headCopy=el321('div')
  headCopy.append(el321('small',null,'PLAN-IMPORT'),el321('h2',null,'Plan aus Text einfügen'),el321('p',null,'ChatGPT-Plan oder anderen Text einfügen. FitTogether erkennt Tage, Übungen, Sätze, Wiederholungen, Gewicht, RIR und Cardio-Zeit.'))
  const closeButton=el321('button',null,'×');closeButton.type='button'
  head.append(headCopy,closeButton)
  const body=el321('div','plan-import-body-v321')
  const textarea=el321('textarea')
  textarea.placeholder='Beispiel:\nMontag – Push\nBankdrücken 3×10, 9 kg, RIR 2\nSchulterdrücken 3×12\n\nMittwoch – Cardio\nFahrrad 35 Minuten'
  const analyze=el321('button','plan-import-analyze-v321','Plan analysieren');analyze.type='button'
  const result=el321('div','plan-import-result-v321')
  body.append(textarea,analyze,result);sheet.append(head,body);ov.append(sheet);document.body.append(ov)
  const close=()=>ov.remove()
  closeButton.onclick=close
  ov.addEventListener('click',e=>{if(e.target===ov)close()})
  analyze.onclick=async()=>{
    const text=textarea.value.trim()
    if(!text){result.replaceChildren(el321('p','plan-import-error-v321','Bitte zuerst einen Trainingsplan einfügen.'));return}
    result.replaceChildren(el321('div','plan-import-loading-v321','Übungsdatenbank wird abgeglichen …'))
    const parsed=parseText321(text)
    if(!parsed.sessions.length){result.replaceChildren(el321('p','plan-import-error-v321','Ich konnte keine Trainingstage mit Übungen erkennen. Schreibe z. B. „Montag – Push“ und darunter „Bankdrücken 3×10“.'));return}
    const db=await loadDb321()
    if(!db.length){result.replaceChildren(el321('p','plan-import-error-v321','Die Übungsdatenbank konnte gerade nicht geladen werden. Bitte später erneut versuchen.'));return}
    const state={name:parsed.name,sessions:parsed.sessions.map(session=>({...session,exercises:session.exercises.map(parsedEx=>{const ranked=rank321(parsedEx.rawName,db),best=ranked[0];return{parsed:parsedEx,ranked,match:best&&best.score>=24?best.x:null,score:best?.score||0}})}))}
    renderPreview321(result,state,close)
  }
}
const enhance321=()=>{
  if(document.querySelector('.active-training,.rest-overlay,.training-overlay,.plan-import-backdrop-v321'))return
  const page=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.trim()==='Trainingspläne')
  if(!page||page.querySelector('.plan-import-launch-v321'))return
  const b=el321('button','plan-import-launch-v321');b.type='button'
  const copy=el321('span');copy.append(el321('small',null,'PLAN-IMPORT'),el321('strong',null,'Plan aus Text importieren'),el321('em',null,'ChatGPT-Plan einfügen und Übungen automatisch zuordnen'))
  b.append(copy,el321('b',null,'Importieren'));b.onclick=openImport321
  const anchor=page.querySelector('.plan-editor-hint-v301')||page.querySelector('.page-head')
  anchor?.insertAdjacentElement('afterend',b)
}
let q321=false
const schedule321=()=>{if(q321)return;q321=true;requestAnimationFrame(()=>{q321=false;enhance321()})}
if(typeof document!=='undefined'){
  const start=()=>{enhance321();new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length||x.removedNodes.length))schedule321()}).observe(document.body,{childList:true,subtree:true});window.addEventListener('pageshow',schedule321)}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
