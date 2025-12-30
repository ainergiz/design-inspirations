"use client";

import { useState, ViewTransition } from "react";
import Image from "next/image";
import { DM_Sans } from "next/font/google";
import {
  Globe,
  Sparkles,
  Flame,
  MapPin,
  Tags,
  Users,
  BarChart3,
  TrendingUp,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

function TrendLine({ dark = false }: { dark?: boolean }) {
  return (
    <svg className="w-20 h-6" viewBox="0 0 80 24" fill="none">
      <path
        d="M2 18 L15 16 L25 17 L40 14 L55 12 L65 8 L78 6"
        stroke={dark ? "#4ade80" : "#22c55e"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// Light mode card
function CompanyCardLight() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className={`bg-[#f8f8f8] rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden transition-all duration-300 ${
        expanded ? "shadow-lg shadow-zinc-200/50" : "hover:shadow-md"
      }`}
    >
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-zinc-100/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
            <Image
              src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/claude-ai-icon.svg"
              alt="Claude"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </div>
          <span className="font-medium text-zinc-900">Claude</span>
        </div>
        <div className="flex items-center gap-3">
          <TrendLine />
          <ChevronDown
            className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="bg-white rounded-t-2xl border-t border-zinc-300 px-5 py-5 space-y-3">
            <InfoRowLight
              icon={<Globe className="w-4 h-4" strokeWidth={1.5} />}
              label="Website"
              value={
                <a
                  href="http://claude.ai"
                  className="text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                  http://claude.ai
                </a>
              }
            />
            <InfoRowLight
              icon={<Sparkles className="w-4 h-4" strokeWidth={1.5} />}
              label="Monthly visits"
              value={<span className="text-zinc-900">216M</span>}
            />
            <InfoRowLight
              icon={<Flame className="w-4 h-4" strokeWidth={1.5} />}
              label="Heat Score"
              value={
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-sm font-medium rounded-md">
                  98
                  <TrendingUp className="w-3 h-3" strokeWidth={2} />
                </span>
              }
            />
            <InfoRowLight
              icon={<MapPin className="w-4 h-4" strokeWidth={1.5} />}
              label="Location"
              value={<span className="text-zinc-900">California, USA</span>}
            />
            <InfoRowLight
              icon={<Tags className="w-4 h-4" strokeWidth={1.5} />}
              label="Categories"
              value={
                <div className="flex gap-1.5">
                  {["AI", "SaaS", "B2B"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-xs font-medium rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              }
            />
            <InfoRowLight
              icon={<Users className="w-4 h-4" strokeWidth={1.5} />}
              label="Employees"
              value={<span className="text-zinc-900">1001-5000</span>}
            />
            <InfoRowLight
              icon={<BarChart3 className="w-4 h-4" strokeWidth={1.5} />}
              label="Estimated ARR"
              value={
                <span className="px-2 py-0.5 bg-green-50 text-green-700 text-sm font-medium rounded-md">
                  $3-4B
                </span>
              }
            />
            <InfoRowLight
              icon={<TrendingUp className="w-4 h-4" strokeWidth={1.5} />}
              label="Founders"
              value={
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-zinc-200">
                      <Image
                        src="https://assets.stickpng.com/images/68446faef46e60b40c392760.png"
                        alt="Dario Amodei"
                        width={20}
                        height={20}
                        className="w-5 h-5 object-cover"
                      />
                    </div>
                    <span className="text-zinc-900 text-sm">Dario Amodei</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-500 text-xs font-medium rounded">
                    +5
                  </span>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Dark mode card
function CompanyCardDark() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className={`bg-zinc-800 rounded-2xl border border-zinc-700/80 shadow-sm overflow-hidden transition-all duration-300 ${
        expanded ? "shadow-lg shadow-black/30" : "hover:shadow-md"
      }`}
    >
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-zinc-700/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
            <Image
              src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/claude-ai-icon.svg"
              alt="Claude"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </div>
          <span className="font-medium text-zinc-100">Claude</span>
        </div>
        <div className="flex items-center gap-3">
          <TrendLine dark />
          <ChevronDown
            className={`w-5 h-5 text-zinc-500 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="bg-zinc-900 rounded-t-2xl border-t border-zinc-700 px-5 py-5 space-y-3">
            <InfoRowDark
              icon={<Globe className="w-4 h-4" strokeWidth={1.5} />}
              label="Website"
              value={
                <a
                  href="http://claude.ai"
                  className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                  http://claude.ai
                </a>
              }
            />
            <InfoRowDark
              icon={<Sparkles className="w-4 h-4" strokeWidth={1.5} />}
              label="Monthly visits"
              value={<span className="text-zinc-100">216M</span>}
            />
            <InfoRowDark
              icon={<Flame className="w-4 h-4" strokeWidth={1.5} />}
              label="Heat Score"
              value={
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-900/50 text-green-400 text-sm font-medium rounded-md">
                  98
                  <TrendingUp className="w-3 h-3" strokeWidth={2} />
                </span>
              }
            />
            <InfoRowDark
              icon={<MapPin className="w-4 h-4" strokeWidth={1.5} />}
              label="Location"
              value={<span className="text-zinc-100">California, USA</span>}
            />
            <InfoRowDark
              icon={<Tags className="w-4 h-4" strokeWidth={1.5} />}
              label="Categories"
              value={
                <div className="flex gap-1.5">
                  {["AI", "SaaS", "B2B"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs font-medium rounded-md border border-zinc-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              }
            />
            <InfoRowDark
              icon={<Users className="w-4 h-4" strokeWidth={1.5} />}
              label="Employees"
              value={<span className="text-zinc-100">1001-5000</span>}
            />
            <InfoRowDark
              icon={<BarChart3 className="w-4 h-4" strokeWidth={1.5} />}
              label="Estimated ARR"
              value={
                <span className="px-2 py-0.5 bg-green-900/50 text-green-400 text-sm font-medium rounded-md">
                  $3-4B
                </span>
              }
            />
            <InfoRowDark
              icon={<TrendingUp className="w-4 h-4" strokeWidth={1.5} />}
              label="Founders"
              value={
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-zinc-700">
                      <Image
                        src="https://assets.stickpng.com/images/68446faef46e60b40c392760.png"
                        alt="Dario Amodei"
                        width={20}
                        height={20}
                        className="w-5 h-5 object-cover"
                      />
                    </div>
                    <span className="text-zinc-100 text-sm">Dario Amodei</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-zinc-800 text-zinc-400 text-xs font-medium rounded border border-zinc-700">
                    +5
                  </span>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRowLight({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="text-zinc-400">{icon}</span>
      <span className="text-zinc-500 text-sm w-32">{label}</span>
      <div className="flex-1">{value}</div>
    </div>
  );
}

function InfoRowDark({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="text-zinc-500">{icon}</span>
      <span className="text-zinc-500 text-sm w-32">{label}</span>
      <div className="flex-1">{value}</div>
    </div>
  );
}

export default function CompanyCardPage() {
  return (
    <div className={`min-h-screen ${dmSans.className}`}>
      <PageHeader
        title="Company Info Card"
        codePath="designs/company-card/page.tsx"
        inspiration={{
          handle: "disarto_max",
          imageUrl: "https://pbs.twimg.com/profile_images/1897392722601816064/BMTvrGgC_400x400.jpg",
        }}
      />

      {/* Split layout */}
      <div className="flex flex-col md:flex-row min-h-screen pt-[57px]">
        {/* Light mode side */}
        <ViewTransition name="company-card-light-panel">
          <div className="flex-1 bg-[#f5f5f5] relative">
            {/* Light dot grid */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, #d4d4d4 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-57px)] p-6 md:p-12">
              <ViewTransition name="company-card-light">
                <div className="w-full max-w-md">
                  <CompanyCardLight />
                </div>
              </ViewTransition>
            </div>
          </div>
        </ViewTransition>

        {/* Dark mode side */}
        <ViewTransition name="company-card-dark-panel">
          <div className="flex-1 bg-zinc-950 relative">
            {/* Dark dot grid */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, #3f3f46 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-57px)] p-6 md:p-12">
              <ViewTransition name="company-card-dark">
                <div className="w-full max-w-md">
                  <CompanyCardDark />
                </div>
              </ViewTransition>
            </div>
          </div>
        </ViewTransition>
      </div>
    </div>
  );
}
