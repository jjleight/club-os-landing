<script setup>
import { useConfirm } from '../composables/useConfirm';
import { AlertCircle } from 'lucide-vue-next';

const { isVisible, modalTitle, modalMessage, handleConfirm, handleCancel } = useConfirm();
</script>

<template>
  <transition name="modal">
    <div v-if="isVisible" class="fixed inset-0 z-[150] flex items-center justify-center px-4">
      
      <!-- Backdrop with Blur -->
      <div @click="handleCancel" class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"></div>

      <!-- Modal Card -->
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
        
        <div class="p-6">
          <div class="flex items-start gap-4">
            <div class="bg-indigo-50 p-3 rounded-full shrink-0">
              <AlertCircle class="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900 leading-tight mb-2">{{ modalTitle }}</h3>
              <p class="text-sm text-slate-500 leading-relaxed">{{ modalMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
          <button @click="handleCancel" 
                  class="px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-200 transition">
            Cancel
          </button>
          <button @click="handleConfirm" 
                  class="px-6 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition active:scale-95">
            Confirm
          </button>
        </div>

      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Add a slight zoom effect to the card */
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
}
</style>
