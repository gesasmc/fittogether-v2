// FitTogether V2.0.167: recognize cardio equipment from central profile and real app usage.
export default function cardioEquipment329(){
  return {
    name:'smart-cardio-equipment-v329',
    enforce:'pre',
    transform(code,id){
      if(!id.endsWith('/src/App.jsx')||!code.includes("'Indoor Bike':!!p.bike"))return null
      const old="'Indoor Bike':!!p.bike,Rudergerät:!!p.rower,Laufband:!!p.treadmill,Crosstrainer:!!(p.elliptical??p.crosstrainer),Stepper:!!p.stepper,Springseil:!!(p.jumpRope??p.rope)"
      const next="'Indoor Bike':!!(p.bike??p.indoorBike??p.ergometer)||/indoor bike|fahrrad|ergometer|cycling|bike/i.test(JSON.stringify(readStore('ft-completed-workouts',[]))+JSON.stringify(readStore('ft-plans',[]))),Rudergerät:!!(p.rower??p.rowingMachine??p.rowing)||/rudergerät|rower|rowing/i.test(JSON.stringify(readStore('ft-completed-workouts',[]))+JSON.stringify(readStore('ft-plans',[]))),Laufband:!!(p.treadmill??p.runningMachine),Crosstrainer:!!(p.elliptical??p.crosstrainer),Stepper:!!p.stepper,Springseil:!!(p.jumpRope??p.rope)"
      if(!code.includes(old))throw new Error('V2.0.167 cardio equipment target not found')
      return {code:code.replace(old,next),map:null}
    },
  }
}
