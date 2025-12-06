import { ref, watch } from 'vue';
import { supabase } from '../supabase';
import { useUser } from './useUser'; 

// Global State
const householdId = ref(null);
const householdName = ref('');
const loading = ref(true);

export function useHousehold() {
  const { user } = useUser(); 

  const fetchHousehold = async () => {
    loading.value = true;
    try {
      if (!user.value) {
         // Fallback for Demo/Guest mode (The Smith Family)
         householdId.value = 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11'; 
         householdName.value = 'The Smith Family (Demo)';
         loading.value = false;
         return;
      }

      // REAL LOGIC: Find household owned by this user
      const { data, error } = await supabase
        .from('households')
        .select('id, name')
        .eq('owner_profile_id', user.value.id)
        .maybeSingle(); // <--- CHANGED: returns null instead of error if 0 rows

      if (error) throw error;

      if (data) {
        householdId.value = data.id;
        householdName.value = data.name;
      } else {
        // Valid state: User has no household linked yet
        householdId.value = null; 
        householdName.value = '';
      }

    } catch (err) {
      console.error("Error loading household:", err);
    } finally {
      loading.value = false;
    }
  };

  // Watch for login/logout
  watch(user, () => {
    fetchHousehold();
  });

  return {
    householdId,
    householdName,
    loading,
    fetchHousehold
  };
}
