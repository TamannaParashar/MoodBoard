import { Suspense } from "react";
import InteractPage from "./InteractClient";


export default function Page() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <InteractPage />
    </Suspense>
  );
}
