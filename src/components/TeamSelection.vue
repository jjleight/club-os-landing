<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import { AlertTriangle, CheckCircle2, XCircle, ShieldAlert, Plus, Minus } from 'lucide-vue-next';

const loading = ref(true);
const players = ref([]);
const teamName = "Mens 2nd XI"; 
const LEAGUE_LIMIT = 5; 

// We need a valid Match ID to attach dummy appearances to.
// In a real app, this would be specific. For the demo, we just need ANY 1st XI match ID.
let demoMatchId = null;

onMounted(async () => {
  await setupDemoData();
  await fetchSquadData();
});

async function setupDemoData() {
  // Find a 1st XI match to use for our "Fake" appearances
  const { data } = await supabase
    .from('matches')
    .select('id, teams!inner(team_level)')
    .eq('teams.team_level', 1) // Must be a 1st XI match
    .limit(1);
    
  if (data && data.length > 0) {
    demoMatchId = data[0].id;
  }
}

async function fetchSquadData() {
  try {
    const { data: playerData, error } = await supabase
      .from('players')
      .select('*')
      .order('last_name');

    if (error) throw error;

    const processedPlayers = await Promise.all(playerData.map(async (p) => {
      // Count games for 1st XI (Level 1)
      const { count } = await supabase
        .from('appearances')
        .select('*, matches!inner(teams!inner(*))', { count: 'exact', head: true })
        .eq('player_id', p.id)
        .lt('matches.teams.team_level', 2); 

      return {
        ...p,
        first_team_apps: count,
        status: count > LEAGUE_LIMIT ? 'ineligible' : (count === LEAGUE_LIMIT ? 'risk' : 'eligible')
      };
    }));

    players.value = processedPlayers;
  } catch (error) {
    console.error('Error fetching squad:', error);
  } finally {
    loading.value = false;
  }
}

// --- DEMO CONTROLS ---

const addApp = async (player) => {
  if (!demoMatchId) return alert("No 1st XI matches found in DB to link to!");
  
  // Optimistic Update (Make UI feel instant)
  player.first_team_apps++;
  updateStatus(player);

  // Real DB Insert
  await supabase.from('appearances').insert({
    match_id: demoMatchId,
    player_id: player.id,
    type: 'Start'
  });
  
  // Background refresh to ensure sync
  fetchSquadData();
};

const removeApp = async (player) => {
  if (player.first_team_apps <= 0) return;

  // Optimistic Update
  player.first_team_apps--;
  updateStatus(player);

  // Real DB Delete (Find the latest one and kill it)
  // We need to find an ID to delete first
  const { data } = await supabase
    .from('appearances')
    .select('id, matches!inner(teams!inner(team_level))')
    .eq('player_id', player.id)
    .lt('matches.teams.team_level', 2) // Ensure we delete a 1st XI app
    .limit(1);

  if (data && data.length > 0) {
    await supabase.from('appearances').delete().eq('id', data[0].id);
  }
  
  fetchSquadData();
};

// Helper to flip the colors instantly on button click
const updateStatus = (player) => {
  player.status = player.first_team_apps > LEAGUE_LIMIT 
    ? 'ineligible' 
    : (player.first_team_apps === LEAGUE_LIMIT ? 'risk' : 'eligible');
};
</script>

<template>
  <div class="w-full bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden min-h-[80vh] flex flex-col">
    
    <!-- App Header -->
    <div class="bg-slate-900 text-white p-6 pt-8 shadow-lg relative z-10">
      <div class="flex justify-between items-center mb-4">
        <div>
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Team Selection</div>
          <h1 class="font-bold text-2xl">{{ teamName }}</h1>
        </div>
        <div class="text-xs font-bold bg-indigo-500 px-3 py-1.5 rounded-lg text-white border border-indigo-400/30">
          Matchday 12
        </div>
      </div>
      
      <!-- Legend -->
      <div class="flex gap-4 text-xs font-medium text-slate-400 bg-slate-800/50 p-2 rounded-lg inline-flex">
        <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-emerald-500"></div> Eligible</div>
        <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-rose-500"></div> Ineligible</div>
      </div>
    </div>

    <!-- The Squad List -->
    <div class="p-4 space-y-3 flex-1 bg-slate-50 overflow-y-auto">
      <div v-if="loading" class="text-center py-10 text-slate-400 flex flex-col items-center gap-2">
        <div class="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        Calculating Rules...
      </div>
      
      <div v-else v-for="player in players" :key="player.id" 
           class="group bg-white p-4 rounded-xl border shadow-sm transition-all duration-300"
           :class="player.status === 'ineligible' ? 'border-rose-200 bg-rose-50/40' : 'border-slate-200 hover:border-indigo-300'">
        
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <!-- Avatar -->
            <div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm border-2"
                 :class="player.status === 'ineligible' ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-slate-100 text-slate-600 border-slate-100'">
              {{ player.first_name[0] }}{{ player.last_name[0] }}
            </div>
            
            <!-- Details -->
            <div>
              <div class="font-bold text-slate-900 text-lg">{{ player.first_name }} {{ player.last_name }}</div>
              
              <!-- Smart Logic Display -->
              <div class="text-sm flex items-center gap-2 mt-1">
                <span v-if="player.status === 'ineligible'" class="text-rose-600 font-bold flex items-center gap-1">
                  <ShieldAlert class="w-4 h-4" /> Ineligible
                </span>
                <span v-else-if="player.status === 'risk'" class="text-amber-500 font-bold flex items-center gap-1">
                  <AlertTriangle class="w-4 h-4" /> Cup Tied Risk
                </span>
                <span v-else class="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 class="w-4 h-4" /> Available
                </span>
              </div>
            </div>
          </div>

          <!-- DEMO CONTROLS (The Magic) -->
          <div class="flex flex-col items-end gap-1">
             <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">1st XI Apps</div>
             <div class="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
               <button @click.stop="removeApp(player)" class="w-8 h-8 flex items-center justify-center rounded hover:bg-white hover:shadow-sm text-slate-500 transition">
                 <Minus class="w-4 h-4" />
               </button>
               <div class="w-8 text-center font-mono font-bold" 
                    :class="player.first_team_apps > LEAGUE_LIMIT ? 'text-rose-600' : 'text-slate-700'">
                 {{ player.first_team_apps }}
               </div>
               <button @click.stop="addApp(player)" class="w-8 h-8 flex items-center justify-center rounded hover:bg-white hover:shadow-sm text-indigo-600 transition">
                 <Plus class="w-4 h-4" />
               </button>
             </div>
          </div>
        </div>

        <!-- The "Why?" Explainer -->
        <div v-if="player.status === 'ineligible'" class="mt-4 text-sm bg-white p-3 rounded-lg text-rose-700 border border-rose-100 flex gap-3 items-start shadow-sm animate-pulse-slow">
           <AlertTriangle class="w-5 h-5 mt-0.5 shrink-0" />
           <span>
             <strong>League Rule 4.2 Violation:</strong> 
             {{ player.first_name }} has {{ player.first_team_apps }} appearances for a higher team. 
             The limit is {{ LEAGUE_LIMIT }}.
           </span>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
.animate-pulse-slow {
  animation: pulse-slow 2s infinite ease-in-out;
}
</style>
