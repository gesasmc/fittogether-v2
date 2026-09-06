import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// V2.0.67: replace the legacy pause timer with a deadline-based timer that
// is isolated from parent re-renders and survives delayed browser ticks.
const oldRestOverlay=`function RestOverlay({seconds,onSkip,onDone}){const[left,setLeft]=useState(seconds);useEffect(()=>setLeft(seconds),[seconds]);useEffect(()=>{if(left<=0){onDone();return}const id=setTimeout(()=>setLeft(v=>v-1),1000);return()=>clearTimeout(id)},[left,onDone]);const fmt=v=>\`\${Math.floor(v/60)}:\${String(v%60).padStart(2,'0')}\`;return <div className="rest-overlay"><small>PAUSE</small><strong>{fmt(left)}</strong><span>Nächste Übung startet danach automatisch</span><button onClick={onSkip}>Pause überspringen <ChevronRight size={18}/></button></div>}`
const stableRestOverlay=`function RestOverlay({seconds,onSkip,onDone}){const total=Math.max(0,Number(seconds)||0);const[left,setLeft]=useState(total);const[finish]=useState(()=>onDone);const[skip]=useState(()=>onSkip);useEffect(()=>{const end=Date.now()+total*1000;let fired=false;let id;const tick=()=>{const next=Math.max(0,Math.ceil((end-Date.now())/1000));setLeft(next);if(next<=0&&!fired){fired=true;if(id)clearInterval(id);finish?.()}};id=setInterval(tick,250);tick();return()=>{fired=true;if(id)clearInterval(id)}},[total,finish]);const fmt=v=>\`\${Math.floor(v/60)}:\${String(v%60).padStart(2,'0')}\`;return <div className="rest-overlay"><small>PAUSE</small><strong>{fmt(left)}</strong><span>Nächste Übung startet danach automatisch</span><button onClick={()=>skip?.()}>Pause überspringen <ChevronRight size={18}/></button></div>}`

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
