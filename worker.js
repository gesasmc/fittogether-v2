const VERSION='V2.0.147'

const noStorePaths=new Set(['/', '/index.html', '/version.json', '/manifest.webmanifest', '/ft-reminder-sw.js'])

export default {
  async fetch(request, env) {
    const url=new URL(request.url)
    const response=await env.ASSETS.fetch(request)
    const headers=new Headers(response.headers)

    if(noStorePaths.has(url.pathname)){
      headers.set('Cache-Control','no-store, no-cache, must-revalidate, max-age=0')
      headers.set('Pragma','no-cache')
      headers.set('Expires','0')
      headers.set('X-FitTogether-Version',VERSION)
    }

    if(url.pathname==='/version.json'){
      headers.set('Clear-Site-Data','"cache"')
    }

    return new Response(response.body,{
      status:response.status,
      statusText:response.statusText,
      headers,
    })
  },
}
