"use client";

import { useState, useRef, useEffect, ViewTransition } from "react";
import { Bell, Clock, MoreVertical, Pause, X } from "lucide-react";

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
      className={`flex flex-col items-center justify-center w-10 h-10 rounded-xl ${
        dark ? "bg-zinc-800" : "bg-zinc-100"
      }`}
    >
      <span className="text-[10px] font-medium text-orange-500 uppercase leading-none">
        {month}
      </span>
      <span
        className={`text-sm font-semibold leading-none mt-0.5 ${
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
      className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${style.bg} ${style.text}`}
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
        dark
          ? "bg-zinc-800 border-zinc-700"
          : "bg-white border-zinc-200"
      }`}
    >
      <button
        className={`flex items-center gap-2 w-full px-3 py-2 text-[11px] font-medium transition-colors ${
          dark
            ? "text-zinc-300 hover:bg-zinc-700"
            : "text-zinc-700 hover:bg-zinc-50"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <Pause className="w-3 h-3" strokeWidth={1.5} />
        Pause
      </button>
      <button
        className={`flex items-center gap-2 w-full px-3 py-2 text-[11px] font-medium transition-colors ${
          dark
            ? "text-red-400 hover:bg-zinc-700"
            : "text-red-600 hover:bg-red-50"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X className="w-3 h-3" strokeWidth={1.5} />
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
  menuOpen = false,
  onMenuToggle,
  onMenuClose,
}: SubscriptionRowProps) {
  const [reminderActive, setReminderActive] = useState(false);

  return (
    <div className="rounded-lg border border-zinc-200/80 overflow-hidden">
      <div className="bg-white p-2.5 flex items-center gap-3 rounded-b-lg relative z-10">
        <DateBadge month={month} day={day} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <img src={logo} alt={name} className="w-3.5 h-3.5" />
            <h3 className="text-sm font-semibold text-zinc-900 truncate">
              {name}
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <CategoryBadge category={category} />
            <div className="flex items-center gap-1 text-zinc-400">
              <Clock className="w-3 h-3" strokeWidth={1.5} />
              <span className="text-[10px]">{date}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-zinc-400 capitalize">
            {frequency}
          </span>
          <p className="text-sm font-semibold text-zinc-900">{price}</p>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuToggle?.();
            }}
            className="p-1 -m-1 rounded-md hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <MoreVertical
              className="w-4 h-4 text-zinc-400 flex-shrink-0"
              strokeWidth={1.5}
            />
          </button>
          {menuOpen && onMenuClose && <DropdownMenu onClose={onMenuClose} />}
        </div>
      </div>
      {expanded && (
        <div className="bg-zinc-100 px-2.5 pt-4 pb-2 -mt-2 flex items-center justify-between">
          <span className="text-xs text-zinc-500">Next payment in 2 days</span>
          <button
            onClick={() => setReminderActive(!reminderActive)}
            className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium rounded-md border transition-colors cursor-pointer ${
              reminderActive
                ? "text-orange-600 bg-orange-50 border-orange-200"
                : "text-zinc-700 bg-white border-zinc-300 hover:bg-zinc-50"
            }`}
          >
            {reminderActive && <Bell className="w-3 h-3" strokeWidth={1.5} />}
            {reminderActive ? "Reminder active" : "Set reminder"}
          </button>
        </div>
      )}
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
  menuOpen = false,
  onMenuToggle,
  onMenuClose,
}: SubscriptionRowProps) {
  const [reminderActive, setReminderActive] = useState(false);

  return (
    <div className="rounded-lg border border-zinc-700/80 overflow-hidden">
      <div className="bg-zinc-800 p-2.5 flex items-center gap-3 rounded-b-lg relative z-10">
        <DateBadge month={month} day={day} dark />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <img src={logo} alt={name} className="w-3.5 h-3.5" />
            <h3 className="text-sm font-semibold text-zinc-100 truncate">
              {name}
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <CategoryBadge category={category} dark />
            <div className="flex items-center gap-1 text-zinc-500">
              <Clock className="w-3 h-3" strokeWidth={1.5} />
              <span className="text-[10px]">{date}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-zinc-500 capitalize">
            {frequency}
          </span>
          <p className="text-sm font-semibold text-zinc-100">{price}</p>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuToggle?.();
            }}
            className="p-1 -m-1 rounded-md hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <MoreVertical
              className="w-4 h-4 text-zinc-500 flex-shrink-0"
              strokeWidth={1.5}
            />
          </button>
          {menuOpen && onMenuClose && (
            <DropdownMenu dark onClose={onMenuClose} />
          )}
        </div>
      </div>
      {expanded && (
        <div className="bg-zinc-900 px-2.5 pt-4 pb-2 -mt-2 flex items-center justify-between">
          <span className="text-xs text-zinc-400">Next payment in 2 days</span>
          <button
            onClick={() => setReminderActive(!reminderActive)}
            className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium rounded-md border transition-colors cursor-pointer ${
              reminderActive
                ? "text-orange-400 bg-orange-900/30 border-orange-800"
                : "text-zinc-300 bg-zinc-800 border-zinc-600 hover:bg-zinc-700"
            }`}
          >
            {reminderActive && <Bell className="w-3 h-3" strokeWidth={1.5} />}
            {reminderActive ? "Reminder active" : "Set reminder"}
          </button>
        </div>
      )}
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
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visibleSubscriptions = showAll ? subscriptions : subscriptions.slice(0, 3);

  return (
    <div className="bg-[#f8f8f8] rounded-xl border border-zinc-200/80 shadow-lg shadow-zinc-200/50 overflow-hidden w-80">
      {/* Header */}
      <div className="px-3 py-2 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">
            Bills & Payments
          </h2>
          <p className="text-[10px] text-zinc-400 mt-0.5">{showAll ? "All subscriptions" : "Dec 2025"}</p>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-2 py-0.5 text-[10px] font-medium text-zinc-600 bg-white border border-zinc-200 rounded-md shadow-sm hover:bg-zinc-50 transition-colors cursor-pointer"
        >
          {showAll ? "Show less" : "View all"}
        </button>
      </div>

      {/* Inner white card */}
      <div className="bg-white rounded-t-xl border-t border-zinc-300 px-3 py-3">
        <div className="flex flex-col gap-2">
          {visibleSubscriptions.map((sub, index) => (
            <SubscriptionCardLight
              key={index}
              index={index}
              {...sub}
              expanded={index === 0 && !showAll}
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
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visibleSubscriptions = showAll ? subscriptions : subscriptions.slice(0, 3);

  return (
    <div className="bg-zinc-800 rounded-xl border border-zinc-700/80 shadow-lg shadow-black/30 overflow-hidden w-80">
      {/* Header */}
      <div className="px-3 py-2 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">
            Bills & Payments
          </h2>
          <p className="text-[10px] text-zinc-500 mt-0.5">{showAll ? "All subscriptions" : "Dec 2025"}</p>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-2 py-0.5 text-[10px] font-medium text-zinc-400 bg-zinc-700 border border-zinc-600 rounded-md shadow-md shadow-black/30 hover:bg-zinc-600 transition-colors cursor-pointer"
        >
          {showAll ? "Show less" : "View all"}
        </button>
      </div>

      {/* Inner dark card */}
      <div className="bg-zinc-900 rounded-t-xl border-t border-zinc-700 px-3 py-3">
        <div className="flex flex-col gap-2">
          {visibleSubscriptions.map((sub, index) => (
            <SubscriptionCardDark
              key={index}
              index={index}
              {...sub}
              expanded={index === 0 && !showAll}
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

export function BillsPaymentsPreview() {
  return (
    <div className="flex gap-3">
      {/* Light mode panel */}
      <ViewTransition name="bills-payments-light-panel">
        <div className="flex-1 bg-[#f5f5f5] rounded-xl p-3 relative overflow-hidden inline-block">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, #d4d4d4 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative z-10">
            <ViewTransition name="bills-payments-light">
              <div className="inline-block">
                <BillsPaymentsLight />
              </div>
            </ViewTransition>
          </div>
        </div>
      </ViewTransition>

      {/* Dark mode panel */}
      <ViewTransition name="bills-payments-dark-panel">
        <div className="flex-1 bg-zinc-950 rounded-xl p-3 relative overflow-hidden inline-block">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, #3f3f46 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative z-10">
            <ViewTransition name="bills-payments-dark">
              <div className="inline-block">
                <BillsPaymentsDark />
              </div>
            </ViewTransition>
          </div>
        </div>
      </ViewTransition>
    </div>
  );
}
