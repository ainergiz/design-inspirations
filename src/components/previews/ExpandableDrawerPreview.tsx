"use client";

import { ViewTransition } from "react";
import { Edit3, Check, Pause, Trash2, Link2 } from "lucide-react";

interface DrawerPreviewProps {
  dark?: boolean;
  expanded?: boolean;
}

function DrawerPreview({ dark = false, expanded = false }: DrawerPreviewProps) {
  const menuItems = [
    { icon: Edit3, label: "Edit objective" },
    { icon: Check, label: "Mark as done" },
    { icon: Pause, label: "Pause" },
    { icon: Trash2, label: "Delete", isDestructive: true },
  ];

  return (
    <div className="w-[180px]">
      <div
        className={`overflow-hidden ${
          expanded
            ? dark
              ? "rounded-xl bg-zinc-800"
              : "rounded-xl bg-white"
            : "rounded-lg"
        }`}
        style={{
          boxShadow: dark
            ? "0 10px 25px -5px rgba(0, 0, 0, 0.4)"
            : "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Menu section */}
        {expanded && (
          <div className="overflow-hidden">
            {/* Drag Handle */}
            <div className="flex justify-center pt-2 pb-0.5">
              <div
                className={`w-6 h-1 rounded-full ${
                  dark ? "bg-zinc-600" : "bg-zinc-300"
                }`}
              />
            </div>

            {/* Menu options - compact */}
            <div className="px-1.5 pb-1.5 space-y-0">
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-[10px] ${
                    item.isDestructive
                      ? "text-red-500"
                      : dark
                      ? "text-zinc-300"
                      : "text-zinc-700"
                  }`}
                >
                  <item.icon
                    className={`w-3 h-3 ${
                      item.isDestructive
                        ? "text-red-500"
                        : dark
                        ? "text-zinc-500"
                        : "text-zinc-400"
                    }`}
                    strokeWidth={1.5}
                  />
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trigger bar */}
        <div
          className={`flex items-center gap-2 px-3 py-2 ${
            dark ? "bg-zinc-900" : "bg-zinc-800"
          } ${expanded ? "rounded-b-xl" : "rounded-lg"}`}
        >
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          <span className="font-mono text-[9px] tracking-wider text-white flex-1">
            NEXT RUN IN 06:53
          </span>
          <Link2 className="w-2.5 h-2.5 text-zinc-400" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

function ExpandableDrawerPreviewLight() {
  return (
    <div className="flex flex-col gap-3">
      <DrawerPreview dark={false} expanded={true} />
    </div>
  );
}

function ExpandableDrawerPreviewDark() {
  return (
    <div className="flex flex-col gap-3">
      <DrawerPreview dark={true} expanded={true} />
    </div>
  );
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
                <ExpandableDrawerPreviewLight />
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
                <ExpandableDrawerPreviewDark />
              </div>
            </ViewTransition>
          </div>
        </div>
      </ViewTransition>
    </div>
  );
}
