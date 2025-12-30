"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowLeft, Code, ExternalLink, ChevronDown, Check } from "lucide-react";
import { designs } from "@/data/designs";

interface InspirationProps {
  handle: string;
  imageUrl: string;
}

interface PageHeaderProps {
  title: string;
  codePath: string;
  inspiration: InspirationProps;
}

function DesignDropdown({
  currentDesignId,
  onClose,
}: {
  currentDesignId: string;
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    // Use "click" not "mousedown" to allow stopPropagation on trigger
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute left-0 top-full mt-1 z-30 rounded-xl shadow-xl border bg-white/80 backdrop-blur-xl border-white/40 min-w-[240px] py-1 overflow-hidden"
    >
      {designs.map((design) => (
        <Link
          key={design.id}
          href={`/designs/${design.id}`}
          className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm transition-colors hover:bg-white/60 ${
            design.id === currentDesignId
              ? "text-zinc-900 bg-white/50"
              : "text-zinc-600"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <span className="text-xs font-mono text-zinc-400 w-5">
            {design.number}
          </span>
          <span className="flex-1 font-medium">{design.title}</span>
          {design.id === currentDesignId && (
            <Check className="w-4 h-4 text-zinc-500" strokeWidth={2} />
          )}
        </Link>
      ))}
    </div>
  );
}

export function PageHeader({ title, codePath, inspiration }: PageHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tabsVisible, setTabsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;
      const scrolledPastThreshold = currentScrollY > 50;

      if (scrollingDown && scrolledPastThreshold) {
        setTabsVisible(false);
      } else if (!scrollingDown) {
        setTabsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const currentDesignId = pathname.split("/").pop() || "";

  const codeUrl = `https://github.com/ainergiz/design-inspirations/blob/main/src/app/${codePath}`;
  const twitterUrl = `https://x.com/${inspiration.handle}`;

  return (
    <>
      {/* Top Header - Glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-20 border-b border-white/30 bg-white/60 backdrop-blur-xl shadow-sm shadow-black/5">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2 sm:py-3 flex items-center justify-between relative">
          {/* Back button - big hit slop */}
          <Link
            href="/"
            className="p-3 sm:p-2 text-zinc-400 hover:text-zinc-600 hover:bg-white/50 rounded-xl transition-colors z-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {/* Centered title with dropdown - big hit slop */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="flex items-center gap-1.5 px-4 py-3 sm:px-3 sm:py-2 rounded-xl hover:bg-white/50 transition-colors cursor-pointer"
              >
                <h1 className="text-base font-medium text-zinc-900">{title}</h1>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  strokeWidth={2}
                />
              </button>
              {dropdownOpen && (
                <DesignDropdown
                  currentDesignId={currentDesignId}
                  onClose={() => setDropdownOpen(false)}
                />
              )}
            </div>
          </div>

          {/* Desktop actions - hidden on mobile */}
          <div className="hidden md:flex items-center gap-4 z-10">
            <a
              href={codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700 hover:bg-white/50 rounded-lg transition-colors"
            >
              <Code className="w-4 h-4" />
              <span>Code</span>
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              <span className="text-zinc-400">Inspired:</span>
              <Image
                src={inspiration.imageUrl}
                alt={inspiration.handle}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full ring-2 ring-white/50"
              />
              <span className="font-medium text-zinc-700">@{inspiration.handle}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar - Glassmorphism */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-white/30 bg-white/70 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out ${
          tabsVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-stretch pb-[env(safe-area-inset-bottom)]">
          <a
            href={codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-zinc-500 hover:text-zinc-700 hover:bg-white/40 active:bg-white/60 transition-colors"
          >
            <Code className="w-5 h-5" />
            <span className="text-xs font-medium">Code</span>
          </a>
          <div className="w-px bg-zinc-200/50 my-2" />
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-zinc-500 hover:text-zinc-700 hover:bg-white/40 active:bg-white/60 transition-colors"
          >
            <Image
              src={inspiration.imageUrl}
              alt={inspiration.handle}
              width={20}
              height={20}
              className="w-5 h-5 rounded-full ring-1 ring-zinc-200"
            />
            <span className="text-xs">
              <span className="text-zinc-400">Inspired: </span>
              <span className="font-medium">@{inspiration.handle}</span>
            </span>
          </a>
        </div>
      </nav>
    </>
  );
}
