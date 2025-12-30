"use client";

import { useState, useRef, useEffect, ViewTransition } from "react";
import Link from "next/link";
import { DM_Sans } from "next/font/google";
import { ArrowLeft, Bell, Code, Clock, MoreVertical, Pause, X } from "lucide-react";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

interface SubscriptionRowProps {
  index: number;
  month: string;
  day: string;
  name: string;
  logo: string;
  category: string;
  date: string;
  frequency: string;
  price: string;
  expanded?: boolean;
  onToggle?: () => void;
  dark?: boolean;
  isLast?: boolean;
  menuOpen?: boolean;
  onMenuToggle?: () => void;
  onMenuClose?: () => void;
}

function DateBadge({
  month,
  day,
  dark = false,
}: {
  month: string;
  day: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl ${
        dark ? "bg-zinc-800" : "bg-zinc-100"
      }`}
    >
      <span className="text-xs font-medium text-orange-500 uppercase leading-none">
        {month}
      </span>
      <span
        className={`text-base font-semibold leading-none mt-0.5 ${
          dark ? "text-zinc-100" : "text-zinc-900"
        }`}
      >
        {day}
      </span>
    </div>
  );
}

function CategoryBadge({
  category,
  dark = false,
}: {
  category: string;
  dark?: boolean;
}) {
  const colors: Record<string, { bg: string; text: string }> = {
    Entertainment: {
      bg: dark ? "bg-rose-900/40" : "bg-rose-50",
      text: dark ? "text-rose-400" : "text-rose-700",
    },
    Design: {
      bg: dark ? "bg-violet-900/40" : "bg-violet-50",
      text: dark ? "text-violet-400" : "text-violet-700",
    },
    Productivity: {
      bg: dark ? "bg-blue-900/40" : "bg-blue-50",
      text: dark ? "text-blue-400" : "text-blue-700",
    },
    Developer: {
      bg: dark ? "bg-zinc-700" : "bg-zinc-100",
      text: dark ? "text-zinc-300" : "text-zinc-700",
    },
    Storage: {
      bg: dark ? "bg-sky-900/40" : "bg-sky-50",
      text: dark ? "text-sky-400" : "text-sky-700",
    },
  };

  const style = colors[category] || colors.Productivity;

  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded ${style.bg} ${style.text}`}
    >
      {category}
    </span>
  );
}

