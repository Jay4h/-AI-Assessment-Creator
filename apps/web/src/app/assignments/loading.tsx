export default function AssignmentsLoading() {
  return (
    <div className="animate-pulse space-y-4 p-2">
      <div className="h-10 w-48 rounded-xl bg-[#f0f0f0]" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-[#f0f0f0]" />
        ))}
      </div>
    </div>
  );
}
