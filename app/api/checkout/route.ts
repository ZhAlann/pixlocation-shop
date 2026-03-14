import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const items = body.items;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "Panier vide ou invalide." },
                { status: 400 }
            );
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: items.map((item: any) => ({
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: item.product.name,
                        description: item.product.description,
                    },
                    unit_amount: Math.round(item.product.price * 100),
                },
                quantity: item.quantity,
            })),
            success_url: `${req.headers.get("origin")}/success`,
            cancel_url: `${req.headers.get("origin")}/cancel`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Erreur Stripe checkout:", error);

        return NextResponse.json(
            { error: "Erreur lors de la création de la session Stripe." },
            { status: 500 }
        );
    }
}