"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Trip = {
  id: number;
  destination: string;
  country: string;
  days: number;
  budget: number;
  currency: string;
  travel_month: string;
  category: string;
  style: string;
  daily_budget: number;
  season: string;
};

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("HALAMAN DETAIL DIJALANKAN");

    const fetchTrip = async () => {
      const tripId = params.id;

      console.log("TRIP ID:", tripId);

      if (!tripId) {
        setError("ID trip tidak ditemukan");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("access_token");

      console.log("TOKEN ADA:", !!token);

      // Kalau belum login, langsung ke halaman login
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1/trips/${tripId}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("STATUS:", response.status);

        const data = await response.json();

        console.log("DATA TRIP:", data);

        // Kalau token tidak valid / expired
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        }

        if (!response.ok) {
          setError(data.detail || "Gagal mengambil data trip");
          setLoading(false);
          return;
        }

        setTrip(data);
      } catch (error) {
        console.error("FETCH ERROR:", error);
        setError("Tidak dapat terhubung ke backend");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [params.id, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading trip...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">
            {error}
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  if (!trip) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Trip tidak ditemukan.</p>
      </main>
    );
  }

  const formattedBudget = `${trip.currency.toUpperCase()} ${new Intl.NumberFormat(
    "en-US"
  ).format(trip.budget)}`;

  const formattedDailyBudget = `${trip.currency.toUpperCase()} ${new Intl.NumberFormat(
    "en-US"
  ).format(trip.daily_budget)}`;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          ← Back to Dashboard
        </button>

        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <p className="text-sm text-blue-100">
              Destination
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              {trip.destination}
            </h1>

            <p className="mt-2 text-blue-100">
              {trip.country}
            </p>
          </div>

          <div className="grid gap-4 p-8 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Duration
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                📅 {trip.days} Days
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Total Budget
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                💰 {formattedBudget}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Daily Budget
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                💵 {formattedDailyBudget}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Travel Month
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                📅 {trip.travel_month}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Category
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                🏷️ {trip.category}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Travel Style
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                👤 {trip.style}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5 sm:col-span-2">
              <p className="text-sm text-slate-500">
                Season
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                🌤️ {trip.season}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}