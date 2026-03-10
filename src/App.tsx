import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Volume1, Repeat, Shuffle, Heart, MoreHorizontal } from 'lucide-react';

const SONGS = [
  {
    id: '1',
    title: 'Midnight City',
    artist: 'Synthwave Dreams',
    albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12'
  },
  {
    id: '2',
    title: 'Neon Lights',
    artist: 'Cyberpunk',
    albumArt: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=500&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05'
  },
  {
    id: '3',
    title: 'Retro Vibes',
    artist: 'The Nostalgics',
    albumArt: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44'
  },
  {
    id: '4',
    title: 'Cosmic Journey',
    artist: 'Space Explorers',
    albumArt: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=500&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: '5:02'
  },
  {
    id: '5',
    title: 'Ocean Breeze',
    artist: 'Chillwave',
    albumArt: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: '5:53'
  }
];

export default function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSong = SONGS[currentSongIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentSongIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    const time = percent * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - bounds.left) / bounds.width));
    setVolume(percent);
    if (audioRef.current) audioRef.current.volume = percent;
    setIsMuted(percent === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume || 0.5;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-violet-900/30 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-fuchsia-900/20 blur-[100px]" />
      </div>

      <div className="w-full max-w-5xl bg-zinc-900/60 backdrop-blur-2xl rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10">
        {/* Left: Player */}
        <div className="w-full md:w-[45%] p-6 sm:p-8 flex flex-col justify-between">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">Now Playing</span>
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <MoreHorizontal size={20} className="text-zinc-400" />
            </button>
          </div>

          {/* Album Art */}
          <div className="relative aspect-square w-full max-w-[320px] mx-auto mb-8 group rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={currentSong.albumArt}
              alt={currentSong.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Song Info */}
          <div className="flex justify-between items-end mb-6">
            <div className="min-w-0 pr-4">
              <h2 className="text-2xl font-bold mb-1 truncate">{currentSong.title}</h2>
              <p className="text-zinc-400 text-sm truncate">{currentSong.artist}</p>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-rose-500 shrink-0">
              <Heart size={24} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div
              className="w-full h-1.5 bg-zinc-800 rounded-full cursor-pointer relative group mb-2"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-violet-500 rounded-full relative"
                style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg scale-125" />
              </div>
            </div>
            <div className="flex justify-between text-xs text-zinc-500 font-mono">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <button className="p-2 text-zinc-400 hover:text-white transition-colors">
              <Shuffle size={20} />
            </button>
            <div className="flex items-center gap-2 sm:gap-4">
              <button onClick={playPrev} className="p-3 text-zinc-300 hover:text-white hover:bg-white/5 rounded-full transition-all">
                <SkipBack size={24} fill="currentColor" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 flex items-center justify-center bg-violet-500 hover:bg-violet-400 text-white rounded-full shadow-lg shadow-violet-500/30 transition-all hover:scale-105 active:scale-95 shrink-0"
              >
                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
              </button>
              <button onClick={playNext} className="p-3 text-zinc-300 hover:text-white hover:bg-white/5 rounded-full transition-all">
                <SkipForward size={24} fill="currentColor" />
              </button>
            </div>
            <button className="p-2 text-zinc-400 hover:text-white transition-colors">
              <Repeat size={20} />
            </button>
          </div>
        </div>

        {/* Right: Playlist */}
        <div className="w-full md:w-[55%] bg-zinc-900/80 p-6 sm:p-8 border-t md:border-t-0 md:border-l border-white/5 flex flex-col h-[400px] md:h-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Up Next</h3>
            <div className="flex items-center gap-2 text-zinc-400">
              <button onClick={toggleMute} className="p-2 hover:text-white transition-colors">
                {isMuted || volume === 0 ? <VolumeX size={20} /> : volume < 0.5 ? <Volume1 size={20} /> : <Volume2 size={20} />}
              </button>
              <div
                className="w-20 sm:w-24 h-1.5 bg-zinc-800 rounded-full cursor-pointer relative group"
                onClick={handleVolumeClick}
              >
                <div
                  className="h-full bg-zinc-300 group-hover:bg-violet-500 transition-colors rounded-full relative"
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg scale-125" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-2 custom-scrollbar">
            {SONGS.map((song, index) => (
              <div
                key={song.id}
                onClick={() => {
                  setCurrentSongIndex(index);
                  setIsPlaying(true);
                }}
                className={`flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-xl cursor-pointer transition-all group ${
                  currentSongIndex === index
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                  <img src={song.albumArt} alt={song.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {currentSongIndex === index && isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="flex gap-0.5 items-end h-4">
                        <div className="w-1 bg-violet-500 animate-eq rounded-t-sm" style={{ animationDelay: '0ms' }} />
                        <div className="w-1 bg-violet-500 animate-eq rounded-t-sm" style={{ animationDelay: '200ms' }} />
                        <div className="w-1 bg-violet-500 animate-eq rounded-t-sm" style={{ animationDelay: '400ms' }} />
                      </div>
                    </div>
                  )}
                  {currentSongIndex !== index && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={20} className="text-white ml-0.5" fill="currentColor" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium truncate ${currentSongIndex === index ? 'text-violet-400' : 'text-zinc-200'}`}>
                    {song.title}
                  </h4>
                  <p className="text-sm text-zinc-500 truncate">{song.artist}</p>
                </div>
                <div className="text-sm text-zinc-500 font-mono shrink-0">
                  {song.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-zinc-500 text-sm font-medium tracking-wide relative z-10 text-center">
        Design by <span className="text-zinc-300">ubaid ullah</span>
      </div>

      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={playNext}
      />
    </div>
  );
}
