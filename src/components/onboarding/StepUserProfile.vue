<script setup>
import { Calendar, ArrowRight } from 'lucide-vue-next';

const props = defineProps(['form']);
const emit = defineEmits(['next']);

const canProceed = () => props.form.firstName && props.form.lastName;
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <h2 class="text-lg font-bold text-slate-900">Your Profile</h2>
    
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="label">First Name</label>
        <input v-model="form.firstName" type="text" class="input" placeholder="John" autofocus />
      </div>
      <div>
        <label class="label">Surname</label>
        <input v-model="form.lastName" type="text" class="input" placeholder="Smith" />
      </div>
    </div>

    <div>
      <label class="label">Your Role</label>
      <select v-model="form.role" class="input bg-white">
        <option>Treasurer</option>
        <option>Secretary</option>
        <option>Chairman/Owner</option>
        <option>Welfare Officer</option>
      </select>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="label">Date of Birth</label>
        <div class="input-group">
          <Calendar class="icon" />
          <input v-model="form.dob" type="date" class="input pl-10" />
        </div>
      </div>
      <div>
        <label class="label">Phone</label>
        <input v-model="form.phone" type="tel" class="input" placeholder="07700..." />
      </div>
    </div>

    <button @click="emit('next')" :disabled="!canProceed()" class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
      Next: Key Contacts <ArrowRight class="w-4 h-4" />
    </button>
  </div>
</template>

<style scoped>
/* Use same styles as Step 1 or move to global */
.label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #64748B; margin-bottom: 0.5rem; margin-left: 0.25rem; }
.input-group { position: relative; }
.input-group .icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); width: 1.25rem; height: 1.25rem; color: #94A3B8; }
.input { width: 100%; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 0.75rem; padding: 0.75rem 1rem; font-weight: 600; color: #0F172A; outline: none; transition: all 0.2s; }
.input:focus { background-color: #FFFFFF; border-color: #6366F1; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
.btn-primary { width: 100%; background-color: #4F46E5; color: white; font-weight: 700; padding: 1rem; border-radius: 0.75rem; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2); transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.btn-primary:hover { background-color: #4338CA; transform: translateY(-1px); }
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
</style>
