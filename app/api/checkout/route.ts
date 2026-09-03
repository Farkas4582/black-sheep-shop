import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const { email, products } = await request.json();

    if (!email?.trim()) {
      return NextResponse.json(
        { error: "Hiányzik az email cím." },
        { status: 400 }
      );
    }

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "A kosár üres." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email.trim(),

      line_items: products.map((product) => ({
        price_data: {
          currency: "huf",
          product_data: {
            name: product.name || "Black Sheep Termék",
          },
          unit_amount: Math.round(Number(product.price)),
        },
        quantity: Number(product.quantity) || 1,
      })),

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop`,
    });

    return NextResponse.json({ url: session.url });
 } catch (error: any) {
    console.error("STRIPE CHECKOUT HIBA:", error);

    return NextResponse.json(
      {
        error: error?.message || "Ismeretlen Stripe hiba.",
        type: error?.type 
 ||null,
        code: error?.code || null,
      },
      { status: 500 }
    );
} 