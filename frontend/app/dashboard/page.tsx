"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TripCard from "@/components/TripCard";

type Trip = {
  id: number;
  destination: string;
  country: string;
  days: number;
  budget: number;
  currency: string;
  travel_month: string;
  category: "Backpacker" | "Standard" | "Luxury";
  style: "Family" | "Solo" | "Couple";
  daily_budget: number;
  season: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchTrips() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/v1/trips",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access_token");
            router.push("/login");
            return;
          }

          throw new Error(
            data.detail || "Gagal mengambil data trip"
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("Data trip dari backend bukan berupa array");
        }

        setTrips(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Gagal mengambil data trip");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">
          Memuat trip history...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-xl font-bold text-red-600">
            Gagal mengambil data
          </h1>

          <p className="mt-2 text-slate-600">
            {error}
          </p>

          <button
            onClick={() => router.push("/login")}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Kembali ke Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            KelanaAI
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Trip History
          </h1>

          <p className="mt-2 text-slate-500">
            View and manage your previously planned trips.
          </p>
        </div>

        {trips.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow">
            <h2 className="text-xl font-semibold text-slate-900">
              Belum ada trip
            </h2>

            <p className="mt-2 text-slate-500">
              Kamu belum memiliki trip yang tersimpan.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
              />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}