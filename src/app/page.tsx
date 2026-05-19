"use client";

import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_dummy"
);

const GOAL = 2000;
const EID_AL_ADHA_DATE = new Date("2026-05-26T00:00:00Z");

const QURBANI_OPTIONS = [
  {
    key: "sheep",
    animal: "Sheep / Goat",
    shares: "1 share",
    price: 250,
    img: "/eid/sheep.png",
    tagline: "Feeds one family for days",
    detail: "A complete sacrifice — perfect for one household giving Qurbani.",
    isCustom: false,
  },
  {
    key: "cow",
    animal: "Cow",
    shares: "Full share",
    price: 650,
    img: "/eid/cow.png",
    tagline: "Feed an entire community",
    detail: "Provide a complete cow Qurbani — fresh meat distributed to dozens of families across partner villages in Bangladesh and Africa.",
    isCustom: false,
  },
  {
    key: "custom",
    animal: "Custom Amount",
    shares: "Any amount helps",
    price: 0,
    img: "/eid/cta-african.png",
    tagline: "Give what your heart can",
    detail: "Choose your own gift toward this Eid's Qurbani. Every contribution joins others to provide fresh meat for families in Bangladesh and Africa.",
    isCustom: true,
  },
] as const;

const STORIES = [
  {
    location: "Bangladesh",
    title: "A Grandfather's Joy",
    img: "/eid/hero.png",
    type: "image" as const,
    quote:
      "For the first time in years, I held my grandson knowing there was meat on our table. You gave us back the dignity of celebrating Eid as a family.",
    personName: "Abdul Karim",
    personRole: "Recipient, Khulna",
    personImg: "/eid/hero.png",
  },
  {
    location: "Distribution Day",
    title: "Hope in Their Hands",
    img: "/eid/distribution.png",
    type: "image" as const,
    quote:
      "I came with my children expecting nothing and left with enough meat to feed us for a week. May Allah reward every donor — you remembered us.",
    personName: "Rahima Begum",
    personRole: "Mother of three",
    personImg: "/eid/distribution.png",
  },
  {
    location: "Eid Morning",
    title: "The First Shared Meal",
    img: "/eid/children.png",
    type: "image" as const,
    quote:
      "We laughed until our cheeks hurt. The little ones had never tasted Eid like this. Your sacrifice made theirs the happiest day of the year.",
    personName: "Volunteer Update",
    personRole: "Field Team",
    personImg: "/eid/children.png",
  },
  {
    location: "Field Update",
    title: "Beside You in Spirit",
    img: "/media/story-vid.mp4",
    type: "video" as const,
    quote:
      "When you give, distance disappears. You are standing right beside us, handing dignity and warm meals to families who waited a whole year for this moment.",
    personName: "Field Team",
    personRole: "Global Operations",
    personImg: "/eid/distribution.png",
  },
  {
    location: "Bangladesh",
    title: "Around One Plate",
    img: "/eid/family.png",
    type: "image" as const,
    quote:
      "Grandmother cried when she saw the platter. She hadn't eaten meat in months. Tonight we are together, full, and grateful — because of you.",
    personName: "Amina R.",
    personRole: "Recipient family",
    personImg: "/eid/family.png",
  },
  {
    location: "Africa",
    title: "An Eid We Won't Forget",
    img: "/eid/cta-african.png",
    type: "image" as const,
    quote:
      "We have not eaten like this in a year. The children ran around the courtyard laughing — they will remember this Eid for the rest of their lives. May Allah bless every hand that gave.",
    personName: "Ibrahim A.",
    personRole: "Recipient, East Africa",
    personImg: "/eid/cta-african.png",
  },
];

