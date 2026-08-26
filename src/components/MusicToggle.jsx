import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { birthdayData } from '../data/birthdayData';

export default function MusicToggle({ isPlaying, setIsPlaying }) {
  const audioRef = useRef(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(birthdayData.musicUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.log("Autoplay blocked by browser. User interaction required first.", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, setIsPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={togglePlay}
      className="fixed top-6 right-6 z-50 p-3 rounded-full glass border border-romantic-rose/30 hover:border-romantic-rose/80 text-white transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg group"
      aria-label="Toggle Music"
    >
      {isPlaying ? (
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-romantic-rose animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-romantic-lightRose hidden group-hover:inline transition-all duration-300 mr-1">
            Music On
          </span>
          {/* Subtle equalizer bars animation */}
          <div className="flex items-end gap-[2px] h-3">
            <span className="w-[2px] bg-romantic-rose animate-[bounce_0.8s_infinite] h-full"></span>
            <span className="w-[2px] bg-romantic-rose animate-[bounce_0.5s_infinite] h-2"></span>
            <span className="w-[2px] bg-romantic-rose animate-[bounce_0.7s_infinite] h-3"></span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <VolumeX className="w-5 h-5 text-gray-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 hidden group-hover:inline transition-all duration-300 mr-1">
            Music Off
          </span>
        </div>
      )}
    </button>
  );
}
