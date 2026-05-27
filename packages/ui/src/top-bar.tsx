import Link from "next/link";
import { IconArrowLeft, IconBell, IconChevronDown, IconHome } from "./icons";

export function TopBar({
  backHref = "/assignments",
  breadcrumb = "Assignment",
}: {
  backHref?: string;
  breadcrumb?: string;
}) {
  return (
    <header className="flex h-16 items-center gap-3 rounded-2xl bg-white/80 pl-4 pr-4 shadow-[0px_4px_16px_rgba(0,0,0,0.08)] backdrop-blur-sm">
      {/* Back button */}
      <Link
        href={backHref}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition-opacity hover:opacity-80"
        aria-label="Go back"
      >
        <IconArrowLeft size={20} className="text-[#303030]" />
      </Link>

      {/* Breadcrumb */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <IconHome size={18} className="shrink-0 text-[#a9a9a9]" />
        <span className="truncate text-[15px] font-semibold tracking-[-0.04em] text-[#a9a9a9]">
          {breadcrumb}
        </span>
      </div>

      {/* Notification bell */}
      <button
        type="button"
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f6f6f6] transition-colors hover:bg-[#f0f0f0]"
        aria-label="Notifications"
      >
        <IconBell size={20} className="text-[#303030]" />
        {/* Red notification dot */}
        <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-red-500" />
      </button>

      {/* User profile */}
      <div className="flex items-center gap-2 rounded-xl px-3 py-1.5 shadow-[0px_16px_24px_rgba(0,0,0,0.12),0px_4px_8px_rgba(0,0,0,0.08)]">
        {/* Avatar */}
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[#f6f6f6]">
          <svg viewBox="0 0 32 32" fill="none" className="h-full w-full">
            <rect width="32" height="32" fill="#E0E7FF" />
            {/* Torso */}
            <rect x="8" y="20" width="16" height="10" rx="8" fill="#6366F1" />
            {/* Head */}
            <circle cx="16" cy="14" r="6" fill="#A5B4FC" />
            {/* Highlight */}
            <circle cx="14" cy="12" r="2" fill="white" fillOpacity="0.3" />
          </svg>
        </div>
        <span className="hidden text-[15px] font-semibold tracking-[-0.04em] text-[#303030] sm:inline">
          John Doe
        </span>
        <IconChevronDown size={16} className="hidden text-[#5e5e5e] sm:block" />
      </div>
    </header>
  );
}
