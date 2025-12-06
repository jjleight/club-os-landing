import { ref, computed } from 'vue';
import { supabase } from '../supabase';
import { useUser } from './useUser';

export function useStats() {
  const { user } = useUser();
  
  const loading = ref(true);
  const playerStats = ref(null);
  const matchHistory = ref([]);
  
  const fetchMyStats = async () => {
    loading.value = true;
    try {
      // 1. Get Player ID linked to this User
      const { data: player } = await supabase
        .from('players')
        .select('id, first_name, last_name, position, team_memberships(teams(name))')
        .eq('owner_profile_id', user.value.id)
        .single();
        
      if (!player) {
         loading.value = false;
         return; 
      }

      // 2. Get All Appearances & Match Results
      const { data: apps } = await supabase
        .from('appearances')
        .select(`
          goals, assists, clean_sheet, motm, rating,
          matches!inner ( match_date, opponent_name, result, home_score, away_score )
        `)
        .eq('player_id', player.id)
        .order('matches(match_date)', { ascending: false });

      // 3. Calculate Totals
      const totalApps = apps.length;
      const totalGoals = apps.reduce((sum, a) => sum + a.goals, 0);
      const totalAssists = apps.reduce((sum, a) => sum + a.assists, 0);
      const totalMotm = apps.filter(a => a.motm).length;
      
      // 4. Calculate XP (The Gamification Algorithm)
      // Play = 100xp, Goal = 50xp, MOTM = 200xp, Win = 50xp
      let xp = 0;
      apps.forEach(a => {
        xp += 100; // Base appearance
        xp += (a.goals * 50);
        xp += (a.motm * 200);
        if (a.matches.result === 'W') xp += 50;
      });
      
      // Level = XP / 1000 (Simple progression)
      const level = Math.floor(xp / 1000) + 1;
      const progress = (xp % 1000) / 10; // Percentage for progress bar

      // 5. Calculate "OVR" (Overall Rating 0-99)
      // Base 60 + bonuses based on performance density
      const baseRating = 60;
      const performanceBonus = Math.min(39, (totalGoals * 2) + (totalMotm * 5) + (totalApps));
      const overall = baseRating + performanceBonus;

      playerStats.value = {
        ...player,
        teamName: player.team_memberships[0]?.teams?.name || 'Club Member',
        stats: {
          apps: totalApps,
          goals: totalGoals,
          assists: totalAssists,
          motm: totalMotm,
          xp,
          level,
          progress,
          overall
        }
      };
      
      matchHistory.value = apps.map(a => ({
         opponent: a.matches.opponent_name,
         date: a.matches.match_date,
         result: a.matches.result || '-',
         score: `${a.matches.home_score}-${a.matches.away_score}`,
         performance: a.goals > 0 ? `${a.goals} ⚽️` : (a.clean_sheet ? 'CS 🛡️' : null)
      }));

    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    playerStats,
    matchHistory,
    fetchMyStats
  };
}
