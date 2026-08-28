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
  daily_budget: number;
  season: string;
};

export default async function Dashboard() {
const response = await fetch("http://127.0.0.1:8000/api/v1/trips");
const trips: Trip[] = await response.json();
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip, index) => (
            <TripCard key={index} trip={trip} />
          ))}
        </div>
      </div>
    </main>
  );
}