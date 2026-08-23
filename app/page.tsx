"use client";

const categories = [
  {
    icon: "💎",
    title: "PP csomagok",
    description: "Szerezz extra PP-t a szerveren.",
    href: "/shop",
  },
  {
    icon: "🚗",
    title: "Járművek",
    description: "Különleges járművek a garázsodba.",
    href: "/shop",
  },
  {
    icon: "👑",
    title: "VIP rangok",
    description: "Exkluzív előnyök és különleges rangok.",
    href: "/shop",
  },
  {
    icon: "🎁",
    title: "Ládák",
    description: "Különleges ládák és jutalmak.",
    href: "/shop",
  },
  {
    icon: "⭐",
    title: "Támogatás",
    description: "Támogasd a Black Sheep Roleplay szervert.",
    href: "/shop",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#060606] text-white">

      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#060606]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <a href="/" className="text-xl font-black tracking-[0.2em]">
            BLACK <span className="text-purple-500">SHEEP</span>
          </a>

          <div className="flex items-center gap-6">
            <a
              href="/"
              className="hidden text-sm font-bold text-white sm:block"
            >
              Kezdőlap
            </a>

            <a
              href="/shop"
              className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold transition hover:bg-purple-500"
            >
              Webshop
            </a>
          </div>

        </div>
      </nav>

      <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-24">

        <div className="absolute left-[-150px] top-[100px] h-[400px] w-[400px] rounded-full bg-purple-700/20 blur-[120px]" />

        <div className="absolute bottom-[-150px] right-[-100px] h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[140px]" />

        <div className="relative mx-auto w-full max-w-7xl">

          <div className="max-w-4xl">

            <div className="mb-6 inline-flex rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-purple-300">
              Black Sheep Roleplay
            </div>

            <h1 className="text-5xl font-black leading-none sm:text-7xl lg:text-8xl">
              Lépj be a
              <span className="block bg-gradient-to-r from-white to-purple-500 bg-clip-text text-transparent">
                Black Sheep
              </span>
              világába.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
              Szerezd be a Black Sheep Roleplay szerverhez elérhető prémium
              tartalmakat, PP-ket, járműveket, VIP rangokat és különleges
              támogatói lehetőségeket.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              <a
                href="/shop"
                className="rounded-2xl bg-purple-600 px-7 py-4 text-center font-black transition hover:-translate-y-1 hover:bg-purple-500"
              >
                🛒 Webshop megnyitása
              </a>

              <a
                href="#kategorik"
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-7 py-4 text-center font-bold text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
              >
                Fedezd fel
              </a>

            </div>

          </div>

        </div>
      </section>

      <section
        id="kategorik"
        className="border-t border-white/10 px-6 py-24"
      >

        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-purple-400">
              Fedezd fel
            </p>

            <h2 className="mt-3 text-4xl font-black sm:text-5xl">
              Minden, amire szükséged van.
            </h2>

            <p className="mt-5 text-zinc-500">
              Válaszd ki a számodra megfelelő kategóriát.
            </p>

          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {categories.map((category) => (
              <a
                key={category.title}
                href={category.href}
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-purple-500/30 hover:bg-white/[0.06]"
              >

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-3xl">
                  {category.icon}
                </div>

                <h3 className="mt-7 text-xl font-black">
                  {category.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {category.description}
                </p>

                <div className="mt-6 text-sm font-bold text-purple-400">
                  Megnézem →
                </div>

              </a>
            ))}

          </div>

        </div>

      </section>

      <section className="px-6 pb-24">

        <div className="mx-auto max-w-7xl">

          <div className="rounded-[2rem] border border-purple-500/20 bg-purple-500/10 p-8 sm:p-12">

            <div className="max-w-2xl">

              <div className="text-4xl">
                ⭐
              </div>

              <h2 className="mt-5 text-3xl font-black sm:text-4xl">
                Támogasd a Black Sheep Roleplay-t.
              </h2>

              <p className="mt-5 leading-7 text-zinc-400">
                A támogatásoddal hozzájárulsz a szerver fejlesztéséhez,
                miközben különleges lehetőségeket szerezhetsz.
              </p>

              <a
                href="/shop"
                className="mt-8 inline-block rounded-2xl bg-purple-600 px-7 py-4 font-black transition hover:bg-purple-500"
              >
                Megnézem a webshopot →
              </a>

            </div>

          </div>

        </div>

      </section>

      <footer className="border-t border-white/10 px-6 py-10">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="font-black tracking-[0.2em]">
            BLACK SHEEP
          </div>

          <div className="text-sm text-zinc-600">
            © 2026 Black Sheep Roleplay. Minden jog fenntartva.
          </div>

        </div>

      </footer>

    </main>
  );
}
