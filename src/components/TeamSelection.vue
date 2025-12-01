<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { supabase } from '../supabase';
import { useClub } from '../composables/useClub';
import { useToast } from '../composables/useToast';
import { useConfirm } from '../composables/useConfirm';
import { 
  AlertTriangle, CheckCircle2, ShieldAlert, 
  Calendar, Users, ChevronDown, Search, Filter,
  LayoutTemplate, Shirt
} from 'lucide-vue-next';

const { activeClubId } = useClub();
const { showToast } = useToast();
const { showConfirm } = useConfirm();

const loading = ref(true);
const matches = ref([]);
const selectedMatchId = ref(null);
const players = ref([]);
const leagueLimit = ref(5); 
const viewMode = ref('squad'); // 'squad' | 'club'
const displayMode = ref('list'); // 'list' | 'pitch'
const searchQuery = ref('');

// Derived State
const currentMatch = computed(() => matches.value.find(m => m.id === selectedMatchId.value));
const teamFormat = computed(() => currentMatch.value?.teams?.format || '11v11');

onMounted(async () => {
  await loadInitialData();
});

watch(selectedMatchId, (newId) => { if (newId) fetchPlayerStatus(newId); });
watch(viewMode, () => { if (selectedMatchId.value) fetchPlayerStatus(selectedMatchId.value); });

async function loadInitialData() {
  loading.value = true;
  await fetchRules();
  await fetchUpcomingMatches();
  if (matches.value.length > 0) selectedMatchId.value = matches.value[0].id;
  loading.value = false;
}

async function fetchRules() {
  const { data } = await supabase.from('league_rules').select('threshold_value').eq('rule_type', 'max_higher_apps').single();
  if (data) leagueLimit.value = data.threshold_value;
}

async function fetchUpcomingMatches() {
  const { data } = await supabase
    .from('matches')
    .select(`*, teams!inner(*)`)
    .eq('teams.club_id', activeClubId.value)
    .eq('status', 'Scheduled')
    .order('match_date', { ascending: true });
  matches.value = data || [];
}

async function fetchPlayerStatus(matchId) {
  loading.value = true;
  const match = matches.value.find(m => m.id === matchId);
  if (!match) return;

  try {
    const { data: allPlayers } = await supabase
      .from('players')
      .select(`*, team_memberships!left (team_id)`)
      .eq('club_id', activeClubId.value)
      .order('last_name');

    const { data: currentSelections } = await supabase
      .from('appearances')
      .select('player_id, position')
      .eq('match_id', matchId);
      
    const selectionMap = new Map(currentSelections?.map(a => [a.player_id, a.position]));

    const filteredList = allPlayers.filter(p => {
      const isSelected = selectionMap.has(p.id);
      if (searchQuery.value) {
        const term = searchQuery.value.toLowerCase();
        return p.first_name.toLowerCase().includes(term) || p.last_name.toLowerCase().includes(term);
      }
      if (isSelected) return true;
      // Coach Filter: Only show my squad by default
      if (viewMode.value === 'squad') return p.team_memberships?.some(m => m.team_id === match.team_id);
      return true;
    });

    const processedPlayers = await Promise.all(filteredList.map(async (p) => {
      const { count } = await supabase
        .from('appearances')
        .select('*, matches!inner(match_date, teams!inner(team_level))', { count: 'exact', head: true })
        .eq('player_id', p.id)
        .lt('matches.teams.team_level', match.teams.team_level)
        .lt('matches.match_date', match.match_date);

      let status = 'eligible';
      if (count > leagueLimit.value) status = 'ineligible';
      else if (count === leagueLimit.value) status = 'risk';

      return {
        ...p,
        isSelected: selectionMap.has(p.id),
        position: selectionMap.get(p.id) || 'SUB', // Default to SUB
        higherApps: count,
        status
      };
    }));

    players.value = processedPlayers.sort((a, b) => (a.isSelected === b.isSelected ? 0 : a.isSelected ? -1 : 1));
  } catch (err) { console.error(err); } 
  finally { loading.value = false; }
}

