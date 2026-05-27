import type { Metadata } from "next";
import Link from "next/link";
import { DashboardShell } from "@/components/layout";
import { AssignmentsList } from "@/components/assignments";
import { fetchAssignments } from "@/lib/api/assignments";

export const metadata: Metadata = {
  title: "Assignments",
  description:
    "View and create AI-powered assignments for your students with VedaAI.",
};

export default async function AssignmentsPage() {
  const assignments = await fetchAssignments();
  const isEmpty = assignments.length === 0;

  return (
    <DashboardShell breadcrumb="Assignment">
      {isEmpty ? (
        /* ---- Empty state ---- */
        <div className="flex min-h-[calc(100vh-140px)] flex-col items-center justify-center gap-8 px-4 py-12">
          <div className="flex h-[220px] w-[220px] items-center justify-center rounded-full bg-[#f6f6f6] shadow-[0px_20px_30px_rgba(146,146,146,0.19)] sm:h-[260px] sm:w-[260px] lg:h-[300px] lg:w-[300px]">
            <svg
              viewBox="0 0 160 160"
              fill="none"
              className="h-[100px] w-[100px] sm:h-[120px] sm:w-[120px] lg:h-[140px] lg:w-[140px]"
              aria-label="No assignments yet illustration"
            >
              {/* Document */}
              <rect x="28" y="20" width="80" height="100" rx="8" fill="#e8e8e8" />
              <rect x="28" y="20" width="80" height="100" rx="8" stroke="#c8c8c8" strokeWidth="2" />
              {/* Folded corner */}
              <path d="M88 20L108 40H88V20Z" fill="#d0d0d0" />
              {/* Lines */}
              <rect x="40" y="52" width="44" height="4" rx="2" fill="#c0c0c0" />
              <rect x="40" y="64" width="56" height="4" rx="2" fill="#c0c0c0" />
              <rect x="40" y="76" width="48" height="4" rx="2" fill="#c0c0c0" />
              <rect x="40" y="88" width="36" height="4" rx="2" fill="#c0c0c0" />
              {/* Magnifying glass */}
              <circle cx="104" cy="104" r="26" fill="white" stroke="#303030" strokeWidth="5" />
              <circle cx="104" cy="104" r="16" fill="#f0f0f0" />
              {/* Magnifier handle */}
              <line x1="122" y1="122" x2="140" y2="140" stroke="#303030" strokeWidth="6" strokeLinecap="round" />
              {/* Question mark inside magnifier */}
              <text x="104" y="111" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#a9a9a9">?</text>
            </svg>
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-2xl font-bold tracking-[-0.04em] text-[#303030] sm:text-3xl">
              No Assignments Yet
            </h1>
            <p className="max-w-[360px] text-[15px] leading-relaxed text-[rgba(94,94,94,0.8)]">
              You haven&apos;t created any assignments. Start by clicking the button below.
            </p>
            <Link
              href="/assignments/create"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#181818] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M8 1L9.2 5.8H14L10.4 8.5L11.6 13.3L8 10.6L4.4 13.3L5.6 8.5L2 5.8H6.8L8 1Z" fill="currentColor"/>
              </svg>
              Create Your First Assignment
            </Link>
          </div>
        </div>
      ) : (
        <AssignmentsList assignments={assignments} />
      )}
    </DashboardShell>
  );
}
