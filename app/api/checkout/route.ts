import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductById } from "@/lib/products";
import { CheckoutRequestBody } from "@/types/checkout";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is missing.");
}

const stripe = new Stripe(stripeSecretKey);

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as CheckoutRequestBody;
        const { items, shippingData } = body;

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "Panier vide ou invalide." },
                { status: 400 }
            );
        }

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

        for (const item of items) {
            if (!item.productId || !item.quantity || item.quantity < 1) {
                return NextResponse.json(
                    { error: "Un article du panier est invalide." },
                    { status: 400 }
                );
            }

            const product = await getProductById(item.productId);

            if (!product) {
                return NextResponse.json(
                    { error: `Produit introuvable : ${item.productId}` },
                    { status: 404 }
                );
            }

            if (product.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Stock insuffisant pour ${product.name}.` },
                    { status: 400 }
                );
            }

            lineItems.push({
                quantity: item.quantity,
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: product.name,
                        description: product.description,
                    },
                    unit_amount: Math.round(product.price * 100),
                },
            });
        }

        const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL;

        if (!origin) {
            return NextResponse.json(
                { error: "Origine de la requête introuvable." },
                { status: 400 }
            );
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: lineItems,
            metadata: {
                firstName: shippingData?.firstName ?? "",
                lastName: shippingData?.lastName ?? "",
                email: shippingData?.email ?? "",
                address: shippingData?.address ?? "",
                city: shippingData?.city ?? "",
                postalCode: shippingData?.postalCode ?? "",
                country: shippingData?.country ?? "",
            },
            success_url: `${origin}/success`,
            cancel_url: `${origin}/cancel`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unknown checkout error";

        console.error("Stripe checkout error:", { message });

        return NextResponse.json(
            { error: "Erreur lors de la création de la session Stripe." },
            { status: 500 }
        );
    }
}