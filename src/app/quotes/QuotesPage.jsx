"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuotePage() {
  const searchParams = useSearchParams();
  const mood = searchParams.get("mood");

  const limit = 10;

  const [quotes, setQuotes] = useState([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchQuotes = async (reset = false, customOffset = 0) => {
    if (!mood) return;

    setLoading(true);

    try {
      const res = await fetch(
        `/api/quotes?mood=${mood}&limit=${limit}&offset=${customOffset}`
      );

      if (!res.ok) {
        setQuotes([]);
        setTotal(0);
        setLoading(false);
        return;
      }

      const data = await res.json();

      // API now returns { mood, total, count, data }
      setTotal(data.total);

      setQuotes((prev) =>
        reset ? data.data : [...prev, ...data.data]
      );

      if (reset) setOffset(0);

    } catch (err) {
      console.error("Error fetching quotes:", err);
      setQuotes([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (mood) {
      fetchQuotes(true, 0);
    }
  }, [mood]);

  const loadMore = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    fetchQuotes(false, nextOffset);
  };

  const hasMore = quotes.length < total;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        Mood: {mood}
      </h1>

      {!loading && quotes.length === 0 && (
        <p className="text-gray-400">No quotes found.</p>
      )}

      {quotes.map((quote, idx) => (
        <div
          key={`${quote}-${idx}`}
          className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 p-6 rounded-lg shadow-lg mb-4"
        >
          <p className="text-xl italic mb-2 text-black">
            "{quote}"
          </p>
        </div>
      ))}

      {loading && (
        <p className="text-gray-400 mt-4">Loading...</p>
      )}

      {hasMore && !loading && (
        <button
          onClick={loadMore}
          className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          Load more
        </button>
      )}
    </div>
  );
}