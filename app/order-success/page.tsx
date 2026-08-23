"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-2xl text-center">

        <div className="mb-8 text-6xl">
          ✓
        </div>

        <h1 className="text-4xl font-black tracking-tight">
          Köszönjük a rendelésed!
        </h1>

        <p className="mt-4 text-lg text-zinc-400">
          A rendelésed sikeresen rögzítettük.
        </p>

        {orderId && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-zinc-500">
              Rendelési azonosító
            </p>

            <p className="mt-2 break-all font-mono text-sm text-purple-400">
              {orderId}
            </p>
          </div>
        )}

        <Link
          href="/shop"
          className="mt-8 inline-flex rounded-2xl bg-purple-600 px-8 py-4 font-black transition hover:bg-purple-500"
        >
          Vissza a webshopba
        </Link>

      </div>
    </main>
  );
}