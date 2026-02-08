"use client";

import { useState, useRef, useCallback, ViewTransition } from "react";
import { DM_Sans } from "next/font/google";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// --- Data ---

interface ModelStat {
  name: string;
  score: number;
}

interface ModelData {
  name: string;
  version: string;
  types: { name: string; color: string }[];
  elo: number;
  rarity: string;
  stars: number;
  cardNumber: string;
  colors: {
    primary: string;
    secondary: string;
    gradient: string[];
    artBgLight: [string, string];
    artBgDark: [string, string];
    barFrom: string;
    barTo: string;
  };
  stats: ModelStat[];
  art: "claude" | "gpt" | "gemini";
}

const models: ModelData[] = [
  {
    name: "Claude Opus",
    version: "4",
    types: [
      { name: "Reasoning", color: "#d97706" },
      { name: "Safety", color: "#2563eb" },
    ],
    elo: 1397,
    rarity: "Legendary",
    stars: 5,
    cardNumber: "#001",
    colors: {
      primary: "#f59e0b",
      secondary: "#ef4444",
      gradient: ["#f59e0b", "#ef4444", "#f59e0b"],
      artBgLight: ["#fef3c7", "#fed7aa"],
      artBgDark: ["#451a03", "#7c2d12"],
      barFrom: "#fbbf24",
      barTo: "#f87171",
    },
    stats: [
      { name: "MMLU", score: 96.2 },
      { name: "HumanEval", score: 95.8 },
      { name: "MATH", score: 88.4 },
      { name: "GPQA", score: 74.9 },
    ],
    art: "claude",
  },
  {
    name: "GPT-4o",
    version: "2024",
    types: [
      { name: "Multimodal", color: "#7c3aed" },
      { name: "Coding", color: "#059669" },
    ],
    elo: 1345,
    rarity: "Ultra Rare",
    stars: 4,
    cardNumber: "#002",
    colors: {
      primary: "#10b981",
      secondary: "#06b6d4",
      gradient: ["#10b981", "#06b6d4", "#10b981"],
      artBgLight: ["#d1fae5", "#ccfbf1"],
      artBgDark: ["#022c22", "#042f2e"],
      barFrom: "#34d399",
      barTo: "#22d3ee",
    },
    stats: [
      { name: "MMLU", score: 88.7 },
      { name: "HumanEval", score: 91.0 },
      { name: "MATH", score: 76.6 },
      { name: "GPQA", score: 53.6 },
    ],
    art: "gpt",
  },
  {
    name: "Gemini Ultra",
    version: "1.5",
    types: [
      { name: "Multimodal", color: "#7c3aed" },
      { name: "Reasoning", color: "#d97706" },
    ],
    elo: 1368,
    rarity: "Ultra Rare",
    stars: 4,
    cardNumber: "#003",
    colors: {
      primary: "#6366f1",
      secondary: "#a855f7",
      gradient: ["#6366f1", "#a855f7", "#6366f1"],
      artBgLight: ["#e0e7ff", "#ede9fe"],
      artBgDark: ["#1e1b4b", "#2e1065"],
      barFrom: "#818cf8",
      barTo: "#c084fc",
    },
    stats: [
      { name: "MMLU", score: 90.0 },
      { name: "HumanEval", score: 88.4 },
      { name: "MATH", score: 83.2 },
      { name: "GPQA", score: 65.0 },
    ],
    art: "gemini",
  },
];

// --- SVG Art Components ---

