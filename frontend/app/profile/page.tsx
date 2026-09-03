"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          KelanaAI
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Profile
        </h1>

        <p className="mt-3 text-slate-500">
          Halaman profile pengguna KelanaAI.
        </p>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </main>
  );
}