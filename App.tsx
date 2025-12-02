
import React, { useState } from 'react';
import { FootballEvent, Lineups } from './types';
import VideoPlayer from './components/VideoPlayer';
import Field from './components/Field';
import EventModal from './components/EventModal';
import EventList from './components/EventList';
import LineupManager from './components/LineupManager';
import { UploadIcon, ClipboardListIcon, ImageIcon, DownloadIcon, TrashIcon } from './components/Icons';

type Coords = {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

const App: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [fieldImageUrl, setFieldImageUrl] = useState<string | null>(null);
  const [events, setEvents] = useState<FootballEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<Coords | null>(null);
  const [editingEvent, setEditingEvent] = useState<FootballEvent | null>(null);
  const [lineups, setLineups] = useState<Lineups | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setEvents([]); // Reset events when a new video is loaded
    }
  };

  const handleFieldImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFieldImageUrl(url);
    }
  };

  const handleFieldClick = (coords: Coords) => {
    if (!videoUrl) {
      alert("Please upload a video first.");
      return;
    }
    setEditingEvent(null);
    setCurrentCoords(coords);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentCoords(null);
    setEditingEvent(null);
  };

  const handleModalSubmit = (eventData: Omit<FootballEvent, 'id' | 'x' | 'y' | 'normalizedX' | 'normalizedY'>, id?: number) => {
    if (editingEvent && id) {
      // Update existing event
      setEvents(prevEvents => prevEvents.map(event =>
        event.id === id ? { ...event, ...eventData } : event
      ));
    } else if (currentCoords) {
      // Create new event
      const newEvent: FootballEvent = {
        id: Date.now(),
        x: currentCoords.x,
        y: currentCoords.y,
        normalizedX: parseFloat(currentCoords.normalizedX.toFixed(2)),
        normalizedY: parseFloat(currentCoords.normalizedY.toFixed(2)),
        ...eventData,
      };
      setEvents(prevEvents => [...prevEvents, newEvent]);
    }
    handleModalClose();
  };
  
  const handleEditEvent = (event: FootballEvent) => {
    setEditingEvent(event);
    setCurrentCoords(null);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  const handleClearAllEvents = () => {
    if (window.confirm('Are you sure you want to delete all events?')) {
      setEvents([]);
    }
  };

  const handleExport = () => {
    if (events.length === 0) {
      alert("No events to export.");
      return;
    }

    const headers = ['id', 'action', 'player', 'team', 'minute', 'period', 'outcome', 'normalizedX', 'normalizedY'];
    
    const formatCsvField = (field: string) => {
      if (/[",\n]/.test(field)) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    const csvRows = [
      headers.join(','),
      ...events.map(event => [
        event.id,
        formatCsvField(event.action),
        formatCsvField(event.player),
        formatCsvField(event.team),
        event.minute,
        event.period,
        event.outcome,
        event.normalizedX,
        event.normalizedY
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'football_events.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveLineups = (lineupsData: Lineups) => {
    setLineups(lineupsData);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-400">Football Event Tagger</h1>
          <div className="flex items-center space-x-4">
             <button
              onClick={handleClearAllEvents}
              disabled={events.length === 0}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg cursor-pointer flex items-center transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              <TrashIcon />
              <span className="ml-2">Clear All</span>
            </button>
             <button
              onClick={handleExport}
              disabled={events.length === 0}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg cursor-pointer flex items-center transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              <DownloadIcon />
              <span className="ml-2">Export Events</span>
            </button>
            <label htmlFor="field-image-upload" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg cursor-pointer flex items-center transition-colors duration-300">
              <ImageIcon />
              <span className="ml-2">Change Field</span>
            </label>
            <input
              id="field-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFieldImageChange}
            />
            <label htmlFor="video-upload" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg cursor-pointer flex items-center transition-colors duration-300">
              <UploadIcon />
              <span className="ml-2">{videoUrl ? 'Change Video' : 'Upload Video'}</span>
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <VideoPlayer src={videoUrl} />
            <Field onFieldClick={handleFieldClick} events={events} fieldImageUrl={fieldImageUrl} />
          </div>
          <div className="lg:col-span-1 space-y-8">
             <LineupManager onSave={handleSaveLineups} />
             <div className="bg-gray-800 rounded-lg shadow-xl p-4 sticky top-4">
              <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2 flex items-center text-green-400">
                <ClipboardListIcon />
                <span className="ml-2">Tagged Events</span>
              </h2>
              <EventList events={events} onEditEvent={handleEditEvent} onDeleteEvent={handleDeleteEvent} />
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          coords={currentCoords}
          eventToEdit={editingEvent}
          lineups={lineups}
        />
      )}
    </div>
  );
};

export default App;
