export default function WellnessLoading() {
  return (
    <div className="space-y-20 pb-20 animate-pulse">
      {/* Header */}
      <section className="py-20 bg-muted/20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="h-6 w-64 bg-muted/40 rounded-full mx-auto" />
          <div className="h-12 w-72 bg-muted/40 rounded-xl mx-auto" />
          <div className="h-4 w-80 bg-muted/30 rounded-lg mx-auto" />
        </div>
      </section>

      {/* Goals grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-muted/40 rounded-2xl" />
          ))}
        </div>

        {/* Detail card */}
        <div className="bg-card border border-border rounded-3xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-5">
              <div className="h-8 w-64 bg-muted/40 rounded-xl" />
              <div className="h-16 bg-muted/30 rounded-xl" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-4 bg-muted/40 rounded-lg" />
                    <div className="h-2.5 bg-muted/30 rounded-full" />
                  </div>
                ))}
              </div>
              <div className="h-20 bg-muted/30 rounded-2xl" />
            </div>
            <div className="lg:col-span-5 space-y-4">
              <div className="h-5 w-40 bg-muted/40 rounded-lg" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted/40 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
