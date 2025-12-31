"use client";

import { useState, useRef, useEffect, ViewTransition } from "react";
import Image from "next/image";
import { DM_Sans } from "next/font/google";
import {
  ChevronLeft,
  RefreshCw,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ExternalLink,
  Music,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  audioUrl: string;
  coverUrl: string;
}

const tracks: Track[] = [
  {
    id: "oxygen",
    title: "Oxygen",
    artist: "Adrian Diaz",
    album: "Royalty Free Collection",
    audioUrl: "/music/oxygen.mp3",
    coverUrl: "/music/covers/oxygen.jpg",
  },
  {
    id: "against",
    title: "Against",
    artist: "Adrian Diaz",
    album: "Royalty Free Collection",
    audioUrl: "/music/against.mp3",
    coverUrl: "/music/covers/against.jpg",
  },
  {
    id: "destroy",
    title: "Destroy",
    artist: "Adrian Diaz",
    album: "Royalty Free Collection",
    audioUrl: "/music/destroy.mp3",
    coverUrl: "/music/covers/destroy.jpg",
  },
  {
    id: "chasing-dreams",
    title: "Chasing Dreams",
    artist: "Adrian Diaz",
    album: "Royalty Free Collection",
    audioUrl: "/music/chasing-dreams.mp3",
    coverUrl: "/music/covers/chasing-dreams.jpg",
  },
  {
    id: "free-life",
    title: "Free Life",
    artist: "Adrian Diaz",
    album: "Royalty Free Collection",
    audioUrl: "/music/free-life.mp3",
    coverUrl: "/music/covers/free-life.jpg",
  },
  {
    id: "everything-ok",
    title: "Everything's Gonna Be Ok",
    artist: "Adrian Diaz",
    album: "Royalty Free Collection",
    audioUrl: "/music/everything-ok.mp3",
    coverUrl: "/music/covers/everything-ok.jpg",
  },
];

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// SVG Vinyl Record Component
function VinylRecord({
  isPlaying,
  size = 160,
  variant,
}: {
  isPlaying: boolean;
  size?: number;
  variant: "light" | "dark";
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      className={`transition-transform ${isPlaying ? "animate-spin-slow" : ""}`}
      style={{ animationDuration: "3s" }}
    >
      {/* Outer ring */}
      <circle
        cx="80"
        cy="80"
        r="78"
        fill={variant === "light" ? "#1a1a1a" : "#0a0a0a"}
      />
      {/* Grooves */}
      {[70, 62, 54, 46, 38].map((r, i) => (
        <circle
          key={i}
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke={variant === "light" ? "#2a2a2a" : "#1a1a1a"}
          strokeWidth="1"
          opacity="0.6"
        />
      ))}
      {/* Shiny highlight */}
      <ellipse
        cx="60"
        cy="60"
        rx="35"
        ry="25"
        fill="url(#vinylShine)"
        opacity="0.15"
        transform="rotate(-30 80 80)"
      />
      {/* Label - gradient orange/pink */}
      <circle cx="80" cy="80" r="28" fill="url(#labelGradient)" />
      {/* Label inner ring */}
      <circle
        cx="80"
        cy="80"
        r="20"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="0.5"
      />
      {/* Center hole */}
      <circle
        cx="80"
        cy="80"
        r="4"
        fill={variant === "light" ? "#f5f5f5" : "#18181b"}
      />
      {/* Gradients */}
      <defs>
        <linearGradient id="labelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <radialGradient id="vinylShine" cx="30%" cy="30%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// Album Browser View Component
function AlbumBrowser({
  tracks,
  onSelectTrack,
  onShuffle,
  hoveredIndex,
  setHoveredIndex,
  variant,
}: {
  tracks: Track[];
  onSelectTrack: (index: number) => void;
  onShuffle: () => void;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  variant: "light" | "dark";
}) {
  const isLight = variant === "light";

  return (
    <div
      className={`rounded-3xl p-6 w-full max-w-[420px] shadow-xl ${
        isLight
          ? "bg-gradient-to-b from-[#f8f8f8] to-[#f0f0f0] shadow-zinc-300/40 border border-white/60"
          : "bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-black/50 border border-zinc-700/40"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-2xl font-semibold ${isLight ? "text-zinc-900" : "text-zinc-100"}`}
        >
          Listening to...
        </h2>
        <button
          onClick={onShuffle}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            isLight
              ? "bg-zinc-200/80 text-zinc-600 hover:bg-zinc-300/80"
              : "bg-zinc-700/80 text-zinc-300 hover:bg-zinc-600/80"
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Fanned Album Stack - horizontal cascade, first album in front */}
      <div className="relative h-[180px] w-full flex items-center justify-center">
        {/* Render in reverse so first album (index 0) renders last and appears on top */}
        {[...tracks.slice(0, 6)].reverse().map((track, renderIndex, arr) => {
          // Convert render index back to actual track index
          const trackIndex = arr.length - 1 - renderIndex;

          // Position: center the stack, each album offset by 40px
          // Stack width = (n-1)*spacing + albumWidth
          const spacing = 40;
          const albumSize = 130;
          const stackWidth = (arr.length - 1) * spacing + albumSize;
          // Offset from center: start at -half stack width, plus album's position
          const translateX = -stackWidth / 2 + trackIndex * spacing + albumSize / 2;

          // Z-index: first album (trackIndex 0) has highest z-index
          // Keep original z-index on hover to maintain stacking order
          const zIndex = arr.length - trackIndex;

          // Hover: lift up in place (no z-index change to preserve cascade)
          const translateY = hoveredIndex === trackIndex ? -20 : 0;

          return (
            <div
              key={track.id}
              className="absolute left-1/2 cursor-pointer transition-all duration-300 ease-out"
              style={{
                transform: `translateX(calc(-50% + ${translateX}px)) translateY(${translateY}px)`,
                zIndex,
              }}
              onMouseEnter={() => setHoveredIndex(trackIndex)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onSelectTrack(trackIndex)}
            >
              <div
                className={`relative w-[130px] h-[130px] rounded-2xl overflow-hidden shadow-xl ${
                  isLight ? "shadow-zinc-400/50" : "shadow-black/70"
                }`}
              >
                <Image
                  src={track.coverUrl}
                  alt={track.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          );
        })}

        {/* Tooltip rendered outside album stack to avoid z-index stacking context */}
        {hoveredIndex !== null && tracks[hoveredIndex] && (() => {
          const spacing = 40;
          const albumSize = 130;
          const arr = tracks.slice(0, 6);
          const stackWidth = (arr.length - 1) * spacing + albumSize;
          const translateX = -stackWidth / 2 + hoveredIndex * spacing + albumSize / 2;
          const track = tracks[hoveredIndex];

          // Position tooltip above the lifted album
          // Container center (50%) - half album (65px) - lift (20px) - gap (10px)
          const tooltipTop = 'calc(50% - 95px)';

          return (
            <div
              className={`absolute px-3 py-2 rounded-xl whitespace-nowrap shadow-lg z-50 pointer-events-none ${
                isLight
                  ? "bg-white/95 backdrop-blur-md border border-zinc-200/80"
                  : "bg-zinc-800/95 backdrop-blur-md border border-zinc-700/80"
              }`}
              style={{
                left: '50%',
                top: tooltipTop,
                transform: `translateX(calc(-50% + ${translateX}px)) translateY(-100%)`,
              }}
            >
              <p
                className={`text-sm font-medium ${isLight ? "text-zinc-700" : "text-zinc-300"}`}
              >
                {track.artist}
              </p>
              <p
                className={`text-sm font-semibold ${isLight ? "text-zinc-900" : "text-zinc-100"}`}
              >
                {track.title}
              </p>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// Player View Component
function PlayerView({
  track,
  isPlaying,
  currentTime,
  duration,
  onBack,
  onPlayPause,
  onPrevious,
  onNext,
  variant,
}: {
  track: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onBack: () => void;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  variant: "light" | "dark";
}) {
  const isLight = variant === "light";

  return (
    <div
      className={`rounded-3xl p-5 w-full max-w-[420px] shadow-2xl cursor-default ${
        isLight
          ? "bg-gradient-to-b from-[#fafafa] to-[#f0f0f0] shadow-zinc-400/30 border border-white/80"
          : "bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-black/60 border border-zinc-700/40"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            isLight
              ? "bg-zinc-200/80 text-zinc-600 hover:bg-zinc-300/80"
              : "bg-zinc-700/80 text-zinc-300 hover:bg-zinc-600/80"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <a
          href="https://archive.org/details/100_free_royalty_background_music_tracks"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            isLight
              ? "bg-zinc-200/80 text-zinc-600 hover:bg-zinc-300/80"
              : "bg-zinc-700/80 text-zinc-300 hover:bg-zinc-600/80"
          }`}
        >
          <Music className="w-4 h-4" />
          Source
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Album + Vinyl + Info */}
      <div className="flex items-center gap-3">
        {/* Album with Vinyl - fixed width container to account for vinyl extension */}
        <div className="relative flex-shrink-0 w-[175px] h-[110px]">
          {/* Vinyl behind album */}
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-500"
            style={{
              left: isPlaying ? 55 : 22,
            }}
          >
            <VinylRecord isPlaying={isPlaying} size={110} variant={variant} />
          </div>

          {/* Album cover */}
          <div
            className={`absolute left-0 top-0 w-[110px] h-[110px] rounded-2xl overflow-hidden shadow-xl z-10 ${
              isLight ? "shadow-zinc-400/50" : "shadow-black/60"
            }`}
          >
            <Image
              src={track.coverUrl}
              alt={track.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Track Info - centered text */}
        <div className="flex-1 min-w-0 flex flex-col items-center text-center">
          <p
            className={`text-sm ${isLight ? "text-zinc-500" : "text-zinc-400"}`}
          >
            {track.artist}
          </p>
          <h3
            className={`text-lg font-semibold mb-2 truncate max-w-full ${isLight ? "text-zinc-900" : "text-zinc-100"}`}
          >
            {track.title}
          </h3>

          {/* Time */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm mb-2 ${
              isLight ? "bg-zinc-200/80 text-zinc-600" : "bg-zinc-700/80 text-zinc-400"
            }`}
          >
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
              isLight ? "bg-zinc-200/80" : "bg-zinc-700/80"
            }`}
          >
            <button
              onClick={onPrevious}
              className={`p-1.5 rounded-full transition-colors ${
                isLight ? "hover:bg-zinc-300/80 text-zinc-600" : "hover:bg-zinc-600/80 text-zinc-400"
              }`}
            >
              <SkipBack className="w-4 h-4" fill="currentColor" />
            </button>
            <button
              onClick={onPlayPause}
              className={`p-1.5 rounded-full transition-colors ${
                isLight ? "hover:bg-zinc-300/80 text-zinc-700" : "hover:bg-zinc-600/80 text-zinc-300"
              }`}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" fill="currentColor" />
              ) : (
                <Play className="w-4 h-4" fill="currentColor" />
              )}
            </button>
            <button
              onClick={onNext}
              className={`p-1.5 rounded-full transition-colors ${
                isLight ? "hover:bg-zinc-300/80 text-zinc-600" : "hover:bg-zinc-600/80 text-zinc-400"
              }`}
            >
              <SkipForward className="w-4 h-4" fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Music Player Component (manages state)
function MusicPlayer({ variant }: { variant: "light" | "dark" }) {
  const [view, setView] = useState<"browser" | "player">("browser");
  const [trackList, setTrackList] = useState(tracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = trackList[currentTrackIndex];

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.addEventListener("timeupdate", () => {
      setCurrentTime(audioRef.current?.currentTime || 0);
    });
    audioRef.current.addEventListener("loadedmetadata", () => {
      setDuration(audioRef.current?.duration || 0);
    });
    audioRef.current.addEventListener("ended", () => {
      handleNext();
    });

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // Load track when it changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentTrack?.id]);

  const handleSelectTrack = (index: number) => {
    setHoveredIndex(null); // Clear hover state before switching views
    setCurrentTrackIndex(index);
    setView("player");
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current?.play().catch(() => {});
    }, 100);
  };

  const handleShuffle = () => {
    const shuffled = [...trackList].sort(() => Math.random() - 0.5);
    setTrackList(shuffled);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    const newIndex =
      currentTrackIndex === 0 ? trackList.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = (currentTrackIndex + 1) % trackList.length;
    setCurrentTrackIndex(newIndex);
  };

  const handleBack = () => {
    setHoveredIndex(null); // Clear hover state when returning to browser
    setView("browser");
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  return (
    <div className="w-full max-w-md flex justify-center">
      {view === "browser" ? (
        <AlbumBrowser
          tracks={trackList}
          onSelectTrack={handleSelectTrack}
          onShuffle={handleShuffle}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
          variant={variant}
        />
      ) : (
        <PlayerView
          track={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onBack={handleBack}
          onPlayPause={handlePlayPause}
          onPrevious={handlePrevious}
          onNext={handleNext}
          variant={variant}
        />
      )}
    </div>
  );
}

export default function MusicPlayerPage() {
  return (
    <div className={`min-h-screen ${dmSans.className}`}>
      <PageHeader
        title="Vinyl Music Player"
        codePath="designs/music-player/page.tsx"
        inspiration={{
          handle: "philipcdavis",
          imageUrl:
            "https://pbs.twimg.com/profile_images/1572984578057531393/K3S2VNGD_400x400.jpg",
        }}
      />

      {/* Split layout */}
      <div className="flex flex-col md:flex-row min-h-screen pt-[57px]">
        {/* Light mode side */}
        <ViewTransition name="music-player-light-panel">
          <div className="flex-1 bg-[#f5f5f5] relative">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, #d4d4d4 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-57px)] p-6 md:p-12">
              <ViewTransition name="music-player-light">
                <MusicPlayer variant="light" />
              </ViewTransition>
            </div>
          </div>
        </ViewTransition>

        {/* Dark mode side */}
        <ViewTransition name="music-player-dark-panel">
          <div className="flex-1 bg-zinc-950 relative">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, #3f3f46 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-57px)] p-6 md:p-12">
              <ViewTransition name="music-player-dark">
                <MusicPlayer variant="dark" />
              </ViewTransition>
            </div>
          </div>
        </ViewTransition>
      </div>

      {/* Add slow spin animation */}
      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
