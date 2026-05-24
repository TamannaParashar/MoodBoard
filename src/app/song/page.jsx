"use client";
import { Suspense } from "react";
import SongPage from "./SongPage";
import { Loader2 } from "lucide-react";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center flex-col">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
        <p className="text-slate-400 font-semibold text-sm">Opening Song Room...</p>
      </div>
    }>
      <SongPage/>
    </Suspense>
  );
}
