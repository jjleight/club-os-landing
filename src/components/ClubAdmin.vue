<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import { useClub } from '../composables/useClub';
// Import Sub-Components
import TeamModal from './club/TeamModal.vue';
import PlayerModal from './club/PlayerModal.vue';
import StaffModal from './club/StaffModal.vue';
// Icons
import { Users, Plus, ChevronRight, UserPlus, Edit2, Trophy, LayoutGrid, Briefcase, UserCog } from 'lucide-vue-next';

const { activeClubId, activeClubName } = useClub(); 
const loading = ref(true);
const activeTab = ref('teams'); 

// Data
const teams = ref([]);
const players = ref([]);

// Modal Controls
const showTeamModal = ref(false);
const editingTeam = ref(null); // Pass entire object to modal
const showPlayerModal = ref(false);
const showStaffModal = ref(false);
const managingStaffTeam = ref(null);

onMounted(fetchData);

async function fetchData() {
  loading.value = true;
  // Teams
  const { data: teamData } = await supabase
    .from('teams')
    .select('*, team_staff(count)')
    .eq('club_id', activeClubId.value)
    .order('team_level', { ascending: true });
  teams.value = teamData || [];

  // Players
  const { data: playerData } = await supabase
    .from('players')
    .select(`*, team_memberships (teams (name))`)
    .eq('club_id', activeClubId.value)
    .order('last_name');
  players.value = playerData || [];
  
  loading.value = false;
}

// Actions
const openCreateTeam = () => {
  editingTeam.value = null;
  showTeamModal.value = true;
};
const openEditTeam = (team) => {
  editingTeam.value = team;
  showTeamModal.value = true;
};
const openStaff = (team) => {
  managingStaffTeam.value = team;
  showStaffModal.value = true;
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 pb-24">
    
    <!-- Header -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div class="max-w-5xl mx-auto px-6 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 flex items-center gap-2">Club Management</h1>
            <p class="text-sm text-slate-500 font-medium">{{ activeClubName }}</p>
          </div>
          
          <button v-if="activeTab === 'teams'" @click="openCreateTeam"
                  class="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-100 active:scale-95 transition hover:bg-indigo-700">
            <Plus class="w-4 h-4" /> Add Team
          </button>
          <button v-else @click="showPlayerModal = true"
                  class="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-100 active:scale-95 transition hover:bg-indigo-700">
            <UserPlus class="w-4 h-4" /> Add Player
          </button>
        </div>

        <div class="flex gap-6 mt-6 border-b border-slate-100">
          <button @click="activeTab = 'teams'" class="pb-3 text-sm font-bold transition border-b-2" :class="activeTab === 'teams' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent'">Teams</button>
          <button @click="activeTab = 'players'" class="pb-3 text-sm font-bold transition border-b-2" :class="activeTab === 'players' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent'">Member Database</button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-5xl mx-auto px-6 py-8">
      
      <!-- TEAMS TAB -->
      <div v-if="activeTab === 'teams'" class="grid md:grid-cols-2 gap-4">
        <div v-if="teams.length === 0" class="col-span-2 text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <Trophy class="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p class="text-slate-500 font-medium">No teams yet.</p>
        </div>
        
        <div v-for="team in teams" :key="team.id" class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center group hover:border-indigo-300 transition relative overflow-hidden">
          <div class="flex items-center gap-4 z-10">
            <div class="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex flex-col items-center justify-center border border-slate-100">
               <span class="text-[10px] uppercase font-bold tracking-wider">Lvl</span>
               <span class="font-bold text-lg leading-none">{{ team.team_level }}</span>
            </div>
            <div>
              <h3 class="font-bold text-slate-900 text-lg">{{ team.name }}</h3>
              <div class="text-xs text-slate-500 font-medium flex items-center gap-2 flex-wrap">
                <span class="px-2 py-0.5 rounded bg-slate-100">{{ team.gender }}</span>
                <span class="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
                   <LayoutGrid class="w-3 h-3" /> {{ team.format || '11v11' }}
                </span>
                <span v-if="team.team_staff && team.team_staff[0].count > 0" class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                   <Briefcase class="w-3 h-3" /> {{ team.team_staff[0].count }} Staff
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
             <button @click="openStaff(team)" class="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition z-10" title="Manage Coaches">
               <UserCog class="w-5 h-5" />
             </button>
             <button @click="openEditTeam(team)" class="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition z-10" title="Edit Team">
               <Edit2 class="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>

      <!-- PLAYERS TAB -->
      <div v-else class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs">
            <tr><th class="p-4">Name</th><th class="p-4">Squads</th><th class="p-4 text-right">Action</th></tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="loading" class="text-center"><td colspan="3" class="p-8 text-slate-400">Loading...</td></tr>
            <tr v-else v-for="player in players" :key="player.id" class="hover:bg-slate-50 transition">
              <td class="p-4 font-bold text-slate-900">{{ player.first_name }} {{ player.last_name }}</td>
              <td class="p-4"><div class="flex gap-2 flex-wrap"><span v-for="m in player.team_memberships" :key="m.teams?.name" class="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold border border-indigo-100">{{ m.teams?.name }}</span></div></td>
              <td class="p-4 text-right text-indigo-600 font-bold cursor-pointer">Edit</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Sub Components -->
    <TeamModal 
      v-if="showTeamModal" 
      :clubId="activeClubId"
      :team="editingTeam"
      @close="showTeamModal = false"
      @saved="fetchData"
    />

    <PlayerModal
      v-if="showPlayerModal"
      :clubId="activeClubId"
      :teams="teams"
      @close="showPlayerModal = false"
      @saved="fetchData"
    />

    <StaffModal
      v-if="showStaffModal"
      :team="managingStaffTeam"
      @close="showStaffModal = false"
    />

  </div>
</template>

