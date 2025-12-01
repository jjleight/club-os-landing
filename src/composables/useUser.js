import { ref, computed } from 'vue';

// Default to Treasurer so you see everything at first
const currentRole = ref('treasurer'); 

export function useUser() {
  
  // Define what each role can see
  const permissions = computed(() => {
    switch (currentRole.value) {
      case 'treasurer':
        return { canManageMoney: true, canEditRules: true, canSelectTeam: true };
      case 'secretary':
        return { canManageMoney: false, canEditRules: true, canSelectTeam: false };
      case 'coach':
        return { canManageMoney: false, canEditRules: false, canSelectTeam: true };
      case 'parent':
        return { canManageMoney: false, canEditRules: false, canSelectTeam: false };
      default:
        return { canManageMoney: false, canEditRules: false, canSelectTeam: false };
    }
  });

  const setRole = (role) => {
    currentRole.value = role;
  };

  return {
    currentRole,
    permissions,
    setRole
  };
}
