import { ref } from 'vue';
import { supabase } from '../supabase';

// Global state
const activeClubId = ref('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'); // Default to Demo Club
const activeClubName = ref('Ashford Town FC');

export function useClub() {
  
  const createClub = async (name) => {
    // 1. Generate Slug
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    // 2. Insert into DB
    const { data, error } = await supabase
      .from('clubs')
      .insert({ name, slug })
      .select()
      .single();

    if (error) throw error;

    // 3. Set as Active
    activeClubId.value = data.id;
    activeClubName.value = data.name;
    
    return data;
  };

  return {
    activeClubId,
    activeClubName,
    createClub
  };
}
