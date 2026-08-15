export default function DocsLoading() {
  return (
    <main aria-busy="true" aria-label="Loading documentation" className="nexus-page min-h-screen px-5 pt-28 text-white sm:px-8">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-3 w-28 rounded bg-white/[0.1]" />
        <div className="mt-6 h-14 max-w-3xl rounded bg-white/[0.08]" />
        <div className="mt-5 h-6 max-w-2xl rounded bg-white/[0.06]" />
        <div className="mt-16 grid gap-10 lg:grid-cols-[13.5rem_minmax(0,1fr)]">
          <div className="hidden space-y-3 lg:block">{Array.from({ length: 8 }, (_, index) => <div className="h-8 rounded bg-white/[0.05]" key={index} />)}</div>
          <div className="space-y-5">{Array.from({ length: 5 }, (_, index) => <div className="h-28 rounded-[var(--nexus-radius-control)] border border-white/[0.07] bg-white/[0.025]" key={index} />)}</div>
        </div>
      </div>
    </main>
  );
}
