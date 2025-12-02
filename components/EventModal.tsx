
import React, { useState, useEffect } from 'react';
import { Period, Outcome, FootballEvent, Action, Lineups } from '../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<FootballEvent, 'id' | 'x' | 'y' | 'normalizedX' | 'normalizedY'>, id?: number) => void;
  coords: { x: number; y: number; normalizedX: number; normalizedY: number; } | null;
  eventToEdit: FootballEvent | null;
  lineups: Lineups | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSubmit, coords, eventToEdit, lineups }) => {
  const [action, setAction] = useState<Action>(Action.Pass);
  const [player, setPlayer] = useState('');
  const [team, setTeam] = useState('');
  const [minute, setMinute] = useState('');
  const [seconds, setSeconds] = useState('');
  const [period, setPeriod] = useState<Period>(Period.FIRST_HALF);
  const [outcome, setOutcome] = useState<Outcome>(Outcome.SUCCESSFUL);
  
  const isEditing = !!eventToEdit;
  const normalizedX = (isEditing ? eventToEdit.normalizedX : coords?.normalizedX ?? 0).toFixed(2);
  const normalizedY = (isEditing ? eventToEdit.normalizedY : coords?.normalizedY ?? 0).toFixed(2);

  const allPlayers = lineups ? [...lineups.teamA.players, ...lineups.teamB.players] : [];
  const hasLineups = allPlayers.length > 0;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        // Populate form with event data to edit
        setAction(eventToEdit.action);
        setPlayer(eventToEdit.player);
        setTeam(eventToEdit.team);
        const [min, sec] = eventToEdit.minute.split(':');
        setMinute(min);
        setSeconds(sec);
        setPeriod(eventToEdit.period);
        setOutcome(eventToEdit.outcome);
      } else {
        // Reset form for new event
        setAction(Action.Pass);
        setPlayer(hasLineups ? allPlayers[0] : '');
        setTeam(hasLineups && lineups ? lineups.teamA.players.includes(allPlayers[0]) ? lineups.teamA.name : lineups.teamB.name : '');
        setMinute('');
        setSeconds('');
        setPeriod(Period.FIRST_HALF);
        setOutcome(Outcome.SUCCESSFUL);
      }
    }
  }, [isOpen, isEditing, eventToEdit, hasLineups]);

  if (!isOpen) return null;

  const handlePlayerChange = (selectedPlayer: string) => {
    setPlayer(selectedPlayer);
    if (lineups) {
      if (lineups.teamA.players.includes(selectedPlayer)) {
        setTeam(lineups.teamA.name);
      } else if (lineups.teamB.players.includes(selectedPlayer)) {
        setTeam(lineups.teamB.name);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!action || !player || !team || !minute || !seconds) {
      alert("Please fill all fields.");
      return;
    }

    const pad = (numStr: string) => numStr.padStart(2, '0');
    const formattedTime = `${pad(minute)}:${pad(seconds)}`;

    const eventData = {
      action,
      player,
      team,
      minute: formattedTime,
      period,
      outcome,
    };

    onSubmit(eventData, eventToEdit?.id);
  };
  
  const inputClass = "w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg transform transition-all">
        <h2 className="text-2xl font-bold mb-6 text-green-400">{isEditing ? 'Edit Event' : 'Tag New Event'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Coord X (Norm)</label>
              <input type="text" value={normalizedX} readOnly className={`${inputClass} text-gray-400 cursor-not-allowed`} />
            </div>
            <div>
              <label className={labelClass}>Coord Y (Norm)</label>
              <input type="text" value={normalizedY} readOnly className={`${inputClass} text-gray-400 cursor-not-allowed`} />
            </div>
          </div>
          <div>
            <label htmlFor="action" className={labelClass}>Action / Event</label>
            <select id="action" value={action} onChange={e => setAction(e.target.value as Action)} className={inputClass}>
              {Object.values(Action).map(actionValue => (
                <option key={actionValue} value={actionValue}>{actionValue}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="player" className={labelClass}>Player</label>
              {hasLineups && lineups ? (
                <select id="player" value={player} onChange={e => handlePlayerChange(e.target.value)} className={inputClass}>
                  <optgroup label={lineups.teamA.name}>
                    {lineups.teamA.players.map(p => <option key={p} value={p}>{p}</option>)}
                  </optgroup>
                  <optgroup label={lineups.teamB.name}>
                    {lineups.teamB.players.map(p => <option key={p} value={p}>{p}</option>)}
                  </optgroup>
                </select>
              ) : (
                <input id="player" type="text" value={player} onChange={e => setPlayer(e.target.value)} className={inputClass} placeholder="Player's name" />
              )}
            </div>
            <div>
              <label htmlFor="team" className={labelClass}>Team</label>
              <input id="team" type="text" value={team} onChange={e => setTeam(e.target.value)} className={inputClass} placeholder="Team's name" readOnly={hasLineups} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Time</label>
              <div className="flex items-center space-x-2">
                <input id="minute" type="number" min="0" max="120" value={minute} onChange={e => setMinute(e.target.value)} className={inputClass} placeholder="mm" />
                <span className="text-gray-400">:</span>
                <input id="seconds" type="number" min="0" max="59" value={seconds} onChange={e => setSeconds(e.target.value)} className={inputClass} placeholder="ss" />
              </div>
            </div>
            <div>
              <label htmlFor="period" className={labelClass}>Period</label>
              <select id="period" value={period} onChange={e => setPeriod(e.target.value as Period)} className={inputClass}>
                <option value={Period.FIRST_HALF}>First Half</option>
                <option value={Period.SECOND_HALF}>Second Half</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="outcome" className={labelClass}>Outcome</label>
            <select id="outcome" value={outcome} onChange={e => setOutcome(e.target.value as Outcome)} className={inputClass}>
              <option value={Outcome.SUCCESSFUL}>Successful</option>
              <option value={Outcome.UNSUCCESSFUL}>Unsuccessful</option>
            </select>
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">Save Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
