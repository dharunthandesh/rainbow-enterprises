export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col gap-8 animate-pulse px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
      {/* Hero skeleton */}
      <div className="w-full h-16 bg-muted/40 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-48 bg-muted/40 rounded-2xl md:col-span-2" />
        <div className="h-48 bg-muted/40 rounded-2xl" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted/40 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
