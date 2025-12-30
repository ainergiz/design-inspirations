"use client";

import { useState, useEffect, useRef, useCallback, ViewTransition } from "react";
import { DM_Sans } from "next/font/google";
import { PageHeader } from "@/components/PageHeader";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  PanInfo,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion";
import { Check, ArrowUp } from "lucide-react";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Constants
const CANVAS_SIZE = 280;
const CENTER = CANVAS_SIZE / 2;
const RADIUS = 65;
const EYE_OFFSET_X = 18;
const EYE_OFFSET_Y = 8;
const LEFT_EYE_X = CENTER - EYE_OFFSET_X;
const RIGHT_EYE_X = CENTER + EYE_OFFSET_X;
const EYE_Y = CENTER - EYE_OFFSET_Y;

const MOODS = [
  { label: "Terrible", color: "#ef4444" },
  { label: "Bad", color: "#f97316" },
  { label: "Okay", color: "#eab308" },
  { label: "Good", color: "#22c55e" },
  { label: "Amazing", color: "#14b8a6" },
];

const MOOD_COLORS = MOODS.map((m) => m.color);

// Generate morphing blob SVG path
function createMorphPath(
  morphFactor: number,
  radius: number,
  centerX: number,
  centerY: number
): string {
  const points = 60;
  let pathData = "";
  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * 2 * Math.PI;
    // Irregularity increases for bad moods, decreases for good moods
    const irregularity = Math.max(0.08, (4 - morphFactor) * 0.12);
    // More waves (tentacles) for good moods
    const waves = 3 + Math.round(morphFactor);
    // Radius varies with sine wave to create tentacle effect
    const r = radius * (1 + irregularity * Math.sin(theta * waves));
    const x = centerX + r * Math.cos(theta - Math.PI / 2);
    const y = centerY + r * Math.sin(theta - Math.PI / 2);
    pathData += (i === 0 ? "M " : "L ") + `${x} ${y} `;
  }
  pathData += "Z";
  return pathData;
}

