import { createRouter, createWebHistory } from 'vue-router'
// Import your components
import LandingPage from '../components/LandingPage.vue'
import TeamSelection from '../components/TeamSelection.vue'
import FamilyWallet from '../components/FamilyWallet.vue'

const routes = [
  // 1. The Marketing Page (Root)
  { path: '/', component: LandingPage },
  
  // 2. The App Pages
  { path: '/selection', component: TeamSelection },
  { path: '/wallet', component: FamilyWallet }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // This ensures the page scrolls to top when you navigate
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router
