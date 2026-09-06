// FitTogether V2.0.69: hard isolation for the active training screen.
// Legacy enhancement scripts use MutationObserver extensively. During an active
// workout they must not touch React-owned training DOM at all.
if(typeof window!=='undefined'&&typeof window.MutationObserver==='function'&&!window.__ftTrainingObserverIsolation){
  window.__ftTrainingObserverIsolation=true
  const NativeMutationObserver=window.MutationObserver
  window.MutationObserver=class FitTogetherMutationObserver extends NativeMutationObserver{
    constructor(callback){
      super((mutations,observer)=>{
        if(document.querySelector('.active-training'))return
        callback(mutations,observer)
      })
    }
  }
}
