import { createRouter, createWebHistory } from 'vue-router'
import { useUser } from '../composables/useUser'; 

// Components
import LandingPage from '../components/LandingPage.vue'
import LoginPage from '../components/auth/LoginPage.vue'
import RegisterPage from '../components/auth/RegisterPage.vue'
import ClubOnboarding from '../components/ClubOnboarding.vue'

// Coach / Admin Components
import TeamSelection from '../components/TeamSelection.vue'
import FixtureManager from '../components/FixtureManager.vue'
import ClubAdmin from '../components/ClubAdmin.vue'
import TreasurerDashboard from '../components/TreasurerDashboard.vue'
import LeagueRules from '../components/LeagueRules.vue'

// Parent / Player Components
import MatchDayHub from '../components/parent/MatchDayHub.vue'
import FamilyWallet from '../components/FamilyWallet.vue'
import StatsDashboard from '../components/stats/StatsDashboard.vue' // NEW IMPORT

const routes = [
  // Public
  { path: '/', component: LandingPage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  
  // Onboarding
  { path: '/onboarding', component: ClubOnboarding, meta: { requiresAuth: true } },
  
  // Coach / Admin Routes
  { 
    path: '/selection', 
    component: TeamSelection, 
    meta: { requiresAuth: true, requires: 'manage_team' } 
  },
  { 
    path: '/fixtures', 
    component: FixtureManager, 
    meta: { requiresAuth: true, requires: 'manage_team' } 
  },
  { 
    path: '/treasurer', 
    component: TreasurerDashboard, 
    meta: { requiresAuth: true, requires: 'manage_finance' } 
  },
  { 
    path: '/rules', 
    component: LeagueRules, 
    meta: { requiresAuth: true, requires: 'edit_compliance' } 
  },
  { 
    path: '/admin', 
    component: ClubAdmin, 
    meta: { requiresAuth: true, requires: 'manage_club' } 
  },

  // Parent / Player Routes
  { 
    path: '/hub', 
    component: MatchDayHub, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/wallet', 
    component: FamilyWallet,
    meta: { requiresAuth: true }
  },
  // NEW ROUTE
  { 
    path: '/stats', 
    component: StatsDashboard, 
    meta: { requiresAuth: true } // Available to any logged in user linked to a player
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

// Global Guard
router.beforeEach(async (to, from, next) => {
  try {
    const { user, initAuth, can } = useUser();
    
    if (!user.value) {
        await initAuth();
    }
    
    const isAuthenticated = !!user.value;

    if (to.meta.requiresAuth && !isAuthenticated) {
      return next('/login');
    }

    // Role Check
    if (to.meta.requires && !can(to.meta.requires)) {
      // If unauthorized, redirect to safe default
      return next('/hub'); 
    }
    
    next();
  } catch (error) {
    console.error("Router Guard Error:", error);
    if (to.path !== '/' && to.path !== '/login') next('/login');
    else next(); 
  }
});

export default router
