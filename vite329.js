// FitTogether V2.0.169: Smart Trainer reads the complete equipment selection from both central stores.
export default function cardioEquipment329(){
  return {
    name:'smart-equipment-source-v329',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/App.jsx')||!code.includes("const p=readStore('ft-equipment-profile',null)?.equipment||readStore('ft-available-equipment-v238',null)||{}"))return null
      const old="const p=readStore('ft-equipment-profile',null)?.equipment||readStore('ft-available-equipment-v238',null)||{}"
      const next="const central=readStore('ft-equipment-profile',null)?.equipment||{},legacy=readStore('ft-available-equipment-v238',null)||{},p={...legacy,...central};['bodyweight','dumbbell','barbell','band','machine','treadmill','bike','rower','bench','bank','landmine','kettlebell','cable','trx','suspension','pullupBar','pullup','dipBars','dip','medicineBall','stabilityBall','bosu','box','stepBox','elliptical','crosstrainer','stepper','jumpRope','rope'].forEach(k=>{if(central[k]===undefined&&legacy[k]!==undefined)p[k]=legacy[k]})"
      if(!code.includes(old))throw new Error('V2.0.169 equipment profile target not found')
      code=code.replace(old,next)
      const cardioOld="'Indoor Bike':!!p.bike,Rudergerät:!!p.rower,Laufband:!!p.treadmill,Crosstrainer:!!(p.elliptical??p.crosstrainer),Stepper:!!p.stepper,Springseil:!!(p.jumpRope??p.rope)"
      const cardioNext="'Indoor Bike':!!p.bike,Rudergerät:!!p.rower,Laufband:!!p.treadmill,Crosstrainer:!!(p.elliptical??p.crosstrainer),Stepper:!!p.stepper,Springseil:!!(p.jumpRope??p.rope)"
      if(code.includes(cardioOld))code=code.replace(cardioOld,cardioNext)
      return {code,map:null}
    },
  }
}
