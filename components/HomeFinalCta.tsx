import Link from "next/link";

export default function HomeFinalCta() {
  return (
    <section className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="nexus-frame mx-auto max-w-7xl rounded-[var(--nexus-radius-surface)] p-1">
        <div className="nexus-surface rounded-[calc(var(--nexus-radius-surface)-0.3rem)] px-6 py-16 text-center sm:px-10 sm:py-20">
          <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Build with Nexus</p>
          <h2 className="nexus-heading mx-auto mt-5 max-w-4xl font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
            Your business should not adapt to your software.
            <span className="nexus-copy block">Your software should adapt to your business.</span>
          </h2>
          <p className="nexus-copy mx-auto mt-6 max-w-2xl text-base leading-7">
            Start with the operation that matters most. Nexus can shape the system, intelligence and integrations around it.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link className="nexus-button-primary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/contact">
              Build with Nexus <span aria-hidden="true" className="ml-2">→</span>
            </Link>
            <Link className="nexus-button-secondary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="#industries">
              Explore systems
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
