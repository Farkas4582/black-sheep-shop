"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ProductContent() {
  const searchParams = useSearchParams();

 const name = searchParams.get("name")  ||"Black Sheep Termék";
const price = searchParams.get("price")  ||"0 Ft";

const description =
  searchParams.get("description") 
  "Termék a Black Sheep Roleplay szerverhez.";

const icon = searchParams.get("icon")  ||"🐑";
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-2xl font-black tracking-widest"
          >
            BLACK <span className="text-purple-500">SHEEP</span>
          </a>

          <a
            href="/shop"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-zinc-300 hover:bg-white/10 hover:text-white"
          >
            ← Vissza a webshopba
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] md:grid-cols-2">
          <div className="flex min-h-[400px] items-center justify-center bg-gradient-to-br from-purple-950/60 to-zinc-950">
            <span className="text-[120px]">{icon}</span>
          </div>

          <div className="flex flex-col justify-center p-10">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-purple-400">
              BLACK SHEEP SHOP
            </p>

            <h1 className="mt-4 text-4xl font-black">
              {name}
            </h1>

            <p className="mt-6 leading-7 text-zinc-400">
              {description}
            </p>

            <div className="my-8 h-px bg-white/10" />

            <div className="flex items-center justify-between gap-5">
              <span className="text-3xl font-black">
                {price}
              </span>

             <button
  onClick={async () => {
    const response = await fetch("/api/checkout", {
      method: "POST",
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Nem sikerült elindítani a fizetést.");
    }
  }}
  className="rounded-xl bg-purple-600 px-7 py-4 font-bold transition hover:bg-purple-500"
>
  Megvásárolom
</button>
            </div>

            <p className="mt-6 text-xs text-zinc-600">
              A vásárlás jelenleg teszt üzemmódban van.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-zinc-500">
          © 2026 Black Sheep Roleplay. Minden jog fenntartva.
        </div>
      </footer>
    </main>
  );
}

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#080808] text-white">
          <div className="flex min-h-screen items-center justify-center">
            Betöltés...
          </div>
        </main>
      }
    >
      <ProductContent />
    </Suspense>
  );
}