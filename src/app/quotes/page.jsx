import { Suspense } from "react";
import QuotePage from "./QuotesPage";


export default function page() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <QuotePage/>
    </Suspense>
  );
}
