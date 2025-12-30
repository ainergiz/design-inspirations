"use client";

import { useState, useEffect, ViewTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { DM_Sans } from "next/font/google";
import { ArrowLeft, ExternalLink, Code, Star, Wifi, Flame, TreePine, Car, UtensilsCrossed, Dog, Mountain, MapPin } from "lucide-react";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

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
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
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
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-6 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/60"
                }`}
              />
              {/* Animated fill for active indicator - only when hovered and not paused */}
              {index === currentIndex && isHovered && !isPaused && (
                <div
                  key={progressKey}
                  className="absolute inset-0 h-2 rounded-full bg-white/50 origin-left animate-carousel-progress"
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
    <div className="bg-gradient-to-b from-[#e8e8ea] to-[#dcdce0] rounded-3xl p-2 w-full max-w-[420px] shadow-xl shadow-zinc-400/30 border border-white/60">
      {/* Image Card */}
      <div className="relative h-[240px] w-full rounded-2xl overflow-hidden mb-2 border border-white/40">
        <ImageCarousel variant="light" />
      </div>

      {/* Info Section */}
      <div className="bg-white rounded-2xl px-5 py-4">
        {/* Title and Rating */}
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="text-lg font-semibold text-zinc-900 leading-tight">
            Snowdonia Thatched Cottage
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-sm font-medium text-zinc-700">4.5</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-4">
          <MapPin className="w-3.5 h-3.5 text-zinc-400" />
          <p className="text-xs text-zinc-400">
            Beddgelert, Gwynedd, Wales LL55 4YE
          </p>
        </div>

        {/* Price and Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-zinc-900">£65</span>
          <span className="text-sm text-zinc-400">/night</span>
          <span className="ml-auto px-3 py-1.5 text-xs font-medium text-zinc-700 bg-[#d4f5d4] rounded-full">
            0.3 miles off route
          </span>
        </div>

        {/* Amenities Row 1 */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-2 flex-wrap">
          <Wifi className="w-3.5 h-3.5" />
          <span>Free Wi-Fi</span>
          <span className="text-zinc-300">•</span>
          <Flame className="w-3.5 h-3.5" />
          <span>Log fire</span>
          <span className="text-zinc-300">•</span>
          <TreePine className="w-3.5 h-3.5" />
          <span>Garden</span>
          <span className="text-zinc-300">•</span>
          <Car className="w-3.5 h-3.5" />
          <span>Parking</span>
        </div>

        {/* Amenities Row 2 */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 flex-wrap">
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Kitchen</span>
          <span className="text-zinc-300">•</span>
          <Dog className="w-3.5 h-3.5" />
          <span>Pet friendly</span>
          <span className="text-zinc-300">•</span>
          <Mountain className="w-3.5 h-3.5" />
          <span>Mountain views</span>
        </div>
      </div>
    </div>
  );
}

function HotelCardDark() {
  return (
    <div className="bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-3xl p-2 w-full max-w-[420px] shadow-xl shadow-black/50 border border-zinc-600/40">
      {/* Image Card */}
      <div className="relative h-[240px] w-full rounded-2xl overflow-hidden mb-2 border border-zinc-600/30">
        <ImageCarousel variant="dark" />
      </div>

      {/* Info Section */}
      <div className="bg-zinc-900 rounded-2xl px-5 py-4">
        {/* Title and Rating */}
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="text-lg font-semibold text-zinc-100 leading-tight">
            Snowdonia Thatched Cottage
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-sm font-medium text-zinc-300">4.5</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-4">
          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
          <p className="text-xs text-zinc-500">
            Beddgelert, Gwynedd, Wales LL55 4YE
          </p>
        </div>

        {/* Price and Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-zinc-100">£65</span>
          <span className="text-sm text-zinc-500">/night</span>
          <span className="ml-auto px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-900/40 rounded-full">
            0.3 miles off route
          </span>
        </div>

        {/* Amenities Row 1 */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-2 flex-wrap">
          <Wifi className="w-3.5 h-3.5" />
          <span>Free Wi-Fi</span>
          <span className="text-zinc-600">•</span>
          <Flame className="w-3.5 h-3.5" />
          <span>Log fire</span>
          <span className="text-zinc-600">•</span>
          <TreePine className="w-3.5 h-3.5" />
          <span>Garden</span>
          <span className="text-zinc-600">•</span>
          <Car className="w-3.5 h-3.5" />
          <span>Parking</span>
        </div>

        {/* Amenities Row 2 */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 flex-wrap">
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Kitchen</span>
          <span className="text-zinc-600">•</span>
          <Dog className="w-3.5 h-3.5" />
          <span>Pet friendly</span>
          <span className="text-zinc-600">•</span>
          <Mountain className="w-3.5 h-3.5" />
          <span>Mountain views</span>
        </div>
      </div>
    </div>
  );
}

export default function HotelCardPage() {
  return (
    <div className={`min-h-screen ${dmSans.className}`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-base font-medium text-zinc-900">
              Hotel Booking Card
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ainergiz/design-inspirations/blob/main/src/app/designs/hotel-card/page.tsx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">Code</span>
            </a>
            <a
              href="https://x.com/loseva_pro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              <span className="hidden sm:inline text-zinc-400">Inspired from</span>
              <Image
                src="https://pbs.twimg.com/profile_images/1925206450499919872/j_t5vP4l_400x400.jpg"
                alt="loseva_pro"
                width={24}
                height={24}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium text-zinc-700">@loseva_pro</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Split layout */}
      <div className="flex flex-col md:flex-row min-h-screen pt-[57px]">
        {/* Light mode side */}
        <ViewTransition name="hotel-card-light-panel">
          <div className="flex-1 bg-[#f5f5f5] relative">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, #d4d4d4 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-57px)] p-6 md:p-12">
              <ViewTransition name="hotel-card-light">
                <div className="w-full max-w-md flex justify-center">
                  <HotelCardLight />
                </div>
              </ViewTransition>
            </div>
          </div>
        </ViewTransition>

        {/* Dark mode side */}
        <ViewTransition name="hotel-card-dark-panel">
          <div className="flex-1 bg-zinc-950 relative">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, #3f3f46 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-57px)] p-6 md:p-12">
              <ViewTransition name="hotel-card-dark">
                <div className="w-full max-w-md flex justify-center">
                  <HotelCardDark />
                </div>
              </ViewTransition>
            </div>
          </div>
        </ViewTransition>
      </div>
    </div>
  );
}
