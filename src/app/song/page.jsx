import { Suspense } from "react";
import SongPage from "./SongPage";


export default function Page() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <SongPage/>
    </Suspense>
  );
}
