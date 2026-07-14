import { createApp } from 'vue'
import '@pipod/shared/styles/theme.css'
import { router } from './router'
import App from './App.vue'
import './assets/main.css'

createApp(App).use(router).mount('#app')
