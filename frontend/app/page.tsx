"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="text-2xl font-bold text-blue-600">
            KelanaAI
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#home" className="hover:text-blue-600">
              Home
            </a>
            <a href="#planner" className="hover:text-blue-600">
              Trip Planner
            </a>
            <a href="#features" className="hover:text-blue-600">
              Features
            </a>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Dashboard
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="relative">
        <div className="relative h-[500px] w-full">
          <Image
            src="/hero-destination.jpg"
            alt="Beautiful Indonesian travel destination"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/45" />

          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 lg:px-8">
            <div className="max-w-2xl text-white">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-200">
                AI-Powered Travel Planner
              </p>

              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Your journey,
                <br />
                intelligently planned.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">
                Discover amazing destinations and create personalized
                travel itineraries with the help of KelanaAI.
              </p>

              <a
                href="#planner"
                className="mt-8 inline-flex rounded-full bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Plan My Trip
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Planner */}
      <section id="planner" className="mx-auto -mt-16 max-w-6xl px-6 pb-20">
        <div className="relative z-20 rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Plan your next adventure
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Tell us about your trip and let KelanaAI create your itinerary.
            </p>
          </div>

          <form className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label
                htmlFor="destination"
                className="mb-2 block text-sm font-semibold"
              >
                Destination
              </label>

              <input
                id="destination"
                type="text"
                placeholder="e.g. Bandung"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="budget"
                className="mb-2 block text-sm font-semibold"
              >
                Budget
              </label>

              <input
                id="budget"
                type="number"
                placeholder="e.g. 1500000"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="duration"
                className="mb-2 block text-sm font-semibold"
              >
                Duration
              </label>

              <select
                id="duration"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option>1 Day</option>
                <option>2 Days</option>
                <option>3 Days</option>
                <option>4 Days</option>
                <option>5 Days</option>
                <option>7 Days</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="style"
                className="mb-2 block text-sm font-semibold"
              >
                Travel Style
              </label>

              <select
                id="style"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option>Relaxing</option>
                <option>Adventure</option>
                <option>Culture</option>
                <option>Food & Culinary</option>
              </select>
            </div>

            <div className="md:col-span-2 lg:col-span-4">
              <button
                type="button"
                className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Generate Itinerary
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-6 pb-20 lg:px-8"
      >
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Why KelanaAI?
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Travel planning made simple
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-3xl">🤖</div>
            <h3 className="text-lg font-bold">AI Recommendations</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Get personalized travel recommendations powered by AI.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-3xl">🗺️</div>
            <h3 className="text-lg font-bold">Smart Itinerary</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Organize your destination into a practical daily itinerary.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-3xl">💰</div>
            <h3 className="text-lg font-bold">Budget Friendly</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Plan your journey according to your available budget.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="font-bold text-blue-600">KelanaAI</p>
            <p className="mt-1 text-sm text-slate-500">
              Your intelligent travel companion.
            </p>
          </div>

          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#home" className="hover:text-blue-600">
              Home
            </a>
            <a href="#planner" className="hover:text-blue-600">
              Planner
            </a>
            <a href="#features" className="hover:text-blue-600">
              Features
            </a>
          </div>

          <p className="text-sm text-slate-400">
            © 2026 KelanaAI. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}