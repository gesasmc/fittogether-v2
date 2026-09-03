// V2.0.18 category enrichment layer.
// Keeps the existing ExerciseGymGifsDB source and separates yoga-like mobility poses
// from ordinary stretching while preserving the original GIF assets.
const yogaTerms=[
  'sphinx','cobra','downward dog','down dog','upward dog','child pose','child’s pose','childs pose',
  'warrior','tree pose','triangle pose','pigeon','cat cow','cat-cow','camel pose','lotus',
  'sun salutation','boat pose','plank pose','bridge pose','pelvic tilt into bridge',
  'pike to cobra','yoga','prayer squat','frog pose','happy baby','thread the needle'
]
const yogaMatch=name=>{const n=String(name||'').toLowerCase();return yogaTerms.some(t=>n.includes(t))}

// App.jsx V2.0.17 uses a small allow-list for Yoga. Extend only that exact list,
// without changing normal Array.includes behaviour elsewhere in the app.
const nativeIncludes=Array.prototype.includes
if(!globalThis.__ftYogaIncludesPatched){
  Object.defineProperty(globalThis,'__ftYogaIncludesPatched',{value:true,configurable:true})
  Array.prototype.includes=function(search,...rest){
    const isYogaAllowList=this.length===3&&this[0]==='sphinx'&&this[1]==='pike to cobra push up'&&this[2]==='pelvic tilt into bridge'
    if(isYogaAllowList&&typeof search==='string'&&yogaMatch(search))return true
    return nativeIncludes.call(this,search,...rest)
  }
}

// Re-label yoga-like records before the exercise library receives them. This keeps
// those poses out of the normal Dehnen category while leaving Cardio/Strength intact.
const nativeFetch=globalThis.fetch?.bind(globalThis)
if(nativeFetch&&!globalThis.__ftCategoryFetchPatched){
  Object.defineProperty(globalThis,'__ftCategoryFetchPatched',{value:true,configurable:true})
  globalThis.fetch=async(...args)=>{
    const response=await nativeFetch(...args)
    const url=String(args[0]?.url||args[0]||'')
    if(!url.includes('JahelCuadrado/ExerciseGymGifsDB'))return response
    try{
      const data=await response.clone().json()
      if(Array.isArray(data?.exercises)){
        data.exercises=data.exercises.map(x=>yogaMatch(x?.name)?{...x,category:'yoga'}:x)
        return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:response.headers})
      }
    }catch{}
    return response
  }
}

// The version constant lives in the existing screen module; update visible labels
// without touching persisted data or application behaviour.
if(typeof document!=='undefined'){
  const updateVersion=()=>{document.querySelectorAll('body *').forEach(el=>{if(el.children.length===0&&el.textContent?.includes('V2.0.17'))el.textContent=el.textContent.replaceAll('V2.0.17','V2.0.18')})}
  const observer=new MutationObserver(updateVersion)
  const start=()=>{updateVersion();observer.observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
