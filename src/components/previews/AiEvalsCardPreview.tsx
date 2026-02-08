"use client";

import { ViewTransition } from "react";
import { Star } from "lucide-react";

// Simplified Claude art for preview
function ClaudeArtMini({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 320 144"
      className="absolute inset-0 w-full h-full"
      fill="none"
    >
      {[80, 60, 40, 22].map((r, i) => (
        <circle
          key={r}
          cx="160"
          cy="72"
          r={r}
          stroke={color}
          strokeWidth={1}
          opacity={0.08 + i * 0.04}
        />
      ))}
      <ellipse
        cx="160"
        cy="72"
        rx="100"
        ry="40"
        stroke={color}
        strokeWidth={1}
        opacity={0.15}
        transform="rotate(25, 160, 72)"
      />
      <ellipse
        cx="160"
        cy="72"
        rx="100"
        ry="40"
        stroke={color}
        strokeWidth={1}
        opacity={0.15}
        transform="rotate(-25, 160, 72)"
      />
      <circle cx="160" cy="72" r="8" fill={color} opacity={0.2} />
      <circle cx="160" cy="72" r="4" fill={color} opacity={0.4} />
      <circle cx="230" cy="52" r="3" fill={color} opacity={0.25} />
      <circle cx="90" cy="92" r="3" fill={color} opacity={0.25} />
    </svg>
  );
}

// Static stat bar for preview (no animation)
function PreviewStatBar({
  name,
  score,
  barFrom,
  barTo,
  isLight,
}: {
  name: string;
  score: number;
  barFrom: string;
  barTo: string;
  isLight: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`text-[8px] font-semibold w-[50px] ${
          isLight ? "text-zinc-500" : "text-zinc-400"
        }`}
      >
        {name}
      </span>
      <div
        className={`flex-1 h-[4px] rounded-full ${
          isLight ? "bg-zinc-200/80" : "bg-zinc-800"
        }`}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, ${barFrom}, ${barTo})`,
          }}
        />
      </div>
      <span
        className={`text-[8px] font-bold tabular-nums w-6 text-right ${
          isLight ? "text-zinc-700" : "text-zinc-300"
        }`}
      >
        {score}
      </span>
    </div>
  );
}

// Compact card for preview
function PreviewCard({ isLight }: { isLight: boolean }) {
  const primary = "#f59e0b";
  const gradient = ["#f59e0b", "#ef4444", "#f59e0b"];
  const barFrom = "#fbbf24";
  const barTo = "#f87171";
  const artBg = isLight
    ? ["#fef3c7", "#fed7aa"]
    : ["#451a03", "#7c2d12"];

  const stats = [
    { name: "MMLU", score: 96.2 },
    { name: "HumanEval", score: 95.8 },
    { name: "MATH", score: 88.4 },
    { name: "GPQA", score: 74.9 },
  ];

  return (
    <div
      className="rounded-xl p-[2px] w-[180px]"
      style={{
        background: `linear-gradient(135deg, ${gradient.join(", ")})`,
      }}
    >
      <div
        className={`rounded-[10px] overflow-hidden ${
          isLight ? "bg-white" : "bg-zinc-900"
        }`}
      >
        {/* Header */}
        <div className="px-2.5 pt-2.5 pb-1 flex items-start justify-between">
          <div>
            <h3
              className={`text-[11px] font-bold leading-tight ${
                isLight ? "text-zinc-900" : "text-zinc-100"
              }`}
            >
              Claude Opus{" "}
              <span
                className={`text-[9px] font-normal ${
                  isLight ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                v4
              </span>
            </h3>
            <div className="flex gap-1 mt-1">
              <span className="px-1.5 py-px text-[7px] font-bold uppercase tracking-wide rounded text-white bg-[#d97706]">
                Reasoning
              </span>
              <span className="px-1.5 py-px text-[7px] font-bold uppercase tracking-wide rounded text-white bg-[#2563eb]">
                Safety
              </span>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-[7px] font-semibold uppercase tracking-wider ${
                isLight ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              ELO
            </div>
            <div
              className="text-base font-extrabold leading-tight"
              style={{ color: primary }}
            >
              1397
            </div>
          </div>
        </div>

        {/* Art area */}
        <div className="px-2 pb-0.5">
          <div
            className="rounded-lg h-[72px] relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${artBg[0]}, ${artBg[1]})`,
            }}
          >
            <ClaudeArtMini color={primary} />
          </div>
        </div>

        {/* Stats */}
        <div className="px-2.5 pt-1.5 pb-1 space-y-1">
          {stats.map((stat) => (
            <PreviewStatBar
              key={stat.name}
              name={stat.name}
              score={stat.score}
              barFrom={barFrom}
              barTo={barTo}
              isLight={isLight}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="px-2.5 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-px">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-2.5 h-2.5"
                fill={primary}
                stroke={primary}
                strokeWidth={1.5}
              />
            ))}
            <span
              className={`text-[7px] font-semibold ml-1 uppercase tracking-wide ${
                isLight ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Legendary
            </span>
          </div>
          <span
            className={`text-[8px] font-mono ${
              isLight ? "text-zinc-300" : "text-zinc-600"
            }`}
          >
            #001
          </span>
        </div>
      </div>
    </div>
  );
}

// Light variant
function AiEvalsCardLight() {
  return <PreviewCard isLight />;
}

// Dark variant
function AiEvalsCardDark() {
  return <PreviewCard isLight={false} />;
}

// Main preview export
export function AiEvalsCardPreview() {
  return (
    <div className="flex gap-3">
      {/* Light mode panel */}
      <ViewTransition name="ai-evals-card-light-panel">
        <div className="flex-1 bg-[#f5f5f5] rounded-xl p-3 relative overflow-hidden inline-block">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, #d4d4d4 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative z-10 flex justify-center">
            <ViewTransition name="ai-evals-card-light">
              <div className="inline-block">
                <AiEvalsCardLight />
              </div>
            </ViewTransition>
          </div>
        </div>
      </ViewTransition>

      {/* Dark mode panel */}
      <ViewTransition name="ai-evals-card-dark-panel">
        <div className="flex-1 bg-zinc-950 rounded-xl p-3 relative overflow-hidden inline-block">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, #3f3f46 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative z-10 flex justify-center">
            <ViewTransition name="ai-evals-card-dark">
              <div className="inline-block">
                <AiEvalsCardDark />
              </div>
            </ViewTransition>
          </div>
        </div>
      </ViewTransition>
    </div>
  );
}
