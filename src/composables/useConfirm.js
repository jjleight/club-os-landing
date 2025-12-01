import { ref } from 'vue';

// Global state shared across the app
const isVisible = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
let resolvePromise = null;

export function useConfirm() {
  
  // This function returns a Promise that resolves to true (Yes) or false (Cancel)
  const showConfirm = (title, message) => {
    modalTitle.value = title;
    modalMessage.value = message;
    isVisible.value = true;

    return new Promise((resolve) => {
      resolvePromise = resolve;
    });
  };

  const handleConfirm = () => {
    isVisible.value = false;
    if (resolvePromise) resolvePromise(true);
  };

  const handleCancel = () => {
    isVisible.value = false;
    if (resolvePromise) resolvePromise(false);
  };

  return {
    isVisible,
    modalTitle,
    modalMessage,
    showConfirm,
    handleConfirm,
    handleCancel
  };
}
