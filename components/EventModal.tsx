import React, { useState, useEffect } from 'react';
import { Period, Outcome, FootballEvent, Action } from '../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<FootballEvent, 'id' | 'x' | 'y' | 'normalizedX' | 'normalizedY'>) => void;
  coords: { x: number; y: number; normalizedX: number; normalizedY: number; };
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSubmit, coords }) => {
  const [action, setAction] = useState<Action>(Action.Pass);
  const [player, setPlayer] = useState('');
  const [team, setTeam] = useState('');
  const [minute, setMinute] = useState('');
  const [seconds, setSeconds] = useState('');
  const [period, setPeriod] = useState<Period>(Period.FIRST_HALF);
  const [outcome, setOutcome] = useState<Outcome>(Outcome.SUCCESSFUL);
  
  const normalizedX = coords.normalizedX.toFixed(2);
  const normalizedY = coords.normalizedY.toFixed(2);

  useEffect(() => {
    if (isOpen) {
      // Reset form on open
      setAction(Action.Pass);
      setPlayer('');
      setTeam('');
      setMinute('');
      setSeconds('');
      setPeriod(Period.FIRST_HALF);
      setOutcome(Outcome.SUCCESSFUL);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!action || !player || !team || !minute || !seconds) {
      alert("Please fill all fields.");
      return;
    }

    const pad = (numStr: string) => numStr.padStart(2, '0');
    const formattedTime = `${pad(minute)}:${pad(seconds)}`;

    onSubmit({
      action,
      player,
      team,
      minute: formattedTime,
      period,
      outcome,
    });
  };
  
  const inputClass = "w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg transform transition-all">
        <h2 className="text-2xl font-bold mb-6 text-green-400">Tag New Event</h2>
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
              <input id="player" type="text" value={player} onChange={e => setPlayer(e.target.value)} className={inputClass} placeholder="Player's name" />
            </div>
            <div>
              <label htmlFor="team" className={labelClass}>Team</label>
              <input id="team" type="text" value={team} onChange={e => setTeam(e.target.value)} className={inputClass} placeholder="Team's name" />
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