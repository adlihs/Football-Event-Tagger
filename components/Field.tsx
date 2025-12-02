import React, { useRef } from 'react';
import { FootballEvent } from '../types';
import { LargeImageIcon } from './Icons';

interface FieldProps {
  onFieldClick: (coords: { x: number; y: number; normalizedX: number; normalizedY: number; }) => void;
  events: FootballEvent[];
  fieldImageUrl: string | null;
}

const Field: React.FC<FieldProps> = ({ onFieldClick, events, fieldImageUrl }) => {
  const fieldRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!fieldRef.current || !fieldImageUrl) return;
    
    const rect = fieldRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const width = rect.width;
    const height = rect.height;

    const normalizedX = (x / width) * 105;
    const normalizedY = ((height - y) / height) * 68; // Inverted Y-axis

    onFieldClick({ x, y, normalizedX, normalizedY });
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-4">
      <h2 className="text-lg font-semibold mb-4 text-green-400">
        {fieldImageUrl ? 'Click on the field to tag an event' : 'Upload a field image to start'}
      </h2>
      <div
        ref={fieldRef}
        className={`relative w-full ${fieldImageUrl ? 'cursor-crosshair' : ''}`}
        onClick={handleClick}
      >
        {fieldImageUrl ? (
          <>
            <img src={fieldImageUrl} alt="Football Field" className="w-full h-auto rounded-md" />
            {events.map(event => (
              <div
                key={event.id}
                className="group absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${event.x}px`, top: `${event.y}px` }}
              >
                <div
                  className="w-4 h-4 rounded-full bg-red-500 border-2 border-white cursor-pointer transition-transform group-hover:scale-150"
                />
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-3 text-sm text-gray-100 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 pointer-events-none z-10"
                >
                  <h4 className="font-bold text-base text-green-400 border-b border-gray-700 pb-1 mb-2">{event.action}</h4>
                  <div className="space-y-1">
                      <p><span className="font-semibold text-gray-400">Player:</span> {event.player} ({event.team})</p>
                      <p><span className="font-semibold text-gray-400">Time:</span> {event.minute} ({event.period})</p>
                      <p><span className="font-semibold text-gray-400">Outcome:</span> {event.outcome}</p>
                  </div>
                   <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800"></div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="w-full aspect-[1.67] bg-black rounded-md flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-600">
            <LargeImageIcon />
            <p className="mt-4 text-gray-400">Please upload a field image using the "Change Field" button.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Field;