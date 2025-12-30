"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { CompanyCardPreview } from "@/components/previews/CompanyCardPreview";
import { HotelCardPreview } from "@/components/previews/HotelCardPreview";
import { BillsPaymentsPreview } from "@/components/previews/BillsPaymentsPreview";
import { designs as designsData } from "@/data/designs";

// Preview dimensions for viewport boundary detection
const PREVIEW_HEIGHT = 400;
const PREVIEW_WIDTH = 320;
const PREVIEW_OFFSET = 20;

// Preview components map
const previewComponents: Record<string, React.ComponentType> = {
  "company-card": CompanyCardPreview,
  "hotel-card": HotelCardPreview,
  "bills-payments": BillsPaymentsPreview,
};

// Design data with preview components
const designs = designsData.map((design) => ({
  ...design,
  PreviewComponent: previewComponents[design.id],
}));

// Touch device detection using useSyncExternalStore for SSR safety
const subscribeToNothing = () => () => {};
const getIsTouchDevice = () =>
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  window.matchMedia('(pointer: coarse)').matches;
const getServerSnapshot = () => false;

export default function Home() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isTouchDevice = useSyncExternalStore(subscribeToNothing, getIsTouchDevice, getServerSnapshot);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip mouse tracking on touch devices
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isTouchDevice]);

  const hoveredDesign = designs.find((d) => d.id === hoveredId);

  // Calculate optimal preview position with viewport boundary detection
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 800;
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
  const spaceBelow = viewportHeight - mousePosition.y;
  const spaceAbove = mousePosition.y;

  // Vertical positioning: prefer below, flip above if needed, clamp if limited
  let previewTop: number;
  if (spaceBelow >= PREVIEW_HEIGHT + PREVIEW_OFFSET) {
    previewTop = mousePosition.y + PREVIEW_OFFSET;
  } else if (spaceAbove >= PREVIEW_HEIGHT + PREVIEW_OFFSET) {
    previewTop = mousePosition.y - PREVIEW_HEIGHT - PREVIEW_OFFSET;
  } else {
    previewTop = Math.max(
      PREVIEW_OFFSET,
      Math.min(mousePosition.y - PREVIEW_HEIGHT / 2, viewportHeight - PREVIEW_HEIGHT - PREVIEW_OFFSET)
    );
  }

  // Horizontal positioning: prefer right, flip left if overflow
  const previewLeft = mousePosition.x + PREVIEW_OFFSET + PREVIEW_WIDTH > viewportWidth
    ? mousePosition.x - PREVIEW_WIDTH - PREVIEW_OFFSET
    : mousePosition.x + PREVIEW_OFFSET;

  return (
    <div className="min-h-screen bg-[#fafafa]" ref={containerRef}>
      {/* Hero section */}
      <div className="max-w-4xl mx-auto px-8 pt-24 pb-16">
        <div className="flex items-start justify-between gap-8">
          <div>
            <h1 className="text-5xl font-semibold tracking-tight text-zinc-900 mb-6">
              Design Inspirations
            </h1>
            <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
              A curated collection of beautiful UI patterns and components.
            </p>
          </div>
          <a
            href="https://github.com/ainergiz/design-inspirations"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-600 transition-colors mt-2"
          >
            <Github className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>

      {/* Designs list */}
      <main className="max-w-4xl mx-auto px-8 pb-24">
        <div className="border-t border-zinc-200">
          {designs.map((design) => (
            <Link
              key={design.id}
              href={`/designs/${design.id}`}
              className="group block"
              onMouseEnter={isTouchDevice ? undefined : () => setHoveredId(design.id)}
              onMouseLeave={isTouchDevice ? undefined : () => setHoveredId(null)}
            >
              <article className="py-8 border-b border-zinc-200 transition-colors hover:bg-zinc-50/50">
                <div className="flex items-start gap-6">
                  {/* Number */}
                  <span className="text-sm font-mono text-zinc-300 pt-1 w-8">
                    {design.number}
                  </span>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Title with arrow */}
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className="text-xl font-medium text-zinc-900 group-hover:text-zinc-700 transition-colors">
                            {design.title}
                          </h2>
                          <ArrowUpRight
                            className="w-5 h-5 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                            strokeWidth={1.5}
                          />
                        </div>

                        {/* Description */}
                        <p className="text-zinc-500 text-sm mb-4">
                          {design.description}
                        </p>

                        {/* Tags */}
                        <div className="flex items-center gap-4">
                          <div className="flex gap-2">
                            {design.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 text-xs font-medium text-zinc-500 bg-zinc-100 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Coming soon placeholder */}
        <div className="py-8 border-b border-zinc-200">
          <div className="flex items-start gap-6">
            <span className="text-sm font-mono text-zinc-200 pt-1 w-8">04</span>
            <div className="flex-1">
              <h2 className="text-xl font-medium text-zinc-300 mb-2">
                More designs coming soon...
              </h2>
              <p className="text-zinc-300 text-sm">
                Stay tuned for more beautiful UI patterns
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating preview - disabled on touch devices */}
      <AnimatePresence>
        {!isTouchDevice && hoveredId && hoveredDesign && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed pointer-events-none z-50"
            style={{
              left: previewLeft,
              top: previewTop,
            }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.2))",
              }}
            >
              <hoveredDesign.PreviewComponent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
