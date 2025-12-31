"use client";

import { useState } from "react";
import { ViewTransition } from "react";
import Image from "next/image";
import { RefreshCw, Play, ChevronLeft, Music, ExternalLink } from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
}

const tracks: Track[] = [
  {
    id: "oxygen",
    title: "Oxygen",
    artist: "Adrian Diaz",
    coverUrl: "/music/covers/oxygen.jpg",
  },
  {
    id: "against",
    title: "Against",
    artist: "Adrian Diaz",
    coverUrl: "/music/covers/against.jpg",
  },
  {
    id: "destroy",
    title: "Destroy",
    artist: "Adrian Diaz",
    coverUrl: "/music/covers/destroy.jpg",
  },
  {
    id: "chasing-dreams",
    title: "Chasing Dreams",
    artist: "Adrian Diaz",
    coverUrl: "/music/covers/chasing-dreams.jpg",
  },
  {
    id: "free-life",
    title: "Free Life",
    artist: "Adrian Diaz",
    coverUrl: "/music/covers/free-life.jpg",
  },
  {
    id: "everything-ok",
    title: "Everything's Ok",
    artist: "Adrian Diaz",
    coverUrl: "/music/covers/everything-ok.jpg",
  },
];

// Simplified Vinyl for preview
function VinylRecordSmall({ variant }: { variant: "light" | "dark" }) {
  return (
    <svg width="90" height="90" viewBox="0 0 160 160">
      <circle
        cx="80"
        cy="80"
        r="78"
        fill={variant === "light" ? "#1a1a1a" : "#0a0a0a"}
      />
      {[70, 62, 54, 46].map((r, i) => (
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
      <circle cx="80" cy="80" r="28" fill="url(#labelGradientPreview)" />
      <circle
        cx="80"
        cy="80"
        r="4"
        fill={variant === "light" ? "#f5f5f5" : "#18181b"}
      />
      <defs>
        <linearGradient
          id="labelGradientPreview"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function AlbumBrowserPreview({ variant }: { variant: "light" | "dark" }) {
  const isLight = variant === "light";
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={`rounded-2xl p-4 w-[280px] shadow-lg ${
        isLight
          ? "bg-gradient-to-b from-[#f8f8f8] to-[#f0f0f0] shadow-zinc-300/40 border border-white/60"
          : "bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-black/50 border border-zinc-700/40"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className={`text-base font-semibold ${isLight ? "text-zinc-900" : "text-zinc-100"}`}
        >
          Listening to...
        </h2>
        <button
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${
            isLight
              ? "bg-zinc-200/80 text-zinc-600"
              : "bg-zinc-700/80 text-zinc-300"
          }`}
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </div>

      {/* Fanned Albums - horizontal cascade, first album in front */}
      <div className="relative h-[110px] w-full flex items-center justify-center">
        {[...tracks.slice(0, 5)].reverse().map((track, renderIndex, arr) => {
          const trackIndex = arr.length - 1 - renderIndex;

          // Position: center the stack, each album offset by spacing
          const spacing = 28;
          const albumSize = 80;
          const stackWidth = (arr.length - 1) * spacing + albumSize;
          // Offset from center: start at -half stack width, plus album's position
          const translateX = -stackWidth / 2 + trackIndex * spacing + albumSize / 2;

          // Keep original z-index on hover to maintain stacking order
          const zIndex = arr.length - trackIndex;
          // Hover: lift up in place (no z-index change to preserve cascade)
          const translateY = hoveredIndex === trackIndex ? -12 : 0;

          return (
            <div
              key={track.id}
              className="absolute left-1/2 transition-all duration-300 ease-out"
              style={{
                transform: `translateX(calc(-50% + ${translateX}px)) translateY(${translateY}px)`,
                zIndex,
              }}
              onMouseEnter={() => setHoveredIndex(trackIndex)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`relative w-[80px] h-[80px] rounded-xl overflow-hidden shadow-lg ${
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
          const spacing = 28;
          const albumSize = 80;
          const arr = tracks.slice(0, 5);
          const stackWidth = (arr.length - 1) * spacing + albumSize;
          const translateX = -stackWidth / 2 + hoveredIndex * spacing + albumSize / 2;
          const track = tracks[hoveredIndex];

          // Position tooltip above the lifted album
          // Container center (50%) - half album (40px) - lift (12px) - gap (6px)
          const tooltipTop = 'calc(50% - 58px)';

          return (
            <div
              className={`absolute px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg z-50 pointer-events-none text-xs ${
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
              <p className={isLight ? "text-zinc-500" : "text-zinc-400"}>
                {track.artist}
              </p>
              <p
                className={`font-medium ${isLight ? "text-zinc-900" : "text-zinc-100"}`}
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

function PlayerPreview({ variant }: { variant: "light" | "dark" }) {
  const isLight = variant === "light";
  const track = tracks[0];

  return (
    <div
      className={`rounded-2xl p-3.5 w-[280px] shadow-xl ${
        isLight
          ? "bg-gradient-to-b from-[#fafafa] to-[#f0f0f0] shadow-zinc-400/30 border border-white/80"
          : "bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-black/60 border border-zinc-700/40"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium ${
            isLight
              ? "bg-zinc-200/80 text-zinc-600"
              : "bg-zinc-700/80 text-zinc-300"
          }`}
        >
          <ChevronLeft className="w-3 h-3" />
          Back
        </button>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${
            isLight
              ? "bg-zinc-200/80 text-zinc-600"
              : "bg-zinc-700/80 text-zinc-300"
          }`}
        >
          <Music className="w-3 h-3" />
          Source
          <ExternalLink className="w-2.5 h-2.5" />
        </div>
      </div>

      {/* Album + Vinyl + Info */}
      <div className="flex items-center gap-3">
        {/* Album with Vinyl - fixed width container */}
        <div className="relative flex-shrink-0 w-[135px] h-[90px]">
          <div className="absolute top-1/2 -translate-y-1/2 left-[45px]">
            <VinylRecordSmall variant={variant} />
          </div>
          <div
            className={`absolute left-0 top-0 w-[90px] h-[90px] rounded-xl overflow-hidden shadow-lg z-10 ${
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

        {/* Info - centered */}
        <div className="flex-1 min-w-0 flex flex-col items-center text-center">
          <p
            className={`text-xs ${isLight ? "text-zinc-500" : "text-zinc-400"}`}
          >
            {track.artist}
          </p>
          <h3
            className={`text-sm font-semibold mb-1.5 truncate max-w-full ${isLight ? "text-zinc-900" : "text-zinc-100"}`}
          >
            {track.title}
          </h3>

          {/* Time */}
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs mb-1.5 ${
              isLight
                ? "bg-zinc-200/80 text-zinc-600"
                : "bg-zinc-700/80 text-zinc-400"
            }`}
          >
            <span>0:42</span>
            <span>/</span>
            <span>1:11</span>
          </div>

          {/* Play button */}
          <div
            className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${
              isLight ? "bg-zinc-200/80" : "bg-zinc-700/80"
            }`}
          >
            <Play
              className={`w-3.5 h-3.5 ${isLight ? "text-zinc-700" : "text-zinc-300"}`}
              fill="currentColor"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MusicPlayerPreview() {
  return (
    <div className="flex gap-3">
      {/* Light mode panel */}
      <ViewTransition name="music-player-light-panel">
        <div className="flex-1 bg-[#f5f5f5] rounded-xl p-3 relative overflow-hidden inline-block">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, #d4d4d4 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative z-10">
            <ViewTransition name="music-player-light">
              <div className="inline-block">
                <AlbumBrowserPreview variant="light" />
              </div>
            </ViewTransition>
          </div>
        </div>
      </ViewTransition>

      {/* Dark mode panel */}
      <ViewTransition name="music-player-dark-panel">
        <div className="flex-1 bg-zinc-950 rounded-xl p-3 relative overflow-hidden inline-block">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, #3f3f46 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative z-10">
            <ViewTransition name="music-player-dark">
              <div className="inline-block">
                <PlayerPreview variant="dark" />
              </div>
            </ViewTransition>
          </div>
        </div>
      </ViewTransition>
    </div>
  );
}
