import React, { useRef } from 'react';
import { FootballEvent } from '../types';

interface FieldProps {
  onFieldClick: (coords: { x: number; y: number; normalizedX: number; normalizedY: number; }) => void;
  events: FootballEvent[];
  fieldImageUrl: string;
}

const Field: React.FC<FieldProps> = ({ onFieldClick, events, fieldImageUrl }) => {
  const fieldRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!fieldRef.current) return;
    
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
      <h2 className="text-lg font-semibold mb-4 text-green-400">Click on the field to tag an event</h2>
      <div
        ref={fieldRef}
        className="relative w-full cursor-crosshair"
        onClick={handleClick}
      >
        <img src={fieldImageUrl} alt="Football Field" className="w-full h-auto rounded-md" />
        {events.map(event => (
          <div
            key={event.id}
            className="absolute w-4 h-4 rounded-full bg-red-500 border-2 border-white transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-150"
            style={{ left: `${event.x}px`, top: `${event.y}px` }}
            title={`Action: ${event.action}\nPlayer: ${event.player}\nMinute: ${event.minute}'`}
          />
        ))}
      </div>
    </div>
  );
};

export default Field;