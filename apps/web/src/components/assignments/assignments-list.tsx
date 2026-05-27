"use client";

import { useState } from "react";
import Link from "next/link";
import { AssignmentCard } from "./assignment-card";
import type { AssignmentSummary } from "@/lib/api/assignments";

export function AssignmentsList({ assignments }: { assignments: AssignmentSummary[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssignments = assignments.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-1 py-4 sm:px-0 pb-24">
      {/* Header Card Container */}
      <div className="mb-6 flex items-start gap-4 rounded-[24px] bg-[#f5f5f5] p-5 border border-[#e8e8e8]">
        {/* Green circle indicator */}
        <div className="mt-1 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#e6fcf0] border border-[#a2f1c6]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold tracking-[-0.04em] text-[#303030] leading-none">
            Assignments
          </h1>
          <p className="mt-1 text-[13px] text-[#8e8e8e] font-medium">
            Manage and create assignments for your classes.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-6 flex flex-row items-center justify-between gap-4">
        {/* Filter Toggle */}
        <div className="flex items-center gap-2 text-[#8e8e8e] hover:text-[#303030] transition-colors cursor-pointer select-none">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span className="text-[14px] font-bold">Filter By</span>
        </div>

        {/* Rounded Search Bar */}
        <div className="relative flex items-center w-full max-w-[280px]">
          <span className="absolute left-4 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Assignment"
            className="w-full h-11 rounded-full border border-[#e8e8e8] bg-white pl-10 pr-4 text-[14px] text-[#303030] placeholder:text-[#a9a9a9] outline-none focus:border-[#ff5623]"
          />
        </div>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f6f6f6] mb-3 text-gray-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p className="text-[15px] text-[#8e8e8e] font-semibold">No assignments found matching &quot;{searchQuery}&quot;</p>
        </div>
      ) : (
        /* List items (2-column Grid on desktop) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAssignments.map((a) => (
            <AssignmentCard key={a.id} assignment={a} />
          ))}
        </div>
      )}

      {/* FAB — mobile: + icon above bottom tab bar; desktop: centered pill */}
      <div className="fixed bottom-[5.75rem] right-4 z-[55] lg:bottom-6 lg:left-1/2 lg:right-auto lg:-translate-x-1/2">
        <Link
          href="/assignments/create"
          aria-label="Create Assignment"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#181818] text-white shadow-[0px_8px_24px_rgba(0,0,0,0.2)] transition-all hover:bg-[#282828] active:scale-95 lg:h-auto lg:w-auto lg:inline-flex lg:gap-2 lg:rounded-full lg:px-6 lg:py-3.5 lg:text-sm lg:font-semibold lg:hover:scale-105"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span className="hidden lg:inline">Create Assignment</span>
        </Link>
      </div>
    </div>
  );
}
