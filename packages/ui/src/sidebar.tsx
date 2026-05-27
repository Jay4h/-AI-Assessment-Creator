import Link from "next/link";
import clsx from "clsx";
import {
  IconHome,
  IconUsers,
  IconFileText,
  IconBook,
  IconLibrary,
  IconSettings,
  IconSparkle,
} from "./icons";
import { NAV_ITEMS } from "@vedaai/content";

const iconComponents = {
  home: IconHome,
  users: IconUsers,
  file: IconFileText,
  book: IconBook,
  library: IconLibrary,
  settings: IconSettings,
};

export function Sidebar({
  ctaHref = "/assignments/create",
  ctaLabel = "Create Assignment",
}: {
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <aside className="flex h-full w-[304px] shrink-0 flex-col justify-between rounded-2xl bg-white p-6 shadow-[0px_16px_24px_rgba(0,0,0,0.12),0px_32px_24px_rgba(0,0,0,0.2)]">
      {/* Top section */}
      <div className="flex flex-col gap-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          {/* Orange gradient V mark */}
          <span
            className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px]"
            style={{ background: "linear-gradient(180deg,#e56820 0%,#d45e3e 100%)" }}
            aria-hidden
          >
            {/* White V paths mimicking the Figma Group 5 */}
            <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
              <path
                d="M0 0L7 20H14L7 0H0Z"
                fill="white"
                fillOpacity="0.95"
              />
              <path
                d="M14 0L21 20H28L21 0H14Z"
                fill="white"
                fillOpacity="0.95"
              />
              <path
                d="M7 0H21L14 20H7L14 0Z"
                fill="white"
                fillOpacity="0.6"
              />
            </svg>
          </span>
          <span
            className="text-[28px] font-bold leading-none tracking-[-0.06em] text-[#303030]"
          >
            VedaAI
          </span>
        </Link>

        {/* Create Assignment CTA */}
        <Link
          href={ctaHref}
          className="relative flex h-[42px] items-center justify-center gap-2 overflow-hidden rounded-full border-4 border-[#ff7950] bg-[#272727] text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {/* inner glow */}
          <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0px_-1px_3.5px_0px_rgba(177,177,177,0.6),inset_0px_0px_34.5px_0px_rgba(255,255,255,0.25)]" />
          <IconSparkle size={14} className="text-white" />
          <span>{ctaLabel}</span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = iconComponents[item.icon as keyof typeof iconComponents] ?? IconHome;
            const isActive = "active" in item && item.active;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors",
                  isActive
                    ? "bg-[#f0f0f0] font-semibold text-[#303030]"
                    : "font-normal text-[#5e5e5e] hover:bg-[#f6f6f6] hover:text-[#303030]",
                )}
              >
                <Icon size={20} className="shrink-0" />
                <span className="flex-1 tracking-[-0.04em]">{item.label}</span>
                {"badge" in item && item.badge ? (
                  <span className="rounded-full bg-[#ff5623] px-2 py-0.5 text-xs font-semibold text-white shadow-[inset_0px_0px_12.6px_0px_rgba(255,255,255,0.1),inset_0px_0px_32.3px_0px_rgba(255,161,10,0.25)]">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col gap-2">
        <Link
          href="/settings"
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] text-[#5e5e5e] transition-colors hover:bg-[#f6f6f6] hover:text-[#303030]"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f0f0f0] text-[#5e5e5e] transition-colors group-hover:bg-[#e8e8e8] group-hover:text-[#303030]">
            <IconSettings size={18} />
          </span>
          <span className="tracking-[-0.04em] font-medium">Settings</span>
        </Link>

        {/* School profile card */}
        <div className="mt-1 flex items-center gap-3 rounded-2xl bg-[#f0f0f0] p-3">
          {/* School mascot avatar */}
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-amber-100">
            {/* Generated avatar — a stylised school crest */}
            <svg viewBox="0 0 56 56" fill="none" className="h-full w-full">
              <rect width="56" height="56" fill="#FEF3C7"/>
              <ellipse cx="28" cy="24" rx="12" ry="14" fill="#D97706"/>
              <ellipse cx="28" cy="23" rx="9" ry="10" fill="#FBBF24"/>
              <path d="M20 32 Q28 40 36 32" stroke="#D97706" strokeWidth="2" fill="none"/>
              <text x="28" y="27" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#92400E">D</text>
              <rect x="14" y="38" width="28" height="12" rx="3" fill="#1E40AF"/>
              <text x="28" y="47.5" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">DPS</text>
            </svg>
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold text-[#303030]">Delhi Public School</p>
            <p className="truncate text-sm text-[#5e5e5e]">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
