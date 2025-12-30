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
      className="absolute left-0 top-full mt-1 z-30 rounded-lg shadow-lg border bg-white border-zinc-200 min-w-[240px] py-1 overflow-hidden"
    >
      {designs.map((design) => (
        <Link
          key={design.id}
          href={`/designs/${design.id}`}
          className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm transition-colors hover:bg-zinc-50 ${
            design.id === currentDesignId
              ? "text-zinc-900 bg-zinc-50"
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
  const pathname = usePathname();
  const currentDesignId = pathname.split("/").pop() || "";

  const codeUrl = `https://github.com/ainergiz/design-inspirations/blob/main/src/app/${codePath}`;
  const twitterUrl = `https://x.com/${inspiration.handle}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="p-2 -m-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
              className="flex items-center gap-1.5 px-2 py-1.5 -mx-2 -my-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
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
        <div className="flex items-center gap-4">
          <a
            href={codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">Code</span>
          </a>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            <span className="hidden sm:inline text-zinc-400">Inspired from</span>
            <Image
              src={inspiration.imageUrl}
              alt={inspiration.handle}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full"
            />
            <span className="font-medium text-zinc-700">@{inspiration.handle}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