// Interpolate between values
function interpolate(
  value: number,
  inputRange: number[],
  outputRange: number[]
): number {
  const inputMin = inputRange[0];
  const inputMax = inputRange[inputRange.length - 1];
  const clampedValue = Math.max(inputMin, Math.min(inputMax, value));

  // Find which segment we're in
  for (let i = 0; i < inputRange.length - 1; i++) {
    if (clampedValue >= inputRange[i] && clampedValue <= inputRange[i + 1]) {
      const t =
        (clampedValue - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
      return outputRange[i] + t * (outputRange[i + 1] - outputRange[i]);
    }
  }
  return outputRange[outputRange.length - 1];
}

// Interpolate colors
function interpolateColor(value: number, colors: string[]): string {
  const idx = Math.min(Math.floor(value), colors.length - 2);
  const t = value - idx;

  const c1 = hexToRgb(colors[idx]);
  const c2 = hexToRgb(colors[idx + 1]);

  if (!c1 || !c2) return colors[Math.round(value)] || colors[0];

  const r = Math.round(c1.r + t * (c2.r - c1.r));
  const g = Math.round(c1.g + t * (c2.g - c1.g));
  const b = Math.round(c1.b + t * (c2.b - c1.b));

  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Small static blob for saved state
const SMALL_BLOB_SIZE = 56;
const SMALL_CENTER = SMALL_BLOB_SIZE / 2;
const SMALL_RADIUS = 22;

function SmallMoodBlob({ mood, dark, layoutId }: { mood: number; dark: boolean; layoutId?: string }) {
  const moodConfig = MOODS[mood];
  const blobPath = createMorphPath(mood, SMALL_RADIUS, SMALL_CENTER, SMALL_CENTER);
  const mouthCurve = interpolate(mood, [0, 2, 4], [-4, 0, 5]);
  const cheekOpacity = interpolate(mood, [2, 4], [0, 0.5]);
  const mouthWidth = interpolate(mood, [0, 4], [6, 8]);
  const mouthPath = `M ${SMALL_CENTER - mouthWidth} ${SMALL_CENTER + 6} Q ${SMALL_CENTER} ${
    SMALL_CENTER + 6 + mouthCurve
  } ${SMALL_CENTER + mouthWidth} ${SMALL_CENTER + 6}`;

  const content = (
    <>
      <div
        className="absolute inset-0 rounded-full blur-lg"
        style={{
          backgroundColor: moodConfig.color,
          transform: "scale(1.1)",
          opacity: 0.2,
        }}
      />
      <svg
        width={SMALL_BLOB_SIZE}
        height={SMALL_BLOB_SIZE}
        viewBox={`0 0 ${SMALL_BLOB_SIZE} ${SMALL_BLOB_SIZE}`}
      >
        <defs>
          <filter id={`small-blur-${dark ? "d" : "l"}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>
        <g>
          <path d={blobPath} fill={moodConfig.color} opacity={0.2} filter={`url(#small-blur-${dark ? "d" : "l"})`} />
          <path d={blobPath} fill={moodConfig.color} />
        </g>
        <g opacity={cheekOpacity}>
          <ellipse cx={SMALL_CENTER - 7} cy={SMALL_CENTER + 1} rx={4} ry={2.5} fill="#fca5a5" filter={`url(#small-blur-${dark ? "d" : "l"})`} />
          <ellipse cx={SMALL_CENTER + 7} cy={SMALL_CENTER + 1} rx={4} ry={2.5} fill="#fca5a5" filter={`url(#small-blur-${dark ? "d" : "l"})`} />
        </g>
        <g>
          <circle cx={SMALL_CENTER - 6} cy={SMALL_CENTER - 3} r={3} fill="white" />
          <circle cx={SMALL_CENTER - 6} cy={SMALL_CENTER - 3} r={1.5} fill="#333" />
          <circle cx={SMALL_CENTER + 6} cy={SMALL_CENTER - 3} r={3} fill="white" />
          <circle cx={SMALL_CENTER + 6} cy={SMALL_CENTER - 3} r={1.5} fill="#333" />
          <path d={mouthPath} stroke="#333" strokeWidth={1.5} strokeLinecap="round" fill="none" />
        </g>
      </svg>
    </>
  );

  if (layoutId) {
    return (
      <motion.div layoutId={layoutId} className="relative">
        {content}
      </motion.div>
    );
  }

  return <div className="relative">{content}</div>;
}

interface MoodSliderProps {
  dark?: boolean;
  onMoodChange?: (mood: number) => void;
  onSave?: (mood: number) => void;
  showSaveButton?: boolean;
  blobLayoutId?: string;
}

function MoodSlider({ dark = false, onMoodChange, onSave, showSaveButton = true, blobLayoutId }: MoodSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Core motion values
  const dragX = useMotionValue(0);
  const moodIndex = useMotionValue(2); // Start at "Okay"
  const smoothMood = useSpring(moodIndex, { stiffness: 300, damping: 30 });

  // Velocity for squeeze effect
  const dragVelocity = useVelocity(dragX);

  // Squeeze distortion based on drag velocity
  const squeezeX = useTransform(
    dragVelocity,
    [-1000, 0, 1000],
    [0.85, 1, 1.15]
  );
  const squeezeY = useTransform(
    dragVelocity,
    [-1000, 0, 1000],
    [1.15, 1, 0.85]
  );

  // Animation states
  const [breatheScale, setBreatheScale] = useState(1);
  const [eyeScale, setEyeScale] = useState(1);
  const [currentMood, setCurrentMood] = useState(2);
  const [blobPath, setBlobPath] = useState(
    createMorphPath(2, RADIUS, CENTER, CENTER)
  );
  const [blobColor, setBlobColor] = useState(MOOD_COLORS[2]);
  const [mouthCurve, setMouthCurve] = useState(0);
  const [cheekOpacity, setCheekOpacity] = useState(0);

  // Update states from smooth mood
  useEffect(() => {
    const unsubscribe = smoothMood.on("change", (value) => {
      const clamped = Math.max(0, Math.min(4, value));
      setBlobPath(createMorphPath(clamped, RADIUS, CENTER, CENTER));
      setBlobColor(interpolateColor(clamped, MOOD_COLORS));
      setMouthCurve(interpolate(clamped, [0, 2, 4], [-12, 0, 15]));
      setCheekOpacity(interpolate(clamped, [2, 4], [0, 0.6]));
      setCurrentMood(Math.round(clamped));
    });
    return unsubscribe;
  }, [smoothMood]);

  // Breathing animation
  useEffect(() => {
    let animationId: number;
    let startTime = Date.now();

    const breathe = () => {
      const elapsed = Date.now() - startTime;
      const progress = (Math.sin((elapsed / 2000) * Math.PI * 2) + 1) / 2;
      setBreatheScale(1 + progress * 0.015);
      animationId = requestAnimationFrame(breathe);
    };

    animationId = requestAnimationFrame(breathe);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Random blinking
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const blink = () => {
      setEyeScale(0.1);
      setTimeout(() => setEyeScale(1), 150);

      // Random delay 2-5 seconds
      const nextDelay = 2000 + Math.random() * 3000;
      timeout = setTimeout(blink, nextDelay);
    };

    timeout = setTimeout(blink, 2000);
    return () => clearTimeout(timeout);
  }, []);

  // Handle drag
  const handleDrag = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // Inverse: dragging right decreases mood (more negative = more happy on right)
      const newProgress = Math.max(
        0,
        Math.min(4, moodIndex.get() - info.delta.x / 60)
      );
      moodIndex.set(newProgress);
    },
    [moodIndex]
  );

  // Handle drag end - snap to nearest mood
  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const snapped = Math.round(moodIndex.get());
      moodIndex.set(snapped);
      onMoodChange?.(snapped + 1); // 1-5 scale
    },
    [moodIndex, onMoodChange]
  );

  // Click on dot to select mood
  const selectMood = useCallback(
    (index: number) => {
      moodIndex.set(index);
      onMoodChange?.(index + 1);
    },
    [moodIndex, onMoodChange]
  );

  // Mouth path
  const mouthWidth = interpolate(currentMood, [0, 4], [16, 20]);
  const mouthPath = `M ${CENTER - mouthWidth} ${CENTER + 18} Q ${CENTER} ${
    CENTER + 18 + mouthCurve
  } ${CENTER + mouthWidth} ${CENTER + 18}`;

  return (
    <div className="flex flex-col items-center">
      {/* Mood label */}
      <motion.div
        key={currentMood}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-lg font-semibold mb-6 ${
          dark ? "text-zinc-100" : "text-zinc-900"
        }`}
      >
        {MOODS[currentMood].label}
      </motion.div>

      {/* Blob container */}
      <motion.div
        ref={containerRef}
        className="relative"
        layoutId={blobLayoutId}
        layout
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-2xl transition-colors duration-300"
          style={{
            backgroundColor: blobColor,
            transform: "scale(1.15)",
            opacity: 0.28,
          }}
        />

        {/* Draggable blob */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className="relative cursor-grab active:cursor-grabbing touch-none"
          style={{
            scaleX: squeezeX,
            scaleY: squeezeY,
          }}
        >
          <svg
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
            style={{
              transform: `scale(${breatheScale})`,
              transition: "transform 0.1s ease-out",
            }}
          >
            {/* Blur filter for glow layers */}
            <defs>
              <filter id="blur12" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
              </filter>
              <filter id="blur2" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
              </filter>
              <filter id="blur8" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
              </filter>
            </defs>

            {/* Body - layered glow effect */}
            <g>
              <path
                d={blobPath}
                fill={blobColor}
                opacity={0.28}
                filter="url(#blur12)"
              />
              <path d={blobPath} fill={blobColor} filter="url(#blur2)" />
              <path d={blobPath} fill={blobColor} />
            </g>

            {/* Rosy cheeks (visible when happy) */}
            <g opacity={cheekOpacity}>
              <ellipse
                cx={LEFT_EYE_X - 2}
                cy={EYE_Y + 20}
                rx={12}
                ry={8}
                fill="#fca5a5"
                filter="url(#blur8)"
              />
              <ellipse
                cx={RIGHT_EYE_X + 2}
                cy={EYE_Y + 20}
                rx={12}
                ry={8}
                fill="#fca5a5"
                filter="url(#blur8)"
              />
            </g>

            {/* Face */}
            <g>
              {/* Left eye */}
              <g
                style={{
                  transform: `scaleY(${eyeScale})`,
                  transformOrigin: `${LEFT_EYE_X}px ${EYE_Y}px`,
                }}
              >
                <circle cx={LEFT_EYE_X} cy={EYE_Y} r={8} fill="white" />
                <circle cx={LEFT_EYE_X} cy={EYE_Y} r={4} fill="#333" />
              </g>

              {/* Right eye */}
              <g
                style={{
                  transform: `scaleY(${eyeScale})`,
                  transformOrigin: `${RIGHT_EYE_X}px ${EYE_Y}px`,
                }}
              >
                <circle cx={RIGHT_EYE_X} cy={EYE_Y} r={8} fill="white" />
                <circle cx={RIGHT_EYE_X} cy={EYE_Y} r={4} fill="#333" />
              </g>

              {/* Mouth */}
              <path
                d={mouthPath}
                stroke="#333"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
          </svg>
        </motion.div>
      </motion.div>

      {/* Pagination dots */}
      <div className="flex gap-2 mt-8">
        {MOODS.map((mood, idx) => {
          const isActive = currentMood === idx;
          return (
            <motion.button
              key={mood.label}
              onClick={() => selectMood(idx)}
              className="rounded-full cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: mood.color,
                height: 8,
              }}
              animate={{
                width: isActive ? 20 : 8,
                opacity: isActive ? 1 : 0.4,
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          );
        })}
      </div>

      {/* Drag hint */}
      <p
        className={`text-xs mt-4 ${dark ? "text-zinc-500" : "text-zinc-400"}`}
      >
        Drag left or right to change mood
      </p>

      {/* Save button */}
      {showSaveButton && (
        <motion.button
          onClick={async () => {
            if (isSaving) return;
            setIsSaving(true);
            await new Promise((r) => setTimeout(r, 400));
            onSave?.(currentMood);
            setIsSaving(false);
          }}
          disabled={isSaving}
          className={`mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            dark
              ? "bg-zinc-700 hover:bg-zinc-600 text-white"
              : "bg-zinc-900 hover:bg-zinc-800 text-white"
          } ${isSaving ? "opacity-70" : ""}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSaving ? (
            <motion.div
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
          )}
          {isSaving ? "Saving..." : "Save"}
        </motion.button>
      )}
    </div>
  );
}

