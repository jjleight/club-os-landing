<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import { useToast } from '../composables/useToast'; 
import { Gavel, Save, RefreshCw, AlertTriangle } from 'lucide-vue-next';

const { showToast } = useToast();
const loading = ref(true);
const saving = ref(false);
const rules = ref([]);

onMounted(async () => {
  await fetchRules();
});

async function fetchRules() {
  const { data, error } = await supabase
    .from('league_rules')
    .select('*')
    .order('league_name');
    
  if (!error) rules.value = data;
  loading.value = false;
}

const updateRule = async (rule) => {
  saving.value = true;
  const { error } = await supabase
    .from('league_rules')
    .update({ threshold_value: rule.threshold_value })
    .eq('id', rule.id);
    
  saving.value = false;

  if (error) {
    showToast('Error', 'Failed to update rule.', 'error');
  } else {
    showToast('Rule Updated', `Captains' apps synced to limit: ${rule.threshold_value}`, 'success');
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 pb-12">
    
    <!-- Header -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div class="max-w-5xl mx-auto px-6 py-6">
        <div class="flex items-center gap-3">
          <div class="bg-rose-100 p-2 rounded-lg text-rose-600">
            <Gavel class="w-6 h-6" />
          </div>
          <div>
            <!-- UPDATED TEXT -->
            <h1 class="text-2xl font-bold text-slate-900">League Compliance</h1>
            <p class="text-sm text-slate-500">Configure safety guardrails for the Surrey Premier</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-5xl mx-auto px-6 py-8">
      
      <div v-if="loading" class="text-center py-10 text-slate-400">Loading Rules...</div>

      <div v-else class="grid gap-6">
        
        <!-- Rule Card -->
        <div v-for="rule in rules" :key="rule.id" 
             class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded uppercase tracking-wide">
                {{ rule.league_name }}
              </span>
              <span class="text-xs font-bold bg-rose-50 text-rose-600 px-2 py-1 rounded uppercase tracking-wide flex items-center gap-1">
                <AlertTriangle class="w-3 h-3" /> Mandatory
              </span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-1">Higher Level Restrictions</h3>
            <p class="text-slate-500 text-sm leading-relaxed">{{ rule.description }}</p>
          </div>

          <!-- The Control Interface -->
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
            <div class="text-center">
              <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Limit</label>
              <input type="number" v-model="rule.threshold_value" 
                     class="w-16 text-center font-mono text-xl font-bold bg-white border border-slate-200 rounded-lg py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            
            <div class="h-8 w-px bg-slate-200"></div>

            <button @click="updateRule(rule)" :disabled="saving"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg shadow-lg shadow-indigo-100 transition active:scale-95 disabled:opacity-50">
              <Save v-if="!saving" class="w-5 h-5" />
              <RefreshCw v-else class="w-5 h-5 animate-spin" />
            </button>
          </div>

        </div>

        <!-- Placeholder for Future Rules -->
        <div class="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center opacity-50">
          <p class="text-slate-400 font-medium">More rules coming soon (Cup Tying, Age Limits)...</p>
        </div>

      </div>
    </div>
  </div>
</template>
