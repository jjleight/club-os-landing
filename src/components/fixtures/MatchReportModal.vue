<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../../supabase';
import { useToast } from '../../composables/useToast';
import { Trophy, Star, Save, X } from 'lucide-vue-next';

const props = defineProps(['match']);
const emit = defineEmits(['close', 'saved']);
const { showToast } = useToast();

const loading = ref(true);
const saving = ref(false);
const squad = ref([]);

// Match Result State
const resultForm = ref({
  home_score: 0,
  away_score: 0
});

onMounted(async () => {
  if (props.match) {
    resultForm.value.home_score = props.match.home_score || 0;
    resultForm.value.away_score = props.match.away_score || 0;
    await fetchSquad();
  }
});

async function fetchSquad() {
  // FIX: Moved 'position' out of 'players()' and into the main list
  // because it lives on the 'appearances' table (match specific)
  const { data, error } = await supabase
    .from('appearances')
    .select(`
        id, 
        player_id, 
        goals, 
        assists, 
        motm, 
        rating,
        position, 
        players (first_name, last_name)
    `)
    .eq('match_id', props.match.id);

  if (error) {
    console.error("Error fetching squad:", error);
    showToast('Error', 'Could not load squad.', 'error');
  } else {
    // Client-side sort
    const sortedData = (data || []).sort((a, b) => {
        const nameA = a.players?.last_name || '';
        const nameB = b.players?.last_name || '';
        return nameA.localeCompare(nameB);
    });

    squad.value = sortedData.map(a => ({
      id: a.id, 
      name: a.players ? `${a.players.first_name} ${a.players.last_name}` : 'Unknown Player',
      position: a.position, // FIX: Read from appearance, not player
      goals: a.goals || 0,
      assists: a.assists || 0,
      motm: a.motm || false,
      rating: a.rating || 6 
    }));
  }
  loading.value = false;
}

const saveReport = async () => {
  saving.value = true;
  try {
    let result = 'D';
    const us = props.match.is_home ? resultForm.value.home_score : resultForm.value.away_score;
    const them = props.match.is_home ? resultForm.value.away_score : resultForm.value.home_score;
    
    if (us > them) result = 'W';
    else if (us < them) result = 'L';

    const { error: matchError } = await supabase
      .from('matches')
      .update({
        home_score: resultForm.value.home_score,
        away_score: resultForm.value.away_score,
        result: result,
        status: 'Played'
      })
      .eq('id', props.match.id);
    
    if (matchError) throw matchError;

    for (const p of squad.value) {
      await supabase
        .from('appearances')
        .update({
           goals: p.goals,
           assists: p.assists,
           motm: p.motm,
           rating: p.rating
        })
        .eq('id', p.id);
    }

    showToast('Report Saved', 'Match stats updated successfully.', 'success');
    emit('saved');
    emit('close');

  } catch (e) {
    console.error(e);
    showToast('Error', 'Failed to save report.', 'error');
  } finally {
    saving.value = false;
  }
};

const setMotm = (playerId) => {
    squad.value.forEach(p => {
        p.motm = (p.id === playerId) ? !p.motm : false; 
    });
};
</script>

<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center px-4">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <div class="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
      
      <!-- Header -->
      <div class="bg-indigo-600 p-6 text-center text-white relative">
         <button @click="$emit('close')" class="absolute top-4 right-4 text-indigo-200 hover:text-white transition">
             <X class="w-5 h-5" />
         </button>
         <div class="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
             <Trophy class="w-3 h-3" /> Match Report
         </div>
         <h2 class="text-2xl font-black tracking-tight">{{ match.teams.name }}</h2>
         <p class="text-sm opacity-80 font-medium">vs {{ match.opponent_name }}</p>
      </div>

      <!-- Scoreboard -->
      <div class="bg-slate-50 p-6 border-b border-slate-200 flex justify-center items-center gap-8">
          <div class="text-center">
             <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Home</label>
             <input type="number" v-model="resultForm.home_score" class="w-16 h-16 text-center text-3xl font-black bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm text-slate-900" />
          </div>
          <div class="text-2xl font-black text-slate-300">-</div>
          <div class="text-center">
             <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Away</label>
             <input type="number" v-model="resultForm.away_score" class="w-16 h-16 text-center text-3xl font-black bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm text-slate-900" />
          </div>
      </div>

      <!-- Player List -->
      <div class="flex-1 overflow-y-auto p-0 bg-white">
         <div v-if="loading" class="p-12 text-center text-slate-400">Loading Squad...</div>
         
         <div v-else-if="squad.length === 0" class="p-12 text-center border-b border-slate-100">
            <p class="text-slate-500 font-bold mb-1">No players found.</p>
            <p class="text-xs text-slate-400">Did you select a squad for this match yet?</p>
         </div>

         <div v-else class="divide-y divide-slate-100">
             <div v-for="player in squad" :key="player.id" class="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                
                <div class="flex items-center gap-3 w-1/3">
                    <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200">
                        {{ player.name.charAt(0) }}
                    </div>
                    <div class="min-w-0">
                        <div class="font-bold text-sm text-slate-900 truncate">{{ player.name }}</div>
                        <div class="text-[10px] text-slate-400 font-mono font-medium">{{ player.position || 'SUB' }}</div>
                    </div>
                </div>

                <!-- Controls -->
                <div class="flex items-center gap-4">
                    
                    <!-- Goals Counter -->
                    <div class="flex flex-col items-center gap-1">
                        <span class="text-[9px] text-slate-400 font-bold uppercase">Gls</span>
                        <div class="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm">
                           <button @click="player.goals > 0 ? player.goals-- : null" class="px-2 py-1 text-slate-400 hover:bg-slate-100 rounded-l-lg font-bold border-r border-slate-100">-</button>
                           <span class="text-sm font-bold w-6 text-center text-slate-900">{{ player.goals }}</span>
                           <button @click="player.goals++" class="px-2 py-1 text-indigo-600 hover:bg-indigo-50 rounded-r-lg font-bold border-l border-slate-100">+</button>
                        </div>
                    </div>

                    <!-- MOTM Toggle -->
                    <div class="flex flex-col items-center gap-1">
                        <span class="text-[9px] text-slate-400 font-bold uppercase" :class="{'text-amber-500': player.motm}">Motm</span>
                        <button @click="setMotm(player.id)" 
                                class="w-8 h-8 rounded-full flex items-center justify-center transition-all border shadow-sm"
                                :class="player.motm ? 'bg-amber-100 border-amber-300' : 'bg-white border-slate-200 hover:border-amber-200'">
                            <Star class="w-4 h-4 transition-colors" :class="player.motm ? 'fill-amber-500 text-amber-500' : 'text-slate-300'" />
                        </button>
                    </div>
                </div>

             </div>
         </div>
      </div>

      <!-- Footer -->
      <div class="p-4 bg-white border-t border-slate-100 flex justify-end gap-3 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)] z-10">
         <button @click="$emit('close')" class="px-5 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl transition">Cancel</button>
         <button @click="saveReport" :disabled="saving" class="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition flex items-center gap-2 active:scale-95 disabled:opacity-50">
            <Save class="w-4 h-4" />
            {{ saving ? 'Saving...' : 'Submit Report' }}
         </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
