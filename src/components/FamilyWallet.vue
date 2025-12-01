<script setup>
import { ref, onMounted, computed } from 'vue';
import { supabase } from '../supabase';
import { useToast } from '../composables/useToast';
import { useConfirm } from '../composables/useConfirm'; // Import Confirm
import { Wallet, CreditCard, CheckCircle2, ChevronRight, Receipt } from 'lucide-vue-next';

const { showToast } = useToast();
const { showConfirm } = useConfirm(); // Use Confirm
const loading = ref(true);
const ledgerItems = ref([]);
const householdName = ref("The Smith Family");
const DEMO_HOUSEHOLD_ID = 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11'; 

onMounted(async () => {
  await fetchWallet();
});

async function fetchWallet() {
  try {
    const { data, error } = await supabase
      .from('ledger')
      .select(`
        id, amount, description, created_at,
        players ( first_name, last_name )
      `)
      .eq('household_id', DEMO_HOUSEHOLD_ID)
      .eq('status', 'pending');

    if (error) throw error;
    ledgerItems.value = data;
  } catch (error) {
    console.error('Error fetching wallet:', error);
  } finally {
    loading.value = false;
  }
}

const totalDue = computed(() => {
  return ledgerItems.value.reduce((sum, item) => sum + item.amount, 0).toFixed(2);
});

const handlePayment = async () => {
  // NEW: Modern Confirm Modal
  const isConfirmed = await showConfirm(
    "Confirm Payment", 
    `Are you sure you want to pay £${totalDue.value} now?`
  );

  if (!isConfirmed) return;
  
  // Optimistic UI Update
  ledgerItems.value = [];
  showToast('Payment Successful', 'Thank you for supporting the club!', 'success');
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 pb-24">
    <!-- Real Header -->
    <div class="bg-indigo-600 text-white p-6 pt-12 shadow-xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
      <div class="relative z-10">
        <h2 class="text-indigo-100 text-sm font-medium uppercase tracking-wider mb-1">Total Contribution</h2>
        <h1 class="text-4xl font-extrabold">£{{ totalDue }}</h1>
        <div class="text-xs text-indigo-200 font-medium flex gap-2 items-center mt-4">
          <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          Payments due by 1st of Month
        </div>
      </div>
    </div>

    <!-- Real Content -->
    <div class="p-6 space-y-6">
      <div v-if="loading" class="text-center text-slate-400 py-10">Loading...</div>
      
      <div v-else-if="ledgerItems.length === 0" class="text-center py-20">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 class="w-8 h-8" />
        </div>
        <h3 class="text-slate-900 font-bold text-lg">All Paid Up!</h3>
        <p class="text-slate-500 text-sm">You are match-ready.</p>
      </div>

      <div v-else>
        <div class="flex justify-between items-end mb-4">
          <h3 class="font-bold text-slate-900 text-lg">Outstanding Items</h3>
        </div>

        <div class="space-y-3">
          <div v-for="item in ledgerItems" :key="item.id" 
               class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs"
                   :class="item.players.first_name === 'Sarah' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'">
                {{ item.players.first_name[0] }}
              </div>
              <div>
                <div class="font-bold text-slate-800 text-sm">{{ item.description }}</div>
                <div class="text-xs text-slate-400">{{ item.players.first_name }}</div>
              </div>
            </div>
            <div class="font-bold text-slate-900">£{{ item.amount }}</div>
          </div>
        </div>

        <button @click="handlePayment" class="w-full mt-8 bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition">
          Pay £{{ totalDue }} Now
        </button>
      </div>
    </div>
  </div>
</template>
