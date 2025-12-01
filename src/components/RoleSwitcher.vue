<script setup>
import { useUser } from '../composables/useUser';
import { UserCircle2, ChevronDown, Check } from 'lucide-vue-next';
import { ref } from 'vue';

const { currentRole, setRole } = useUser();
const isOpen = ref(false);

const roles = [
  { id: 'treasurer', label: 'Treasurer', desc: 'Full Access' },
  { id: 'secretary', label: 'Secretary', desc: 'Rules & Compliance' },
  { id: 'coach', label: 'Team Coach', desc: 'Selection Only' },
  { id: 'parent', label: 'Parent', desc: 'Wallet Only' },
];

const selectRole = (roleId) => {
  setRole(roleId);
  isOpen.value = false;
  // Optional: Redirect to a safe page if they lose access to current page
};
</script>

<template>
  <div class="relative">
    <button @click="isOpen = !isOpen" 
            class="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-800 transition text-left border border-slate-700 bg-slate-800/50">
      <div class="bg-indigo-500 rounded-full p-1">
        <UserCircle2 class="w-5 h-5 text-white" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-xs text-slate-400 font-bold uppercase tracking-wider">Viewing As</div>
        <div class="text-sm font-bold text-white capitalize truncate">{{ currentRole }}</div>
      </div>
      <ChevronDown class="w-4 h-4 text-slate-500" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Dropdown Menu -->
    <div v-if="isOpen" class="absolute bottom-full left-0 w-full mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
      <div v-for="role in roles" :key="role.id" 
           @click="selectRole(role.id)"
           class="p-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center group">
        <div>
          <div class="text-sm font-bold text-slate-200 group-hover:text-white">{{ role.label }}</div>
          <div class="text-[10px] text-slate-500 group-hover:text-slate-400">{{ role.desc }}</div>
        </div>
        <Check v-if="currentRole === role.id" class="w-4 h-4 text-emerald-500" />
      </div>
    </div>
  </div>
</template>
