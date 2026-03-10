const fs = require('fs');
const Stripe = require('stripe');

const env = fs.readFileSync('.env.local', 'utf8');
const keyMatch = env.match(/STRIPE_SECRET_KEY=(.+)/);
if (!keyMatch) {
    console.error("No STRIPE_SECRET_KEY found in .env.local");
    process.exit(1);
}
const key = keyMatch[1].trim().replace(/['"]/g, '');

const stripe = new Stripe(key);

async function run() {
    try {
        const sessions = await stripe.checkout.sessions.list({ limit: 10 });
        console.log('--- SESSIONS ---');
        console.log(sessions.data.map(s => ({ id: s.id, amt: s.amount_total, status: s.payment_status })));

        const pis = await stripe.paymentIntents.list({ limit: 10 });
        console.log('--- PAYMENT INTENTS ---');
        console.log(pis.data.map(p => ({ id: p.id, amt: p.amount_received, status: p.status })));
    } catch (e) {
        console.error(e.message);
    }
}
run();
