import React, { useState } from 'react';
import { useStore } from '../store';
import { Team } from '../types';
import toast from 'react-hot-toast';

export const CommissionerConsole: React.FC = () => {
  const { 
    teams, 
    results, 
    addTeam, 
    addResult, 
    addWriteup
  } = useStore();
  
  const [newTeam, setNewTeam] = useState({ name: '', manager: '' });
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [matchup, setMatchup] = useState({
    team1: '',
    team2: '',
    score1: '',
    score2: '',
    topPlayer: ''
  });
  const [writeup, setWriteup] = useState('');
  
  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam.name || !newTeam.manager) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      await addTeam(newTeam.name, newTeam.manager);
      setNewTeam({ name: '', manager: '' });
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };
  
  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchup.team1 || !matchup.team2 || !matchup.score1 || !matchup.score2) {
      toast.error('Please fill in all matchup fields');
      return;
    }
    
    try {
      // Add result for team 1
      await addResult({
        team_id: matchup.team1,
        opponent_id: matchup.team2,
        week: selectedWeek,
        points: parseFloat(matchup.score1),
        opponent_points: parseFloat(matchup.score2),
        top_player: matchup.topPlayer === matchup.team1,
        top_points: false // This will be determined automatically
      });
      
      // Add result for team 2
      await addResult({
        team_id: matchup.team2,
        opponent_id: matchup.team1,
        week: selectedWeek,
        points: parseFloat(matchup.score2),
        opponent_points: parseFloat(matchup.score1),
        top_player: matchup.topPlayer === matchup.team2,
        top_points: false // This will be determined automatically
      });
      
      setMatchup({
        team1: '',
        team2: '',
        score1: '',
        score2: '',
        topPlayer: ''
      });
      
      toast.success('Matchup results added successfully!');
    } catch (error) {
      console.error('Error adding result:', error);
    }
  };
  
  const handleAddWriteup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writeup) {
      toast.error('Please enter a writeup');
      return;
    }
    
    try {
      await addWriteup(selectedWeek, writeup);
      setWriteup('');
    } catch (error) {
      console.error('Error adding writeup:', error);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 space-y-8">
      {/* Add Team Section */}
      <section className="retro-card bg-white text-gray-900">
        <h2 className="text-xl font-bold mb-4">Add Team</h2>
        <form onSubmit={handleAddTeam} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Team Name"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              className="retro-input w-full bg-white text-gray-900 border-gray-300"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Manager Name"
              value={newTeam.manager}
              onChange={(e) => setNewTeam({ ...newTeam, manager: e.target.value })}
              className="retro-input w-full bg-white text-gray-900 border-gray-300"
            />
          </div>
          <button type="submit" className="retro-button">Add Team</button>
        </form>
      </section>

      {/* Team Results Grid */}
      <section className="retro-card bg-white text-gray-900 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Team Results</h2>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Team</th>
              {Array.from({ length: 17 }, (_, i) => (
                <th key={i} className="p-2 text-center">W{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id} className="border-t border-gray-300">
                <td className="p-2">{team.name}</td>
                {Array.from({ length: 17 }, (_, week) => {
                  const result = results.find(
                    r => r.team_id === team.id && r.week === week + 1
                  );
                  return (
                    <td key={week} className="p-2 text-center">
                      {result && (
                        <div className={`rounded p-1 ${
                          result.points > result.opponent_points
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <div className="flex justify-center space-x-1">
                            {result.top_player && '⭐'}
                            {result.top_points && '👑'}
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Enter Matchup Results */}
      <section className="retro-card bg-white text-gray-900">
        <h2 className="text-xl font-bold mb-4">Enter Matchup Results</h2>
        <form onSubmit={handleAddResult} className="space-y-4">
          <div className="flex gap-4 mb-4">
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              className="retro-input bg-white text-gray-900 border-gray-300"
            >
              {Array.from({ length: 17 }, (_, i) => (
                <option key={i} value={i + 1}>Week {i + 1}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <select
                value={matchup.team1}
                onChange={(e) => setMatchup({ ...matchup, team1: e.target.value })}
                className="retro-input w-full bg-white text-gray-900 border-gray-300"
              >
                <option value="">Select Team 1</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Score"
                value={matchup.score1}
                onChange={(e) => setMatchup({ ...matchup, score1: e.target.value })}
                className="retro-input w-full bg-white text-gray-900 border-gray-300"
              />
            </div>
            
            <div className="space-y-2">
              <select
                value={matchup.team2}
                onChange={(e) => setMatchup({ ...matchup, team2: e.target.value })}
                className="retro-input w-full bg-white text-gray-900 border-gray-300"
              >
                <option value="">Select Team 2</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Score"
                value={matchup.score2}
                onChange={(e) => setMatchup({ ...matchup, score2: e.target.value })}
                className="retro-input w-full bg-white text-gray-900 border-gray-300"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-2">Top Player:</label>
            <select
              value={matchup.topPlayer}
              onChange={(e) => setMatchup({ ...matchup, topPlayer: e.target.value })}
              className="retro-input w-full bg-white text-gray-900 border-gray-300"
            >
              <option value="">Select Team</option>
              {matchup.team1 && (
                <option value={matchup.team1}>
                  {teams.find(t => t.id === matchup.team1)?.name}
                </option>
              )}
              {matchup.team2 && (
                <option value={matchup.team2}>
                  {teams.find(t => t.id === matchup.team2)?.name}
                </option>
              )}
            </select>
          </div>
          
          <button type="submit" className="retro-button">Save Matchup</button>
        </form>
      </section>

      {/* Weekly Write-up */}
      <section className="retro-card bg-white text-gray-900">
        <h2 className="text-xl font-bold mb-4">Weekly Write-up</h2>
        <form onSubmit={handleAddWriteup} className="space-y-4">
          <textarea
            value={writeup}
            onChange={(e) => setWriteup(e.target.value)}
            placeholder="Enter this week's write-up..."
            className="retro-input w-full h-32 bg-white text-gray-900 border-gray-300 whitespace-pre-wrap"
            style={{ whiteSpace: 'pre-wrap' }}
          />
          <button type="submit" className="retro-button">Submit Write-up</button>
        </form>
      </section>
    </div>
  );
};