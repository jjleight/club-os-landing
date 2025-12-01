import { ref } from 'vue';

// Global state (outside the function) so it is shared across the whole app
const notifications = ref([]);

export function useToast() {
  
  const showToast = (title, message, type = 'success') => {
    const id = Date.now();
    
    // Add to the stack
    notifications.value.push({
      id,
      title,
      message,
      type // 'success', 'error', 'info'
    });

    // Auto-remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id);
  };

  return {
    notifications,
    showToast,
    removeToast
  };
}
