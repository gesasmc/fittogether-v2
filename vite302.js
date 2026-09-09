export default function cardioSearch302(){
  return {
    name:'cardio-search-v302',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/App.jsx'))return null
      let next=code

      const exercisesMarker='function Exercises({onBack})'
      if(!next.includes(exercisesMarker))throw new Error('V2.0.120 Exercises target not found')
      const helpers=`const normSearch302=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9äöüß]+/g,' ').trim()\nconst exerciseMatches302=(x,q)=>{const n=normSearch302(q);if(!n)return true;const hay=normSearch302([x?.name,germanName(x?.name),x?.muscle,x?.bodyPart,x?.equipment].filter(Boolean).join(' '));if(hay.includes(n))return true;const aliases=[];if(/fahrrad|ergometer/.test(n))aliases.push('bike','bicycle','cycle','cycling','stationary bike','ergometer');if(/ruder|rudern/.test(n))aliases.push('rower','rowing','rowing machine');if(/laufband|laufen/.test(n))aliases.push('treadmill','running');if(/kurzhantel/.test(n))aliases.push('dumbbell');if(/langhantel/.test(n))aliases.push('barbell');return aliases.some(a=>hay.includes(normSearch302(a)))}\nconst cardioQuery302=x=>{const t=normSearch302([x?.name,x?.query,x?.equipment].filter(Boolean).join(' '));if(/fahrrad|ergometer|bike|bicycle|cycle|cycling/.test(t))return'stationary bike';if(/ruder|rower|rowing/.test(t))return'rowing machine';if(/laufband|treadmill/.test(t))return'treadmill';return x?.query||x?.name}\n`
      next=next.replace(exercisesMarker,helpers+exercisesMarker)

      const oldSearch="(!query||`${x.name} ${germanName(x.name)}`.toLowerCase().includes(query.toLowerCase()))"
      if(!next.includes(oldSearch))throw new Error('V2.0.120 exercise search predicate not found')
      next=next.replace(oldSearch,'exerciseMatches302(x,query)')

      const marker="const current=exercises[index],restSeconds=readStore('ft-timer-default',90);"
      if(!next.includes(marker))throw new Error('V2.0.120 ActiveTraining marker not found')
      const cardioState="const cardioExercise302=(()=>{const t=normSearch302([current?.kind,current?.category,current?.bodyPart,current?.muscle,current?.equipment,current?.name,current?.query].filter(Boolean).join(' '));return /cardio|cardiovascular|fahrrad|ergometer|bike|bicycle|cycling|cycle|laufband|treadmill|rudergerät|rower|rowing/.test(t)})();const[cardioMinutes302,setCardioMinutes302]=useState(()=>Math.max(1,Number(current?.duration||current?.minutes)||20));useEffect(()=>{if(cardioExercise302)setCardioMinutes302(Math.max(1,Number(current?.duration||current?.minutes)||20))},[index,cardioExercise302]);"
      next=next.replace(marker,marker+cardioState)

      const mediaLookup='setMedia(findExerciseMedia(items,current))'
      if(!next.includes(mediaLookup))throw new Error('V2.0.120 media lookup target not found')
      next=next.replace(mediaLookup,"setMedia(findExerciseMedia(items,cardioExercise302?{...current,query:cardioQuery302(current)}:current))")

      const mediaOld='{media?.gifUrl?<img src={media.gifUrl} alt={current.name}/>:<div className="media-loading"><Dumbbell size={32}/><small>Bild wird geladen…</small></div>}'
      if(!next.includes(mediaOld))throw new Error('V2.0.120 media render target not found')
      next=next.replace(mediaOld,'{(current?.gifUrl||current?.image||media?.gifUrl)?<img src={current?.gifUrl||current?.image||media?.gifUrl} alt={current.name}/>:<div className="media-loading"><Dumbbell size={32}/><small>Bild wird geladen…</small></div>}')

      const descOld="<p>{current.sets||3} Sätze · {current.reps||'8–12'} Wiederholungen</p>"
      if(!next.includes(descOld))throw new Error('V2.0.120 exercise description target not found')
      next=next.replace(descOld,"<p>{cardioExercise302?`${cardioMinutes302} Min. Cardio`:`${current.sets||3} Sätze · ${current.reps||'8–12'} Wiederholungen`}</p>")

      const setPrefix='{!current.warmup&&<div className="set-card compact-set-card">'
      if(!next.includes(setPrefix))throw new Error('V2.0.120 set card target not found')
      next=next.replace(setPrefix,'{!current.warmup&&!cardioExercise302&&<div className="set-card compact-set-card">')

      const nextDef="const nextExercise=()=>{setResting(false);if(index<exercises.length-1){setIndex(i=>i+1);setSet(1);setTip('Neue Übung · sauber starten')}else setFinished(true)};"
      if(!next.includes(nextDef))throw new Error('V2.0.120 nextExercise target not found')
      next=next.replace(nextDef,nextDef+"const finishCardio302=()=>{const logs=readStore('ft-active-set-logs-v277',[]);logs.push({exercise:current.name,exerciseIndex:index,set:1,durationMinutes:Math.max(1,Number(cardioMinutes302)||1),kind:'cardio',loadType:'cardio'});writeStore('ft-active-set-logs-v277',logs);nextExercise()};")

      const buttonOld='<button className="primary-action compact-action" onClick={()=>current.warmup?advance():setRirOpen(true)}><Check size={19}/> {current.warmup?`Aufwärmen ${set} abschließen`:`Satz ${set} abschließen`}</button>'
      if(!next.includes(buttonOld))throw new Error('V2.0.120 primary action target not found')
      const buttonNew='<>{cardioExercise302&&<div className="cardio-card-v302"><span>DAUER</span><label><input inputMode="numeric" value={cardioMinutes302} onChange={e=>setCardioMinutes302(Math.max(1,Number(e.target.value)||1))}/><small>Min.</small></label><p>Nur Zeit erfassen · kein Gewicht, keine Wiederholungen, kein RIR.</p></div>}<button className="primary-action compact-action" onClick={()=>current.warmup?advance():cardioExercise302?finishCardio302():setRirOpen(true)}><Check size={19}/> {current.warmup?`Aufwärmen ${set} abschließen`:cardioExercise302?'Cardio speichern':`Satz ${set} abschließen`}</button></>'
      next=next.replace(buttonOld,buttonNew)

      next=next.replace("kind:'strength',sets:logs,version:'V2.0.87'","kind:logs.length&&logs.every(x=>x?.kind==='cardio')?'cardio':'strength',sets:logs,version:'V2.0.120'")

      return {code:next,map:null}
    }
  }
}
