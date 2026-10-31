/** Shown the moment a tab or button is tapped, while the next admin page loads,
 *  so the panel never feels frozen on a slow connection. */
export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Loading">
      <div className="h-8 w-48 rounded-lg bg-ink/10" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-ink/5" />
        ))}
      </div>
      <div className="h-24 rounded-xl bg-ink/5" />
      <div className="h-24 rounded-xl bg-ink/5" />
    </div>
  );
}
