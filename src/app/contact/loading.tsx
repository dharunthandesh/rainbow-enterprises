export default function ContactLoading() {
  return (
    <div className="space-y-16 pb-20 animate-pulse">
      {/* Header */}
      <section className="py-20 bg-muted/20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="h-12 w-56 bg-muted/40 rounded-xl mx-auto" />
          <div className="h-4 w-28 bg-muted/30 rounded-lg mx-auto" />
        </div>
      </section>

      {/* Form + Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="h-8 w-48 bg-muted/40 rounded-xl" />
          <div className="h-12 bg-muted/30 rounded-xl" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted/40 rounded-2xl" />
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-muted/40 rounded-xl" />
            <div className="h-12 bg-muted/40 rounded-xl" />
          </div>
          <div className="h-12 bg-muted/40 rounded-xl" />
          <div className="h-32 bg-muted/40 rounded-xl" />
          <div className="h-14 bg-muted/50 rounded-xl" />
        </div>
      </section>
    </div>
  );
}
