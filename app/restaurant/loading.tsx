export default function RestaurantLoading() {
  return (
    <main className="nexus-page min-h-screen flex-1 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1480px] animate-pulse">
        <div className="h-16 rounded-2xl border border-white/[0.08] bg-white/[0.025]" />
        <div className="mt-7 grid grid-cols-2 gap-2.5 md:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div className="h-24 rounded-2xl border border-white/[0.08] bg-white/[0.025]" key={index} />
          ))}
        </div>
        <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
          <div className="h-[36rem] rounded-3xl border border-white/[0.08] bg-white/[0.025]" />
          <div className="h-[30rem] rounded-3xl border border-white/[0.08] bg-white/[0.025]" />
        </div>
      </div>
    </main>
  );
}
