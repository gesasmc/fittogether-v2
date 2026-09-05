// FitTogether V2.0.65: keep legacy enhancement observers out of active training.
// React owns the training/timer UI. Old patch observers are only needed on normal app pages.
if(typeof window!=='undefined'&&window.MutationObserver&&!window.__ftTrainingObserverGuard){
  window.__ftTrainingObserverGuard=true
  const NativeMutationObserver=window.MutationObserver
  window.MutationObserver=class FitTogetherMutationObserver extends NativeMutationObserver{
    constructor(callback){
      super((records,observer)=>{
        // Do not let legacy DOM-enhancement patches react to timer/training mutations.
        // They can resume automatically as soon as the training screen is gone.
        if(document.querySelector('.active-training,.training-overlay,.rir-backdrop,.rest-overlay'))return
        callback(records,observer)
      })
    }
  }
}
