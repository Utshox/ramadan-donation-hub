import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// We use a dummy key if not provided so the build doesn't fail, 
// but it will fail at runtime if a real key isn't provided by the user.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
    apiVersion: "2026-02-25.clover" as any,
});

export async function POST(req: NextRequest) {
    try {
        const { amount, type } = await req.json();

        if (!amount || isNaN(amount) || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        const origin = req.headers.get("origin") || "http://localhost:3000";

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Give and Go Relief Donation",
                            description: "Thank you for your generous contribution.",
                            images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuAuG1UpsogjfO1wGMgCJMtNS_rxhxyzPLMP0I1rjVw8rAChKAWKr9jBHXt8647VYqwO6QkBLOR3Njrz_i0M6JG6tYuhXVUhtb6pfqIpCZQQHWoMa9kQ4tQ7JmezrrMGk28-1VokgHFUGQFUNFgfyLvySxF4ZSIaTnsjX-Whk8mTpMPaElty3QiR6iY9nX4BfEReAcRPFx1bIJ8iyKtpau0Aih4AlK-kcQjsgFwOhZqMQZ4tsL9pwz0NlpGIT8djCpPLWOfsrqKZEbs"],
                        },
                        unit_amount: Math.round(amount * 100), // Stripe uses cents
                        ...(type === "monthly" ? { recurring: { interval: "month" } as any } : {}),
                    },
                    quantity: 1,
                },
            ],
            mode: type === "monthly" ? "subscription" : "payment",
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cancel`,
        });

        return NextResponse.json({ id: session.id, url: session.url });
    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
