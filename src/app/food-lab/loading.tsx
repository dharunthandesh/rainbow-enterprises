export default function FoodLabLoading() {
  return (
    <div className="space-y-20 pb-20 animate-pulse">
      {/* Header */}
      <section className="py-20 bg-muted/20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="h-6 w-56 bg-muted/40 rounded-full mx-auto" />
          <div className="h-12 w-64 bg-muted/40 rounded-xl mx-auto" />
          <div className="h-4 w-80 bg-muted/30 rounded-lg mx-auto" />
        </div>
      </section>

      {/* Ingredient explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-64 bg-muted/40 rounded-xl mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 bg-muted/40 rounded-xl flex-shrink-0 w-40 lg:w-full" />
            ))}
          </div>
          <div className="lg:col-span-8 bg-card border border-border rounded-3xl p-8 space-y-6">
            <div className="h-8 w-56 bg-muted/40 rounded-xl" />
            <div className="grid grid-cols-2 gap-6">
              <div className="h-16 bg-muted/30 rounded-xl" />
              <div className="h-16 bg-muted/30 rounded-xl" />
            </div>
            <div className="h-20 bg-muted/30 rounded-2xl" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 bg-muted/40 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Myth vs Fact */}
      <section className="bg-muted/30 py-16 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-48 bg-muted/40 rounded-xl mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-72 bg-muted/40 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
