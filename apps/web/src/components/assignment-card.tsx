"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteAssignment } from "@/lib/actions";
import type { AssignmentSummary } from "@/lib/fetch-assignments";

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  queued:     { bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-400",  label: "Queued" },
  processing: { bg: "bg-blue-50",    text: "text-blue-700",   dot: "bg-blue-400",   label: "Generating…" },
  completed:  { bg: "bg-green-50",   text: "text-green-700",  dot: "bg-green-500",  label: "Completed" },
  failed:     { bg: "bg-red-50",     text: "text-red-700",    dot: "bg-red-500",    label: "Failed" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.queued;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function formatDate(dStr?: string) {
  if (!dStr) return "—";
  const d = new Date(dStr);
  if (isNaN(d.getTime())) return dStr;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function IconMoreVertical() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1.2" />
      <circle cx="12" cy="12" r="1.2" />
      <circle cx="12" cy="19" r="1.2" />
    </svg>
  );
}

export function AssignmentCard({ assignment }: { assignment: AssignmentSummary }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const assignedDate = formatDate(assignment.createdAt);
  const dueDate = formatDate(assignment.dueDate);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (buttonRef.current?.contains(event.target as Node)) {
          return;
        }
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm("Are you sure you want to delete this assignment?")) {
      startTransition(async () => {
        const result = await deleteAssignment(assignment.id);
        if (result.ok) {
          setMenuOpen(false);
          router.refresh();
        } else {
          alert(result.error || "Failed to delete assignment");
        }
      });
    }
  };

  return (
    <div className={`relative group flex flex-col justify-between min-h-[140px] rounded-[24px] bg-white p-6 shadow-[0px_4px_16px_rgba(0,0,0,0.02)] border border-[#f0f0f0] transition-all hover:shadow-[0px_8px_24px_rgba(0,0,0,0.06)] hover:border-[#e0e0e0] ${
      isPending ? "opacity-50 pointer-events-none" : ""
    }`}>
      {/* Absolute overlay Link to make the entire card clickable, except for interactive z-20 elements */}
      <Link
        href={`/assignments/${assignment.id}/output`}
        className="absolute inset-0 rounded-[24px] z-10"
        aria-label={`View assignment ${assignment.title}`}
      />

      {/* Header Row: Title & Options Dots */}
      <div className="flex items-start justify-between gap-3">
        <span className="text-[18px] font-bold tracking-[-0.02em] text-[#303030] group-hover:text-[#ff5623] transition-colors line-clamp-2">
          {assignment.title}
        </span>
        <button
          ref={buttonRef}
          type="button"
          className="relative z-20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#303030]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
        >
          <IconMoreVertical />
        </button>
      </div>

      {/* Details Row: Assigned Date & Due Date aligned on opposite ends */}
      <div className="flex items-center justify-between gap-4 text-[13px] mt-4">
        <span className="font-bold text-[#303030]">
          Assigned on : <span className="font-medium text-[#8e8e8e]">{assignedDate}</span>
        </span>
        <span className="font-bold text-[#303030]">
          Due : <span className="font-medium text-[#8e8e8e]">{dueDate}</span>
        </span>
      </div>

      {/* Sleek, High-Fidelity Dropdown Options Menu */}
      {menuOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-4 top-12 z-30 w-[180px] rounded-[24px] bg-white p-3 shadow-[0px_12px_32px_rgba(0,0,0,0.12)] border border-[#f2f2f2] animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <Link
            href={`/assignments/${assignment.id}/output`}
            onClick={() => setMenuOpen(false)}
            className="relative z-40 block w-full text-left rounded-[14px] px-4 py-2.5 text-[14px] font-semibold text-[#303030] hover:bg-[#f5f5f5] transition-colors"
          >
            View Assignment
          </Link>
          <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="relative z-40 block w-full text-left rounded-[14px] bg-[#f5f5f5] px-4 py-2.5 text-[14px] font-semibold text-[#d93025] hover:bg-[#ebebeb] transition-colors disabled:opacity-50 mt-1"
          >
            {isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}
