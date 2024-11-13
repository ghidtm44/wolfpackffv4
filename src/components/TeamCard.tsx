import React from 'react';
import { Trophy, Flame, Snowflake, Crown, Star, Shield } from 'lucide-react';
import { Team, WeeklyResult } from '../types';
import { useStore } from '../store';

interface TeamCardProps {
  team: Team;
  results: WeeklyResult[];
  onClick: () => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, results, onClick }) => {
  const { getTopScoringTeam } = useStore();
  const teamResults = results.filter(r => r.team_id === team.id);
  const streak = calculateStreak(teamResults);
  const cardClass = getCardClass(streak);
  
  const stats = calculateStats(teamResults);
  const latestWeek = Math.max(...results.map(r => r.week), 0);
  const isTopScorer = getTopScoringTeam(latestWeek) === team.id;
  
  return (
    <div 
      className={`retro-card cursor-pointer transition-all ${cardClass} hover:scale-105`}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="mb-3">
          <h3 
            className="text-base sm:text-lg font-bold break-words" 
            style={{ 
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
            title={team.name}
          >
            {team.name}
          </h3>
          <p 
            className="text-xs sm:text-sm text-gray-300 mt-1" 
            style={{ 
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
            title={`Manager: ${team.manager}`}
          >
            {team.manager}
          </p>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-yellow-400 shrink-0" />
            <span className="text-sm font-bold">{team.wins}-{team.losses}</span>
          </div>
          {isTopScorer && (
            <div className="flex items-center gap-1">
              <Crown className="text-yellow-400 shrink-0" size={16} />
              <span className="text-xs">Top Score</span>
            </div>
          )}
        </div>

        {/* Streak Display */}
        {getStreakDisplay(streak)}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-gray-700">
          <div className="flex items-center gap-1">
            <Shield size={14} className="text-green-400 shrink-0" />
            <div className="text-xs">
              <span className="opacity-75">PF:</span>
              <span className="ml-1 font-bold">{stats.pointsFor.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Shield size={14} className="text-red-400 shrink-0" />
            <div className="text-xs">
              <span className="opacity-75">PA:</span>
              <span className="ml-1 font-bold">{stats.pointsAgainst.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 shrink-0" />
            <div className="text-xs">
              <span className="opacity-75">Top:</span>
              <span className="ml-1 font-bold">{stats.topPlayerCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Crown size={14} className="text-yellow-400 shrink-0" />
            <div className="text-xs">
              <span className="opacity-75">High:</span>
              <span className="ml-1 font-bold">{stats.topScoreCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function calculateStats(results: WeeklyResult[]) {
  return {
    pointsFor: results.reduce((sum, result) => sum + result.points, 0),
    pointsAgainst: results.reduce((sum, result) => sum + result.opponent_points, 0),
    topScoreCount: results.filter(result => result.top_points).length,
    topPlayerCount: results.filter(result => result.top_player).length,
  };
}

function calculateStreak(results: WeeklyResult[]): number {
  let streak = 0;
  const sortedResults = [...results].sort((a, b) => b.week - a.week);
  
  for (const result of sortedResults) {
    const isWin = result.points > result.opponent_points;
    if (streak === 0) {
      streak = isWin ? 1 : -1;
    } else if ((streak > 0 && isWin) || (streak < 0 && !isWin)) {
      streak = streak + (isWin ? 1 : -1);
    } else {
      break;
    }
  }
  
  return streak;
}

function getCardClass(streak: number): string {
  if (streak >= 3) return 'on-fire';
  if (streak === 2) return 'heating-up';
  if (streak <= -3) return 'frozen';
  if (streak === -2) return 'cooling-off';
  return '';
}

function getStreakDisplay(streak: number) {
  if (!streak) return null;

  const streakText = Math.abs(streak);
  const streakDisplay = {
    3: { icon: Flame, text: 'On Fire!', color: 'text-orange-500' },
    2: { icon: Flame, text: 'Heating Up', color: 'text-orange-300' },
    [-3]: { icon: Snowflake, text: 'Frozen', color: 'text-blue-500' },
    [-2]: { icon: Snowflake, text: 'Cooling Off', color: 'text-blue-300' }
  }[streak];

  if (!streakDisplay) return null;

  const Icon = streakDisplay.icon;
  return (
    <div className={`flex items-center gap-1 ${streakDisplay.color} text-xs mb-3`}>
      <Icon size={14} className="shrink-0" />
      <span>{streakDisplay.text}</span>
      <span className="ml-1">({streakText})</span>
    </div>
  );
}