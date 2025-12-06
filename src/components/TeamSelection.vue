<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { supabase } from '../supabase';
import { useClub } from '../composables/useClub';
import { useToast } from '../composables/useToast';
import { useConfirm } from '../composables/useConfirm';
import { useUser } from '../composables/useUser'; // Permissions
import { 
  AlertTriangle, CheckCircle2, ShieldAlert, 
  Calendar, Users, ChevronDown, Search, Filter,
  LayoutTemplate, Shirt
} from 'lucide-vue-next';

// Sub-Components
import SelectionHeader from './selection/SelectionHeader.vue';
import PlayerList from './selection/PlayerList.vue';
import PitchView from './selection/PitchView.vue';

const { activeClubId } = useClub();
const { showToast } = useToast();
const { showConfirm } = useConfirm();
const { permissions } = useUser();

const loading = ref(true);
const matches = ref([]);
const selectedMatchId = ref(null);
const players = ref([]);
const leagueLimit = ref(5); 
const viewMode = ref('squad'); 
const displayMode = ref('list'); 
const searchQuery = ref('');

// Derived State
const currentMatch = computed(() => matches.value.find(m => m.id === selectedMatchId.value));
const teamFormat = computed(() => currentMatch.value?.teams?.format || '11v11');
const selectedPlayers = computed(() => players.value.filter(p => p.isSelected));

onMounted(async () => {
  await loadInitialData();
});

// --- THE FIX: Watch for Club ID Changes ---
watch(activeClubId, async (newId) => {
  if (newId) {
      console.log("Club Context Changed:", newId);
      await loadInitialData();
  }
});

watch(selectedMatchId, (newId) => { if (newId) fetchPlayerStatus(newId); });
watch(viewMode, () => { if (selectedMatchId.value) fetchPlayerStatus(selectedMatchId.value); });

const handleSearch = (query) => {
    searchQuery.value = query;
    if (selectedMatchId.value) fetchPlayerStatus(selectedMatchId.value);
};

async function loadInitialData() {
  loading.value = true;
  await fetchRules();
  await fetchUpcomingMatches();
  if (matches.value.length > 0) {
      selectedMatchId.value = matches.value[0].id;
  } else {
      // Clear players if no matches (prevents stale data)
      players.value = [];
  }
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
    .eq('teams.club_id', activeClubId.value) // REACTIVE ID
    .eq('status', 'Scheduled')
    .order('match_date', { ascending: true });
  
  let allMatches = data || [];

  // Filter by Coach Permissions
  if (permissions.value.managedTeamIds !== 'all') {
      allMatches = allMatches.filter(m => permissions.value.managedTeamIds.includes(m.team_id));
  }

  matches.value = allMatches;
}

async function fetchPlayerStatus(matchId) {
  loading.value = true;
  const match = matches.value.find(m => m.id === matchId);
  if (!match) return;

  try {
    // 1. Fetch All Players for ACTIVE CLUB
    const { data: allPlayers } = await supabase
      .from('players')
      .select(`*, team_memberships!left (team_id)`)
      .eq('club_id', activeClubId.value)
      .order('last_name');

    // 2. Fetch Selections
    const { data: currentSelections } = await supabase
      .from('appearances')
      .select('player_id, position')
      .eq('match_id', matchId);
      
    // 3. Fetch Availability
    const { data: availabilityData } = await supabase
      .from('match_availability')
      .select('player_id, status, note')
      .eq('match_id', matchId);

    const selectionMap = new Map(currentSelections?.map(a => [a.player_id, a.position]));
    const availabilityMap = new Map(availabilityData?.map(a => [a.player_id, a]));

    // Filter
    const filteredList = allPlayers.filter(p => {
      const isSelected = selectionMap.has(p.id);
      if (searchQuery.value) {
        const term = searchQuery.value.toLowerCase();
        return p.first_name.toLowerCase().includes(term) || p.last_name.toLowerCase().includes(term);
      }
      if (isSelected) return true;
      if (viewMode.value === 'squad') return p.team_memberships?.some(m => m.team_id === match.team_id);
      return true;
    });

    // Process
    const processedPlayers = await Promise.all(filteredList.map(async (p) => {
      const { count } = await supabase
        .from('appearances')
        .select('*, matches!inner(match_date, teams!inner(team_level))', { count: 'exact', head: true })
        .eq('player_id', p.id)
        .lt('matches.teams.team_level', match.teams.team_level)
        .lt('matches.match_date', match.match_date);

      let complianceStatus = 'eligible';
      if (count > leagueLimit.value) complianceStatus = 'ineligible';
      else if (count === leagueLimit.value) complianceStatus = 'risk';

      const availRecord = availabilityMap.get(p.id);

      return {
        ...p,
        isSelected: selectionMap.has(p.id),
        position: selectionMap.get(p.id) || 'SUB', 
        higherApps: count,
        complianceStatus,
        availability: availRecord?.status || 'Unknown'
      };
    }));

    players.value = processedPlayers.sort((a, b) => {
        if (a.isSelected !== b.isSelected) return a.isSelected ? -1 : 1;
        if (a.availability === 'Unavailable' && b.availability !== 'Unavailable') return 1;
        if (b.availability === 'Unavailable' && a.availability !== 'Unavailable') return -1;
        return a.last_name.localeCompare(b.last_name);
    });

  } catch (err) { console.error(err); } 
  finally { loading.value = false; }
}

const togglePlayer = async (player, desiredPos = 'SUB') => {
  if (loading.value) return;

  if (!player.isSelected) {
    if (player.availability === 'Unavailable') {
       if (!await showConfirm("⚠️ Player Unavailable", "Select anyway?")) return;
    }
    if (player.complianceStatus === 'ineligible') {
      if (!await showConfirm("⚠️ Rule Violation", "Select anyway?")) return;
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
    showToast('Added', 'Player added to squad.', 'success');

  } else {
    const { error } = await supabase.from('appearances').delete().eq('match_id', selectedMatchId.value).eq('player_id', player.id);
    if (error) return showToast('Error', error.message, 'error');
    player.isSelected = false;
  }
};

const setPosition = async (player, pos) => {
    if (!player.isSelected) {
        await togglePlayer(player, pos);
    } else {
        const { error } = await supabase.from('appearances').update({ position: pos }).eq('match_id', selectedMatchId.value).eq('player_id', player.id);
        if(!error) player.position = pos;
    }
}
</script>

<template>
  <div class="w-full bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden min-h-[80vh] flex flex-col">
    
    <SelectionHeader 
      :matches="matches"
      v-model:selectedMatchId="selectedMatchId"
      v-model:viewMode="viewMode"
      v-model:displayMode="displayMode"
      :selectedCount="selectedPlayers.length"
      :teamFormat="teamFormat"
    />

    <PitchView 
      v-if="displayMode === 'pitch'" 
      :selectedPlayers="selectedPlayers" 
    />

    <PlayerList 
      v-else 
      :players="players" 
      :loading="loading"
      :viewMode="viewMode"
      :searchQuery="searchQuery"
      @update:searchQuery="handleSearch"
      @toggle="togglePlayer"
      @setPosition="setPosition"
    />

  </div>
</template>
