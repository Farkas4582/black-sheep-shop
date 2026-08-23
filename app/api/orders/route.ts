import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type OrderProduct = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email;
    const products = body.products as OrderProduct[];

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Érvénytelen email cím." },
        { status: 400 }
      );
    }

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "A kosár üres." },
        { status: 400 }
      );
    }

   const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
    const productIds = products.map((product) => product.id);

    const { data: databaseProducts, error: productsError } =
      await supabase
        .from("products")
        .select("id, name, price, active")
        .in("id", productIds)
        .eq("active", true);

    if (productsError) {
      console.error("PRODUCT ERROR:", productsError);

      return NextResponse.json(
        { error: productsError.message },
        { status: 500 }
      );
    }

    if (
      !databaseProducts ||
      databaseProducts.length !== products.length
    ) {
      return NextResponse.json(
        { error: "Egy vagy több termék már nem elérhető." },
        { status: 400 }
      );
    }

    let totalAmount = 0;

    const orderItems = products.map((cartProduct) => {
      const databaseProduct = databaseProducts.find(
        (product) => product.id === cartProduct.id
      );

      if (!databaseProduct) {
        throw new Error("Termék nem található.");
      }

      const quantity = Math.max(
        1,
        Math.floor(Number(cartProduct.quantity))
      );

      const unitPrice = databaseProduct.price;
      const totalPrice = unitPrice * quantity;

      totalAmount += totalPrice;

      return {
        product_id: databaseProduct.id,
        product_name: databaseProduct.name,
        unit_price: unitPrice,
        quantity: quantity,
        total_price: totalPrice,
      };
    });

    const { data: order, error: orderError } =
      await supabase
        .from("orders")
        .insert({
          customer_email: email,
          total_amount: totalAmount,
          status: "pending",
          payment_status: "unpaid",
        })
        .select("id")
        .single();

    if (orderError || !order) {
      console.error("ORDER ERROR:", orderError);

      return NextResponse.json(
        {
          error:
            orderError?.message ||
            "A rendelés létrehozása sikertelen.",
        },
        { status: 500 }
      );
    }

    const itemsToInsert = orderItems.map((item) => ({
      order_id: order.id,
      ...item,
    }));

    const { error: itemsError } =
      await supabase
        .from("order_items")
        .insert(itemsToInsert);

    if (itemsError) {
      console.error("ORDER ITEMS ERROR:", itemsError);

      await supabase
        .from("orders")
        .delete()
        .eq("id", order.id);

      return NextResponse.json(
        { error: itemsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      totalAmount: totalAmount,
    });
  } catch (error) {
    console.error("ORDER API ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Váratlan hiba történt.",
      },
      { status: 500 }
    );
  }
}