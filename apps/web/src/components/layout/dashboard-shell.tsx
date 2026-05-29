import { Sidebar, TopBar } from "@vedaai/ui";
import { DashboardMobileChrome } from "./dashboard-mobile-chrome";

export function DashboardShell({
  children,
  breadcrumb = "Assignment",
  backHref = "/assignments",
}: {
  children: React.ReactNode;
  breadcrumb?: string;
  backHref?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col gap-2 p-2 sm:gap-3 sm:p-3 lg:flex-row lg:items-start pb-24 lg:pb-3 print:p-0 print:pb-0 print:gap-0 print:bg-white">
      <div className="sticky top-3 hidden h-[calc(100vh-24px)] lg:block print:hidden">
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-3 print:gap-0 print:p-0">
        <DashboardMobileChrome />
        <div className="hidden lg:block print:hidden">
          <TopBar backHref={backHref} breadcrumb={breadcrumb} />
        </div>
        <main className="flex-1 print:p-0 print:m-0">{children}</main>
      </div>
    </div>
  );
}
