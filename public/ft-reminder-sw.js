// FitTogether notification-only service worker. No fetch handler, no asset cache.
self.addEventListener('install',()=>self.skipWaiting())
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()))
self.addEventListener('notificationclick',event=>{
  event.notification.close()
  const target=event.notification?.data?.url||'/?reminder=training'
  event.waitUntil((async()=>{
    const list=await self.clients.matchAll({type:'window',includeUncontrolled:true})
    for(const client of list){
      if('focus'in client){try{await client.focus();return}catch{}}
    }
    if(self.clients.openWindow)await self.clients.openWindow(target)
  })())
})
