import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Stable pause timer: deadline-based, isolated from parent re-renders and
// persistent ±10 second adjustments for the current and following pauses.
const oldRestOverlay=`function RestOverlay({seconds,onSkip,onDone}){const[left,setLeft]=useState(seconds);useEffect(()=>setLeft(seconds),[seconds]);useEffect(()=>{if(left<=0){onDone();return}const id=setTimeout(()=>setLeft(v=>v-1),1000);return()=>clearTimeout(id)},[left,onDone]);const fmt=v=>\`\${Math.floor(v/60)}:\${String(v%60).padStart(2,'0')}\`;return <div className="rest-overlay"><small>PAUSE</small><strong>{fmt(left)}</strong><span>Nächste Übung startet danach automatisch</span><button onClick={onSkip}>Pause überspringen <ChevronRight size={18}/></button></div>}`
const stableRestOverlay=`function RestOverlay({seconds,onSkip,onDone}){const total=Math.max(10,Number(seconds)||90);const[left,setLeft]=useState(total);const[base,setBase]=useState(total);const[deadline,setDeadline]=useState(()=>Date.now()+total*1000);const[finish]=useState(()=>onDone);const[skip]=useState(()=>onSkip);useEffect(()=>{let fired=false;let id;const tick=()=>{const next=Math.max(0,Math.ceil((deadline-Date.now())/1000));setLeft(next);if(next<=0&&!fired){fired=true;if(id)clearInterval(id);finish?.()}};id=setInterval(tick,250);tick();return()=>{fired=true;if(id)clearInterval(id)}},[deadline,finish]);const adjust=delta=>{const nextBase=Math.max(10,Math.min(600,base+delta));const actual=nextBase-base;if(!actual)return;setBase(nextBase);setDeadline(d=>Math.max(Date.now()+1000,d+actual*1000));setLeft(v=>Math.max(1,v+actual));try{localStorage.setItem('ft-timer-default',JSON.stringify(nextBase))}catch{}};const fmt=v=>\`\${Math.floor(v/60)}:\${String(v%60).padStart(2,'0')}\`;return <div className="rest-overlay"><small>PAUSE</small><strong>{fmt(left)}</strong><span>Nächste Übung startet danach automatisch</span><div className="rest-adjust-v270"><button type="button" onClick={()=>adjust(-10)}>−10 Sek.</button><button type="button" onClick={()=>adjust(10)}>+10 Sek.</button></div><button onClick={()=>skip?.()}>Pause überspringen <ChevronRight size={18}/></button></div>}`

const stableRestTimer=()=>({
  name:'stable-rest-timer',
  enforce:'pre',
  transform(code,id){
    if(!id.endsWith('/src/App.jsx'))return null
    if(!code.includes(oldRestOverlay))throw new Error('Stable rest timer patch target not found')
    return {code:code.replace(oldRestOverlay,stableRestOverlay),map:null}
  },
})

export default defineConfig({
  plugins: [stableRestTimer(),react()],
})
