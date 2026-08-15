export default function DemoLoading() {
  return (
    <main aria-busy="true" aria-label="Loading Nexus demo" className="nexus-page min-h-screen px-5 pt-24 text-white sm:px-8">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="mx-auto h-4 w-36 rounded bg-white/[0.1]" />
        <div className="mx-auto mt-6 h-16 max-w-xl rounded bg-white/[0.08]" />
        <div className="mx-auto mt-5 h-6 max-w-2xl rounded bg-white/[0.06]" />
        <div className="mt-20 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div className="h-[23rem] rounded-[var(--nexus-radius-surface)] border border-white/[0.08] bg-white/[0.025]" key={index} />)}</div>
      </div>
    </main>
  );
}
