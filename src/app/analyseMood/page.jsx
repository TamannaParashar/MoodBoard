"use client";
import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AnalyseMood() {
  const [userId, setUserId] = useState("");
  const [moodData, setMoodData] = useState(null);
  const [error, setError] = useState("");

  const fetchMoodData = async () => {
    setError("");
    setMoodData(null);

    if (!userId.trim()) {
      setError("Please enter a valid ID");
      return;
    }

    try {
      const res = await fetch(`/api/getMood?userId=${userId}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Unable to fetch mood data");
        return;
      }

      setMoodData(data.moodCounts);
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 text-white">
      
      {/* ID input */}
      <div className="flex gap-3 mb-6">
        <input
          type="number"
          placeholder="Enter your unique ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="p-3 rounded-lg bg-gray-800 text-white"
        />

        <button
          onClick={fetchMoodData}
          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
        >
          Analyze Mood
        </button>
      </div>

      {/* Error message */}
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* Donut chart */}
      {moodData && (
        <div className="w-80">
          <Doughnut
            data={{
              labels: Object.keys(moodData),
              datasets: [
                {
                  data: Object.values(moodData),
                  backgroundColor: [
                    "#6366F1", // Indigo
                    "#EC4899", // Pink
                    "#3B82F6", // Blue
                    "#F59E0B", // Amber
                    "#10B981", // Green
                    "#F43F5E", // Red
                    "#A855F7", // Purple
                  ],
                  borderWidth: 2,
                },
              ],
            }}
          />
        </div>
      )}
    </div>
  );
}
