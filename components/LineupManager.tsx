import React, { useState } from 'react';
import { Lineups } from '../types';
import { UsersIcon } from './Icons';

interface LineupManagerProps {
  onSave: (lineups: Lineups) => void;
}

const LineupManager: React.FC<LineupManagerProps> = ({ onSave }) => {
  const [teamAName, setTeamAName] = useState('Team A');
  const [teamBName, setTeamBName] = useState('Team B');
  const [teamAPlayers, setTeamAPlayers] = useState('');
  const [teamBPlayers, setTeamBPlayers] = useState('');

  const handleSave = () => {
    const lineups: Lineups = {
      teamA: {
        name: teamAName,
        players: teamAPlayers.split('\n').filter(p => p.trim() !== ''),
      },
      teamB: {
        name: teamBName,
        players: teamBPlayers.split('\n').filter(p => p.trim() !== ''),
      },
    };
    onSave(lineups);
    alert('Lineups saved!');
  };

  const inputClass = "w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";
  const textareaClass = `${inputClass} h-32 resize-y font-mono text-sm`;

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-4">
      <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2 flex items-center text-green-400">
        <UsersIcon />
        <span className="ml-2">Lineup Manager</span>
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="teamAName" className={labelClass}>Team A Name</label>
            <input
              id="teamAName"
              type="text"
              value={teamAName}
              onChange={(e) => setTeamAName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="teamAPlayers" className={labelClass}>Team A Players (one per line)</label>
            <textarea
              id="teamAPlayers"
              value={teamAPlayers}
              onChange={(e) => setTeamAPlayers(e.target.value)}
              className={textareaClass}
              placeholder="Player 1&#10;Player 2&#10;Player 3..."
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="teamBName" className={labelClass}>Team B Name</label>
            <input
              id="teamBName"
              type="text"
              value={teamBName}
              onChange={(e) => setTeamBName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="teamBPlayers" className={labelClass}>Team B Players (one per line)</label>
            <textarea
              id="teamBPlayers"
              value={teamBPlayers}
              onChange={(e) => setTeamBPlayers(e.target.value)}
              className={textareaClass}
               placeholder="Player 1&#10;Player 2&#10;Player 3..."
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Save Lineups
        </button>
      </div>
    </div>
  );
};

export default LineupManager;
