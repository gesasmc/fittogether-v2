import React from 'react'

const CRASH_KEY='ft-last-ui-crash-v2106'

export default class StabilityBoundary extends React.Component{
  constructor(props){super(props);this.state={error:null}}
  static getDerivedStateFromError(error){return{error}}
  componentDidCatch(error,info){
    try{
      localStorage.setItem(CRASH_KEY,JSON.stringify({time:Date.now(),message:String(error?.message||error||'Unbekannter Fehler'),stack:String(info?.componentStack||'').slice(0,4000),version:window.__FT_BUILD_VERSION__||''}))
    }catch{}
  }
  reset=()=>{
    try{localStorage.removeItem(CRASH_KEY)}catch{}
    this.setState({error:null})
  }
  reload=()=>{window.location.reload()}
  render(){
    if(!this.state.error)return this.props.children
    return <main className="stability-fallback-v2106">
      <div className="stability-card-v2106">
        <small>FITTOGETHER · SICHERHEITSMODUS</small>
        <h1>Die Oberfläche wurde abgefangen.</h1>
        <p>Deine gespeicherten Trainingsdaten wurden nicht gelöscht. Du kannst die Oberfläche neu laden oder einen erneuten Start versuchen.</p>
        <button type="button" onClick={this.reload}>App neu laden</button>
        <button type="button" className="secondary" onClick={this.reset}>Erneut versuchen</button>
      </div>
    </main>
  }
}