const togglePlayer = async (player, desiredPos = 'SUB') => {
  if (loading.value) return;

  if (!player.isSelected) {
    if (player.status === 'ineligible') {
      if (!await showConfirm("⚠️ Ineligible Player", "Selecting may result in a fine. Proceed?")) return;
    }
    
    const { error } = await supabase.from('appearances').insert({
      match_id: selectedMatchId.value,
      player_id: player.id,
      type: 'Start',
      position: desiredPos 
    });
    
    if (error) return showToast('Error', error.message, 'error');
    player.isSelected = true;
    player.position = desiredPos;

  } else {
    const { error } = await supabase
      .from('appearances')
      .delete()
      .eq('match_id', selectedMatchId.value)
      .eq('player_id', player.id);

    if (error) return showToast('Error', error.message, 'error');
    player.isSelected = false;
    player.position = null;
  }
};

const setPosition = async (player, pos) => {
    if (!player.isSelected) {
        await togglePlayer(player, pos);
    } else {
        const { error } = await supabase.from('appearances')
            .update({ position: pos })
            .eq('match_id', selectedMatchId.value)
            .eq('player_id', player.id);
        if(!error) player.position = pos;
    }
}

const selectedCount = computed(() => players.value.filter(p => p.isSelected).length);
const selectedPlayers = computed(() => players.value.filter(p => p.isSelected));
</script>

