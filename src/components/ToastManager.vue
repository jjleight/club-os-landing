<script setup>
import { useToast } from '../composables/useToast';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-vue-next';

const { notifications, removeToast } = useToast();
</script>

<template>
  <div class="fixed top-4 left-0 w-full z-[100] pointer-events-none flex flex-col items-center gap-3 px-4">
    <transition-group name="toast">
      <div v-for="note in notifications" :key="note.id"
           class="pointer-events-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 p-4 w-full max-w-sm flex items-start gap-4 transform transition-all duration-300">
        
        <!-- Icon based on Type -->
        <div class="p-2 rounded-full shrink-0"
             :class="{
               'bg-emerald-100 text-emerald-600': note.type === 'success',
               'bg-rose-100 text-rose-600': note.type === 'error',
               'bg-indigo-100 text-indigo-600': note.type === 'info'
             }">
          <CheckCircle2 v-if="note.type === 'success'" class="w-5 h-5" />
          <AlertCircle v-if="note.type === 'error'" class="w-5 h-5" />
          <Info v-if="note.type === 'info'" class="w-5 h-5" />
        </div>

        <div class="flex-1 pt-0.5">
          <h3 class="font-bold text-slate-900 text-sm">{{ note.title }}</h3>
          <p class="text-slate-500 text-xs mt-0.5 leading-relaxed">{{ note.message }}</p>
        </div>

        <button @click="removeToast(note.id)" class="text-slate-400 hover:text-slate-600 transition">
          <X class="w-4 h-4" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>
