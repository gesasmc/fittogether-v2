// FitTogether V2.0.161: make cardio timer restoration/background completion reliable on iOS.
export default function cardioBackgroundFix325(){
  return {
    name:'cardio-background-fix-v325',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/App.jsx')||!code.includes('cardioSavedHere302'))return null
      let next=code

      const oldFallback="Math.max(0,Number(cardioSavedHere302?.remaining)??cardioDefaultMinutes302*60)"
      const newFallback="Number.isFinite(Number(cardioSavedHere302?.remaining))?Math.max(0,Number(cardioSavedHere302?.remaining)):cardioDefaultMinutes302*60"
      if(!next.includes(oldFallback))throw new Error('V2.0.161 cardio restore fallback target not found')
      next=next.replace(oldFallback,newFallback)

      const oldRunning="const running=!!(saved?.running&&Number(saved?.deadline)>Date.now());setCardioMinutes302"
      const newRunning="const running=!!(saved?.running&&Number(saved?.deadline)>Date.now()),expired=!!(saved?.running&&Number(saved?.deadline)>0&&Number(saved.deadline)<=Date.now());setCardioMinutes302"
      if(!next.includes(oldRunning))throw new Error('V2.0.161 cardio expired restore target not found')
      next=next.replace(oldRunning,newRunning)

      const oldRemaining="setCardioRemaining302(running?Math.max(0,Math.ceil((Number(saved.deadline)-Date.now())/1000)):Math.max(0,Number(saved?.remaining)||cardioDefaultMinutes302*60));"
      const newRemaining="setCardioRemaining302(expired?0:running?Math.max(0,Math.ceil((Number(saved.deadline)-Date.now())/1000)):(Number.isFinite(Number(saved?.remaining))?Math.max(0,Number(saved.remaining)):cardioDefaultMinutes302*60));"
      if(!next.includes(oldRemaining))throw new Error('V2.0.161 cardio remaining restore target not found')
      next=next.replace(oldRemaining,newRemaining)

      const oldFinished="setCardioFinished302(!!saved?.finished||!!(saved?.running&&Number(saved?.deadline)>0&&Number(saved.deadline)<=Date.now()));"
      const newFinished="setCardioFinished302(!!saved?.finished||expired);"
      if(!next.includes(oldFinished))throw new Error('V2.0.161 cardio finished restore target not found')
      next=next.replace(oldFinished,newFinished)

      const oldTick="const extra=cardioRunStarted302?Math.max(0,Date.now()-cardioRunStarted302):0;"
      const newTick="const extra=cardioRunStarted302?Math.max(0,Math.min(Date.now(),cardioDeadline302)-cardioRunStarted302):0;"
      if(!next.includes(oldTick))throw new Error('V2.0.161 cardio background tick target not found')
      next=next.replace(oldTick,newTick)

      const oldFinish="const finishCardio302=()=>{if(cardioMode302==='manual'){if(!Number(cardioMinutes302)||Number(cardioMinutes302)<=0)return;saveCardio302(Number(cardioMinutes302)*60,'manual');return}const live=cardioRunning302&&cardioRunStarted302?Math.max(0,Date.now()-cardioRunStarted302):0,actual=Math.max(1000,cardioAccumulated302+live);setCardioRunning302(false);setCardioRunStarted302(0);saveCardio302(actual/1000,'timer')};"
      const newFinish="const finishCardio302=()=>{if(cardioMode302==='manual'){if(!Number(cardioMinutes302)||Number(cardioMinutes302)<=0)return;saveCardio302(Number(cardioMinutes302)*60,'manual');return}const now=Date.now(),savedNow=readStore('ft-cardio-active-v302',null),deadline=Math.max(Number(cardioDeadline302)||0,Number(savedNow?.deadline)||0),expired=cardioFinished302||(deadline>0&&deadline<=now),started=Number(cardioRunStarted302)||Number(savedNow?.runStarted)||0,live=!expired&&cardioRunning302&&started?Math.max(0,now-started):0,actual=expired?Math.max(1000,validCardioMinutes302()*60*1000):Math.max(1000,(Number(cardioAccumulated302)||0)+live);setCardioRunning302(false);setCardioRunStarted302(0);setCardioRemaining302(expired?0:cardioRemaining302);saveCardio302(actual/1000,'timer')};"
      if(!next.includes(oldFinish))throw new Error('V2.0.161 cardio save target not found')
      next=next.replace(oldFinish,newFinish)

      return {code:next,map:null}
    },
  }
}
