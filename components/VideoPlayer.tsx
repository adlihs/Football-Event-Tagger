
import React from 'react';
import { VideoCameraIcon } from './Icons';

interface VideoPlayerProps {
  src: string | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden aspect-video">
      {src ? (
        <video controls src={src} className="w-full h-full object-contain">
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center bg-black">
          <VideoCameraIcon />
          <p className="mt-4 text-gray-400">Upload a video to begin tagging</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
