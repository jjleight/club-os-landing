<script setup>
import { Trophy, ArrowRight } from 'lucide-vue-next';

const props = defineProps(['form']);
const emit = defineEmits(['next']);

const canProceed = () => props.form.clubName.trim().length > 0;
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <h2 class="text-lg font-bold text-slate-900">Club Details</h2>
    
    <div>
      <label class="label">Club Name</label>
      <div class="input-group">
        <Trophy class="icon" />
        <input v-model="form.clubName" type="text" placeholder="e.g. Melchester Rovers" class="input" autofocus @keyup.enter="canProceed() && emit('next')" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="label">Sport</label>
        <select v-model="form.sport" class="input bg-white">
          <option>Football</option>
          <option>Cricket</option>
          <option>Rugby</option>
        </select>
      </div>
      <div>
        <label class="label">County / Area</label>
        <input v-model="form.county" type="text" placeholder="e.g. Surrey FA" class="input" />
      </div>
    </div>

    <div>
      <label class="label">Primary Club Color</label>
      <div class="flex gap-3 mt-2">
        <button v-for="c in ['#4F46E5', '#DC2626', '#059669', '#2563EB', '#F59E0B', '#000000']" 
                :key="c"
                @click="form.color = c"
                class="w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
                :class="form.color === c ? 'border-slate-900 scale-110 ring-2 ring-slate-200' : 'border-transparent'"
                :style="{ backgroundColor: c }">
        </button>
      </div>
    </div>

    <button @click="emit('next')" :disabled="!canProceed()" class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
      Next: Your Profile <ArrowRight class="w-4 h-4" />
    </button>
  </div>
</template>

<style scoped>
/* Reusing shared styles - ideally move these to global CSS */
.label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #64748B; margin-bottom: 0.5rem; margin-left: 0.25rem; }
.input-group { position: relative; }
.input-group .icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); width: 1.25rem; height: 1.25rem; color: #94A3B8; }
.input { width: 100%; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 0.75rem; padding: 0.75rem 1rem; font-weight: 600; color: #0F172A; outline: none; transition: all 0.2s; }
.input-group .input { padding-left: 3rem; }
.input:focus { background-color: #FFFFFF; border-color: #6366F1; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
.btn-primary { width: 100%; background-color: #4F46E5; color: white; font-weight: 700; padding: 1rem; border-radius: 0.75rem; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2); transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.btn-primary:hover { background-color: #4338CA; transform: translateY(-1px); }
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
</style>
