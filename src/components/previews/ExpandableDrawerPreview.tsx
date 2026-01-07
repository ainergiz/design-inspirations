"use client";

import { useState, useRef, useEffect, ViewTransition } from "react";

// Menu items for the drawer
const MENU_ITEMS = [
  { icon: "pencil", label: "Edit objective" },
  { icon: "check", label: "Mark as done" },
  { icon: "pause", label: "Pause scouting" },
];

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
    if (delta > 0) setDragY(delta);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY > 60) setIsOpen(false);
    setDragY(0);
  };

  // Calculate opacity and height based on drag progress
  const dragProgress = Math.min(dragY / 150, 1);
  const menuOpacity = 1 - dragProgress * 0.7;
  const menuMaxHeight = isDragging ? Math.max(0, 200 - dragY * 1.5) : 300;

  // Dynamic instruction text
  const instructionText = isOpen ? "drag to close" : "click for options";

  // Color schemes
  const colors = dark
    ? {
        bg: "bg-zinc-900",
        cardBg: "bg-zinc-800",
        barBg: "bg-zinc-950",
        text: "text-zinc-300",
        mutedText: "text-zinc-500",
        hoverBg: "hover:bg-zinc-700",
        handle: "bg-zinc-600",
        deleteText: "text-red-400",
        deleteHover: "hover:bg-red-950/50",
      }
    : {
        bg: "bg-zinc-100",
        cardBg: "bg-white",
        barBg: "bg-slate-800",
        text: "text-slate-700",
        mutedText: "text-zinc-400",
        hoverBg: "hover:bg-gray-50",
        handle: "bg-gray-300",
        deleteText: "text-red-500",
        deleteHover: "hover:bg-red-50",
      };

  return (
    <div className={`${colors.bg} rounded-xl p-6 w-72`}>
      {/* Instruction text */}
      <div className="text-center mb-4">
        <span
          className={`text-xs font-medium ${colors.mutedText} uppercase tracking-widest`}
        >
          {instructionText}
        </span>
      </div>

      {/* The expandable card */}
      <div ref={cardRef} className="relative">
        <div
          className={`overflow-hidden shadow-xl ${
            isOpen ? "rounded-2xl" : "rounded-xl"
          } ${isOpen ? colors.cardBg : ""}`}
          style={{ transition: isDragging ? "none" : "all 0.4s ease-out" }}
        >
          {/* Menu section - collapses during drag */}
          <div
            className="overflow-hidden"
            style={{
              maxHeight: isOpen ? menuMaxHeight : 0,
              opacity: isOpen ? menuOpacity : 0,
              transition: isDragging ? "none" : "all 0.4s ease-out",
            }}
          >
            {/* DRAGGABLE Handle */}
            <div
              className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none"
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
            >
              <div className={`w-10 h-1.5 ${colors.handle} rounded-full`} />
            </div>

            {/* Menu options */}
            <div className="px-3 pb-3 space-y-0.5">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left ${colors.text} ${colors.hoverBg} rounded-lg transition-colors text-sm`}
                >
                  <span className={`${colors.mutedText}`}>
                    {item.icon === "pencil" && (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    )}
                    {item.icon === "check" && (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    {item.icon === "pause" && (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
              <button
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left ${colors.deleteText} ${colors.deleteHover} rounded-lg transition-colors text-sm`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span className="font-medium">Delete</span>
              </button>
            </div>
          </div>

          {/* Dark bar - ALWAYS at bottom, NEVER moves */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center gap-3 px-4 py-3 ${
              colors.barBg
            } transition-colors cursor-pointer ${
              isOpen ? "rounded-b-2xl" : "rounded-xl"
            }`}
          >
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="font-mono text-xs tracking-wider text-white">
              NEXT RUN IN 06:53:35
            </span>
            <span className="p-1 text-gray-400 ml-auto">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ExpandableDrawerLight() {
  return <ExpandableDrawer dark={false} />;
}

function ExpandableDrawerDark() {
  return <ExpandableDrawer dark={true} />;
}

export function ExpandableDrawerPreview() {
  return (
    <div className="flex gap-3">
      {/* Light mode panel */}
      <ViewTransition name="expandable-drawer-light-panel">
        <div className="flex-1 bg-[#f5f5f5] rounded-xl p-3 relative overflow-hidden inline-block">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, #d4d4d4 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative z-10">
            <ViewTransition name="expandable-drawer-light">
              <div className="inline-block">
                <ExpandableDrawerLight />
              </div>
            </ViewTransition>
          </div>
        </div>
      </ViewTransition>

      {/* Dark mode panel */}
      <ViewTransition name="expandable-drawer-dark-panel">
        <div className="flex-1 bg-zinc-950 rounded-xl p-3 relative overflow-hidden inline-block">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, #3f3f46 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative z-10">
            <ViewTransition name="expandable-drawer-dark">
              <div className="inline-block">
                <ExpandableDrawerDark />
              </div>
            </ViewTransition>
          </div>
        </div>
      </ViewTransition>
    </div>
  );
}