function DropdownMenu({
  dark = false,
  onClose,
}: {
  dark?: boolean;
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className={`absolute right-0 top-full mt-1 z-20 rounded-lg shadow-lg border overflow-hidden ${
        dark ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200"
      }`}
    >
      <button
        className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-medium transition-colors ${
          dark
            ? "text-zinc-300 hover:bg-zinc-700"
            : "text-zinc-700 hover:bg-zinc-50"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <Pause className="w-3.5 h-3.5" strokeWidth={1.5} />
        Pause
      </button>
      <button
        className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-medium transition-colors ${
          dark ? "text-red-400 hover:bg-zinc-700" : "text-red-600 hover:bg-red-50"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X className="w-3.5 h-3.5" strokeWidth={1.5} />
        Cancel
      </button>
    </div>
  );
}

function SubscriptionCardLight({
  month,
  day,
  name,
  logo,
  category,
  date,
  frequency,
  price,
  expanded = false,
  onToggle,
  menuOpen = false,
  onMenuToggle,
  onMenuClose,
}: SubscriptionRowProps) {
  const [reminderActive, setReminderActive] = useState(false);

  return (
    <div
      className="rounded-xl border border-zinc-200/80 cursor-pointer overflow-hidden"
      onClick={onToggle}
    >
      <div className="bg-white p-4 flex items-center gap-4 rounded-b-xl relative z-10">
        <DateBadge month={month} day={day} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <img src={logo} alt={name} className="w-4 h-4" />
            <h3 className="text-base font-semibold text-zinc-900 truncate">
              {name}
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <CategoryBadge category={category} />
            <div className="flex items-center gap-1 text-zinc-400">
              <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="text-xs">{date}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-zinc-400 capitalize">{frequency}</span>
          <p className="text-base font-semibold text-zinc-900">{price}</p>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuToggle?.();
            }}
            className="p-1.5 -m-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <MoreVertical
              className="w-5 h-5 text-zinc-400 flex-shrink-0"
              strokeWidth={1.5}
            />
          </button>
          {menuOpen && onMenuClose && <DropdownMenu onClose={onMenuClose} />}
        </div>
      </div>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{
          gridTemplateRows: expanded ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <div className="bg-zinc-100 px-4 pt-6 pb-3 -mt-3 flex items-center justify-between">
            <span className="text-sm text-zinc-500">Next payment in 2 days</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setReminderActive(!reminderActive);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                reminderActive
                  ? "text-orange-600 bg-orange-50 border-orange-200"
                  : "text-zinc-700 bg-white border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              {reminderActive && <Bell className="w-3.5 h-3.5" strokeWidth={1.5} />}
              {reminderActive ? "Reminder active" : "Set reminder"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubscriptionCardDark({
  month,
  day,
  name,
  logo,
  category,
  date,
  frequency,
  price,
  expanded = false,
  onToggle,
  menuOpen = false,
  onMenuToggle,
  onMenuClose,
}: SubscriptionRowProps) {
  const [reminderActive, setReminderActive] = useState(false);

  return (
    <div
      className="rounded-xl border border-zinc-700/80 cursor-pointer overflow-hidden"
      onClick={onToggle}
    >
      <div className="bg-zinc-800 p-4 flex items-center gap-4 rounded-b-xl relative z-10">
        <DateBadge month={month} day={day} dark />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <img src={logo} alt={name} className="w-4 h-4" />
            <h3 className="text-base font-semibold text-zinc-100 truncate">
              {name}
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <CategoryBadge category={category} dark />
            <div className="flex items-center gap-1 text-zinc-500">
              <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="text-xs">{date}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-zinc-500 capitalize">{frequency}</span>
          <p className="text-base font-semibold text-zinc-100">{price}</p>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuToggle?.();
            }}
            className="p-1.5 -m-1.5 rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <MoreVertical
              className="w-5 h-5 text-zinc-500 flex-shrink-0"
              strokeWidth={1.5}
            />
          </button>
          {menuOpen && onMenuClose && (
            <DropdownMenu dark onClose={onMenuClose} />
          )}
        </div>
      </div>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{
          gridTemplateRows: expanded ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <div className="bg-zinc-900 px-4 pt-6 pb-3 -mt-3 flex items-center justify-between">
            <span className="text-sm text-zinc-400">Next payment in 2 days</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setReminderActive(!reminderActive);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                reminderActive
                  ? "text-orange-400 bg-orange-900/30 border-orange-800"
                  : "text-zinc-300 bg-zinc-800 border-zinc-600 hover:bg-zinc-700"
              }`}
            >
              {reminderActive && <Bell className="w-3.5 h-3.5" strokeWidth={1.5} />}
              {reminderActive ? "Reminder active" : "Set reminder"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const subscriptions = [
  {
    month: "DEC",
    day: "16",
    name: "Netflix",
    logo: "/logos/netflix.svg",
    category: "Entertainment",
    date: "Dec 16, 2025",
    frequency: "Monthly",
    price: "$15.99",
  },
  {
    month: "DEC",
    day: "24",
    name: "Notion",
    logo: "/logos/notion.svg",
    category: "Productivity",
    date: "Dec 24, 2025",
    frequency: "Monthly",
    price: "$10.00",
  },
  {
    month: "DEC",
    day: "28",
    name: "Figma",
    logo: "/logos/figma.svg",
    category: "Design",
    date: "Dec 28, 2025",
    frequency: "yearly",
    price: "$144.00",
  },
  {
    month: "JAN",
    day: "02",
    name: "GitHub",
    logo: "/logos/github.svg",
    category: "Developer",
    date: "Jan 2, 2026",
    frequency: "Monthly",
    price: "$4.00",
  },
];

function BillsPaymentsLight() {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visibleSubscriptions = showAll ? subscriptions : subscriptions.slice(0, 3);

  return (
    <div className="bg-[#f8f8f8] rounded-2xl border border-zinc-200/80 shadow-lg shadow-zinc-200/50 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            Bills & Payments
          </h2>
          <p className="text-sm text-zinc-400 mt-0.5">{showAll ? "All subscriptions" : "Dec 2025"}</p>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-3 py-1.5 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg shadow-sm hover:bg-zinc-50 transition-colors cursor-pointer"
        >
          {showAll ? "Show less" : "View all"}
        </button>
      </div>

      {/* Inner white card */}
      <div className="bg-white rounded-t-xl border-t border-zinc-300 px-4 py-4">
        <div className="flex flex-col gap-3">
          {visibleSubscriptions.map((sub, index) => (
            <SubscriptionCardLight
              key={index}
              index={index}
              {...sub}
              expanded={expandedIndex === index}
              onToggle={() =>
                setExpandedIndex(expandedIndex === index ? -1 : index)
              }
              menuOpen={openMenu === index}
              onMenuToggle={() =>
                setOpenMenu(openMenu === index ? null : index)
              }
              onMenuClose={() => setOpenMenu(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BillsPaymentsDark() {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visibleSubscriptions = showAll ? subscriptions : subscriptions.slice(0, 3);

  return (
    <div className="bg-zinc-800 rounded-2xl border border-zinc-700/80 shadow-lg shadow-black/30 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">
            Bills & Payments
          </h2>
          <p className="text-sm text-zinc-500 mt-0.5">{showAll ? "All subscriptions" : "Dec 2025"}</p>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-3 py-1.5 text-sm font-medium text-zinc-400 bg-zinc-700 border border-zinc-600 rounded-lg shadow-md shadow-black/30 hover:bg-zinc-600 transition-colors cursor-pointer"
        >
          {showAll ? "Show less" : "View all"}
        </button>
      </div>

      {/* Inner dark card */}
      <div className="bg-zinc-900 rounded-t-xl border-t border-zinc-700 px-4 py-4">
        <div className="flex flex-col gap-3">
          {visibleSubscriptions.map((sub, index) => (
            <SubscriptionCardDark
              key={index}
              index={index}
              {...sub}
              expanded={expandedIndex === index}
              onToggle={() =>
                setExpandedIndex(expandedIndex === index ? -1 : index)
              }
              menuOpen={openMenu === index}
              onMenuToggle={() =>
                setOpenMenu(openMenu === index ? null : index)
              }
              onMenuClose={() => setOpenMenu(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BillsPaymentsPage() {
  return (
    <div className={`min-h-screen ${dmSans.className}`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-base font-medium text-zinc-900">
              Bills & Payments
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ainergiz/design-inspirations/blob/main/src/app/designs/bills-payments/page.tsx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">Code</span>
            </a>
          </div>
        </div>
      </header>

      {/* Split layout */}
      <div className="flex flex-col md:flex-row min-h-screen pt-[57px]">
        {/* Light mode side */}
        <ViewTransition name="bills-payments-light-panel">
          <div className="flex-1 bg-[#f5f5f5] relative">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, #d4d4d4 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-57px)] p-6 md:p-12">
              <ViewTransition name="bills-payments-light">
                <div className="w-full max-w-md">
                  <BillsPaymentsLight />
                </div>
              </ViewTransition>
            </div>
          </div>
        </ViewTransition>

        {/* Dark mode side */}
        <ViewTransition name="bills-payments-dark-panel">
          <div className="flex-1 bg-zinc-950 relative">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, #3f3f46 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-57px)] p-6 md:p-12">
              <ViewTransition name="bills-payments-dark">
                <div className="w-full max-w-md">
                  <BillsPaymentsDark />
                </div>
              </ViewTransition>
            </div>
          </div>
        </ViewTransition>
      </div>
    </div>
  );
}
