"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuotePage() {
  const searchParams = useSearchParams();
  const mood = searchParams.get("mood");
  const limit = 10;
  
  const [quotes, setQuotes] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadBtn,setLoadBtn] = useState(false);

  const fetchQuotes = async (reset = false, currentOffset = offset) => {
    if (!mood) return;

    setLoading(true);

    try {
      const res = await fetch(
        `/api/quotes?mood=${mood}&limit=${limit}&offset=${reset ? 0 : currentOffset}`
      );
      if(!res.ok){
        setQuotes([]);
        setLoadBtn(false);
        setLoading(false);
        return;
      }
      const data = await res.json();

      setQuotes((prev) => (reset ? data : [...prev, ...data]));
      setLoadBtn(true);
      if (reset) setOffset(0);
    } catch (err) {
        setQuotes([]);
      console.error("Error fetching quotes:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchQuotes(true);
  }, [mood]);

  const loadMore = () => {
  const nextOffset = offset + limit;
  setOffset(nextOffset);
  fetchQuotes(false, nextOffset);
};

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-4">Mood: {mood}</h1>

      {quotes.length === 0 && !loading && <p>No quotes found.</p>}

      {quotes.map((q, idx) => (
        <div
          key={`${q.q}-${idx}`}
          className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 p-6 rounded-lg shadow-lg mb-4"
        >
          <p className="text-xl italic mb-2">"{q.text}"</p>
          <p className="text-right text-black">— {q.author}</p>
        </div>
      ))}

      {loading && <p className="text-gray-400">Loading...</p>}

      {loadBtn &&
      <button onClick={loadMore} disabled={loading} className="w-max px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">{loading ? 'Loading...' : 'Load more...'}</button>}
    </div>
  );
}