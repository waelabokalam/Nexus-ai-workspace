import Link from "next/link";
import NexusCore from "@/components/ui/NexusCore";

export default function Hero() {
  return (
    <section className="relative px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Nexus</p>
          <h1 className="mt-5 max-w-4xl font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
            The AI operating system for business communication.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
            Nexus helps businesses understand customer intent, use company knowledge, remember context and move conversations into the right workflow or action.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link className="nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] bg-white px-5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200" href="/demo">
              Try the live demo
            </Link>
            <Link className="nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] border border-white/[0.14] bg-white/[0.025] px-5 text-sm font-medium text-white transition hover:bg-white/[0.07]" href="/features">
              Explore capabilities
            </Link>
          </div>
        </div>
        <aside className="nexus-surface rounded-[var(--nexus-radius-surface)] p-5 sm:p-6">
          <NexusCore size={42} />
          <p className="mt-8 text-sm font-medium text-white">Built for the work behind every reply.</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-400">
            <li>Adaptive English, Arabic and Turkish conversations</li>
            <li>Business knowledge powered by retrieval, with conversation memory</li>
            <li>Routing, scheduling and visible execution</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