function ClaudeArt({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 320 144"
      className="absolute inset-0 w-full h-full"
      fill="none"
    >
      {/* Concentric circles */}
      {[100, 80, 60, 40, 22].map((r, i) => (
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
      {/* Orbital ellipses */}
      <ellipse
        cx="160"
        cy="72"
        rx="110"
        ry="45"
        stroke={color}
        strokeWidth={1}
        opacity={0.15}
        transform="rotate(25, 160, 72)"
      />
      <ellipse
        cx="160"
        cy="72"
        rx="110"
        ry="45"
        stroke={color}
        strokeWidth={1}
        opacity={0.15}
        transform="rotate(-25, 160, 72)"
      />
      {/* Center glow */}
      <circle cx="160" cy="72" r="10" fill={color} opacity={0.2} />
      <circle cx="160" cy="72" r="5" fill={color} opacity={0.4} />
      {/* Orbital nodes */}
      <circle cx="240" cy="50" r="3.5" fill={color} opacity={0.3} />
      <circle cx="80" cy="94" r="3.5" fill={color} opacity={0.3} />
      <circle cx="210" cy="108" r="2.5" fill={color} opacity={0.2} />
      <circle cx="110" cy="36" r="2.5" fill={color} opacity={0.2} />
      <circle cx="270" cy="80" r="2" fill={color} opacity={0.15} />
      <circle cx="50" cy="64" r="2" fill={color} opacity={0.15} />
    </svg>
  );
}

function GPTArt({ color }: { color: string }) {
  // Deterministic hex-grid of nodes
  const nodes: { x: number; y: number }[] = [];
  const cols = 9;
  const rows = 5;
  const sx = 320 / (cols + 1);
  const sy = 144 / (rows + 1);
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const offset = r % 2 === 0 ? sx / 2 : 0;
      nodes.push({ x: c * sx + offset - sx / 2, y: r * sy });
    }
  }

  // Connect nearby nodes
  const connections: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 55) {
        connections.push({
          x1: nodes[i].x,
          y1: nodes[i].y,
          x2: nodes[j].x,
          y2: nodes[j].y,
        });
      }
    }
  }

  return (
    <svg
      viewBox="0 0 320 144"
      className="absolute inset-0 w-full h-full"
      fill="none"
    >
      {connections.map((c, i) => (
        <line
          key={i}
          x1={c.x1}
          y1={c.y1}
          x2={c.x2}
          y2={c.y2}
          stroke={color}
          strokeWidth={0.6}
          opacity={0.12}
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i % 3 === 0 ? 3 : 2}
          fill={color}
          opacity={0.15 + (i % 4) * 0.05}
        />
      ))}
    </svg>
  );
}

function GeminiArt({ color }: { color: string }) {
  const cx = 160;
  const cy = 72;
  const rays = 12;
  const innerR = 18;
  const outerR = 65;

  return (
    <svg
      viewBox="0 0 320 144"
      className="absolute inset-0 w-full h-full"
      fill="none"
    >
      {/* Radiating lines */}
      {Array.from({ length: rays }).map((_, i) => {
        const angle = (i * 360) / rays;
        const rad = (angle * Math.PI) / 180;
        const x1 = cx + Math.cos(rad) * innerR;
        const y1 = cy + Math.sin(rad) * innerR;
        const x2 = cx + Math.cos(rad) * outerR;
        const y2 = cy + Math.sin(rad) * outerR;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={1}
            opacity={0.15}
          />
        );
      })}
      {/* Diamond shapes at endpoints */}
      {Array.from({ length: rays }).map((_, i) => {
        if (i % 2 !== 0) return null;
        const angle = (i * 360) / rays;
        const rad = (angle * Math.PI) / 180;
        const x = cx + Math.cos(rad) * (outerR - 5);
        const y = cy + Math.sin(rad) * (outerR - 5);
        return (
          <rect
            key={`d-${i}`}
            x={x - 3}
            y={y - 3}
            width={6}
            height={6}
            fill={color}
            opacity={0.2}
            transform={`rotate(45, ${x}, ${y})`}
          />
        );
      })}
      {/* Inner polygon */}
      {(() => {
        const points = Array.from({ length: 6 })
          .map((_, i) => {
            const angle = (i * 360) / 6 - 90;
            const rad = (angle * Math.PI) / 180;
            return `${cx + Math.cos(rad) * 28},${cy + Math.sin(rad) * 28}`;
          })
          .join(" ");
        return (
          <polygon
            points={points}
            stroke={color}
            strokeWidth={1}
            fill={color}
            fillOpacity={0.06}
            opacity={0.3}
          />
        );
      })()}
      {/* Center */}
      <circle cx={cx} cy={cy} r={8} fill={color} opacity={0.15} />
      <circle cx={cx} cy={cy} r={3.5} fill={color} opacity={0.35} />
    </svg>
  );
}

