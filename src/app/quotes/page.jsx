"use client";
import { Suspense } from "react";
import QuotePage from "./QuotesPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <QuotePage />
    </Suspense>
  );
}
