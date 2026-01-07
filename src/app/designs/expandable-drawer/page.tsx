"use client";

import { useState, useRef, useEffect, ViewTransition } from "react";
import { DM_Sans } from "next/font/google";
import { PageHeader } from "@/components/PageHeader";
import { Edit3, Check, Pause, Trash2, Link2 } from "lucide-react";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

interface ExpandableDrawerProps {
  dark?: boolean;
}

function ExpandableDrawer({ dark = false }: ExpandableDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Drag gesture handlers
  const handleDragStart = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleDragMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientY - dragStartY.current;
    // Only allow dragging down (positive delta)
    if (delta > 0) {
      setDragY(delta);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // If dragged more than 80px, close the menu
    if (dragY > 80) {
      setIsOpen(false);
    }
    setDragY(0);
  };

  // Calculate opacity and height based on drag progress
  const dragProgress = Math.min(dragY / 200, 1);
  const menuOpacity = 1 - dragProgress * 0.7;
  const menuMaxHeight = isDragging ? Math.max(0, 260 - dragY * 1.5) : 300;

  const menuItems = [
    { icon: Edit3, label: "Edit objective", color: dark ? "text-zinc-300" : "text-zinc-700" },
    { icon: Check, label: "Mark as done", color: dark ? "text-zinc-300" : "text-zinc-700" },
    { icon: Pause, label: "Pause", color: dark ? "text-zinc-300" : "text-zinc-700" },
    { icon: Trash2, label: "Delete", color: "text-red-500", hoverBg: dark ? "hover:bg-red-500/10" : "hover:bg-red-50" },
  ];

  return (
    <div ref={cardRef} className="w-[320px] relative">
      {/* Menu panel - positioned absolutely above the trigger bar */}
      <div
        className={`absolute bottom-full left-0 right-0 mb-0 overflow-hidden ${
          dark ? "bg-zinc-800" : "bg-white"
        }`}
        style={{
          maxHeight: isOpen ? menuMaxHeight : 0,
          opacity: isOpen ? menuOpacity : 0,
          transition: isDragging
            ? "none"
            : "max-height 0.5s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.4s ease-out, border-radius 0.3s ease-out, box-shadow 0.4s ease-out",
          borderRadius: isOpen ? "16px 16px 0 0" : "16px",
          boxShadow: isOpen
            ? dark
              ? "0 -10px 40px -10px rgba(0, 0, 0, 0.4)"
              : "0 -10px 40px -10px rgba(0, 0, 0, 0.15)"
            : "none",
        }}
      >
        {/* Drag Handle */}
        <div
          className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
        >
          <div
            className={`w-10 h-1.5 rounded-full ${
              dark ? "bg-zinc-600" : "bg-zinc-300"
            }`}
          />
        </div>

        {/* Menu options */}
        <div className="px-3 pb-3 space-y-0.5">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setIsOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg transition-colors cursor-pointer ${item.color} ${
                item.hoverBg || (dark ? "hover:bg-zinc-700" : "hover:bg-zinc-50")
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  item.label === "Delete"
                    ? "text-red-500"
                    : dark
                    ? "text-zinc-500"
                    : "text-zinc-400"
                }`}
                strokeWidth={1.5}
              />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trigger bar - FIXED position, never moves */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-4 px-5 py-3.5 transition-colors cursor-pointer ${
          dark
            ? "bg-zinc-900 hover:bg-zinc-800"
            : "bg-zinc-800 hover:bg-zinc-700"
        } ${isOpen ? "rounded-b-2xl rounded-t-none" : "rounded-xl"}`}
        style={{
          boxShadow: dark
            ? "0 10px 30px -5px rgba(0, 0, 0, 0.5)"
            : "0 10px 30px -5px rgba(0, 0, 0, 0.25)",
        }}
      >
        <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
        <span className="font-mono text-sm tracking-wider text-white flex-1 text-left">
          NEXT RUN IN 06:53:35
        </span>
        <Link2 className="w-4 h-4 text-zinc-400" strokeWidth={2} />
      </button>
    </div>
  );
}

function ExpandableDrawerLight() {
  return <ExpandableDrawer dark={false} />;
}

function ExpandableDrawerDark() {
  return <ExpandableDrawer dark={true} />;
}

export default function ExpandableDrawerPage() {
  return (
    <div className={`min-h-screen ${dmSans.className}`}>
      <PageHeader
        title="Expandable Drawer"
        codePath="designs/expandable-drawer/page.tsx"
        inspiration={{
          handle: "yutori_ai",
          imageUrl:
            "https://pbs.twimg.com/profile_images/1882505193713242112/W482xHmw_400x400.png",
        }}
      />

      {/* Split layout */}
      <div className="flex flex-col md:flex-row min-h-screen pt-[57px]">
        {/* Light mode side */}
        <ViewTransition name="expandable-drawer-light-panel">
          <div className="flex-1 bg-[#f5f5f5] relative overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, #d4d4d4 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            {/* Position drawer at center of panel */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <ViewTransition name="expandable-drawer-light">
                <ExpandableDrawerLight />
              </ViewTransition>
            </div>
          </div>
        </ViewTransition>

        {/* Dark mode side */}
        <ViewTransition name="expandable-drawer-dark-panel">
          <div className="flex-1 bg-zinc-950 relative overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, #3f3f46 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            {/* Position drawer at center of panel */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <ViewTransition name="expandable-drawer-dark">
                <ExpandableDrawerDark />
              </ViewTransition>
            </div>
          </div>
        </ViewTransition>
      </div>
    </div>
  );
}
