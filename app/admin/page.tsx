"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";

type Product = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  icon: string | null;
  active: boolean;
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      setMessage("A termékek betöltése nem sikerült.");
    } else {
      setProducts(data ?? []);
    }

    setLoading(false);
  }

  function updateProduct(
    id: string,
    field: keyof Product,
    value: string | number | boolean
  ) {
    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? { ...product, [field]: value }
          : product
      )
    );
  }

  async function saveProduct(product: Product) {
    setSaving(product.id);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase
      .from("products")
      .update({
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        icon: product.icon,
        active: product.active,
      })
      .eq("id", product.id);

    if (error) {
      console.error(error);
      setMessage(`Hiba: ${error.message}`);
    } else {
      setMessage(`${product.name} sikeresen mentve.`);
    }

    setSaving(null);
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* FEJLÉC */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <a
            href="/"
            className="text-2xl font-black tracking-widest"
          >
            BLACK <span className="text-purple-500">SHEEP</span>
          </a>

          <a
            href="/shop"
            className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold transition hover:bg-purple-500"
          >
            Webshop
          </a>

        </div>
      </header>

      {/* TARTALOM */}
      <section className="mx-auto max-w-7xl px-6 py-12">

        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-purple-400">
            BLACK SHEEP
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Admin Panel
          </h1>

          <p className="mt-3 text-zinc-500">
            Itt tudod kezelni a webshop termékeit és árait.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-purple-500/20 bg-purple-500/10 px-5 py-4 text-sm text-purple-300">
            {message}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-zinc-500">
            Termékek betöltése...
          </div>
        ) : (
          <div className="space-y-6">

            {products.map((product) => (

              <div
                key={product.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

                  {/* NÉV */}
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Termék neve
                    </span>

                    <input
                      value={product.name}
                      onChange={(e) =>
                        updateProduct(
                          product.id,
                          "name",
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-purple-500"
                    />
                  </label>

                  {/* KATEGÓRIA */}
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Kategória
                    </span>

                    <select
                      value={product.category}
                      onChange={(e) =>
                        updateProduct(
                          product.id,
                          "category",
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-purple-500"
                    >
                      <option value="PP csomag">
                        PP csomag
                      </option>

                      <option value="Jármű">
                        Jármű
                      </option>

                      <option value="VIP rang">
                        VIP rang
                      </option>

                      <option value="Láda">
                        Láda
                      </option>

                      <option value="Támogatás">
                        Támogatás
                      </option>
                    </select>
                  </label>

                  {/* ÁR */}
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Ár (Ft)
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={product.price}
                      onChange={(e) =>
                        updateProduct(
                          product.id,
                          "price",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-purple-500"
                    />
                  </label>

                  {/* AKTÍV */}
                  <label className="flex items-end">
                    <span className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                      <span className="text-sm font-bold">
                        Megjelenjen
                      </span>

                      <input
                        type="checkbox"
                        checked={product.active}
                        onChange={(e) =>
                          updateProduct(
                            product.id,
                            "active",
                            e.target.checked
                          )
                        }
                        className="h-5 w-5 accent-purple-600"
                      />
                    </span>
                  </label>

                </div>

                {/* LEÍRÁS */}
                <label className="mt-5 block">

                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Leírás
                  </span>

                  <textarea
                    value={product.description ?? ""}
                    onChange={(e) =>
                      updateProduct(
                        product.id,
                        "description",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-purple-500"
                  />

                </label>

                {/* MENTÉS */}
                <div className="mt-5 flex items-center justify-between">

                  <span className="text-xs text-zinc-600">
                    ID: {product.id}
                  </span>

                  <button
                    onClick={() => saveProduct(product)}
                    disabled={saving === product.id}
                    className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving === product.id
                      ? "Mentés..."
                      : "Mentés"}
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-zinc-500">
          © 2026 Black Sheep Roleplay. Minden jog fenntartva.
        </div>
      </footer>

    </main>
  );
}
