import { ref } from 'vue';
import { supabase } from '../supabase';

// Global state
const activeClubId = ref(null); 
const activeClubName = ref('');
const activeClubColor = ref('#4F46E5'); // Default to Indigo

export function useClub() {
  
  // Updated: Accepts an object { name, sport, county, color }
  const createClub = async (clubDetails, creatorUser) => {
    
    const { name, sport, county, color } = clubDetails;

    // 1. Generate Slug
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now().toString().slice(-4);
    
    // 2. Insert Club with ALL fields
    const { data: club, error } = await supabase
      .from('clubs')
      .insert({ 
        name, 
        slug,
        sport: sport || 'Football',
        county_affiliation: county || null,
        primary_color: color || '#4F46E5'
      })
      .select()
      .single();

    if (error) throw error;

    // 3. Link Admin (Creator)
    if (creatorUser) {
        // Assign Role
        const { error: roleError } = await supabase.from('user_roles').insert({
            profile_id: creatorUser.id,
            club_id: club.id,
            role: 'admin' 
        });
        if (roleError) throw roleError;

        // Update Profile Context
        await supabase.from('profiles').update({ 
            club_id: club.id,
            role: 'admin'
        }).eq('id', creatorUser.id);
    }

    // 4. Set as Active Session
    activeClubId.value = club.id;
    activeClubName.value = club.name;
    activeClubColor.value = club.primary_color;
    
    return club;
  };

  return {
    activeClubId,
    activeClubName,
    activeClubColor,
    createClub
  };
}