const artComponents = {
  claude: ClaudeArt,
  gpt: GPTArt,
  gemini: GeminiArt,
};

// --- Stat Bar ---

function StatBar({
  stat,
  theme,
  delay,
  barFrom,
  barTo,
  modelIndex,
}: {
  stat: ModelStat;
  theme: "light" | "dark";
  delay: number;
  barFrom: string;
  barTo: string;
  modelIndex: number;
}) {
  const isLight = theme === "light";

  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`text-xs font-semibold w-[72px] ${
          isLight ? "text-zinc-500" : "text-zinc-400"
        }`}
      >
        {stat.name}
      </span>
      <div
        className={`flex-1 h-[6px] rounded-full ${
          isLight ? "bg-zinc-200/80" : "bg-zinc-800"
        }`}
      >
        <motion.div
          key={modelIndex}
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${stat.score}%` }}
          transition={{
            duration: 0.7,
            delay,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{
            background: `linear-gradient(90deg, ${barFrom}, ${barTo})`,
          }}
        />
      </div>
      <span
        className={`text-xs font-bold tabular-nums w-9 text-right ${
          isLight ? "text-zinc-700" : "text-zinc-300"
        }`}
      >
        {stat.score}
      </span>
    </div>
  );
}

// --- Model Card ---

function ModelCard({
  model,
  theme,
  modelIndex,
}: {
  model: ModelData;
  theme: "light" | "dark";
  modelIndex: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setMousePos({ x: 0.5, y: 0.5 });
  }, []);

  const rotateX = isHovering ? (mousePos.y - 0.5) * -14 : 0;
  const rotateY = isHovering ? (mousePos.x - 0.5) * 14 : 0;

  const isLight = theme === "light";
  const ArtComponent = artComponents[model.art];

  return (
    <div style={{ perspective: "1000px" }} className="flex justify-center">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        className="relative w-[300px] select-none"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: isHovering
            ? "transform 0.1s ease-out"
            : "transform 0.4s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Gradient border wrapper */}
        <div
          className="rounded-2xl p-[2.5px]"
          style={{
            background: `linear-gradient(135deg, ${model.colors.gradient.join(", ")})`,
          }}
        >
          {/* Inner card */}
          <div
            className={`rounded-[13px] overflow-hidden ${
              isLight ? "bg-white" : "bg-zinc-900"
            }`}
          >
            {/* Header */}
            <div className="px-4 pt-4 pb-2 flex items-start justify-between">
              <div>
                <h3
                  className={`text-lg font-bold leading-tight ${
                    isLight ? "text-zinc-900" : "text-zinc-100"
                  }`}
                >
                  {model.name}{" "}
                  <span
                    className={`text-sm font-normal ${
                      isLight ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    v{model.version}
                  </span>
                </h3>
                <div className="flex gap-1.5 mt-1.5">
                  {model.types.map((type) => (
                    <span
                      key={type.name}
                      className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md text-white"
                      style={{ backgroundColor: type.color }}
                    >
                      {type.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                    isLight ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  ELO
                </div>
                <div
                  className="text-2xl font-extrabold leading-tight"
                  style={{ color: model.colors.primary }}
                >
                  {model.elo}
                </div>
              </div>
            </div>

            {/* Art area */}
            <div className="px-3 pb-1">
              <div
                className="rounded-xl h-36 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${
                    isLight
                      ? model.colors.artBgLight[0]
                      : model.colors.artBgDark[0]
                  }, ${
                    isLight
                      ? model.colors.artBgLight[1]
                      : model.colors.artBgDark[1]
                  })`,
                }}
              >
                <ArtComponent color={model.colors.primary} />
              </div>
            </div>

            {/* Stats */}
            <div className="px-4 pt-3 pb-2 space-y-2">
              {model.stats.map((stat, i) => (
                <StatBar
                  key={stat.name}
                  stat={stat}
                  theme={theme}
                  delay={0.15 + i * 0.1}
                  barFrom={model.colors.barFrom}
                  barTo={model.colors.barTo}
                  modelIndex={modelIndex}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 pt-1 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5"
                    fill={
                      i < model.stars ? model.colors.primary : "transparent"
                    }
                    stroke={
                      i < model.stars
                        ? model.colors.primary
                        : isLight
                          ? "#d4d4d8"
                          : "#52525b"
                    }
                    strokeWidth={1.5}
                  />
                ))}
                <span
                  className={`text-[10px] font-semibold ml-1.5 uppercase tracking-wide ${
                    isLight ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  {model.rarity}
                </span>
              </div>
              <span
                className={`text-xs font-mono ${
                  isLight ? "text-zinc-300" : "text-zinc-600"
                }`}
              >
                {model.cardNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Holographic rainbow shimmer overlay */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            opacity: isHovering ? 0.2 : 0,
            background: `radial-gradient(
              circle at ${mousePos.x * 100}% ${mousePos.y * 100}%,
              hsla(0, 90%, 75%, 0.5),
              hsla(55, 90%, 75%, 0.5) 17%,
              hsla(120, 90%, 75%, 0.5) 34%,
              hsla(180, 90%, 75%, 0.5) 51%,
              hsla(240, 90%, 75%, 0.5) 68%,
              hsla(300, 90%, 75%, 0.4) 85%,
              transparent 100%
            )`,
            mixBlendMode: "overlay",
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Light reflection spot */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            opacity: isHovering ? 0.12 : 0,
            background: `radial-gradient(
              circle at ${mousePos.x * 100}% ${mousePos.y * 100}%,
              rgba(255, 255, 255, 0.8) 0%,
              transparent 45%
            )`,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

// --- Card Browser ---

function CardBrowser({ theme }: { theme: "light" | "dark" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [[, direction], setPage] = useState([0, 0]);

  const navigate = (newIndex: number) => {
    setPage([newIndex, newIndex > activeIndex ? 1 : -1]);
    setActiveIndex(newIndex);
  };

  const prev = () =>
    navigate((activeIndex - 1 + models.length) % models.length);
  const next = () => navigate((activeIndex + 1) % models.length);

  const isLight = theme === "light";

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Card with enter/exit animation */}
      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: direction * 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction * -40, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <ModelCard
              model={models[activeIndex]}
              theme={theme}
              modelIndex={activeIndex}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={prev}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isLight
              ? "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
              : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
          }`}
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2} />
        </button>

        <div className="flex gap-2 items-center">
          {models.map((_, i) => (
            <button
              key={i}
              onClick={() => navigate(i)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === activeIndex
                  ? `w-6 ${isLight ? "bg-zinc-800" : "bg-zinc-200"}`
                  : `w-2 ${isLight ? "bg-zinc-300 hover:bg-zinc-400" : "bg-zinc-600 hover:bg-zinc-500"}`
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isLight
              ? "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
              : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
          }`}
        >
          <ChevronRight className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

// --- Page Components ---

function AiEvalsCardLight() {
  return <CardBrowser theme="light" />;
}

function AiEvalsCardDark() {
  return <CardBrowser theme="dark" />;
}

export default function AiEvalsCardPage() {
  return (
    <div className={`min-h-screen ${dmSans.className}`}>
      <PageHeader
        title="AI Evals Card"
        codePath="designs/ai-evals-card/page.tsx"
        inspiration={{
          handle: "ainergiz",
          imageUrl: "https://unavatar.io/x/ainergiz",
        }}
      />

      {/* Split layout */}
      <div className="flex flex-col md:flex-row min-h-screen pt-[57px]">
        {/* Light mode side */}
        <ViewTransition name="ai-evals-card-light-panel">
          <div className="flex-1 bg-[#f5f5f5] relative">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, #d4d4d4 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-57px)] p-6 md:p-12">
              <ViewTransition name="ai-evals-card-light">
                <div>
                  <AiEvalsCardLight />
                </div>
              </ViewTransition>
            </div>
          </div>
        </ViewTransition>

        {/* Dark mode side */}
        <ViewTransition name="ai-evals-card-dark-panel">
          <div className="flex-1 bg-zinc-950 relative">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, #3f3f46 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-57px)] p-6 md:p-12">
              <ViewTransition name="ai-evals-card-dark">
                <div>
                  <AiEvalsCardDark />
                </div>
              </ViewTransition>
            </div>
          </div>
        </ViewTransition>
      </div>
    </div>
  );
}
