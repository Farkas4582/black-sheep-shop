"use client";

import { useEffect, useMemo, useState } from "react";
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

type CartItem = Product & {
  quantity: number;
};

const categories = [
  { name: "Összes", icon: "🛒" },
  { name: "PP csomag", icon: "💎" },
  { name: "Jármű", icon: "🚗" },
  { name: "VIP rang", icon: "👑" },
  { name: "Láda", icon: "🎁" },
  { name: "Támogatás", icon: "⭐" },
];

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("hu-HU").format(price)} Ft`;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Összes");
const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
const [customerEmail, setCustomerEmail] = useState("");
const [orderLoading, setOrderLoading] = useState(false);
const [orderMessage, setOrderMessage] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  useEffect(() => {
    async function loadProducts() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
        setError("A termékek betöltése nem sikerült.");
      } else {
        setProducts(data ?? []);
      }

      setLoading(false);
    }

    loadProducts();
  }, []);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("black-sheep-cart");

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Kosár betöltési hiba:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "black-sheep-cart",
      JSON.stringify(cart)
    );
    async function handleCheckout() {
  if (!customerEmail.trim()) {
    setOrderMessage("Kérlek, add meg az email címed.");
    return;
  }

  if (cart.length === 0) {
    setOrderMessage("A kosár üres.");
    return;
  }

  setOrderLoading(true);
  setOrderMessage("");

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: customerEmail.trim(),
        products: cart,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setOrderMessage(
        result.error || "A rendelés leadása sikertelen."
      );
      return;
    }

    setCart([]);
    setCustomerEmail("");

    router.push(`/order-success?orderId=${result.orderId}`);
console.log("ORDER RESULT:", result);
   router.push(`/order-success?orderId=${result.orderId}`);
  } catch (error) {
    console.error(error);
    setOrderMessage("Hiba történt a rendelés leadásakor.");
  } finally {
    setOrderLoading(false);
  }
}
  }, [cart]);async function handleCheckout() {
  if (!customerEmail.trim()) {
    setOrderMessage("Kérlek, add meg az email címed.");
    return;
  }

  if (cart.length === 0) {
    setOrderMessage("A kosár üres.");
    return;
  }

  setOrderLoading(true);
  setOrderMessage("");

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: customerEmail.trim(),
        products: cart,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setOrderMessage(
        result.error || "A rendelés leadása sikertelen."
      );
      return;
    }

   setCart([]);
setCustomerEmail("");
setOrderMessage("");

router.push(`/order-success?orderId=${result.orderId}`);

  
  } catch (error) {
    console.error(error);
    setOrderMessage("Hiba történt a rendelés leadásakor.");
  } finally {
    setOrderLoading(false);
  }
}

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Összes") {
      return products;
    }

    return products.filter(
      (product) => product.category === selectedCategory
    );
  }, [products, selectedCategory]);

  const cartCount = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cart]);

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    setCartOpen(true);
    setSelectedProduct(null);
  }

  function increaseQuantity(id: string) {
    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  function decreaseQuantity(id: string) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id: string) {
    setCart((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <main className="min-h-screen bg-[#060606] text-white">

      {/* HÁTTÉR */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-[-150px] top-[100px] h-[400px] w-[400px] rounded-full bg-purple-700/10 blur-[130px]" />

        <div className="absolute right-[-150px] top-[40%] h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[150px]" />
      </div>

      {/* NAVBAR */}
      <nav className="relative z-20 border-b border-white/10 bg-[#060606]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <a
            href="/"
            className="text-xl font-black tracking-[0.2em]"
          >
            BLACK <span className="text-purple-500">SHEEP</span>
          </a>

          <div className="flex items-center gap-3">

            <a
              href="/"
              className="hidden rounded-xl px-4 py-2 text-sm font-bold text-zinc-400 transition hover:text-white sm:block"
            >
              Kezdőlap
            </a>

            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold transition hover:bg-purple-500"
            >
              🛒 Kosár

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1 text-xs font-black text-purple-700">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </nav>

      {/* FEJLÉC */}
      <section className="relative z-10 border-b border-white/10 px-6 py-20">

        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-purple-400">
            BLACK SHEEP
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">
            Black Sheep
            <span className="block bg-gradient-to-r from-white to-purple-500 bg-clip-text text-transparent">
              Shop
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Szerezd be a Black Sheep Roleplay szerverhez elérhető
            prémium tartalmakat, PP-ket és különleges támogatói
            lehetőségeket.
          </p>

        </div>

      </section>

      {/* KATEGÓRIÁK */}
      <section className="relative z-10 px-6 pt-10">

        <div className="mx-auto max-w-7xl">

          <div className="flex gap-3 overflow-x-auto pb-4">

            {categories.map((category) => {
              const active =
                selectedCategory === category.name;

              return (
                <button
                  key={category.name}
                  onClick={() =>
                    setSelectedCategory(category.name)
                  }
                  className={`flex shrink-0 items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-bold transition ${
                    active
                      ? "border-purple-500/40 bg-purple-600 text-white shadow-lg shadow-purple-950/30"
                      : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </button>
              );
            })}

          </div>

        </div>

      </section>

      {/* TERMÉKEK */}
      <section className="relative z-10 px-6 py-12">

        <div className="mx-auto max-w-7xl">

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-[360px] animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]"
                />
              ))}

            </div>
          ) : error ? (

            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">

              <div className="text-4xl">
                ⚠️
              </div>

              <h2 className="mt-4 text-xl font-black">
                Hiba történt
              </h2>

              <p className="mt-2 text-sm text-red-300">
                {error}
              </p>

            </div>

          ) : filteredProducts.length === 0 ? (

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center">

              <div className="text-5xl">
                🐑
              </div>

              <h2 className="mt-5 text-2xl font-black">
                Nincs elérhető termék
              </h2>

              <p className="mt-3 text-zinc-500">
                Ebben a kategóriában jelenleg nincs aktív termék.
              </p>

            </div>

          ) : (

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-white/[0.05]"
                >

                  <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/70 to-transparent opacity-0 transition group-hover:opacity-100" />

                  <div className="p-7">

                    <div className="flex items-start justify-between">

                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-4xl transition duration-300 group-hover:scale-110">
                        {product.icon || "🐑"}
                      </div>

                      <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300">
                        {product.category}
                      </span>

                    </div>

                    <h2 className="mt-7 text-2xl font-black">
                      {product.name}
                    </h2>

                    <p className="mt-3 min-h-[48px] text-sm leading-6 text-zinc-500">
                      {product.description ||
                        "Prémium Black Sheep Roleplay tartalom."}
                    </p>

                    <div className="mt-8 flex items-end justify-between gap-4">

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                          Ár
                        </p>

                        <p className="mt-1 text-2xl font-black">
                          {formatPrice(product.price)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedProduct(product)
                        }
                        className="rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black transition hover:border-purple-500/30 hover:bg-purple-600"
                      >
                        Megnézem
                      </button>

                    </div>

                  </div>

                </article>
              ))}

            </div>

          )}

        </div>

      </section>

      {/* TERMÉK MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-6 backdrop-blur-md">

          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0d0d0d] p-7 shadow-2xl">

            <div className="flex items-start justify-between">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-purple-500/10 text-4xl">
                {selectedProduct.icon || "🐑"}
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>

            </div>

            <div className="mt-7">

              <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300">
                {selectedProduct.category}
              </span>

              <h2 className="mt-4 text-3xl font-black">
                {selectedProduct.name}
              </h2>

              <p className="mt-4 leading-7 text-zinc-400">
                {selectedProduct.description ||
                  "Prémium Black Sheep Roleplay tartalom."}
              </p>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                  Ár
                </p>

                <p className="mt-1 text-3xl font-black">
                  {formatPrice(selectedProduct.price)}
                </p>

              </div>

              <button
                onClick={() =>
                  addToCart(selectedProduct)
                }
                className="mt-5 w-full rounded-2xl bg-purple-600 px-6 py-4 font-black transition hover:bg-purple-500"
              >
                🛒 Kosárba
              </button>

            </div>

          </div>

        </div>
      )}

      {/* KOSÁR */}
      {cartOpen && (
        <div className="fixed inset-0 z-[80]">

          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />

          <aside className="absolute bottom-0 right-0 top-0 flex w-full max-w-md flex-col border-l border-white/10 bg-[#0a0a0a] shadow-2xl">

            {/* KOSÁR FEJLÉC */}
            <div className="flex items-center justify-between border-b border-white/10 p-6">

              <div>
                <h2 className="text-2xl font-black">
                  Kosár
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  {cartCount} termék
                </p>
              </div>

              <button
                onClick={() => setCartOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>

            </div>

            {/* KOSÁR TARTALMA */}
            <div className="flex-1 overflow-y-auto p-6">

              {cart.length === 0 ? (

                <div className="flex h-full flex-col items-center justify-center text-center">

                  <div className="text-6xl">
                    🛒
                  </div>

                  <h3 className="mt-6 text-xl font-black">
                    A kosarad üres
                  </h3>

                  <p className="mt-2 text-sm text-zinc-500">
                    Adj hozzá néhány terméket a webshopból.
                  </p>

                </div>

              ) : (

                <div className="space-y-4">

                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                    >

                      <div className="flex gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black/40 text-2xl">
                          {item.icon || "🐑"}
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-3">

                            <div>
                              <h3 className="font-bold">
                                {item.name}
                              </h3>

                              <p className="mt-1 text-sm text-purple-400">
                                {formatPrice(item.price)}
                              </p>
                            </div>

                            <button
                              onClick={() =>
                                removeFromCart(item.id)
                              }
                              className="text-xs font-bold text-zinc-600 transition hover:text-red-400"
                            >
                              Törlés
                            </button>

                          </div>

                          <div className="mt-4 flex items-center justify-between">

                            <div className="flex items-center gap-2">

                              <button
                                onClick={() =>
                                  decreaseQuantity(item.id)
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 font-bold hover:bg-white/10"
                              >
                                −
                              </button>

                              <span className="w-8 text-center text-sm font-bold">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  increaseQuantity(item.id)
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 font-bold hover:bg-white/10"
                              >
                                +
                              </button>

                            </div>

                            <p className="font-black">
                              {formatPrice(
                                item.price * item.quantity
                              )}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>
                  ))}

                </div>

              )}

            </div>

       {/* KOSÁR ALJA */}
{cart.length > 0 && (
  <div className="border-t border-white/10 p-6">

    <div className="flex items-center justify-between">

      <span className="text-zinc-500">
        Végösszeg
      </span>

      <span className="text-2xl font-black">
        {formatPrice(cartTotal)}
      </span>

    </div>

   <input
  type="email"
  value={customerEmail}
  onChange={(event) => setCustomerEmail(event.target.value)}
  placeholder="Email címed"
  className="mt-5 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-purple-500/50"
/>
{orderMessage && (
  <p className="mt-3 text-sm text-zinc-400">
    {orderMessage}
  </p>
)}
    <button
  type="button"
  onClick={handleCheckout}
  disabled={orderLoading}
  className="mt-3 w-full rounded-2xl bg-purple-600 px-6 py-4 font-black transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
>
  {orderLoading ? "Rendelés küldése..." : "Rendelés leadása"}
</button>

    <button
      type="button"
      onClick={clearCart}
      className="mt-3 w-full rounded-xl px-4 py-3 text-sm font-bold text-zinc-500 transition hover:text-red-400"
    >
      Kosár ürítése
    </button>
               

              </div>
            )}

          </aside>

        </div>
      )}

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-10">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">

          <div className="font-black tracking-[0.2em] text-zinc-400">
            BLACK SHEEP
          </div>

          <div>
            © 2026 Black Sheep Roleplay. Minden jog fenntartva.
          </div>

        </div>

      </footer>

    </main>
  );
}