const FAQS = [
  {
    q: "When is Qurbani due in 2026?",
    a: "Qurbani is performed on the days of Eid al-Adha (10th–13th of Dhul Hijjah). In 2026 this falls on approximately May 26–29. Donate before Eid morning so your share is processed and distributed in time.",
  },
  {
    q: "Who is obligated to give Qurbani?",
    a: "Every adult Muslim of sound mind who possesses wealth above the nisab threshold (after essential needs) on the days of Eid is obligated to perform Qurbani once per year on behalf of themselves.",
  },
  {
    q: "Can I split a cow share with family?",
    a: "Yes. A cow or camel counts as 7 shares — you and up to six others can each take one share. Each $200 share counts as one full Qurbani for one person.",
  },
  {
    q: "Where is the meat distributed?",
    a: "Across two regions: rural Bangladesh — including Khulna, Sylhet, and Chittagong — and Muslim communities across Sub-Saharan Africa, East Africa, and West Africa. The meat is hand-delivered fresh on the days of Eid.",
  },
  {
    q: "Is my donation tax-deductible?",
    a: "Yes. Give and Go Relief operates under Give and Go Global, a registered 501(c)(3) non-profit. You will receive a tax receipt by email after your donation is processed.",
  },
];

function useCountdown(target: Date) {
  // null on the server and on the very first client render, so SSR and
  // hydration markup match. Real values only appear after mount.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return { days: 0, hours: 0, mins: 0, secs: 0, ready: false };
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
    ready: true,
  };
}

