export default function CheckoutLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="h-8 w-48 bg-muted/40 rounded-xl mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="h-6 w-40 bg-muted/40 rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted/40 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="h-6 w-32 bg-muted/40 rounded-xl" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted/40 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="h-6 w-32 bg-muted/40 rounded-xl" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-16 h-16 bg-muted/40 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted/40 rounded-lg" />
                  <div className="h-3 bg-muted/30 rounded-lg w-2/3" />
                </div>
              </div>
            ))}
            <div className="h-14 bg-muted/50 rounded-xl mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
