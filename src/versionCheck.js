const CURRENT_VERSION='V2.0.59'
let checking=false

const checkForUpdate=async()=>{
  if(checking)return
  checking=true
  try{
    const response=await fetch(`/version.json?t=${Date.now()}`,{cache:'no-store',headers:{'Cache-Control':'no-cache'}})
    if(!response.ok)return
    const data=await response.json()
    if(data?.version&&data.version!==CURRENT_VERSION){
      window.location.reload()
    }
  }catch{}
  finally{checking=false}
}

if(typeof window!=='undefined'){
  window.__FT_BUILD_VERSION__=CURRENT_VERSION
  window.addEventListener('pageshow',checkForUpdate)
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkForUpdate()})
  setTimeout(checkForUpdate,1200)
}
