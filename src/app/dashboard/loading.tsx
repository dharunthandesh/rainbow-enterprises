export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-pulse">
      {/* Title */}
      <div className="space-y-2">
        <div className="h-9 w-56 bg-muted/40 rounded-xl" />
        <div className="h-4 w-32 bg-muted/30 rounded-lg" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar */}
        <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3 pb-4 border-b border-border mb-3">
            <div className="w-12 h-12 rounded-full bg-muted/50" />
            <div className="space-y-1">
              <div className="h-4 w-24 bg-muted/50 rounded-lg" />
              <div className="h-3 w-32 bg-muted/30 rounded-lg" />
            </div>
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted/40 rounded-xl" />
          ))}
        </div>

        {/* Main panel */}
        <div className="lg:col-span-3 bg-card border border-border rounded-3xl p-8 space-y-6">
          <div className="h-7 w-40 bg-muted/40 rounded-xl border-b border-border pb-3" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="border border-border rounded-2xl overflow-hidden">
              <div className="h-16 bg-muted/30 border-b border-border" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-muted/30 rounded-lg" />
                <div className="h-5 bg-muted/30 rounded-lg w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
