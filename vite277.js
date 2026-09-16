import trainingMemory277Original from './vite277-original.js'
import smartTrainer350 from './vite350.js'

export default function trainingMemory277(){
  const memory=trainingMemory277Original()
  const smart=smartTrainer350()
  return {
    name:'training-memory-plus-smart-v350',
    enforce:'pre',
    transform(code,id){
      let next=code
      const s=smart.transform?.call(this,next,id)
      if(s?.code)next=s.code
      const m=memory.transform?.call(this,next,id)
      if(m?.code)next=m.code
      if(next===code)return null
      return {code:next,map:null}
    }
  }
}
