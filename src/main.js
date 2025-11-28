import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // Import the router

// Optional: Keep vConsole for mobile debugging if you like
import VConsole from 'vconsole';
const vConsole = new VConsole();

createApp(App)
  .use(router) // Tell Vue to use it
  .mount('#app')

