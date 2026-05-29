"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@vedaai/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

function IconBell() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function DashboardMobileChrome() {
  const pathname = usePathname();

  const isHomeActive = pathname === "/";
  const isAssignmentsActive = pathname.startsWith("/assignments");
  const isLibraryActive = pathname.startsWith("/library");
  const isToolkitActive = pathname.startsWith("/toolkit");

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileSidebarOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileSidebarOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileSidebarOpen]);

  return (
    <>
      <div className="lg:hidden w-full print:hidden">
        <nav className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-[0px_4px_16px_rgba(0,0,0,0.06)]">
          <Link href="/assignments" prefetch={false} className="flex items-center gap-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#181818] text-white"
              aria-hidden
            >
              <svg width="20" height="15" viewBox="0 0 28 20" fill="none">
                <path d="M0 0L7 20H14L7 0H0Z" fill="white" fillOpacity="0.95" />
                <path d="M14 0L21 20H28L21 0H14Z" fill="white" fillOpacity="0.95" />
                <path d="M7 0H21L14 20H7L14 0Z" fill="white" fillOpacity="0.6" />
              </svg>
            </span>
            <span className="text-[20px] font-extrabold tracking-[-0.05em] text-[#303030]">VedaAI</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f6f6] text-[#303030] transition-colors hover:bg-[#f0f0f0]"
              aria-label="Notifications"
            >
              <IconBell />
              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#ff5623]" />
            </button>

            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-[#f0f0f0] bg-[#f0e8e0]">
              <img src="/avatar.png" alt="User avatar" className="h-full w-full object-cover" />
            </div>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#303030] hover:bg-[#f6f6f6]"
              aria-label="Open navigation menu"
              aria-expanded={mobileSidebarOpen}
              onClick={() => setMobileSidebarOpen(true)}
            >
              <IconMenu />
            </button>
          </div>
        </nav>
      </div>

      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden print:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close navigation menu"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(304px,88vw)] flex-col p-3">
            <div className="flex h-[calc(100vh-24px)] flex-col">
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#303030] shadow-sm"
                  aria-label="Close navigation menu"
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="min-h-0 flex-1">
                <Sidebar
                  className="h-full w-full shadow-none"
                  onNavigate={() => setMobileSidebarOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="fixed bottom-4 left-4 right-4 z-50 lg:hidden print:hidden">
        <div className="flex h-16 items-center justify-between rounded-[24px] bg-[#181818] px-6 py-2 shadow-[0px_8px_32px_rgba(0,0,0,0.24)]">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 text-[10px] ${
              isHomeActive
                ? "font-semibold text-white"
                : "font-medium text-[#8e8e8e] transition-opacity hover:opacity-85"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
            <span className={isHomeActive ? "relative after:absolute after:-bottom-1 after:left-1/2 after:h-0.5 after:w-4 after:-translate-x-1/2 after:rounded-full after:bg-white" : ""}>
              Home
            </span>
          </Link>

          <Link
            href="/assignments"
            prefetch={false}
            className={`flex flex-col items-center gap-1 text-[10px] ${
              isAssignmentsActive
                ? "font-semibold text-white"
                : "font-medium text-[#8e8e8e] transition-opacity hover:opacity-85"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className={isAssignmentsActive ? "relative after:absolute after:-bottom-1 after:left-1/2 after:h-0.5 after:w-4 after:-translate-x-1/2 after:rounded-full after:bg-white" : ""}>
              Assignments
            </span>
          </Link>

          <Link
            href="/library"
            prefetch={false}
            className={`flex flex-col items-center gap-1 text-[10px] ${
              isLibraryActive
                ? "font-semibold text-white"
                : "font-medium text-[#8e8e8e] transition-opacity hover:opacity-85"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span className={isLibraryActive ? "relative after:absolute after:-bottom-1 after:left-1/2 after:h-0.5 after:w-4 after:-translate-x-1/2 after:rounded-full after:bg-white" : ""}>
              Library
            </span>
          </Link>

          <Link
            href="/toolkit"
            prefetch={false}
            className={`flex flex-col items-center gap-1 text-[10px] ${
              isToolkitActive
                ? "font-semibold text-white"
                : "font-medium text-[#8e8e8e] transition-opacity hover:opacity-85"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className={isToolkitActive ? "relative after:absolute after:-bottom-1 after:left-1/2 after:h-0.5 after:w-4 after:-translate-x-1/2 after:rounded-full after:bg-white" : ""}>
              AI Toolkit
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
