// FitTogether V2.0.168: Smart Trainer uses only the central equipment profile.
export default function cardioEquipment329(){
  return {
    name:'smart-equipment-source-v329',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/App.jsx')||!code.includes("'Indoor Bike':!!p.bike"))return null
      const old="'Indoor Bike':!!p.bike,Rudergerät:!!p.rower,Laufband:!!p.treadmill,Crosstrainer:!!(p.elliptical??p.crosstrainer),Stepper:!!p.stepper,Springseil:!!(p.jumpRope??p.rope)"
      const next="'Indoor Bike':!!p.bike,Rudergerät:!!p.rower,Laufband:!!p.treadmill,Crosstrainer:!!p.elliptical,Stepper:!!p.stepper,Springseil:!!p.jumpRope"
      if(!code.includes(old))throw new Error('V2.0.168 equipment source target not found')
      return {code:code.replace(old,next),map:null}
    },
  }
}