export default function Home() {
  const [donationAmount, setDonationAmount] = useState<number | "">("");
  const [donationType, setDonationType] = useState<"one-time" | "monthly">("one-time");
  const [isLoading, setIsLoading] = useState(false);
  // Eid al-Adha campaign starts fresh — totals always display as 0.
  const totalRaised = 0;
  const donorCount = 0;

  const [selectedMedia, setSelectedMedia] = useState<{ type: "video" | "image"; url: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [qurbaniModal, setQurbaniModal] = useState<typeof QURBANI_OPTIONS[number] | null>(null);
  const [qurbaniLoading, setQurbaniLoading] = useState(false);
  const [qurbaniCustomAmount, setQurbaniCustomAmount] = useState<string>("100");
  const qurbaniCustomPresets = [50, 100, 250, 500];

  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });
  const countdown = useCountdown(EID_AL_ADHA_DATE);

  const presetAmounts = useMemo(
    () => [
      { amount: 50, label: "Partial share" },
      { amount: 250, label: "1 Sheep / Goat" },
      { amount: 650, label: "1 Cow share" },
    ],
    []
  );

  const handleCheckout = async () => {
    if (!donationAmount || Number(donationAmount) <= 0) {
      alert("Please select or enter a valid donation amount.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(donationAmount), type: donationType }),
      });
      const { url, error } = await response.json();
      if (error) throw new Error(error);
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No redirect URL returned from Stripe.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Checkout failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQurbaniDonate = async () => {
    if (!qurbaniModal) return;
    const amount = qurbaniModal.isCustom ? Number(qurbaniCustomAmount) : qurbaniModal.price;
    if (!amount || amount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }
    setQurbaniLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, type: "one-time" }),
      });
      const { url, error } = await response.json();
      if (error) throw new Error(error);
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No redirect URL returned from Stripe.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Checkout failed: " + err.message);
    } finally {
      setQurbaniLoading(false);
    }
  };

  const progressPct = Math.min((totalRaised / GOAL) * 100, 100);

  return (
    <>
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-background-dark/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-full text-green-700 dark:text-green-400">
                <span className="material-symbols-outlined text-2xl">mosque</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Give and Go<span className="text-green-600 dark:text-primary">Relief</span>
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              <a
                href="/"
                className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors"
              >
                Eid al-Adha
              </a>
              <a
                href="/ramadan"
                className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
              >
                Ramadan
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="bg-primary hover:bg-primary-dark text-gray-900 px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40"
              >
                Give Qurbani
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero */}
        <section className="relative pt-10 pb-20 lg:pt-16 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-background-light via-background-light/95 to-background-light/40 dark:from-background-dark dark:via-background-dark/95 dark:to-background-dark/40 z-10"></div>
            <div className="absolute inset-0">
              <Image
                src="/eid/hero.png"
                alt="A grandfather embracing his grandchild after receiving Qurbani meat in rural Bangladesh"
                fill
                priority
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
          </div>

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 items-start lg:items-center">
              <div className="flex-1 max-w-2xl pt-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/20 text-yellow-700 dark:text-yellow-400 text-xs font-bold uppercase tracking-wider mb-6 border border-accent-gold/30">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                  Eid al-Adha 2026 · Qurbani Appeal
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.05] mb-6">
                  This Eid, be the reason a family <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-primary">smiles</span>.
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed max-w-xl">
                  Fulfill your Qurbani. Place fresh meat on the table of a family in Bangladesh and across Africa — and let them taste the joy of Eid alongside you.
                </p>

                {/* Countdown */}
                <div className="grid grid-cols-4 gap-3 max-w-md mb-8">
                  {[
                    { v: countdown.days, l: "Days" },
                    { v: countdown.hours, l: "Hours" },
                    { v: countdown.mins, l: "Mins" },
                    { v: countdown.secs, l: "Secs" },
                  ].map((c) => (
                    <div key={c.l} className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur rounded-xl p-3 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
                      <div className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tabular-nums">
                        {countdown.ready ? String(c.v).padStart(2, "0") : "--"}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 mt-1">{c.l}</div>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 max-w-xl mb-2">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Raised</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalRaised.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Goal</p>
                      <p className="text-base font-semibold text-gray-700 dark:text-gray-300">${GOAL.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 mb-3 overflow-hidden">
                    <div className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPct}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{donorCount} donors so far</span>
                    <span>{progressPct.toFixed(1)}% reached</span>
                  </div>
                </div>
              </div>

              {/* Donation card */}
              <div className="w-full lg:w-[420px] shrink-0">
                <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl shadow-green-900/10 border border-gray-100 dark:border-gray-800 overflow-hidden relative">
                  <div className="h-2 bg-gradient-to-r from-green-600 via-primary to-green-600"></div>
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Give Qurbani</h3>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded uppercase">Secure</span>
                    </div>

                    <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40">
                      <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-base">schedule</span>
                      <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                        Qurbani must be given before Eid prayers — only {countdown.days} day{countdown.days === 1 ? "" : "s"} left.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {presetAmounts.map(({ amount, label }) => (
                        <button
                          key={amount}
                          onClick={() => setDonationAmount(amount)}
                          className={`flex flex-col items-center justify-center py-2.5 border-2 rounded-xl font-bold transition-all focus:outline-none ${donationAmount === amount
                            ? "border-primary bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-primary ring-1 ring-primary"
                            : "border-gray-100 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-200"
                            }`}
                        >
                          <span className="text-base leading-tight">${amount}</span>
                          <span className="text-[10px] font-medium opacity-70 leading-tight mt-0.5">{label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="relative mb-6">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-400 font-bold">$</span>
                      </div>
                      <input
                        type="number"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value ? Number(e.target.value) : "")}
                        onFocus={() => {
                          if (presetAmounts.some((p) => p.amount === Number(donationAmount))) setDonationAmount("");
                        }}
                        className="block w-full pl-8 pr-12 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
                        placeholder="Custom Amount"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-xs font-medium text-gray-400">USD</span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={isLoading}
                      className="w-full bg-primary hover:bg-primary-dark text-gray-900 font-bold py-4 px-6 rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all flex items-center justify-center gap-2 group mb-4 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      <span>{isLoading ? "Processing..." : donationAmount ? `Give Qurbani — $${Number(donationAmount).toLocaleString()}` : "Give Qurbani"}</span>
                      {!isLoading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                    </button>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                      Your donation is 100% tax-deductible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Qurbani Share Selector */}
        <section className="py-20 bg-white dark:bg-surface-dark border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="flex items-center justify-center gap-2 text-accent-gold mb-3">
                <span className="material-symbols-outlined">volunteer_activism</span>
                <span className="text-sm font-bold uppercase tracking-wider">Choose Your Qurbani</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">A sacrifice that travels further than you can.</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Every share is hand-delivered as fresh meat to a family in Bangladesh and across Africa. Pick what fits your heart and your means.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {QURBANI_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setQurbaniModal(opt)}
                  className="group text-left bg-background-light dark:bg-background-dark rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary hover:-translate-y-1 transition-all shadow-sm hover:shadow-2xl flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={opt.img}
                      alt={opt.animal}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                      className="group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                    <div className="absolute bottom-3 left-4 text-white">
                      <p className="text-xs font-bold uppercase tracking-widest text-primary drop-shadow">{opt.shares}</p>
                      <h3 className="text-2xl font-bold drop-shadow">{opt.animal}</h3>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-baseline gap-2 mb-2">
                      {opt.isCustom ? (
                        <span className="text-3xl font-black text-gray-900 dark:text-white">You choose</span>
                      ) : (
                        <>
                          <span className="text-3xl font-black text-gray-900 dark:text-white">${opt.price.toLocaleString()}</span>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">/ share</span>
                        </>
                      )}
                    </div>
                    <p className="text-base font-semibold text-primary mb-2">{opt.tagline}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{opt.detail}</p>
                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      Give this share
                      <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* The 10 Blessed Days */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 text-accent-gold mb-3">
              <span className="material-symbols-outlined">auto_awesome</span>
              <span className="text-sm font-bold uppercase tracking-wider">The 10 Blessed Days</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              The most beloved days to Allah.
            </h2>
            <blockquote className="text-lg md:text-xl text-gray-700 dark:text-gray-300 italic leading-relaxed mb-6 max-w-2xl mx-auto">
              &ldquo;There are no days during which righteous deeds are more beloved to Allah than these ten days.&rdquo;
            </blockquote>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-10">— Prophet Muhammad ﷺ (Bukhari)</p>
            <div className="grid sm:grid-cols-3 gap-4 text-left">
              <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <div className="text-2xl mb-2">🌙</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Dhul Hijjah 1–9</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fast, give charity, and increase remembrance — every deed is multiplied.</p>
              </div>
              <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <div className="text-2xl mb-2">☀️</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Day of Arafah</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">A single fast on this day expiates the sins of the year before and after.</p>
              </div>
              <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <div className="text-2xl mb-2">🐑</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Eid al-Adha</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Offer Qurbani and feed the poor — the sacrifice that follows the Sunnah of Ibrahim ؑ.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Distribution */}
        <section className="py-20 bg-white dark:bg-surface-dark border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/eid/distribution.png"
                  alt="Volunteers distributing Qurbani meat to families in rural Bangladesh"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 text-accent-gold mb-3">
                  <span className="material-symbols-outlined">redeem</span>
                  <span className="text-sm font-bold uppercase tracking-wider">Where Your Qurbani Goes</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Distributed the way the Prophet ﷺ taught us.
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                  Every Qurbani share is divided into three parts and delivered fresh on the days of Eid — never frozen, never delayed.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    { pct: "1/3", title: "For your family", body: "Kept for your own household — the Sunnah of celebrating with what you offer." },
                    { pct: "1/3", title: "For relatives & neighbors", body: "Shared with kin and the community around the recipient." },
                    { pct: "1/3", title: "For families in need", body: "Hand-delivered to the poorest households in our distribution villages." },
                  ].map((row) => (
                    <div key={row.title} className="flex gap-4">
                      <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary/15 text-green-700 dark:text-primary font-black flex items-center justify-center text-lg">
                        {row.pct}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">{row.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{row.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Communities served</p>
                  <div className="flex flex-wrap gap-2">
                    {["Bangladesh — Khulna", "Bangladesh — Sylhet", "Bangladesh — Chittagong", "Sub-Saharan Africa", "East Africa", "West Africa"].map((tag) => (
                      <span key={tag} className="px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-primary text-xs font-semibold border border-green-200 dark:border-green-800/40">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stories of Hope */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">Stories of Eid Joy</h2>
              <p className="text-lg text-gray-800 dark:text-gray-300">
                Behind every share is a face, a table, a moment of laughter you helped create.
              </p>
            </div>
            <div className="embla overflow-hidden -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8" ref={emblaRef}>
              <div className="embla__container flex touch-pan-y">
                {STORIES.map((story, i) => (
                  <div key={i} className="embla__slide flex-[0_0_85%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pr-6 pb-8 pt-4">
                    <div className="group h-full bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col hover:-translate-y-2">
                      <div
                        className="h-64 overflow-hidden relative cursor-pointer"
                        onClick={() => setSelectedMedia({ type: story.type, url: story.img })}
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 z-10 transition-colors flex items-center justify-center">
                          <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 text-4xl transition-all drop-shadow-xl scale-50 group-hover:scale-110 duration-300 bg-primary/80 p-3 rounded-full">
                            {story.type === "video" ? "play_arrow" : "zoom_in"}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none"></div>
                        {story.type === "video" ? (
                          <video
                            src={story.img}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                            muted
                            loop
                            autoPlay
                            playsInline
                          />
                        ) : (
                          <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-700">
                            <Image
                              src={story.img}
                              alt={story.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              style={{ objectFit: "cover", objectPosition: "center" }}
                            />
                          </div>
                        )}
                        <div className="absolute bottom-4 left-4 z-20 text-white pointer-events-none">
                          <p className="text-xs font-black uppercase tracking-[0.2em] mb-1 text-primary drop-shadow-md">{story.location}</p>
                          <h3 className="text-xl font-bold drop-shadow-md">{story.title}</h3>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <blockquote className="text-gray-700 dark:text-gray-300 italic mb-6 flex-1 text-sm leading-relaxed">
                          &ldquo;{story.quote}&rdquo;
                        </blockquote>
                        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/30 shrink-0 bg-gray-200">
                            <Image src={story.personImg} alt={story.personName} fill sizes="40px" style={{ objectFit: "cover" }} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{story.personName}</p>
                            <p className="text-xs font-semibold text-primary">{story.personRole}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white dark:bg-surface-dark border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 text-accent-gold mb-3">
                <span className="material-symbols-outlined">help</span>
                <span className="text-sm font-bold uppercase tracking-wider">Frequently Asked</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Your questions, answered.</h2>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => {
                const open = openFaq === i;
                return (
                  <div key={i} className="bg-background-light dark:bg-background-dark rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="font-bold text-gray-900 dark:text-white">{faq.q}</span>
                      <span className={`material-symbols-outlined text-primary transition-transform shrink-0 ${open ? "rotate-180" : ""}`}>
                        expand_more
                      </span>
                    </button>
                    {open && (
                      <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/eid/cta-african.png"
              alt="An African Muslim family sharing Eid al-Adha together"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
          </div>
          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              One sacrifice. <span className="text-primary">Countless smiles.</span>
            </h2>
            <p className="text-lg text-gray-200 mb-10 max-w-xl mx-auto">
              The window is small — only the four days of Eid. Lock in your Qurbani now and travel with us, in spirit, to a family that is waiting.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-gray-900 font-bold py-4 px-8 rounded-full shadow-2xl shadow-green-500/30 transition-all"
            >
              Give Your Qurbani
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* Spread the Barakah */}
        <section className="bg-surface-dark py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M50 0 L100 50 L50 100 L0 50 Z\\' fill=\\'%23ffffff\\' /%3E%3C/svg%3E')", backgroundSize: "60px 60px" }}></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <span className="inline-block p-3 rounded-full bg-white/10 text-primary mb-6">
              <span className="material-symbols-outlined text-3xl">share</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Spread the Barakah</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Every share you spark counts as your reward. Tell someone about this campaign — be the cause of another family&apos;s Eid.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank")}
                className="flex items-center gap-3 bg-[#1877F2] text-white px-6 py-3 rounded-full font-bold hover:brightness-110 transition-all"
              >
                <span className="material-symbols-outlined text-xl">thumb_up</span>
                Facebook
              </button>
              <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, "_blank")}
                className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-full font-bold hover:brightness-110 transition-all"
              >
                <strong className="text-lg font-black leading-none pb-0.5">X</strong>
                Post
              </button>
              <button
                onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`, "_blank")}
                className="flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold hover:brightness-110 transition-all"
              >
                <span className="material-symbols-outlined text-xl">chat</span>
                WhatsApp
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
                className="flex items-center gap-3 bg-white/10 text-white px-6 py-3 rounded-full font-bold hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                <span className="material-symbols-outlined text-xl">content_copy</span>
                Copy Link
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800 text-sm">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-primary/20 rounded-full text-green-700 dark:text-green-400">
                  <span className="material-symbols-outlined">mosque</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">Give and Go<span className="text-green-600 dark:text-primary">Relief</span></span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
                Dedicated to providing essential relief, food, and water to communities in need across Bangladesh and Africa — especially during the blessed days of Eid al-Adha.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700/50 self-start inline-block">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Legal Information</p>
                <p className="font-semibold text-gray-900 dark:text-gray-200 mb-2">
                  Give and go Relief is doing business under{" "}
                  <a href="https://givegoglobal.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-all">
                    Give and go Global
                  </a>
                </p>
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800/30 w-fit">
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span className="text-xs font-bold uppercase tracking-wide">Registered 501(c)(3) Non-Profit</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-xs">Contact Us</h4>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">mail</span>
                  <a href="mailto:info@givegoglobal.org" className="hover:text-primary transition-colors">info@givegoglobal.org</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">phone</span>
                  <a href="tel:+15103994743" className="hover:text-primary transition-colors">+510-399-4743</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">history</span>
                  <a href="/ramadan" className="hover:text-primary transition-colors">View Ramadan 2026 campaign</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">© 2026 Give and Go Global. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Qurbani Confirm Modal */}
      {qurbaniModal && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => !qurbaniLoading && setQurbaniModal(null)}
        >
          <div
            className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-2 bg-gradient-to-r from-green-600 via-primary to-green-600"></div>
            <button
              type="button"
              onClick={() => !qurbaniLoading && setQurbaniModal(null)}
              disabled={qurbaniLoading}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="relative h-44">
              <Image
                src={qurbaniModal.img}
                alt={qurbaniModal.animal}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                style={{ objectFit: "cover" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-3 left-5 text-white">
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{qurbaniModal.shares}</p>
                <h3 className="text-2xl font-bold drop-shadow">{qurbaniModal.isCustom ? "Qurbani Contribution" : `${qurbaniModal.animal} Qurbani`}</h3>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">{qurbaniModal.detail}</p>

              {qurbaniModal.isCustom ? (
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Your contribution</label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {qurbaniCustomPresets.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setQurbaniCustomAmount(String(amt))}
                        className={`h-11 border-2 rounded-xl font-bold text-sm transition-all focus:outline-none ${Number(qurbaniCustomAmount) === amt
                          ? "bg-primary border-primary text-gray-900"
                          : "bg-background-light dark:bg-background-dark border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary"}`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold">$</span>
                    <input
                      type="number"
                      min={1}
                      inputMode="numeric"
                      value={qurbaniCustomAmount}
                      onChange={(e) => setQurbaniCustomAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full h-12 pl-8 pr-4 bg-background-light dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-900 dark:text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-background-light dark:bg-background-dark rounded-xl p-4 mb-5 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">${qurbaniModal.price.toLocaleString()}</span>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">USD</span>
                  </div>
                </div>
              )}

              <ul className="space-y-2 mb-6 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                  Distributed fresh on the days of Eid
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                  100% tax-deductible — receipt by email
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                  Secure checkout via Stripe
                </li>
              </ul>

              <button
                onClick={handleQurbaniDonate}
                disabled={qurbaniLoading}
                className="w-full bg-primary hover:bg-primary-dark text-gray-900 font-bold py-4 px-6 rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed"
              >
                <span>{qurbaniLoading ? "Processing..." : `Donate $${(qurbaniModal.isCustom ? Number(qurbaniCustomAmount) || 0 : qurbaniModal.price).toLocaleString()}`}</span>
                {!qurbaniLoading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
              </button>
              <button
                type="button"
                onClick={() => !qurbaniLoading && setQurbaniModal(null)}
                disabled={qurbaniLoading}
                className="w-full mt-2 text-sm font-semibold text-gray-500 dark:text-gray-400 py-2 hover:text-gray-700 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-12 right-0 text-white hover:text-primary transition-colors focus:outline-none"
              onClick={() => setSelectedMedia(null)}
            >
              <span className="material-symbols-outlined text-4xl shadow-sm">close</span>
            </button>
            {selectedMedia.type === "video" ? (
              <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                {selectedMedia.url.endsWith(".mp4") ? (
                  <video src={selectedMedia.url} className="w-full h-full" controls autoPlay />
                ) : (
                  <iframe
                    className="w-full h-full"
                    src={selectedMedia.url}
                    title="Video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            ) : (
              <div className="relative flex justify-center items-center w-full max-h-[85vh] h-[85vh]">
                <Image
                  src={selectedMedia.url}
                  alt="Expanded view"
                  fill
                  sizes="100vw"
                  style={{ objectFit: "contain" }}
                  className="rounded-2xl shadow-2xl ring-1 ring-white/10"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
