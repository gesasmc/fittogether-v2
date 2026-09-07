const REPDB_URL='https://exercise-dataset.com/exercises.json'
const REPDB_ASSET_BASE='https://exercise-dataset.com/'
const YOGA_TERMS=[
  'yoga','warrior','downward dog','upward dog','three-legged dog','child\'s pose','childs pose',
  'cobra','sphinx','pigeon','tree pose','triangle pose','camel pose','lotus','boat pose',
  'chair pose','mountain pose','corpse pose','happy baby','sun salutation','cat cow','cat-cow',
  'lizard','low lunge','prayer squat','frog pose','thread the needle','dog to plank','dog pedal',
  'pike to cobra push up','pelvic tilt into bridge'
]

const yogaText=value=>String(value||'').toLowerCase()
export const isYogaExercise111=exercise=>{
  const name=yogaText(exercise?.name||exercise?.name_en)
  const id=yogaText(exercise?.id||exercise?.slug)
  const category=yogaText(exercise?.category)
  return category==='yoga'||YOGA_TERMS.some(term=>name.includes(term)||id.includes(term.replaceAll(' ','-')))
}

const imageUrl=row=>{
  const flat=row?.images?.flat||{}
  const rel=flat.main||flat.start||flat.peak
  return rel?`${REPDB_ASSET_BASE}${String(rel).replace(/^\//,'')}`:''
}
const normalizePart=value=>String(value||'').replaceAll('_',' ')
const toFitExercise=row=>({
  id:`repdb/${row.id}`,
  slug:row.id,
  name:row.name_en||row.name_de||row.id,
  muscle:normalizePart(row.primary_muscles?.[0]||row.body_part||''),
  bodyPart:normalizePart(row.body_part||''),
  equipment:normalizePart(row.equipment||'bodyweight'),
  category:isYogaExercise111(row)?'yoga':String(row.category||'').toLowerCase(),
  secondaryMuscles:(row.secondary_muscles||[]).map(normalizePart),
  instructions:row.instructions_de?.length?row.instructions_de:(row.instructions_en||[]),
  gifUrl:imageUrl(row),
  thumbUrl:imageUrl(row),
  source:'RepDB',
  attribution:'Exercise data by RepDB'
})

let repdbPromise
export const loadRepDbSupplement111=()=>repdbPromise||(repdbPromise=fetch(REPDB_URL)
  .then(response=>response.ok?response.json():Promise.reject(new Error(`RepDB ${response.status}`)))
  .then(data=>Array.isArray(data)?data:(data.exercises||[]))
  .then(rows=>rows.filter(row=>['cardio','stretching'].includes(String(row.category||'').toLowerCase())||isYogaExercise111(row)).map(toFitExercise))
  .catch(()=>[]))

export const mergeExerciseSources111=(primary=[],extra=[])=>{
  const byKey=new Map()
  for(const item of [...primary,...extra]){
    const key=String(item?.id||item?.slug||item?.name||'').trim().toLowerCase()
    if(!key||byKey.has(key))continue
    byKey.set(key,item)
  }
  return [...byKey.values()]
}
