const CURRENT_VERSION='V2.0.65'
let checking=false

const VERSION_SELECTOR='.brand b,.training-note,.version,.ft-auth-copy small'
const syncVisibleVersion=(root=document)=>{
  const nodes=[]
  if(root?.nodeType===1&&root.matches?.(VERSION_SELECTOR))nodes.push(root)
  root?.querySelectorAll?.(VERSION_SELECTOR)?.forEach(el=>nodes.push(el))
  for(const el of nodes){
    const text=el.textContent||''
    if(/V2\.0\.\d+/.test(text))el.textContent=text.replace(/V2\.0\.\d+/g,CURRENT_VERSION)
  }
}

const checkForUpdate=async()=>{
  if(checking)return
  checking=true
  try{
    const response=await fetch(`/version.json?t=${Date.now()}`,{cache:'no-store',headers:{'Cache-Control':'no-cache'}})
    if(!response.ok)return
    const data=await response.json()
    if(data?.version&&data.version!==CURRENT_VERSION)window.location.reload()
  }catch{}
  finally{checking=false}
}

if(typeof window!=='undefined'){
  window.__FT_BUILD_VERSION__=CURRENT_VERSION
  const start=()=>{
    syncVisibleVersion(document)
    const observer=new MutationObserver(mutations=>{
      for(const mutation of mutations){
        mutation.addedNodes.forEach(node=>{if(node.nodeType===1)syncVisibleVersion(node)})
      }
    })
    observer.observe(document.body,{childList:true,subtree:true})
  }
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
  window.addEventListener('pageshow',checkForUpdate)
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkForUpdate()})
  setTimeout(checkForUpdate,1200)
}
