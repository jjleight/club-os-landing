<script setup>
import { ref } from 'vue';
import { supabase } from '../../supabase';
import { useToast } from '../../composables/useToast';
import { UserPlus } from 'lucide-vue-next';

const props = defineProps(['clubId', 'teams']);
const emit = defineEmits(['close', 'saved']);
const { showToast } = useToast();

const form = ref({ first_name: '', last_name: '', team_id: '' });

const save = async () => {
  // 1. Create Player
  const { data: player, error: pError } = await supabase
    .from('players')
    .insert({
      club_id: props.clubId,
      first_name: form.value.first_name,
      last_name: form.value.last_name
    })
    .select()
    .single();

  if (pError) return showToast('Error', pError.message, 'error');

  // 2. Create Membership
  if (form.value.team_id) {
    await supabase.from('team_memberships').insert({
      player_id: player.id,
      team_id: form.value.team_id
    });
  }

  showToast('Success', 'Player registered.', 'success');
  emit('saved');
  emit('close');
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
     <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="$emit('close')"></div>
     <div class="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
       <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
         <UserPlus class="w-5 h-5 text-indigo-600" /> Register Player
       </h2>
       <div class="space-y-4">
         <div class="grid grid-cols-2 gap-4">
           <div>
             <label class="label">First Name</label>
             <input v-model="form.first_name" class="input" />
           </div>
           <div>
             <label class="label">Last Name</label>
             <input v-model="form.last_name" class="input" />
           </div>
         </div>
         <div>
           <label class="label">Assign to Team (Optional)</label>
           <select v-model="form.team_id" class="input bg-white">
             <option value="">-- Unassigned --</option>
             <option v-for="t in teams" :key="t.id" :value="t.id">{{ t.name }}</option>
           </select>
         </div>
         <button @click="save" class="btn-primary">Register</button>
       </div>
     </div>
  </div>
</template>

<style scoped>
/* Shared styles - in a real app, these would be in a global CSS or base component */
.label { display: block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: #64748B; margin-bottom: 0.3rem; }
.input { width: 100%; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 0.5rem; padding: 0.75rem; font-weight: 600; color: #0F172A; outline: none; }
.input:focus { border-color: #6366F1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
.btn-primary { width: 100%; color: white; font-weight: 700; padding: 0.75rem; border-radius: 0.75rem; background-color: #4F46E5; margin-top: 0.5rem; transition: all 0.2s; }
.btn-primary:hover { background-color: #4338CA; }
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>

