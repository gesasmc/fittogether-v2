// FitTogether V2.0.19 supplemental exercise source.
// RepDB free tier: free in-app use with attribution. Adds missing cardio machines,
// stretching and yoga-style movements while preserving ExerciseGymGifsDB as primary source.
const REPDB_URL='https://exercise-dataset.com/exercises.json'
const REPDB_ASSET_BASE='https://exercise-dataset.com/'
const yogaTerms=[
  'yoga','warrior','downward dog','upward dog','three-legged dog','child\'s pose','childs pose',
  'cobra','sphinx','pigeon','tree pose','triangle pose','camel pose','lotus','boat pose',
  'chair pose','mountain pose','corpse pose','happy baby','sun salutation','cat cow','cat-cow',
  'lizard','low lunge','prayer squat','frog pose','thread the needle','dog to plank','dog pedal'
]
const isYogaLike=r=>{const n=String(r?.name_en||'').toLowerCase();const id=String(r?.id||'').toLowerCase();return yogaTerms.some(t=>n.includes(t)||id.includes(t.replaceAll(' ','-')))}
const imageUrl=r=>{const flat=r?.images?.flat||{};const rel=flat.main||flat.start||flat.peak;return rel?`${REPDB_ASSET_BASE}${String(rel).replace(/^\//,'')}`:''}
const normalizePart=v=>String(v||'').replaceAll('_',' ')
const toFitExercise=r=>({
  id:`repdb/${r.id}`,
  slug:r.id,
  name:r.name_en||r.name_de||r.id,
  muscle:normalizePart(r.primary_muscles?.[0]||r.body_part||''),
  bodyPart:normalizePart(r.body_part||''),
  equipment:normalizePart(r.equipment||'bodyweight'),
  category:isYogaLike(r)?'yoga':String(r.category||'').toLowerCase(),
  secondaryMuscles:(r.secondary_muscles||[]).map(normalizePart),
  instructions:r.instructions_de?.length?r.instructions_de:(r.instructions_en||[]),
  gifUrl:imageUrl(r),
  thumbUrl:imageUrl(r),
  source:'RepDB',
  attribution:'Exercise data by RepDB'
})
let repdbPromise
const loadRepDB=()=>repdbPromise||(repdbPromise=fetch(REPDB_URL).then(r=>r.ok?r.json():Promise.reject(new Error(`RepDB ${r.status}`))).then(data=>Array.isArray(data)?data:(data.exercises||[])).then(rows=>rows.filter(r=>['cardio','stretching'].includes(String(r.category||'').toLowerCase())||isYogaLike(r)).map(toFitExercise)).catch(()=>[]))

const previousFetch=globalThis.fetch?.bind(globalThis)
if(previousFetch&&!globalThis.__ftRepdbSupplement){
  Object.defineProperty(globalThis,'__ftRepdbSupplement',{value:true,configurable:true})
  globalThis.fetch=async(...args)=>{
    const response=await previousFetch(...args)
    const url=String(args[0]?.url||args[0]||'')
    if(!url.includes('JahelCuadrado/ExerciseGymGifsDB')||!url.endsWith('/cardio.json'))return response
    try{
      const data=await response.clone().json()
      const extras=await loadRepDB()
      if(Array.isArray(data?.exercises)&&extras.length){
        const existing=new Set(data.exercises.map(x=>String(x.name||'').toLowerCase()))
        data.exercises=[...data.exercises,...extras.filter(x=>!existing.has(String(x.name||'').toLowerCase()))]
        return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:response.headers})
      }
    }catch{}
    return response
  }
}

// Extend the old three-item yoga allow-list used by App.jsx without touching other arrays.
const nativeIncludes219=Array.prototype.includes
if(!globalThis.__ftYogaIncludes219){
  Object.defineProperty(globalThis,'__ftYogaIncludes219',{value:true,configurable:true})
  Array.prototype.includes=function(search,...rest){
    const isOldYogaList=this.length===3&&this[0]==='sphinx'&&this[1]==='pike to cobra push up'&&this[2]==='pelvic tilt into bridge'
    if(isOldYogaList&&typeof search==='string'){
      const s=search.toLowerCase()
      if(yogaTerms.some(t=>s.includes(t)))return true
    }
    return nativeIncludes219.call(this,search,...rest)
  }
}

// Show the actual iteration number until App.jsx versioning is consolidated later.
if(typeof document!=='undefined'){
  const updateVersion=()=>document.querySelectorAll('body *').forEach(el=>{if(el.children.length===0&&el.textContent?.includes('V2.0.18'))el.textContent=el.textContent.replaceAll('V2.0.18','V2.0.19')})
  const obs=new MutationObserver(updateVersion)
  const start=()=>{updateVersion();obs.observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
