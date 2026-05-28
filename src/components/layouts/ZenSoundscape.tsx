'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Music, Volume2, VolumeX, Play, Pause, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Soundscape {
  id: string;
  name: string;
  url: string;
}

const SOUNDSCAPES: Soundscape[] = [
  {
    id: 'flute',
    name: 'Lotus Flute',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Relaxing synth/flute instrumental
  },
  {
    id: 'bowls',
    name: 'Singing Bowls',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', // Gentle resonance ambient track
  },
];

export default function ZenSoundscape() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSound, setSelectedSound] = useState<string>('flute');
  const [volume, setVolume] = useState<number>(0.3);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      
      // Load saved preferences if any
      const savedSound = localStorage.getItem('zen_sound');
      const savedVolume = localStorage.getItem('zen_volume');
      
      if (savedSound) {
        setSelectedSound(savedSound);
      }
      if (savedVolume) {
        const parsedVolume = parseFloat(savedVolume);
        setVolume(parsedVolume);
        audioRef.current.volume = parsedVolume;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Sync source and playing status
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const currentSound = SOUNDSCAPES.find((s) => s.id === selectedSound);
    if (!currentSound) return;

    const wasPlaying = isPlaying;

    // Only update src if it changed
    if (audio.src !== currentSound.url) {
      audio.src = currentSound.url;
      audio.load();
      if (wasPlaying) {
        audio.play().catch((err) => console.log('Audio autoplay blocked by browser:', err));
      }
    }
  }, [selectedSound]);

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.log('Audio play failed:', err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const targetVolume = isMuted ? 0 : volume;
    audio.volume = targetVolume;
    
    localStorage.setItem('zen_volume', volume.toString());
  }, [volume, isMuted]);

  // Save sound choice
  useEffect(() => {
    localStorage.setItem('zen_sound', selectedSound);
  }, [selectedSound]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSoundChange = (id: string) => {
    setSelectedSound(id);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="bg-brand-card border border-[#EAE3DB] rounded-3xl p-5 w-64 shadow-xl mb-3 flex flex-col space-y-4 text-brand-dark"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F8F4EF] pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-accent animate-pulse" />
                <span className="font-serif text-sm font-semibold tracking-wide">Zen Ambience</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-brand-dark/40 hover:text-brand-dark p-1 rounded-full hover:bg-brand-light transition-colors"
                aria-label="Close soundscape panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Visualizer & Play Toggle */}
            <div className="flex items-center justify-between bg-brand-light p-3 rounded-2xl border border-[#EAE3DB]/40">
              <div className="flex flex-col space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/50">Current Sound</span>
                <span className="font-serif text-xs font-semibold text-brand-dark">
                  {SOUNDSCAPES.find((s) => s.id === selectedSound)?.name || 'None'}
                </span>
              </div>
              
              {/* Visualizer bars */}
              <div className="flex items-end justify-center space-x-0.5 h-4 w-8 px-1">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={isPlaying && !isMuted ? {
                      height: [4, i === 0 ? 12 : i === 1 ? 16 : i === 2 ? 10 : 14, 4]
                    } : { height: 4 }}
                    transition={{
                      duration: 0.8 + i * 0.15,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="w-1 bg-brand-accent rounded-full"
                  />
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-brand-accent hover:bg-brand-accent-hover text-white flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer"
                aria-label={isPlaying ? 'Pause soundscape' : 'Play soundscape'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
              </button>
            </div>

            {/* Sound selectors */}
            <div className="flex flex-col space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-dark/40 px-1">Choose Vibe</span>
              <div className="grid grid-cols-2 gap-1.5">
                {SOUNDSCAPES.map((sound) => {
                  const isActive = selectedSound === sound.id;
                  return (
                    <button
                      key={sound.id}
                      onClick={() => handleSoundChange(sound.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'bg-brand-accent/15 border-brand-accent text-brand-dark font-semibold'
                          : 'bg-white border-[#EAE3DB] hover:border-brand-accent/50 text-brand-dark/70'
                      }`}
                    >
                      {sound.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume controls */}
            <div className="flex items-center space-x-3 pt-1 border-t border-[#F8F4EF]">
              <button
                onClick={toggleMute}
                className="text-brand-dark/60 hover:text-brand-accent transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (isMuted) setIsMuted(false);
                }}
                className="w-full h-1 bg-brand-light border border-[#EAE3DB]/40 rounded-lg appearance-none cursor-pointer accent-brand-accent focus:outline-hidden"
                aria-label="Volume slider"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating trigger circle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-brand-dark hover:bg-brand-accent text-[#F4EFEB] flex items-center justify-center shadow-lg cursor-pointer transition-colors duration-300 relative border border-white/10"
        aria-label="Toggle Zen Soundscapes"
      >
        <Music className={`w-5 h-5 ${isPlaying && !isMuted ? 'animate-bounce' : ''}`} />
        
        {/* Active glowing indicator dot */}
        {isPlaying && !isMuted && (
          <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-accent"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
