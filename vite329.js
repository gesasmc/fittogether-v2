// FitTogether V2.0.170: the existing "Meine Ausstattung" selector is the source of truth.
// ft-available-equipment-v238 must win over the mirrored profile because same-tab storage events
// do not refresh the mirror immediately.
export default function cardioEquipment329(){
  return {
    name:'smart-equipment-source-v329',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/App.jsx')||!code.includes("const p=readStore('ft-equipment-profile',null)?.equipment||readStore('ft-available-equipment-v238',null)||{}"))return null
      const old="const p=readStore('ft-equipment-profile',null)?.equipment||readStore('ft-available-equipment-v238',null)||{}"
      const next="const central=readStore('ft-equipment-profile',null)?.equipment||{},selected=readStore('ft-available-equipment-v238',null),p=selected?{...central,...selected}:central"
      if(!code.includes(old))throw new Error('V2.0.170 equipment profile target not found')
      return {code:code.replace(old,next),map:null}
    },
  }
}
