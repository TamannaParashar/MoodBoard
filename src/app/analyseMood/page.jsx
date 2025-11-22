"use client"

import { useState } from "react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function AnalyseMood() {
  const [userId, setUserId] = useState("")
  const [moodData, setMoodData] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchMoodData = async () => {
    setError("")
    setMoodData(null)
    setLoading(true)

    if (!userId.trim()) {
      setError("Please enter a valid ID")
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`/api/getMood?userId=${userId}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Unable to fetch mood data")
        setLoading(false)
        return
      }

      setMoodData(data.moodCounts)
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchMoodData()
    }
  }

  const moodColors = [
    "#6366F1", // Indigo
    "#EC4899", // Pink
    "#3B82F6", // Blue
    "#F59E0B", // Amber
    "#10B981", // Green
    "#F43F5E", // Red
    "#A855F7", // Purple
  ]

  const totalMoods = moodData ? Object.values(moodData).reduce((a, b) => a + b, 0) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        {/* Input Card */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
          <label className="block text-sm font-semibold text-slate-300 mb-4">Enter Your ID</label>
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Enter your unique ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition"
            />
            <button
              onClick={fetchMoodData}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition shadow-lg hover:shadow-xl"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8 text-red-200 text-center">
            {error}
          </div>
        )}

        {/* Charts & Stats Section */}
        {moodData && (
          <div className="space-y-8">
            {/* Doughnut Chart */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">Your Mood Distribution</h2>
              <div className="flex justify-center">
                <div className="w-80 h-80">
                  <Doughnut
                    data={{
                      labels: Object.keys(moodData),
                      datasets: [
                        {
                          data: Object.values(moodData),
                          backgroundColor: moodColors,
                          borderColor: "#1e293b",
                          borderWidth: 3,
                          hoverBorderColor: "#ffffff",
                          hoverBorderWidth: 4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            color: "#cbd5e1",
                            font: { size: 13, weight: "600" },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: "circle",
                          },
                        },
                        tooltip: {
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          titleColor: "#e2e8f0",
                          bodyColor: "#cbd5e1",
                          borderColor: "#475569",
                          borderWidth: 1,
                          padding: 12,
                          displayColors: true,
                          callbacks: {
                            label: (context) => {
                              const total = context.dataset.data.reduce((a, b) => a + b, 0)
                              const percentage = ((context.parsed / total) * 100).toFixed(1)
                              return `${context.label}: ${context.parsed} (${percentage}%)`
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-6 shadow-lg">
                <p className="text-slate-400 text-sm font-medium mb-2">Total Entries</p>
                <p className="text-4xl font-bold text-indigo-400">{totalMoods}</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-6 shadow-lg">
                <p className="text-slate-400 text-sm font-medium mb-2">Mood Types</p>
                <p className="text-4xl font-bold text-purple-400">{Object.keys(moodData).length}</p>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Detailed Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(moodData).map(([mood, count], index) => {
                  const percentage = ((count / totalMoods) * 100).toFixed(1)
                  return (
                    <div key={mood} className="flex items-center gap-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: moodColors[index % moodColors.length] }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-300 font-medium capitalize">{mood}</span>
                          <span className="text-slate-400 text-sm">
                            {count} • {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: moodColors[index % moodColors.length],
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!moodData && !loading && !error && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-12 text-center shadow-2xl">
            <p className="text-slate-400 text-lg">Enter your ID and click Analyze to see your mood distribution</p>
          </div>
        )}
      </div>
    </div>
  )
}
