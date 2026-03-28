export default function Loading() {
  return (
    <main className="nf-app">
      {/* Skeleton topbar */}
      <header className="nf-topbar nf-topbar--scrolled" style={{ pointerEvents: "none" }}>
        <div className="nf-topbar-left">
          <div className="nf-skeleton" style={{ width: 80, height: 20 }} />
        </div>
        <div className="nf-skeleton" style={{ width: 36, height: 36, borderRadius: "50%" }} />
      </header>

      {/* Skeleton billboard */}
      <div className="nf-skeleton" style={{ width: "100%", aspectRatio: "3/4", maxHeight: "80vh" }} />

      {/* Skeleton rows */}
      {[1, 2, 3].map((row) => (
        <div key={row} style={{ padding: "20px 0 0" }}>
          <div className="nf-skeleton" style={{ width: 140, height: 18, margin: "0 24px 10px", borderRadius: 4 }} />
          <div style={{ display: "flex", gap: 8, padding: "0 24px", overflow: "hidden" }}>
            {[1, 2, 3, 4, 5].map((card) => (
              <div className="nf-skeleton" key={card} style={{ width: 140, height: 210, borderRadius: 8, flexShrink: 0 }} />
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
