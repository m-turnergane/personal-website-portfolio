"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="mb-8">
        <h1 className="text-8xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-2 text-white">Page Not Found</h2>
        <p className="text-zinc-400 text-lg max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.06] hover:bg-white/[0.09] border border-white/10 hover:border-white/20 text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-neutral-900"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 text-zinc-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-neutral-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </div>
  );
}
