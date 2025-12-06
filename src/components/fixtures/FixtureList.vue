<script setup>
import { MapPin, Edit2, Trash2, XCircle, AlertOctagon, CheckSquare, Shirt, Medal } from 'lucide-vue-next';

defineProps({
  groupedFixtures: Object
});

const emit = defineEmits(['edit', 'delete', 'updateStatus', 'report']);
</script>

<template>
  <div class="space-y-8">
    <div v-for="(matches, date) in groupedFixtures" :key="date" class="animate-fade-in">
      
      <div class="flex items-center gap-4 mb-4 sticky top-44 z-0">
         <div class="h-px bg-slate-200 flex-1"></div>
         <span class="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-4 py-1 rounded-full border border-slate-200">
           {{ new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) }}
         </span>
         <div class="h-px bg-slate-200 flex-1"></div>
      </div>

      <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
         <div v-for="match in matches" :key="match.id" 
              class="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              :class="{
                'border-rose-200 bg-rose-50/30': match.status === 'Cancelled',
                'border-amber-200 bg-amber-50/30': match.status === 'Postponed',
                'border-emerald-200 bg-emerald-50/20': match.status === 'Played',
                'border-slate-200': match.status === 'Scheduled'
              }">
            
            <div class="flex items-start sm:items-center gap-4 flex-1 min-w-0">
              <div class="text-center w-12 shrink-0">
                 <div class="text-xs font-bold text-slate-400">{{ match.match_time?.slice(0,5) }}</div>
                 <div class="text-[10px] font-bold uppercase mt-1 px-1 py-0.5 rounded"
                      :class="match.is_home ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'">
                    {{ match.is_home ? 'Home' : 'Away' }}
                 </div>
              </div>
              
              <div class="min-w-0 flex-1">
                 <div class="flex items-center gap-2 mb-0.5">
                   <span class="text-xs font-bold text-indigo-600 truncate">{{ match.teams.name }}</span>
                   <span v-if="match.kit" class="text-[10px] flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 text-slate-500">
                     <Shirt class="w-3 h-3" /> {{ match.kit }}
                   </span>
                 </div>

                 <div class="font-bold text-slate-900 text-lg truncate flex items-center gap-2 flex-wrap">
                    <span class="truncate">vs {{ match.opponent_name }}</span>
                    <span v-if="match.status === 'Played'" class="text-[10px] px-1.5 py-0.5 rounded text-white bg-emerald-500 uppercase tracking-wide">
                        {{ match.home_score }} - {{ match.away_score }}
                    </span>
                    <span v-else-if="match.status !== 'Scheduled'" class="text-[10px] px-1.5 py-0.5 rounded text-white bg-rose-500 uppercase tracking-wide">
                      {{ match.status }}
                    </span>
                 </div>

                 <div v-if="match.location" class="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                    <MapPin class="w-3 h-3 shrink-0" />
                    {{ match.location }}
                 </div>
              </div>
            </div>

            <div class="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-auto">
               
               <!-- NEW REPORT BUTTON -->
               <button @click="$emit('report', match)" 
                       class="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-xs font-bold flex items-center gap-1" 
                       title="Match Report">
                 <Medal class="w-3 h-3" /> Report
               </button>

               <div class="h-4 w-px bg-slate-200 mx-1"></div>

               <button @click="$emit('edit', match)" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Edit">
                 <Edit2 class="w-4 h-4" />
               </button>
               
               <div v-if="match.status === 'Scheduled'" class="flex gap-1">
                   <button @click="$emit('updateStatus', match, 'Postponed')" class="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg" title="Postpone">
                     <AlertOctagon class="w-4 h-4" />
                   </button>
                   <button @click="$emit('updateStatus', match, 'Cancelled')" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg" title="Cancel">
                     <XCircle class="w-4 h-4" />
                   </button>
               </div>
               
               <button @click="$emit('delete', match.id)" class="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition ml-2">
                 <Trash2 class="w-4 h-4" />
               </button>
            </div>

         </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
