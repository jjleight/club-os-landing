import { ref, computed } from 'vue';
import { supabase } from '../supabase';
import { useClub } from './useClub';

// --- GLOBAL STATE ---
const user = ref(null);        
const profile = ref(null);     
const userRoles = ref([]);     
const overrideRole = ref(null); 
const loading = ref(true);

export function useUser() {
  const { activeClubId, activeClubName } = useClub();
  
  // 1. COMPUTED: Active Roles (The Array)
  // This is the Source of Truth for permissions.
  const activeRoles = computed(() => {
    // Demo Override
    if (overrideRole.value) {
        return [{ role: overrideRole.value, team_id: null }];
    }
    // Real DB Roles
    if (userRoles.value.length > 0) {
        return userRoles.value;
    }
    // Fallback to Profile Role
    if (profile.value?.role) {
        return [{ role: profile.value.role, team_id: null }];
    }
    return [];
  });

  // 2. COMPUTED: Active Role (The String)
  // This fixes your error. It provides a safe single string for UI labels.
  const activeRole = computed(() => {
    return activeRoles.value[0]?.role || 'guest';
  });

  // 3. COMPUTED: Managed Team IDs
  const managedTeamIds = computed(() => {
    const roles = activeRoles.value;
    if (roles.some(r => ['admin', 'secretary', 'treasurer'].includes(r.role))) {
        return 'all';
    }
    const teamIds = roles
        .filter(r => r.role === 'coach' && r.team_id)
        .map(r => r.team_id);
        
    return teamIds.length > 0 ? teamIds : [];
  });

  // 4. LOGIC: Permission Checker
  const can = (action, resourceTeamId = null) => {
    const currentRoles = activeRoles.value;

    if (currentRoles.some(r => r.role === 'admin')) return true;

    switch (action) {
      case 'manage_club': 
        return currentRoles.some(r => r.role === 'secretary');

      case 'manage_finance': 
        return currentRoles.some(r => r.role === 'treasurer');
      
      case 'manage_team': 
        return currentRoles.some(r => {
            if (['secretary', 'admin'].includes(r.role)) return true;
            if (r.role !== 'coach') return false;
            if (resourceTeamId && r.team_id && r.team_id !== resourceTeamId) return false;
            return true;
        });
      
      case 'edit_compliance': 
        return currentRoles.some(r => ['secretary', 'treasurer'].includes(r.role));

      case 'view_safeguarding': 
        return currentRoles.some(r => r.role === 'welfare_officer');

      case 'pay_wallet': 
        return currentRoles.some(r => ['parent', 'player'].includes(r.role));
        
      default: return false;
    }
  };

  // 5. COMPUTED: Permissions Object
  const permissions = computed(() => ({
    isSuperAdmin: can('manage_club'),
    canManageMoney: can('manage_finance'),
    canSelectTeam: can('manage_team'),
    canEditRules: can('edit_compliance'),
    canViewSafeguarding: can('view_safeguarding'),
    isParent: can('pay_wallet'),
    isAuthenticated: !!user.value,
    
    managedTeamIds: managedTeamIds.value,
    
    // UI Label Logic
    currentLabel: overrideRole.value 
        ? overrideRole.value 
        : (userRoles.value.length > 1 ? 'Hybrid (All)' : activeRole.value)
  }));

  // 6. AUTH ACTIONS
  const initAuth = async () => {
    loading.value = true;
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      user.value = session.user;
      await fetchProfile();
    }
    loading.value = false;
  };

  const fetchProfile = async () => {
    if (!user.value) return;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*, clubs(name)')
        .eq('id', user.value.id)
        .single();

      if (data) {
        profile.value = data;
        if (data.club_id) {
          activeClubId.value = data.club_id;
          activeClubName.value = data.clubs?.name;
        }
        
        const { data: roles } = await supabase
            .from('user_roles')
            .select('*')
            .eq('profile_id', user.value.id);
        
        userRoles.value = roles || [];
      }
    } catch (e) {
      console.error("Profile fetch error", e);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    user.value = data.user;
    await fetchProfile();
    return data.user;
  };

  const register = async (email, password, firstName, lastName) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
       const userId = data.user.id;
       const { error: profileError } = await supabase.from('profiles').insert({
         id: userId,
         first_name: firstName,
         last_name: lastName,
         email: email,
         role: 'parent' 
       });
       if (profileError) throw profileError;

       // Auto-Link Logic
       const { data: household } = await supabase.from('households').select('id').ilike('primary_email', email).single();
       if (household) {
         await supabase.from('households').update({ owner_profile_id: userId }).eq('id', household.id);
         
         // Try to find club via household children
         const { data: kid } = await supabase.from('players').select('club_id').eq('household_id', household.id).limit(1).single();
         const targetClub = kid ? kid.club_id : activeClubId.value;

         await supabase.from('user_roles').insert({ profile_id: userId, club_id: targetClub, role: 'parent' });
       }

       const { data: player } = await supabase.from('players').select('id, club_id').ilike('email', email).single();
       if (player) {
         await supabase.from('players').update({ owner_profile_id: userId }).eq('id', player.id);
         await supabase.from('user_roles').insert({ profile_id: userId, club_id: player.club_id, role: 'player' });
       }

       const { data: staffList } = await supabase.from('team_staff').select('id, team_id, teams(club_id)').ilike('email', email);
       if (staffList && staffList.length > 0) {
         for (const staff of staffList) {
             await supabase.from('team_staff').update({ owner_profile_id: userId }).eq('id', staff.id);
             await supabase.from('user_roles').insert({
                 profile_id: userId,
                 club_id: staff.teams.club_id,
                 team_id: staff.team_id,
                 role: 'coach'
             });
         }
       }
       
       setTimeout(() => fetchProfile(), 500);
    }
    
    user.value = data.user;
    return data.user;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    user.value = null;
    profile.value = null;
    userRoles.value = [];
    overrideRole.value = null;
    activeClubId.value = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; 
  };

  const setPersona = (roleKey) => {
    overrideRole.value = roleKey === 'default' ? null : roleKey;
  };

  return {
    user,
    profile,
    userRoles,
    activeRole, // <--- This is the missing piece!
    activeRoles,
    loading,
    permissions,
    initAuth,
    login,
    register,
    logout,
    can,
    setPersona
  };
}
