<script setup>
defineProps(['player']);
</script>

<template>
  <div class="relative w-64 h-96 mx-auto perspective-1000 group cursor-pointer">
    
    <!-- The Card Container -->
    <div class="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border-4 border-amber-400 shadow-2xl shadow-amber-500/20 flex flex-col items-center overflow-hidden transform transition-transform duration-500 hover:rotate-y-12 hover:scale-105">
        
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        <!-- Rating & Position -->
        <div class="absolute top-4 left-4 text-left z-10">
            <div class="text-4xl font-black text-amber-400 leading-none">{{ player.stats.overall }}</div>
            <div class="text-lg font-bold text-slate-300 uppercase">{{ player.position?.substring(0,3) || 'PLY' }}</div>
        </div>

        <!-- Avatar (Using initials or image if we had it) -->
        <div class="mt-8 w-32 h-32 rounded-full bg-gradient-to-t from-slate-700 to-slate-600 border-4 border-amber-400/50 flex items-center justify-center relative z-10 shadow-lg">
             <span class="text-4xl font-bold text-white">{{ player.first_name[0] }}{{ player.last_name[0] }}</span>
        </div>

        <!-- Name -->
        <div class="mt-4 text-center z-10">
             <h2 class="text-2xl font-black text-white uppercase tracking-wider drop-shadow-md">{{ player.last_name }}</h2>
             <p class="text-xs font-bold text-amber-400 uppercase tracking-widest">{{ player.teamName }}</p>
        </div>

        <!-- Stats Grid -->
        <div class="w-full px-6 mt-6 grid grid-cols-3 gap-2 text-center z-10">
            <div>
               <div class="text-xs font-bold text-slate-400 uppercase">Apps</div>
               <div class="text-lg font-bold text-white">{{ player.stats.apps }}</div>
            </div>
            <div>
               <div class="text-xs font-bold text-slate-400 uppercase">Goals</div>
               <div class="text-lg font-bold text-emerald-400">{{ player.stats.goals }}</div>
            </div>
            <div>
               <div class="text-xs font-bold text-slate-400 uppercase">MOTM</div>
               <div class="text-lg font-bold text-purple-400">{{ player.stats.motm }}</div>
            </div>
        </div>
        
        <!-- Shine Effect -->
        <div class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>

    </div>
  </div>
</template>

<style scoped>
.perspective-1000 { perspective: 1000px; }
.rotate-y-12 { transform: rotateY(12deg); }
</style>
