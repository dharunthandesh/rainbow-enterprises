function ProductCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted/50" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-muted/50 rounded-lg w-3/4" />
        <div className="h-3 bg-muted/40 rounded-lg w-1/2" />
        <div className="h-6 bg-muted/50 rounded-lg w-1/3 mt-2" />
      </div>
    </div>
  );
}

export default function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner skeleton */}
      <div className="h-28 bg-muted/40 rounded-3xl animate-pulse" />

      {/* Controls skeleton */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card border border-border p-4 rounded-2xl animate-pulse">
        <div className="h-12 bg-muted/40 rounded-xl w-full md:max-w-md" />
        <div className="h-12 bg-muted/40 rounded-xl w-48" />
      </div>

      {/* Main grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-6 space-y-3 animate-pulse">
          <div className="h-5 bg-muted/50 rounded-lg w-1/2" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 bg-muted/40 rounded-xl" />
          ))}
        </div>

        {/* Product grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
