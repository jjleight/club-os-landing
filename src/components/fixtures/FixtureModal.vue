<script setup>
import { ref, onMounted } from 'vue';
import { Calendar, MapPin } from 'lucide-vue-next';

const props = defineProps({
  teams: Array,
  fixture: Object // If provided, we are editing
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  team_id: '',
  opponent_name: '',
  match_date: '',
  match_time: '14:00',
  is_home: true,
  location: '',
  kit: 'Home',
  competition: 'League',
  status: 'Scheduled'
});

onMounted(() => {
  if (props.fixture) {
    // Edit Mode: Clone data
    form.value = { ...props.fixture };
  } else {
    // Create Mode: Defaults
    const today = new Date().toISOString().split('T')[0];
    form.value.match_date = today;
    // Default to first team if available
    if (props.teams.length > 0) form.value.team_id = props.teams[0].id;
  }
});

const handleSubmit = () => {
  // Smart Default for Location
  if (!form.value.location) {
    form.value.location = form.value.is_home ? 'Home Ground' : 'Away Ground';
  }
  emit('save', form.value);
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <div class="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in overflow-y-auto max-h-[90vh]">
      <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
        <Calendar class="w-5 h-5 text-indigo-600" /> 
        {{ fixture ? 'Edit Fixture' : 'Schedule Match' }}
      </h2>
      
      <div class="space-y-4">
        <!-- Team Select -->
        <div>
          <label class="label">Team</label>
          <select v-model="form.team_id" class="input">
            <option v-for="t in teams" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
        </div>

        <!-- Opponent -->
        <div>
          <label class="label">Opponent</label>
          <input v-model="form.opponent_name" type="text" class="input" placeholder="e.g. Cranleigh FC" />
        </div>

        <!-- Date & Time -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Date</label>
            <input v-model="form.match_date" type="date" class="input" />
          </div>
          <div>
            <label class="label">Kickoff</label>
            <input v-model="form.match_time" type="time" class="input" />
          </div>
        </div>

        <!-- Location -->
        <div>
           <label class="label">Location / Address</label>
           <div class="relative">
             <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input v-model="form.location" type="text" class="input pl-10" placeholder="e.g. Meadowbank Stadium, RH4 1LY" />
           </div>
        </div>

        <!-- Format & Kit -->
        <div class="grid grid-cols-2 gap-4">
           <div>
              <label class="label">Format</label>
              <div class="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
                 <button @click="form.is_home = true" class="flex-1 py-1.5 rounded text-xs font-bold transition" :class="form.is_home ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'">Home</button>
                 <button @click="form.is_home = false" class="flex-1 py-1.5 rounded text-xs font-bold transition" :class="!form.is_home ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'">Away</button>
              </div>
           </div>
           <div>
              <label class="label">Kit</label>
              <div class="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
                 <button @click="form.kit = 'Home'" class="flex-1 py-1.5 rounded text-xs font-bold transition" :class="form.kit === 'Home' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'">Home</button>
                 <button @click="form.kit = 'Away'" class="flex-1 py-1.5 rounded text-xs font-bold transition" :class="form.kit === 'Away' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'">Away</button>
              </div>
           </div>
        </div>

        <!-- Status -->
        <div>
            <label class="label">Status</label>
            <select v-model="form.status" class="input">
               <option>Scheduled</option>
               <option>Played</option>
               <option>Postponed</option>
               <option>Cancelled</option>
            </select>
        </div>

        <button @click="handleSubmit" :disabled="!form.team_id" class="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl mt-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
          {{ fixture ? 'Save Changes' : 'Add to Schedule' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.label { display: block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: #64748B; margin-bottom: 0.3rem; margin-left: 0.2rem; }
.input { width: 100%; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 0.5rem; padding: 0.75rem; font-weight: 600; color: #0F172A; outline: none; }
.input:focus { border-color: #6366F1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>

