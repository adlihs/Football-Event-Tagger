
import React from 'react';
import { FootballEvent, Outcome } from '../types';
import { TrashIcon, PencilIcon } from './Icons';

interface EventListProps {
  events: FootballEvent[];
  onEditEvent: (event: FootballEvent) => void;
  onDeleteEvent: (id: number) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onEditEvent, onDeleteEvent }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No events tagged yet.</p>
        <p className="text-sm">Click on the field to add one.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
      {events.map(event => (
        <div key={event.id} className="group relative bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-200">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-white">{event.action}</h3>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              event.outcome === Outcome.SUCCESSFUL ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
            }`}>
              {event.outcome}
            </span>
          </div>
          <div className="text-sm text-gray-300 mt-2">
            <p><span className="font-semibold">Player:</span> {event.player} ({event.team})</p>
            <p><span className="font-semibold">Time:</span> {event.minute} ({event.period})</p>
            <p><span className="font-semibold">Coords:</span> ({event.normalizedX}, {event.normalizedY})</p>
          </div>
          <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEditEvent(event)}
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label={`Edit event: ${event.action}`}
            >
              <PencilIcon />
            </button>
            <button
              onClick={() => onDeleteEvent(event.id)}
              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label={`Delete event: ${event.action}`}
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
