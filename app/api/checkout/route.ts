import Stripe from "stripe";
import { NextResponse } from "next/server";

  export async function POST(request: Request) {
  const { name, price } = await request.json();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "huf",
            product_data: {
              name: name || "Black Sheep Termék",
            },
            unit_amount: Math.round(
  Number(price.replace(/[^\d]/g, "")) || 100
),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Sikertelen fizetés indítás." },
      { status: 500 }
    );
  }
}