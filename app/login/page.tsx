"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setCheckingAuth(false);
    }

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!checkingAuth) {
      loadProducts();
    }
  }, [checkingAuth]);

  async function loadProducts() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      setMessage(`Hiba: ${error.message}`);
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

  async function logout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.replace("/login");
  }

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] text-white">
        <p className="text-zinc-400">Ellenőrzés...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      <header className="border-b border-white/10 bg-[#080808]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <a
            href="/"
            className="text-2xl font-black tracking-widest"
          >
            BLACK <span className="text-purple-500">SHEEP</span>
          </a>

          <div className="flex items-center gap-3">

            <a
              href="/shop"
              className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-bold transition hover:bg-white/20"
            >
              Webshop
            </a>

            <button
              onClick={logout}
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold transition hover:bg-red-500"
            >
              Kijelentkezés
            </button>

          </div>

        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">

        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-purple-400">
            BLACK SHEEP
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Admin Panel
          </h1>

          <p className="mt-3 text-zinc-500">
            A webshop termékeinek kezelése.
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
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-zinc-500">
            Nincsenek termékek.
          </div>
        ) : (
          <div className="space-y-6">

            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Termék neve
                    </span>

                    <input
                      value={product.name}
                      onChange={(event) =>
                        updateProduct(
                          product.id,
                          "name",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-purple-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Kategória
                    </span>

                    <select
                      value={product.category}
                      onChange={(event) =>
                        updateProduct(
                          product.id,
                          "category",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-purple-500"
                    >
                      <option value="PP csomag">PP csomag</option>
                      <option value="Jármű">Jármű</option>
                      <option value="VIP rang">VIP rang</option>
                      <option value="Láda">Láda</option>
                      <option value="Támogatás">Támogatás</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Ár (Ft)
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={product.price}
                      onChange={(event) =>
                        updateProduct(
                          product.id,
                          "price",
                          Number(event.target.value)
                        )
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-purple-500"
                    />
                  </label>

                  <label className="flex items-end">
                    <span className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                      <span className="text-sm font-bold">
                        Megjelenjen
                      </span>

                      <input
                        type="checkbox"
                        checked={product.active}
                        onChange={(event) =>
                          updateProduct(
                            product.id,
                            "active",
                            event.target.checked
                          )
                        }
                        className="h-5 w-5 accent-purple-600"
                      />
                    </span>
                  </label>

                </div>

                <label className="mt-5 block">

                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Leírás
                  </span>

                  <textarea
                    value={product.description ?? ""}
                    onChange={(event) =>
                      updateProduct(
                        product.id,
                        "description",
                        event.target.value
                      )
                    }
                    rows={3}
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-purple-500"
                  />

                </label>

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