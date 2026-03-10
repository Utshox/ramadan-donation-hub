import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
    apiVersion: "2026-02-25.clover" as any,
});

export async function GET() {
    try {
        // Fetch completed checkout sessions
        const sessions = await stripe.checkout.sessions.list({
            limit: 100, // adjust as needed
            expand: ['data.line_items'],
        });

        let totalRaised = 0;
        let donorCount = 0;

        sessions.data.forEach(session => {
            if (session.payment_status === 'paid') {
                totalRaised += (session.amount_total || 0) / 100; // Convert cents to dollars
                donorCount++;
            }
        });

        return NextResponse.json({ totalRaised, donorCount });
    } catch (error: any) {
        console.error("Stripe Stats Error:", error);
        return NextResponse.json({ totalRaised: 0, donorCount: 0, error: error.message }, { status: 500 });
    }
}
