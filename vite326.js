// FitTogether V2.0.162: show cardio target, elapsed and remaining time together.
export default function cardioProgress326(){
  return {
    name:'cardio-progress-v326',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/App.jsx')||!code.includes('cardio-clock-v302'))return null
      let next=code

      const helperTarget="const validCardioMinutes302=()=>Math.max(1,Number(cardioMinutes302)||1);"
      const helperReplacement=helperTarget+"const cardioTargetSeconds326=()=>Math.max(60,validCardioMinutes302()*60);const cardioElapsedSeconds326=()=>{const target=cardioTargetSeconds326();if(cardioFinished302)return target;const accumulated=Math.max(0,Number(cardioAccumulated302)||0),live=cardioRunning302&&cardioRunStarted302?Math.max(0,Date.now()-cardioRunStarted302):0;return Math.min(target,Math.max(0,Math.floor((accumulated+live)/1000)))};"
      if(!next.includes(helperTarget))throw new Error('V2.0.162 cardio progress helper target not found')
      next=next.replace(helperTarget,helperReplacement)

      const clockTarget='<strong className="cardio-clock-v302">{fmtCardio302(cardioRemaining302)}</strong>'
      const clockReplacement='<div className="cardio-times-v326"><div><span>ZIEL</span><strong>{fmtCardio302(cardioTargetSeconds326())}</strong></div><div className="cardio-elapsed-v326"><span>GELAUFEN</span><strong>{fmtCardio302(cardioElapsedSeconds326())}</strong></div><div><span>REST</span><strong>{fmtCardio302(cardioRemaining302)}</strong></div></div>'
      if(!next.includes(clockTarget))throw new Error('V2.0.162 cardio clock target not found')
      next=next.replace(clockTarget,clockReplacement)

      return {code:next,map:null}
    },
  }
}
