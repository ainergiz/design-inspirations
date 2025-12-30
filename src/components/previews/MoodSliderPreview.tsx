"use client";

import { useState, useEffect, ViewTransition } from "react";

// Constants
const CANVAS_SIZE = 160;
const CENTER = CANVAS_SIZE / 2;
const RADIUS = 40;
const EYE_OFFSET_X = 12;
const EYE_OFFSET_Y = 5;
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
    const irregularity = Math.max(0.08, (4 - morphFactor) * 0.12);
    const waves = 3 + Math.round(morphFactor);
    const r = radius * (1 + irregularity * Math.sin(theta * waves));
    const x = centerX + r * Math.cos(theta - Math.PI / 2);
    const y = centerY + r * Math.sin(theta - Math.PI / 2);
    pathData += (i === 0 ? "M " : "L ") + `${x} ${y} `;
  }
  pathData += "Z";
  return pathData;
}

function interpolate(
  value: number,
  inputRange: number[],
  outputRange: number[]
): number {
  const inputMin = inputRange[0];
  const inputMax = inputRange[inputRange.length - 1];
  const clampedValue = Math.max(inputMin, Math.min(inputMax, value));

  for (let i = 0; i < inputRange.length - 1; i++) {
    if (clampedValue >= inputRange[i] && clampedValue <= inputRange[i + 1]) {
      const t =
        (clampedValue - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
      return outputRange[i] + t * (outputRange[i + 1] - outputRange[i]);
    }
  }
  return outputRange[outputRange.length - 1];
}

interface MoodBlobProps {
  mood: number;
  dark?: boolean;
}

function MoodBlob({ mood, dark = false }: MoodBlobProps) {
  const [breatheScale, setBreatheScale] = useState(1);
  const [eyeScale, setEyeScale] = useState(1);

  const moodConfig = MOODS[mood];
  const blobPath = createMorphPath(mood, RADIUS, CENTER, CENTER);
  const mouthCurve = interpolate(mood, [0, 2, 4], [-8, 0, 10]);
  const cheekOpacity = interpolate(mood, [2, 4], [0, 0.6]);
  const mouthWidth = interpolate(mood, [0, 4], [10, 14]);
  const mouthPath = `M ${CENTER - mouthWidth} ${CENTER + 12} Q ${CENTER} ${
    CENTER + 12 + mouthCurve
  } ${CENTER + mouthWidth} ${CENTER + 12}`;

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
      const nextDelay = 2000 + Math.random() * 3000;
      timeout = setTimeout(blink, nextDelay);
    };

    timeout = setTimeout(blink, 2000 + Math.random() * 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl"
          style={{
            backgroundColor: moodConfig.color,
            transform: "scale(1.1)",
            opacity: 0.28,
          }}
        />

        <svg
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
          style={{
            transform: `scale(${breatheScale})`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <defs>
            <filter id={`blur12-${dark ? "dark" : "light"}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
            </filter>
            <filter id={`blur2-${dark ? "dark" : "light"}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
            </filter>
            <filter id={`blur8-${dark ? "dark" : "light"}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
            </filter>
          </defs>

          {/* Body */}
          <g>
            <path
              d={blobPath}
              fill={moodConfig.color}
              opacity={0.28}
              filter={`url(#blur12-${dark ? "dark" : "light"})`}
            />
            <path d={blobPath} fill={moodConfig.color} filter={`url(#blur2-${dark ? "dark" : "light"})`} />
            <path d={blobPath} fill={moodConfig.color} />
          </g>

          {/* Cheeks */}
          <g opacity={cheekOpacity}>
            <ellipse
              cx={LEFT_EYE_X - 1}
              cy={EYE_Y + 13}
              rx={8}
              ry={5}
              fill="#fca5a5"
              filter={`url(#blur8-${dark ? "dark" : "light"})`}
            />
            <ellipse
              cx={RIGHT_EYE_X + 1}
              cy={EYE_Y + 13}
              rx={8}
              ry={5}
              fill="#fca5a5"
              filter={`url(#blur8-${dark ? "dark" : "light"})`}
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
              <circle cx={LEFT_EYE_X} cy={EYE_Y} r={5} fill="white" />
              <circle cx={LEFT_EYE_X} cy={EYE_Y} r={2.5} fill="#333" />
            </g>

            {/* Right eye */}
            <g
              style={{
                transform: `scaleY(${eyeScale})`,
                transformOrigin: `${RIGHT_EYE_X}px ${EYE_Y}px`,
              }}
            >
              <circle cx={RIGHT_EYE_X} cy={EYE_Y} r={5} fill="white" />
              <circle cx={RIGHT_EYE_X} cy={EYE_Y} r={2.5} fill="#333" />
            </g>

            {/* Mouth */}
            <path
              d={mouthPath}
              stroke="#333"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        </svg>
      </div>

      {/* Label */}
      <span
        className={`text-xs font-medium mt-2 ${
          dark ? "text-zinc-300" : "text-zinc-600"
        }`}
      >
        {moodConfig.label}
      </span>

      {/* Dots */}
      <div className="flex gap-1.5 mt-3">
        {MOODS.map((m, idx) => (
          <div
            key={m.label}
            className="rounded-full transition-all duration-200"
            style={{
              backgroundColor: m.color,
              width: mood === idx ? 14 : 6,
              height: 6,
              opacity: mood === idx ? 1 : 0.4,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MoodSliderLight() {
  return (
    <div className="bg-[#f8f8f8] rounded-xl border border-zinc-200/80 shadow-lg shadow-zinc-200/50 p-6 w-52">
      <MoodBlob mood={3} dark={false} />
    </div>
  );
}

function MoodSliderDark() {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg shadow-black/50 w-52">
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
      {/* Bottom edge shadow */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-black/40" />
      {/* Content */}
      <div className="relative p-6">
        <MoodBlob mood={3} dark={true} />
      </div>
    </div>
  );
}

export function MoodSliderPreview() {
  return (
    <div className="flex gap-3">
      {/* Light mode panel */}
      <ViewTransition name="mood-slider-light-panel">
        <div className="flex-1 bg-[#f5f5f5] rounded-xl p-3 relative overflow-hidden inline-block">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, #d4d4d4 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative z-10">
            <ViewTransition name="mood-slider-light">
              <div className="inline-block">
                <MoodSliderLight />
              </div>
            </ViewTransition>
          </div>
        </div>
      </ViewTransition>

      {/* Dark mode panel */}
      <ViewTransition name="mood-slider-dark-panel">
        <div className="flex-1 bg-zinc-950 rounded-xl p-3 relative overflow-hidden inline-block">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, #3f3f46 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative z-10">
            <ViewTransition name="mood-slider-dark">
              <div className="inline-block">
                <MoodSliderDark />
              </div>
            </ViewTransition>
          </div>
        </div>
      </ViewTransition>
    </div>
  );
}
