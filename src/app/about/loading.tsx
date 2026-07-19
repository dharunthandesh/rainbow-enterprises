export default function AboutLoading() {
  return (
    <div className="space-y-16 pb-20 animate-pulse">
      {/* Header */}
      <section className="py-20 bg-muted/20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="h-12 w-64 bg-muted/40 rounded-xl mx-auto" />
          <div className="h-4 w-32 bg-muted/30 rounded-lg mx-auto" />
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="h-[400px] bg-muted/40 rounded-3xl" />
        <div className="space-y-4">
          <div className="h-6 w-20 bg-muted/40 rounded-full" />
          <div className="h-8 w-3/4 bg-muted/40 rounded-xl" />
          <div className="h-20 bg-muted/30 rounded-xl" />
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/30 py-16 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-64 bg-muted/40 rounded-xl mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card border border-border p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 bg-muted/50 rounded-xl" />
                <div className="h-5 bg-muted/40 rounded-lg w-2/3" />
                <div className="h-12 bg-muted/30 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
