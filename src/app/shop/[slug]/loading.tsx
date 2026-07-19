export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-pulse">
      {/* Breadcrumb */}
      <div className="h-5 w-28 bg-muted/40 rounded-lg" />

      {/* Product details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gallery skeleton */}
        <div className="lg:col-span-5 space-y-3">
          <div className="aspect-square bg-muted/40 rounded-2xl" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-14 h-14 bg-muted/40 rounded-xl flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="h-6 w-24 bg-muted/40 rounded-full" />
            <div className="h-10 w-3/4 bg-muted/40 rounded-xl" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 w-24 bg-muted/40 rounded-xl" />
              ))}
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 w-4 bg-muted/40 rounded-full" />
              ))}
              <div className="h-4 w-32 bg-muted/40 rounded-lg ml-2" />
            </div>
          </div>

          <div className="flex gap-4 border-y border-border py-4">
            <div className="h-10 w-24 bg-muted/40 rounded-xl" />
            <div className="h-10 w-20 bg-muted/30 rounded-xl" />
          </div>

          <div className="h-16 w-full bg-muted/30 rounded-xl" />

          <div className="flex gap-3">
            <div className="h-12 flex-1 bg-muted/40 rounded-xl" />
            <div className="h-12 w-12 bg-muted/40 rounded-xl" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted/40 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
