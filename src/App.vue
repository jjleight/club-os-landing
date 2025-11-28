<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import BrandLogo from './components/BrandLogo.vue';
import { LayoutGrid, Wallet, Users, Settings, LogOut, Menu } from 'lucide-vue-next';

const route = useRoute();

// This tells the App: "If we are at the root URL (/), hide the sidebar."
const isLandingPage = computed(() => route.path === '/');
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
    
    <!-- === DESKTOP SIDEBAR === -->
    <!-- We hide this sidebar if we are on the Landing Page -->
    <aside v-if="!isLandingPage" class="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 border-r border-slate-800 transition-all">
      
      <!-- Sidebar Header -->
      <div class="p-6 flex items-center gap-3 cursor-pointer" @click="$router.push('/')">
        <div class="w-8 h-8">
          <BrandLogo />
        </div>
        <span class="text-xl font-bold text-white tracking-tight">Club<span class="text-indigo-500">OS</span></span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 space-y-2 mt-4">
        <router-link to="/selection" class="nav-row" active-class="active">
          <LayoutGrid class="w-5 h-5" />
          <span>Team Selection</span>
        </router-link>

        <router-link to="/wallet" class="nav-row" active-class="active">
          <Wallet class="w-5 h-5" />
          <span>Family Wallet</span>
        </router-link>

        <div class="nav-row opacity-50 cursor-not-allowed">
          <Users class="w-5 h-5" />
          <span>Club Members</span>
        </div>

        <div class="nav-row opacity-50 cursor-not-allowed">
          <Settings class="w-5 h-5" />
          <span>Settings</span>
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div class="p-4 border-t border-slate-800">
        <router-link to="/" class="flex items-center gap-3 text-sm font-medium hover:text-white transition">
          <LogOut class="w-4 h-4" />
          Back to Home
        </router-link>
      </div>
    </aside>

    <!-- === MAIN CONTENT AREA === -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      
      <!-- Mobile Header (App View Only) -->
      <div v-if="!isLandingPage" class="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8">
            <BrandLogo />
          </div>
          <span class="font-bold text-lg text-slate-900">ClubOS</span>
        </div>
        <router-link to="/" class="text-slate-500">
          <LogOut class="w-5 h-5" />
        </router-link>
      </div>

      <!-- THE MAGIC WINDOW: This is where pages appear -->
      <div class="flex-1 overflow-y-auto" :class="!isLandingPage ? 'p-0 md:p-8' : ''">
        <div :class="!isLandingPage ? 'max-w-5xl mx-auto' : 'w-full'">
          
          <!-- <router-view> swaps LandingPage.vue for TeamSelection.vue when URL changes -->
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>

        </div>
      </div>

      <!-- Mobile Bottom Nav (App View Only) -->
      <nav v-if="!isLandingPage" class="md:hidden bg-white border-t border-slate-200 flex justify-around items-center p-2 pb-safe z-30 sticky bottom-0">
        <router-link to="/selection" class="mobile-nav-item" active-class="active">
          <LayoutGrid class="w-6 h-6" />
          <span>Team</span>
        </router-link>

        <router-link to="/wallet" class="mobile-nav-item" active-class="active">
          <Wallet class="w-6 h-6" />
          <span>Wallet</span>
        </router-link>

        <div class="mobile-nav-item opacity-40">
          <Settings class="w-6 h-6" />
          <span>More</span>
        </div>
      </nav>

    </main>
  </div>
</template>

<style scoped>
/* Sidebar Styles */
.nav-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  color: #94a3b8;
}
.nav-row:hover { background-color: #1e293b; color: white; }
.nav-row.active { background-color: #4f46e5; color: white; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); }

/* Mobile Nav Styles */
.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s;
}
.mobile-nav-item.active { color: #4f46e5; }

/* Page Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
</style>

Step 3: Verify Router
Ensure your src/router/index.js looks like this (it connects the pieces):
import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../components/LandingPage.vue'
import TeamSelection from '../components/TeamSelection.vue'
import FamilyWallet from '../components/FamilyWallet.vue'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/selection', component: TeamSelection },
  { path: '/wallet', component: FamilyWallet }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router
