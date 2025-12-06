<script setup>
import { Sparkles, Mail, CheckCircle2 } from 'lucide-vue-next';

defineProps(['form', 'loading']);
const emit = defineEmits(['submit']);
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <h2 class="text-lg font-bold text-slate-900">Key Officials (Optional)</h2>
    
    <div class="bg-indigo-50 p-4 rounded-xl flex gap-3 items-start border border-indigo-100">
      <Sparkles class="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
      <p class="text-xs text-indigo-800 leading-relaxed">
        <strong>Pro Tip:</strong> We will send them an invite to complete their own profile. If you hold these roles, leave blank.
      </p>
    </div>
    
    <div v-if="form.role !== 'Secretary'">
      <label class="label">Club Secretary Email</label>
      <div class="input-group">
        <Mail class="icon" />
        <input v-model="form.secretaryEmail" type="email" class="input" placeholder="secretary@club.com" />
      </div>
    </div>

    <div v-if="form.role !== 'Chairman/Owner'">
      <label class="label">Chairman/Owner Email</label>
      <div class="input-group">
        <Mail class="icon" />
        <input v-model="form.chairmanEmail" type="email" class="input" placeholder="chairman@club.com" />
      </div>
    </div>

    <button @click="emit('submit')" :disabled="loading" class="btn-primary disabled:opacity-50">
      <span v-if="loading">Building Club...</span>
      <span v-else>Launch SportOS</span>
      <CheckCircle2 v-if="!loading" class="w-4 h-4" />
    </button>
  </div>
</template>

<style scoped>
/* Shared styles again */
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