<template>
  <div class="w-full bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden min-h-[80vh] flex flex-col">
    
    <!-- Header -->
    <div class="bg-slate-900 text-white p-6 pt-8 shadow-lg relative z-10 space-y-6">
      
      <!-- Match Selector -->
      <div v-if="matches.length > 0" class="relative">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Select Fixture</label>
          <select v-model="selectedMatchId" 
                  class="w-full bg-slate-800 border border-slate-700 text-white text-lg font-bold rounded-xl py-3 pl-4 pr-10 appearance-none focus:ring-2 focus:ring-indigo-500 outline-none transition">
            <option v-for="m in matches" :key="m.id" :value="m.id">
              vs {{ m.opponent_name }} ({{ m.teams.format || '11v11' }})
            </option>
          </select>
          <ChevronDown class="absolute right-4 bottom-3.5 text-slate-400 pointer-events-none w-5 h-5" />
      </div>
      <div v-else class="text-center py-2 text-slate-400">No matches scheduled.</div>

      <!-- Controls Row -->
      <div class="flex items-center gap-2">
          <!-- View Mode (Squad vs Club) -->
          <div class="flex bg-slate-800 p-1 rounded-lg flex-1">
            <button @click="viewMode = 'squad'" 
                    class="flex-1 py-2 rounded-md text-xs font-bold transition-all"
                    :class="viewMode === 'squad' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'">
               Squad Only
            </button>
            <button @click="viewMode = 'club'" 
                    class="flex-1 py-2 rounded-md text-xs font-bold transition-all"
                    :class="viewMode === 'club' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-white'">
               Whole Club
            </button>
          </div>

          <!-- Display Mode (List vs Pitch) -->
          <div class="flex bg-slate-800 p-1 rounded-lg">
             <button @click="displayMode = 'list'" class="p-2 rounded hover:bg-slate-700" :class="{'text-indigo-400': displayMode==='list', 'text-slate-400': displayMode!=='list'}"><Users class="w-4 h-4" /></button>
             <button @click="displayMode = 'pitch'" class="p-2 rounded hover:bg-slate-700" :class="{'text-indigo-400': displayMode==='pitch', 'text-slate-400': displayMode!=='pitch'}"><LayoutTemplate class="w-4 h-4" /></button>
          </div>
      </div>
      
      <div class="flex justify-between items-end pt-2 border-t border-slate-800">
         <div class="text-xs text-slate-400">{{ teamFormat }} Format</div>
         <div class="text-right"><span class="text-2xl font-bold">{{ selectedCount }}</span><span class="text-[10px] text-slate-400 uppercase font-bold ml-1">Selected</span></div>
      </div>
    </div>

    <!-- 1. LIST VIEW -->
    <div v-if="displayMode === 'list'" class="p-4 space-y-2 flex-1 bg-slate-50 overflow-y-auto">
      <div class="relative mb-4"><Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input v-model="searchQuery" @input="fetchPlayerStatus(selectedMatchId)" type="text" placeholder="Search player..." class="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 text-sm outline-none focus:ring-2 focus:ring-indigo-500" /></div>
      
      <div v-for="player in players" :key="player.id" 
           class="group p-3 rounded-xl border shadow-sm transition-all duration-200 bg-white border-slate-200 flex flex-col gap-2"
           :class="{'ring-1 ring-indigo-500 bg-indigo-50': player.isSelected}">
        
        <div class="flex items-center justify-between cursor-pointer" @click="togglePlayer(player)">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors border" :class="player.isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'">{{ player.first_name[0] }}</div>
                <div>
                    <div class="font-bold text-sm text-slate-900">{{ player.first_name }} {{ player.last_name }}</div>
                    <div v-if="player.status !== 'eligible'" class="text-[10px] font-bold text-rose-600 flex items-center gap-1"><ShieldAlert class="w-3 h-3" /> Ineligible</div>
                </div>
            </div>
            <CheckCircle2 v-if="player.isSelected" class="w-5 h-5 text-indigo-600" />
            <div v-else class="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-indigo-300"></div>
        </div>

        <!-- Position Selector -->
        <div v-if="player.isSelected" class="border-t border-indigo-100 pt-2 flex gap-1 justify-between">
            <button v-for="pos in ['GK', 'DEF', 'MID', 'FWD', 'SUB']" :key="pos"
                    @click.stop="setPosition(player, pos)"
                    class="text-[10px] font-bold px-2 py-1 rounded transition border"
                    :class="player.position === pos ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'">
                {{ pos }}
            </button>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="!loading && players.length === 0" class="text-center py-10 text-slate-400">
        No players found. <span v-if="viewMode === 'squad'">Try "Whole Club" mode.</span>
      </div>
    </div>

    <!-- 2. PITCH VIEW -->
    <div v-else class="flex-1 bg-emerald-800 relative overflow-hidden flex flex-col">
        <!-- Pitch Graphics -->
        <div class="absolute inset-4 border-2 border-white/30 rounded-lg pointer-events-none"></div>
        <div class="absolute top-1/2 left-4 right-4 h-px bg-white/30 pointer-events-none"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white/30 pointer-events-none"></div>

        <!-- Zones -->
        <div class="flex-1 flex flex-col relative z-10 p-4 gap-4 justify-between">
            <!-- FWD -->
            <div class="flex justify-center items-center gap-4 h-1/4">
                 <div v-for="p in selectedPlayers.filter(x => x.position === 'FWD')" :key="p.id" class="player-dot">{{ p.first_name }}</div>
            </div>
            <!-- MID -->
            <div class="flex justify-center items-center gap-4 h-1/4">
                 <div v-for="p in selectedPlayers.filter(x => x.position === 'MID')" :key="p.id" class="player-dot">{{ p.first_name }}</div>
            </div>
            <!-- DEF -->
            <div class="flex justify-center items-center gap-4 h-1/4">
                 <div v-for="p in selectedPlayers.filter(x => x.position === 'DEF')" :key="p.id" class="player-dot">{{ p.first_name }}</div>
            </div>
            <!-- GK -->
            <div class="flex justify-center h-auto pb-2">
                 <div v-for="p in selectedPlayers.filter(x => x.position === 'GK')" :key="p.id" class="player-dot bg-yellow-400 text-yellow-900 border-yellow-200">{{ p.first_name }}</div>
            </div>
        </div>

        <!-- Bench -->
        <div class="bg-slate-900/90 p-3 border-t border-white/10">
            <div class="text-[10px] text-slate-400 uppercase font-bold mb-2">Substitutes</div>
            <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                 <div v-for="p in selectedPlayers.filter(x => x.position === 'SUB')" :key="p.id" 
                      class="shrink-0 bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    {{ p.first_name }}
                 </div>
                 <div v-if="selectedPlayers.filter(x => x.position === 'SUB').length === 0" class="text-slate-500 text-xs italic">Bench empty</div>
            </div>
        </div>
    </div>

  </div>
</template>

<style scoped>
.player-dot {
    background: white; color: #0F172A; font-size: 10px; font-weight: 800;
    padding: 4px 8px; border-radius: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    border: 2px solid rgba(255,255,255,0.8); text-transform: uppercase;
    min-width: 48px; text-align: center;
}
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
