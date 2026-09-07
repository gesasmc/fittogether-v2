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
