import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../components/LandingPage.vue'
import TeamSelection from '../components/TeamSelection.vue'
import FamilyWallet from '../components/FamilyWallet.vue'
import TreasurerDashboard from '../components/TreasurerDashboard.vue'
import LeagueRules from '../components/LeagueRules.vue'
import ClubAdmin from '../components/ClubAdmin.vue'
import ClubOnboarding from '../components/ClubOnboarding.vue'
import FixtureManager from '../components/FixtureManager.vue' // Import

const routes = [
  { path: '/', component: LandingPage },
  { path: '/onboarding', component: ClubOnboarding },
  { path: '/selection', component: TeamSelection },
  { path: '/wallet', component: FamilyWallet },
  { path: '/treasurer', component: TreasurerDashboard },
  { path: '/rules', component: LeagueRules },
  { path: '/admin', component: ClubAdmin },
  { path: '/fixtures', component: FixtureManager } // New Route
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router
