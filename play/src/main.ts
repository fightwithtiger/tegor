import { createApp } from 'vue'
import '@tegor-ui/theme-chalk/style/index.css'

;(async () => {
  const apps = import.meta.glob('./views/*.vue')
  const name = location.pathname.replace(/^\//, '') || 'App'
  const file = apps[`./views/${name}.vue`]
  if (!file) {
    location.pathname = 'App'
    return
  }
  const App = (await file()).default
  const app = createApp(App)

  app.mount('#app')
})()

