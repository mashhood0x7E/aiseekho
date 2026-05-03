/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Music, Volume2 } from 'lucide-react';
import { DEMO_TRACKS } from '../constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DEMO_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DEMO_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DEMO_TRACKS.length) % DEMO_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-[400px] p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden group">
      {/* Animated Gradient Pulse */}
      <motion.div
        animate={{
          scale: isPlaying ? [1, 1.2, 1] : 1,
          opacity: isPlaying ? [0.1, 0.2, 0.1] : 0.05,
        }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600 rounded-full blur-[80px]"
      />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-shadow">
            <Music className="w-8 h-8 text-white relative z-10" />
            {isPlaying && (
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 p-2">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 16, 8] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                    className="w-1 bg-white rounded-full"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate leading-tight group-hover:text-purple-300 transition-colors">
              {currentTrack.title}
            </h3>
            <p className="text-sm text-white/40 truncate font-mono uppercase tracking-widest italic pt-1">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between font-mono text-[10px] text-white/30 uppercase tracking-tighter">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8">
            <button
              onClick={prevTrack}
              className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>
            <button
              onClick={togglePlay}
              className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
            >
              {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current translate-x-0.5" />}
            </button>
            <button
              onClick={nextTrack}
              className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Volume2 className="w-4 h-4 text-white/30" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white/20"
            />
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextTrack}
      />
    </div>
  );
}
