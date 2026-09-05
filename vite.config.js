import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const oldRestOverlay=`function RestOverlay({seconds,onSkip,onDone}){const[left,setLeft]=useState(seconds);useEffect(()=>setLeft(seconds),[seconds]);useEffect(()=>{if(left<=0){onDone();return}const id=setTimeout(()=>setLeft(v=>v-1),1000);return()=>clearTimeout(id)},[left,onDone]);const fmt=v=>\`\${Math.floor(v/60)}:\${String(v%60).padStart(2,'0')}\`;return <div className="rest-overlay"><small>PAUSE</small><strong>{fmt(left)}</strong><span>Nächste Übung startet danach automatisch</span><button onClick={onSkip}>Pause überspringen <ChevronRight size={18}/></button></div>}`
const stableRestOverlay=`function RestOverlay({seconds,onSkip,onDone}){const[left,setLeft]=useState(()=>Math.max(0,Number(seconds)||0));useEffect(()=>setLeft(Math.max(0,Number(seconds)||0)),[seconds]);useEffect(()=>{if(left<=0){const id=setTimeout(()=>onDone?.(),0);return()=>clearTimeout(id)}const id=setTimeout(()=>setLeft(v=>Math.max(0,v-1)),1000);return()=>clearTimeout(id)},[left]);const fmt=v=>\`\${Math.floor(v/60)}:\${String(v%60).padStart(2,'0')}\`;return <div className="rest-overlay"><small>PAUSE</small><strong>{fmt(left)}</strong><span>Nächste Übung startet danach automatisch</span><button onClick={onSkip}>Pause überspringen <ChevronRight size={18}/></button></div>}`

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
