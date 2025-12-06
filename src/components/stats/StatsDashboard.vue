<script setup>
import { onMounted } from 'vue';
import { useStats } from '../../composables/useStats';
import { Trophy, Flame, TrendingUp, History } from 'lucide-vue-next';
import PlayerCard from './PlayerCard.vue';

const { loading, playerStats, matchHistory, fetchMyStats } = useStats();

onMounted(fetchMyStats);
</script>

<template>
  <div class="min-h-screen bg-slate-900 pb-24 text-slate-100">
    
    <!-- Dark Mode Header -->
    <div class="bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 p-6 border-b border-slate-800">
       <h1 class="text-2xl font-bold flex items-center gap-2">
         <Trophy class="w-6 h-6 text-amber-400" />
         My Career
       </h1>
    </div>

    <div v-if="loading" class="p-12 text-center text-slate-500">Loading Stats...</div>
    
    <div v-else-if="!playerStats" class="p-12 text-center border-2 border-dashed border-slate-800 rounded-xl m-6">
        <p class="text-slate-400">No player profile linked to this account.</p>
        <p class="text-xs text-slate-600 mt-2">Ask your admin to link your email.</p>
    </div>

    <div v-else class="p-6 space-y-8">
       
       <!-- 1. The Card -->
       <PlayerCard :player="playerStats" />

       <!-- 2. XP & Level -->
       <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
           <div class="flex justify-between items-end mb-2">
               <div class="text-xs font-bold text-indigo-400 uppercase">Current Level</div>
               <div class="text-3xl font-black text-white">{{ playerStats.stats.level }}</div>
           </div>
           
           <!-- Progress Bar -->
           <div class="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
               <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000" 
                    :style="{ width: playerStats.stats.progress + '%' }">
               </div>
           </div>
           <div class="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
               <span>{{ playerStats.stats.xp }} XP</span>
               <span>NEXT LEVEL</span>
           </div>
       </div>

       <!-- 3. Recent Form -->
       <div>
          <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
             <Flame class="w-4 h-4 text-orange-500" /> Recent Form
          </h3>
          
          <div class="space-y-3">
              <div v-for="(match, i) in matchHistory" :key="i" 
                   class="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div class="flex items-center gap-4">
                      <!-- Result Badge -->
                      <div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                           :class="{
                             'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30': match.result === 'W',
                             'bg-rose-500/20 text-rose-400 border border-rose-500/30': match.result === 'L',
                             'bg-slate-600/20 text-slate-400 border border-slate-600/30': match.result === 'D'
                           }">
                         {{ match.result }}
                      </div>
                      <div>
                          <div class="font-bold text-white text-sm">{{ match.opponent }}</div>
                          <div class="text-xs text-slate-500">{{ new Date(match.date).toLocaleDateString() }}</div>
                      </div>
                  </div>
                  <div class="text-right">
                      <div class="font-mono font-bold text-slate-300">{{ match.score }}</div>
                      <div v-if="match.performance" class="text-[10px] text-amber-400 mt-0.5">{{ match.performance }}</div>
                  </div>
              </div>
          </div>
       </div>

    </div>
  </div>
</template>
