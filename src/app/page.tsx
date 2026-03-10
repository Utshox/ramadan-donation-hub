"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

// Uses actual env var if available, otherwise fallback
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_dummy"
);

export default function Home() {
  const [donationAmount, setDonationAmount] = useState<number | "">("");
  const [donationType, setDonationType] = useState<"one-time" | "monthly">("one-time");
  const [isLoading, setIsLoading] = useState(false);
  const [totalRaised, setTotalRaised] = useState(0);
  const [donorCount, setDonorCount] = useState(0);

  // Zakat Calculator States
  const [savings, setSavings] = useState<number | "">("");
  const [gold, setGold] = useState<number | "">("");
  const [investments, setInvestments] = useState<number | "">("");

  const zakatTotal = ((Number(savings) || 0) + (Number(gold) || 0) + (Number(investments) || 0)) * 0.025;

  // Media Lightbox State
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'video' | 'image', url: string } | null>(null);

  // Carousel
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });
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

      const { id, url, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

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

  // Fetch campaign stats on mount
  useState(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats', { cache: 'no-store' });
        const data = await res.json();
        setTotalRaised(data.totalRaised || 0);
        setDonorCount(data.donorCount || 0);
      } catch (err) {
        console.error("Failed to fetch campaign stats:", err);
      }
    };
    fetchStats();
  });

  const handlePayZakat = () => {
    setDonationAmount(zakatTotal > 0 ? zakatTotal : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

            {/* Header menus removed as requested */}

            <div className="flex items-center gap-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="bg-primary hover:bg-primary-dark text-gray-900 px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40"
              >
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-10 pb-20 lg:pt-16 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-background-light via-background-light/95 to-transparent dark:from-background-dark dark:via-background-dark/95 dark:to-transparent z-10 w-full lg:w-2/3"></div>
            <div className="absolute inset-0">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuG1UpsogjfO1wGMgCJMtNS_rxhxyzPLMP0I1rjVw8rAChKAWKr9jBHXt8647VYqwO6QkBLOR3Njrz_i0M6JG6tYuhXVUhtb6pfqIpCZQQHWoMa9kQ4tQ7JmezrrMGk28-1VokgHFUGQFUNFgfyLvySxF4ZSIaTnsjX-Whk8mTpMPaElty3QiR6iY9nX4BfEReAcRPFx1bIJ8iyKtpau0Aih4AlK-kcQjsgFwOhZqMQZ4tsL9pwz0NlpGIT8djCpPLWOfsrqKZEbs"
                alt="Ramadan Donation Hero Background"
                fill
                priority
                quality={90}
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
          </div>
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 items-start lg:items-center">
              {/* Hero Content */}
              <div className="flex-1 max-w-2xl pt-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/20 text-yellow-700 dark:text-yellow-400 text-xs font-bold uppercase tracking-wider mb-6 border border-accent-gold/30">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                  Ramadan 2026 Appeal
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-6">
                  Multiply Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-primary">Blessings</span> This Ramadan
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed max-w-xl">
                  Join us in providing meals and hope to families in need. Your generosity becomes their sustenance during this holy month of giving.
                </p>

                {/* Progress Bar */}
                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 max-w-xl mb-8">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Raised</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalRaised.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Goal</p>
                      <p className="text-base font-semibold text-gray-700 dark:text-gray-300">$7,000</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 mb-3 overflow-hidden">
                    <div className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min((totalRaised / 7000) * 100, 100)}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{donorCount} Donors</span>
                    <span>{((totalRaised / 7000) * 100).toFixed(1)}% Reached</span>
                  </div>
                </div>

                {/* <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedMedia({ type: "video", url: "https://www.youtube.com/embed/jZSPBbl206o?autoplay=1" })}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors font-medium"
                  >
                    <span className="material-symbols-outlined">play_circle</span>
                    Watch Our Story
                  </button>
                </div> */}
              </div>

              {/* Floating Donation Card */}
              <div className="w-full lg:w-[420px] shrink-0">
                <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl shadow-green-900/10 border border-gray-100 dark:border-gray-800 overflow-hidden relative">
                  <div className="h-2 bg-gradient-to-r from-green-600 via-primary to-green-600"></div>
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Make a Donation</h3>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded uppercase">Secure</span>
                    </div>

                    <div className="flex p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl mb-6">
                      <button
                        onClick={() => setDonationType("one-time")}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${donationType === "one-time" ? "text-gray-900 bg-white dark:bg-primary shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
                        One-time
                      </button>
                      <button
                        onClick={() => setDonationType("monthly")}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${donationType === "monthly" ? "text-gray-900 bg-white dark:bg-primary shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
                        Monthly
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[25, 50, 100, 250].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setDonationAmount(amount)}
                          className={`h-12 border-2 rounded-xl font-bold transition-all focus:outline-none ${donationAmount === amount
                            ? "border-primary bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-primary ring-1 ring-primary"
                            : "border-gray-100 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-200"
                            }`}
                        >
                          ${amount}
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
                          if ([25, 50, 100, 250].includes(Number(donationAmount))) {
                            setDonationAmount("");
                          }
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
                      <span>{isLoading ? "Processing..." : "Donate via Stripe"}</span>
                      {!isLoading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                    </button>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                      Your donation is 100% tax deductible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Zakat Calculator Widget Section */}
        <section className="py-20 bg-white dark:bg-surface-dark border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-background-light dark:bg-background-dark rounded-3xl p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                  <div className="flex items-center gap-2 text-accent-gold mb-4">
                    <span className="material-symbols-outlined">calculate</span>
                    <span className="text-sm font-bold uppercase tracking-wider">Religious Obligation</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Calculate Your Zakat</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                    Not sure how much to give? Use our simple calculator to determine your Zakat amount based on your assets and savings for the year. Purification of wealth brings peace of mind.
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                      <span className="text-gray-800 dark:text-gray-200">2.5% on qualifying wealth</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                      <span className="text-gray-800 dark:text-gray-200">100% Transparency on distribution</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                      <span className="text-gray-800 dark:text-gray-200">Sharia-compliant assessment</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Savings (Cash & Bank)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">$</span>
                        <input
                          type="number"
                          value={savings}
                          onChange={(e) => setSavings(e.target.value ? Number(e.target.value) : "")}
                          className="block w-full pl-8 pr-3 py-2.5 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-background-dark focus:border-primary focus:ring-primary sm:text-sm text-gray-900 dark:text-white"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value of Gold & Silver</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">$</span>
                        <input
                          type="number"
                          value={gold}
                          onChange={(e) => setGold(e.target.value ? Number(e.target.value) : "")}
                          className="block w-full pl-8 pr-3 py-2.5 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-background-dark focus:border-primary focus:ring-primary sm:text-sm text-gray-900 dark:text-white"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Investments & Shares</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">$</span>
                        <input
                          type="number"
                          value={investments}
                          onChange={(e) => setInvestments(e.target.value ? Number(e.target.value) : "")}
                          className="block w-full pl-8 pr-3 py-2.5 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-background-dark focus:border-primary focus:ring-primary sm:text-sm text-gray-900 dark:text-white"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-gray-900 dark:text-white">Total Zakat Due:</span>
                        <span className="text-2xl font-bold text-primary">${zakatTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <button
                        onClick={handlePayZakat}
                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity"
                      >
                        Set Amount & Pay Zakat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stories */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">Stories of Hope</h2>
              <p className="text-lg text-gray-800 dark:text-gray-300">Your contributions create real stories of change. Here are the lives you've touched.</p>
            </div>
            <div className="embla overflow-hidden -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8" ref={emblaRef}>
              <div className="embla__container flex touch-pan-y">
                {[
                  {
                    location: "Global Update",
                    title: "Field Deployment",
                    img: "/media/story-vid.mp4",
                    type: "video",
                    quote: "When you give, distance disappears. You are standing right beside us in these villages, handing dignity and relief to families who have waited so long for a moment of ease.",
                    personName: "Field Team",
                    personRole: "Global Operations",
                    personImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp1bMyRjpsGtgtCjyn5scxoXbumvQGIHoPJSSjcRwnppVDHC5Vpu2J5wpyMjYPqyNr1nu3pjtTWMRAxYVHCVUGWalrF9rcqIEnaAOdkfQOA3C82Xr326j2hMOLDgpMSWovM5B3tnqTXobqRmGMNysAyr8AMBreB-tjCduAnbXiy_i-xXLSbXAWg3rr_n0S31pslHoLoLhjcPSqtaKyk1_LZXs5Pizt7pKz3H6T_Ga5OtHhH9Itj3StIDfaGZYRkepRX_ebtNHNuYM"
                  },
                  {
                    location: "Water & Sustenance",
                    title: "A Father's Relief",
                    img: "/media/africa 0.png",
                    type: "image",
                    quote: "Water is life. Clean water is hope. Because of your generosity, these children no longer have to fear what they drink. You have given this community a foundation to thrive.",
                    personName: "Community Leader",
                    personRole: "Local Partner",
                    personImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpXsEi6YKWH0k16fkCQT1l1uPwdgPA-Fs0nKH4XMK9Wt9Hj9Rf__VY2HsXXbIe653crpCpJHVDnSW05_LGQGQigRsr5zuI70udbmeFTJkwr7sbGG1vNVy5sUa_zBc0kpkzBvojLQKf3eWLFgw7IStlC6lAfMnrllZOprwStqYAr4f3BK_YhY7zogw07obDZ9TYt2ClXieasI5l95IkGnjQ9b1XvMt9kaozeBCYrfvCyWCSsP5XxGO_S_F1sq4wcfAH-pUYoL6RrOU"
                  },
                  {
                    location: "Distribution Center",
                    title: "Nourishing Meals",
                    img: "/media/africa 1.png",
                    type: "image",
                    quote: "There is no sight more beautiful than a community breaking fast together in peace. Watching these children receive warm, hearty meals is witnessing the true spirit of giving in action.",
                    personName: "Volunteer Update",
                    personRole: "Logistics Hub",
                    personImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAG_r2gU8na3r8MnAMQC0L-cmrGvt9fEGWk0i1IBDMSfMawx3kE0At7eek_t55gGGS3ZiNb_lqeJz_Tfh05aa_W9O-BKnGEMPc98Caw9pbzi1Y7nQleC7HfZSC3ryBXVuTyQBkkQWhjHICqk3H7VK3-9e66rhHygNQmKq2QlCbbftiZKepZWrxW3rg8OPPNBo9ppar_lBrfAJ5pCUB5jMVdyZipc6j8kW8ey2iugSfpWF7dEQU_Wr9tMBo84xq6iKtY3IpmusgZIuU"
                  },
                  {
                    location: "School Outreach",
                    title: "Smiles of Hope",
                    img: "/media/africa 2.png",
                    type: "image",
                    quote: "The weight on their shoulders is no longer a burden of struggle, but a harvest of your kindness. They can just be kids now. Their radiant smiles are quiet prayers of thanks sent directly to you.",
                    personName: "Amina R.",
                    personRole: "Teacher",
                    personImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpXsEi6YKWH0k16fkCQT1l1uPwdgPA-Fs0nKH4XMK9Wt9Hj9Rf__VY2HsXXbIe653crpCpJHVDnSW05_LGQGQigRsr5zuI70udbmeFTJkwr7sbGG1vNVy5sUa_zBc0kpkzBvojLQKf3eWLFgw7IStlC6lAfMnrllZOprwStqYAr4f3BK_YhY7zogw07obDZ9TYt2ClXieasI5l95IkGnjQ9b1XvMt9kaozeBCYrfvCyWCSsP5XxGO_S_F1sq4wcfAH-pUYoL6RrOU"
                  },
                  {
                    location: "Community Outreach",
                    title: "A Full Plate",
                    img: "/media/africa 3.png",
                    type: "image",
                    quote: "Look into their eyes and see the profound impact of your mercy. Your generosity reached these children when they needed it most, reminding them that they are loved and never forgotten.",
                    personName: "Dr. Youssef",
                    personRole: "Medical Coordinator",
                    personImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp1bMyRjpsGtgtCjyn5scxoXbumvQGIHoPJSSjcRwnppVDHC5Vpu2J5wpyMjYPqyNr1nu3pjtTWMRAxYVHCVUGWalrF9rcqIEnaAOdkfQOA3C82Xr326j2hMOLDgpMSWovM5B3tnqTXobqRmGMNysAyr8AMBreB-tjCduAnbXiy_i-xXLSbXAWg3rr_n0S31pslHoLoLhjcPSqtaKyk1_LZXs5Pizt7pKz3H6T_Ga5OtHhH9Itj3StIDfaGZYRkepRX_ebtNHNuYM"
                  }
                ].map((story, i) => (
                  <div key={i} className="embla__slide flex-[0_0_85%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pr-6 pb-8 pt-4">
                    <div className="group h-full bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col hover:-translate-y-2">
                      <div
                        className="h-64 overflow-hidden relative cursor-pointer"
                        onClick={() => setSelectedMedia({ type: story.type as any, url: story.img })}
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 z-10 transition-colors flex items-center justify-center">
                          <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 text-4xl transition-all drop-shadow-xl scale-50 group-hover:scale-110 duration-300 bg-primary/80 p-3 rounded-full">
                            {story.type === 'video' ? 'play_arrow' : 'zoom_in'}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none"></div>
                        {story.type === 'video' ? (
                          <video
                            src={story.img}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                            muted loop autoPlay playsInline
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
                          "{story.quote}"
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

        {/* Social Share / CTA */}
        <section className="bg-surface-dark py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M50 0 L100 50 L50 100 L0 50 Z\\' fill=\\'%23ffffff\\' /%3E%3C/svg%3E')", backgroundSize: "60px 60px" }}></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <span className="inline-block p-3 rounded-full bg-white/10 text-primary mb-6">
              <span className="material-symbols-outlined text-3xl">share</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Spread the Barakah</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Multiply your impact by sharing this campaign with your friends and family. Every donation generated from your share counts as a good deed for you too.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="flex items-center gap-3 bg-[#1877F2] text-white px-6 py-3 rounded-full font-bold hover:brightness-110 transition-all">
                <span className="material-symbols-outlined text-xl">thumb_up</span>
                Facebook
              </button>
              <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="flex items-center gap-3 bg-[#000000] text-white px-6 py-3 rounded-full font-bold hover:brightness-110 transition-all">
                <strong className="text-lg font-black leading-none pb-0.5">X</strong>
                Post
              </button>
              <button
                onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold hover:brightness-110 transition-all">
                <span className="material-symbols-outlined text-xl">chat</span>
                WhatsApp
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
                className="flex items-center gap-3 bg-white/10 text-white px-6 py-3 rounded-full font-bold hover:bg-white/20 transition-all backdrop-blur-sm">
                <span className="material-symbols-outlined text-xl">content_copy</span>
                Copy Link
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Minimal */}
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
                Dedicated to providing essential relief, food, and water to communities in need, especially during the blessed month of Ramadan.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700/50 self-start inline-block">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Legal Information</p>
                <p className="font-semibold text-gray-900 dark:text-gray-200 mb-2">Give and go Relief is doing business under <a href="https://givegoglobal.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-all">Give and go Global</a></p>
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
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">© 2026 Give and Go Global. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
            </div>
            <div className="flex gap-4">
              <span className="text-gray-400 hover:text-primary transition-colors cursor-pointer material-symbols-outlined text-xl">camera_alt</span>
              <span className="text-gray-400 hover:text-primary transition-colors cursor-pointer font-black text-xl leading-none pb-0.5">X</span>
              <span className="text-gray-400 hover:text-primary transition-colors cursor-pointer material-symbols-outlined text-xl">play_circle</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal for Video & Photos */}
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
                <iframe
                  className="w-full h-full"
                  src={selectedMedia.url}
                  title="Video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
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
