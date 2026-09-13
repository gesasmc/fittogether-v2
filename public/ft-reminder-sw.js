// FitTogether notification-only service worker. No fetch handler, no asset cache.
self.addEventListener('install',()=>self.skipWaiting())
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()))
self.addEventListener('push',event=>{
  let data={}
  try{data=event.data?.json?.()||{}}catch{try{data=JSON.parse(event.data?.text?.()||'{}')}catch{}}
  const title=data.title||'Zeit fürs Training 💪'
  const options={
    body:data.body||'Dein Training steht heute an.',
    icon:'/fittogether-icon-192.png?v=230',
    badge:'/fittogether-icon-192.png?v=230',
    tag:data.tag||'ft-training-reminder',
    renotify:false,
    data:{url:data.url||'/?reminder=training'},
  }
  event.waitUntil(self.registration.showNotification(title,options))
})
self.addEventListener('notificationclick',event=>{
  event.notification.close()
  const target=event.notification?.data?.url||'/?reminder=training'
  event.waitUntil((async()=>{
    const list=await self.clients.matchAll({type:'window',includeUncontrolled:true})
    for(const client of list){
      if('focus'in client){
        try{if('navigate'in client)await client.navigate(target)}catch{}
        try{await client.focus();return}catch{}
      }
    }
    if(self.clients.openWindow)await self.clients.openWindow(target)
  })())
})
