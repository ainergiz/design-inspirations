"use client";

import { useState, useEffect } from "react";
import { ViewTransition } from "react";
import Image from "next/image";
import { Star, Wifi, Flame, TreePine, Car, UtensilsCrossed, Dog, Mountain, MapPin } from "lucide-react";

const images = [
  "/images/cottage-1.jpeg",
  "/images/cottage-2.jpeg",
  "/images/cottage-3.jpeg",
  "/images/cottage-4.jpeg",
  "/images/cottage-5.jpeg",
  "/images/cottage-6.jpeg",
];

function ImageCarousel({ variant }: { variant: "light" | "dark" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    if (!isHovered || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setProgressKey((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered, isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left - next image
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else {
        // Swipe right - previous image
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
      setProgressKey((prev) => prev + 1);
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 3000);
    }
    setTouchStart(null);
  };

  return (
    <div
      className="relative h-full w-full group touch-pan-y"
      onMouseEnter={() => {
        setIsHovered(true);
        setProgressKey((prev) => prev + 1);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Images with fade transition */}
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Cottage view ${index + 1}`}
          fill
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Glassmorphic indicator container */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsPaused(true);
                setProgressKey((prev) => prev + 1);
                // Resume auto-advance after 3 seconds
                setTimeout(() => setIsPaused(false), 3000);
              }}
              className="relative cursor-pointer"
            >
              {/* Background pill */}
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
              />
              {/* Animated fill for active indicator - only when hovered and not paused */}
              {index === currentIndex && isHovered && !isPaused && (
                <div
                  key={progressKey}
                  className="absolute inset-0 h-1.5 rounded-full bg-white/50 origin-left animate-carousel-progress"
                  style={{ animationDuration: "3000ms" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function HotelCardLight() {
  return (
    <div className="bg-gradient-to-b from-[#e8e8ea] to-[#dcdce0] rounded-2xl p-1.5 w-[300px] shadow-lg shadow-zinc-400/30 border border-white/60">
      {/* Image Card */}
      <div className="relative h-[140px] w-full rounded-xl overflow-hidden mb-1.5 border border-white/40">
        <ImageCarousel variant="light" />
      </div>

      {/* Info Section */}
      <div className="bg-white rounded-xl px-3.5 py-3">
        {/* Title and Rating */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-zinc-900 leading-tight">
            Snowdonia Thatched Cottage
          </h3>
          <div className="flex items-center gap-0.5 shrink-0">
            <span className="text-xs font-medium text-zinc-700">4.5</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-3 h-3 text-zinc-400" />
          <p className="text-[10px] text-zinc-400">
            Beddgelert, Gwynedd, Wales LL55 4YE
          </p>
        </div>

        {/* Price and Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-zinc-900">£65</span>
          <span className="text-xs text-zinc-400">/night</span>
          <span className="ml-auto px-2.5 py-1 text-[10px] font-medium text-zinc-700 bg-[#d4f5d4] rounded-full">
            0.3 miles off route
          </span>
        </div>

        {/* Amenities Row 1 */}
        <div className="flex items-center gap-1 text-[9px] text-zinc-500 mb-1.5 flex-wrap">
          <Wifi className="w-3 h-3" />
          <span>Free Wi-Fi</span>
          <span className="text-zinc-300">•</span>
          <Flame className="w-3 h-3" />
          <span>Log fire</span>
          <span className="text-zinc-300">•</span>
          <TreePine className="w-3 h-3" />
          <span>Garden</span>
          <span className="text-zinc-300">•</span>
          <Car className="w-3 h-3" />
          <span>Parking</span>
        </div>

        {/* Amenities Row 2 */}
        <div className="flex items-center gap-1 text-[9px] text-zinc-500 flex-wrap">
          <UtensilsCrossed className="w-3 h-3" />
          <span>Kitchen</span>
          <span className="text-zinc-300">•</span>
          <Dog className="w-3 h-3" />
          <span>Pet friendly</span>
          <span className="text-zinc-300">•</span>
          <Mountain className="w-3 h-3" />
          <span>Mountain views</span>
        </div>
      </div>
    </div>
  );
}

function HotelCardDark() {
  return (
    <div className="bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-2xl p-1.5 w-[300px] shadow-lg shadow-black/40 border border-zinc-600/40">
      {/* Image Card */}
      <div className="relative h-[140px] w-full rounded-xl overflow-hidden mb-1.5 border border-zinc-600/30">
        <ImageCarousel variant="dark" />
      </div>

      {/* Info Section */}
      <div className="bg-zinc-900 rounded-xl px-3.5 py-3">
        {/* Title and Rating */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-zinc-100 leading-tight">
            Snowdonia Thatched Cottage
          </h3>
          <div className="flex items-center gap-0.5 shrink-0">
            <span className="text-xs font-medium text-zinc-300">4.5</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-3 h-3 text-zinc-500" />
          <p className="text-[10px] text-zinc-500">
            Beddgelert, Gwynedd, Wales LL55 4YE
          </p>
        </div>

        {/* Price and Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-zinc-100">£65</span>
          <span className="text-xs text-zinc-500">/night</span>
          <span className="ml-auto px-2.5 py-1 text-[10px] font-medium text-emerald-400 bg-emerald-900/40 rounded-full">
            0.3 miles off route
          </span>
        </div>

        {/* Amenities Row 1 */}
        <div className="flex items-center gap-1 text-[9px] text-zinc-400 mb-1.5 flex-wrap">
          <Wifi className="w-3 h-3" />
          <span>Free Wi-Fi</span>
          <span className="text-zinc-600">•</span>
          <Flame className="w-3 h-3" />
          <span>Log fire</span>
          <span className="text-zinc-600">•</span>
          <TreePine className="w-3 h-3" />
          <span>Garden</span>
          <span className="text-zinc-600">•</span>
          <Car className="w-3 h-3" />
          <span>Parking</span>
        </div>

        {/* Amenities Row 2 */}
        <div className="flex items-center gap-1 text-[9px] text-zinc-400 flex-wrap">
          <UtensilsCrossed className="w-3 h-3" />
          <span>Kitchen</span>
          <span className="text-zinc-600">•</span>
          <Dog className="w-3 h-3" />
          <span>Pet friendly</span>
          <span className="text-zinc-600">•</span>
          <Mountain className="w-3 h-3" />
          <span>Mountain views</span>
        </div>
      </div>
    </div>
  );
}

export function HotelCardPreview() {
  return (
    <div className="flex gap-3">
      {/* Light mode panel */}
      <ViewTransition name="hotel-card-light-panel">
        <div className="flex-1 bg-[#f5f5f5] rounded-xl p-3 relative overflow-hidden inline-block">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, #d4d4d4 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative z-10">
            <ViewTransition name="hotel-card-light">
              <div className="inline-block">
                <HotelCardLight />
              </div>
            </ViewTransition>
          </div>
        </div>
      </ViewTransition>

      {/* Dark mode panel */}
      <ViewTransition name="hotel-card-dark-panel">
        <div className="flex-1 bg-zinc-950 rounded-xl p-3 relative overflow-hidden inline-block">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, #3f3f46 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative z-10">
            <ViewTransition name="hotel-card-dark">
              <div className="inline-block">
                <HotelCardDark />
              </div>
            </ViewTransition>
          </div>
        </div>
      </ViewTransition>
    </div>
  );
}
