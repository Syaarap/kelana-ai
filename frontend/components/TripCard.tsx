"use client";

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

type TripCardProps = {
  trip: Trip;
};

export default function TripCard({ trip }: TripCardProps) {
  const categoryStyles = {
    Backpacker: "bg-green-100 text-green-700",
    Standard: "bg-blue-100 text-blue-700",
    Luxury: "bg-purple-100 text-purple-700",
  };

  const styleStyles = {
    Family: "bg-orange-100 text-orange-700",
    Solo: "bg-cyan-100 text-cyan-700",
    Couple: "bg-pink-100 text-pink-700",
  };

  const destinationIcons: Record<string, string> = {
    bandung: "🏔️",
    bali: "🌴",
    tokyo: "🗼",
    jakarta: "🏙️",
    yogyakarta: "🏛️",
    singapore: "🌆",
    default: "🌍",
  };

  const icon =
    destinationIcons[trip.destination.toLowerCase()] ||
    destinationIcons.default;

  const formattedBudget = `${trip.currency.toUpperCase()} ${new Intl.NumberFormat(
    "en-US",
    {
      maximumFractionDigits: 0,
    }
  ).format(trip.budget)}`;

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Destination */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur-sm">
            {icon}
          </div>

          <div>
            <p className="text-sm text-blue-100">
              Destination
            </p>

            <h2 className="text-2xl font-bold">
              {trip.destination}
            </h2>

            <p className="text-sm text-blue-100">
              {trip.country}
            </p>
          </div>
        </div>
      </div>

      {/* Trip Information */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              Duration
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              📅 {trip.days} Days
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              Budget
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              💰 {formattedBudget}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              categoryStyles[trip.category]
            }`}
          >
            {trip.category}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              styleStyles[trip.style]
            }`}
          >
            {trip.style}
          </span>
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={() => {
            window.location.href = `/dashboard/trips/${trip.id}`;
          }}
          className="mt-6 w-full rounded-xl border border-blue-600 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
        >
          View Trip →
        </button>
      </div>
    </div>
  );
}