function MoodSliderLight() {
  const [savedMood, setSavedMood] = useState<number | null>(null);

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        {savedMood !== null ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={() => setSavedMood(null)}
            className="bg-[#f8f8f8] rounded-2xl border border-zinc-200/80 shadow-lg shadow-zinc-200/50 overflow-hidden cursor-pointer hover:bg-[#f4f4f4] transition-colors min-w-[320px]"
          >
            <motion.div
              className="p-5 flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {/* Left side - checkmark and text */}
              <motion.div
                className="flex-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <motion.div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${MOODS[savedMood].color}20` }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <Check className="w-3.5 h-3.5" style={{ color: MOODS[savedMood].color }} strokeWidth={3} />
                  </motion.div>
                  <span className="text-sm font-semibold text-zinc-900">Mood Saved</span>
                </div>
                <p className="text-sm text-zinc-500">
                  Feeling <span style={{ color: MOODS[savedMood].color }} className="font-medium">{MOODS[savedMood].label.toLowerCase()}</span> today
                </p>
              </motion.div>

              {/* Right side - small blob with shared layout */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
              >
                <SmallMoodBlob mood={savedMood} dark={false} layoutId="blob-light" />
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="slider"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="bg-[#f8f8f8] rounded-2xl border border-zinc-200/80 shadow-lg shadow-zinc-200/50 p-8"
          >
            <MoodSlider dark={false} onSave={(mood) => setSavedMood(mood)} blobLayoutId="blob-light" />
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

// Brushed metal container component
function BrushedMetalCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-xl shadow-black/50 ${className}`}>
      {/* Brushed metal base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            #52525b 0%,
            #3f3f46 15%,
            #27272a 50%,
            #3f3f46 85%,
            #52525b 100%
          )`,
        }}
      />
      {/* Brushed metal horizontal lines texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            rgba(255,255,255,0.5) 1px,
            rgba(255,255,255,0.5) 2px
          )`,
        }}
      />
      {/* Top edge highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-400/40 to-transparent" />
      {/* Left edge highlight */}
      <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-zinc-400/30 via-transparent to-transparent" />
      {/* Bottom edge shadow */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-black/40" />
      {/* Right edge shadow */}
      <div className="absolute inset-y-0 right-0 w-[1px] bg-black/30" />
      {/* Inner border for depth */}
      <div className="absolute inset-[1px] rounded-[15px] border border-zinc-600/20 pointer-events-none" />
      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

function MoodSliderDark() {
  const [savedMood, setSavedMood] = useState<number | null>(null);

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        {savedMood !== null ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={() => setSavedMood(null)}
            className="cursor-pointer min-w-[320px]"
          >
            <BrushedMetalCard className="hover:brightness-110 transition-all">
              <motion.div
                className="p-5 flex items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {/* Left side - checkmark and text */}
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <motion.div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${MOODS[savedMood].color}30` }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <Check className="w-3.5 h-3.5" style={{ color: MOODS[savedMood].color }} strokeWidth={3} />
                    </motion.div>
                    <span className="text-sm font-semibold text-zinc-100">Mood Saved</span>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Feeling <span style={{ color: MOODS[savedMood].color }} className="font-medium">{MOODS[savedMood].label.toLowerCase()}</span> today
                  </p>
                </motion.div>

                {/* Right side - small blob with shared layout */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
                >
                  <SmallMoodBlob mood={savedMood} dark={true} layoutId="blob-dark" />
                </motion.div>
              </motion.div>
            </BrushedMetalCard>
          </motion.div>
        ) : (
          <motion.div
            key="slider"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <BrushedMetalCard>
              <div className="p-8">
                <MoodSlider dark={true} onSave={(mood) => setSavedMood(mood)} blobLayoutId="blob-dark" />
              </div>
            </BrushedMetalCard>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

export default function MoodSliderPage() {
  return (
    <div className={`min-h-screen ${dmSans.className}`}>
      <PageHeader
        title="Mood Slider"
        codePath="designs/mood-slider/page.tsx"
        inspiration={{
          handle: "aihsannergiz",
          imageUrl:
            "https://pbs.twimg.com/profile_images/1842723972229582848/2DZACP9T_400x400.jpg",
        }}
      />

      {/* Split layout */}
      <div className="flex flex-col md:flex-row min-h-screen pt-[57px]">
        {/* Light mode side */}
        <ViewTransition name="mood-slider-light-panel">
          <div className="flex-1 bg-[#f5f5f5] relative">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, #d4d4d4 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-57px)] p-6 md:p-12">
              <ViewTransition name="mood-slider-light">
                <MoodSliderLight />
              </ViewTransition>
            </div>
          </div>
        </ViewTransition>

        {/* Dark mode side */}
        <ViewTransition name="mood-slider-dark-panel">
          <div className="flex-1 bg-zinc-950 relative">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, #3f3f46 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-57px)] p-6 md:p-12">
              <ViewTransition name="mood-slider-dark">
                <MoodSliderDark />
              </ViewTransition>
            </div>
          </div>
        </ViewTransition>
      </div>
    </div>
  );
}
