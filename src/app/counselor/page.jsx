"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Video, Clock, Check, X, ToggleLeft, ToggleRight, HeartHandshake } from "lucide-react"

const MOOD_COLORS = {
  sad: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  fearful: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  angry: "bg-red-500/20 text-red-300 border-red-500/30",
  disgusted: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  neutral: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  happy: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
}

function LoginScreen({ onLogin }) {
  const [slug, setSlug] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!slug || !password) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/counselorAuth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Invalid credentials")
        return
      }
      localStorage.setItem("counselorSession", JSON.stringify(data))
      onLogin(data)
    } catch {
      setError("Connection error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <HeartHandshake className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Counselor Portal</h1>
          <p className="text-slate-400 text-sm mt-1">MoodBoard Professional Access</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Your ID (slug)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. priya-sharma"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
              {error}
            </p>
          )}
          <button
            onClick={handleLogin}
            disabled={loading || !slug || !password}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 rounded-xl font-bold transition-all"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CounselorDashboard() {
  const router = useRouter()
  const [counselor, setCounselor] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)

  // Restore session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("counselorSession")
    if (saved) {
      try {
        setCounselor(JSON.parse(saved))
      } catch {}
    }
  }, [])

  const fetchRequests = useCallback(async (id) => {
    if (!id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/sessionRequest?counselorId=${id}`)
      const data = await res.json()
      setRequests(data.sessions || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Poll every 8 seconds for new requests
  useEffect(() => {
    if (!counselor?.id) return
    fetchRequests(counselor.id)
    const interval = setInterval(() => fetchRequests(counselor.id), 8000)
    return () => clearInterval(interval)
  }, [counselor?.id, fetchRequests])

  const handleAction = async (token, action) => {
    setActionLoading(token)
    try {
      const res = await fetch("/api/sessionRequest", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action, counselorId: counselor.id }),
      })
      const data = await res.json()

      if (!res.ok) {
        alert(data.message || "Something went wrong")
        return
      }

      if (action === "approve") {
        // Redirect counselor to the call room
        router.push(`/call/${data.roomId}?role=counselor&token=${token}`)
      } else {
        // Remove declined request from list
        setRequests((prev) => prev.filter((r) => r.sessionToken !== token))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("counselorSession")
    setCounselor(null)
  }

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`
    return `${Math.floor(mins / 60)}h ago`
  }

  if (!counselor) {
    return <LoginScreen onLogin={setCounselor} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur border-b border-slate-800/60">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={counselor.photo}
              alt={counselor.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-700"
            />
            <div>
              <p className="font-bold">{counselor.name}</p>
              <p className="text-xs text-slate-400">{counselor.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              counselor.inSession
                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${counselor.inSession ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`} />
              {counselor.inSession ? "In Session" : "Available"}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-all"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Incoming Requests</h2>
          <button
            onClick={() => fetchRequests(counselor.id)}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Refresh
          </button>
        </div>

        {counselor.inSession && (
          <div className="mb-6 px-5 py-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <p className="text-amber-300 font-semibold text-sm">
              ⚠️ You are currently in a session. End your active call before accepting new requests.
            </p>
          </div>
        )}

        {loading && requests.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🕊️</div>
            <h3 className="text-xl font-bold mb-2">No pending requests</h3>
            <p className="text-slate-400 text-sm">New requests will appear here automatically.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.sessionToken}
                className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        Mood Pattern
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {timeAgo(req.createdAt)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {req.moodPattern.map((m, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${
                            MOOD_COLORS[m] || "bg-slate-500/20 text-slate-300 border-slate-500/30"
                          }`}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {req.userMessage && (
                  <div className="mb-4 px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                    <p className="text-xs text-slate-500 font-semibold mb-1">Their message</p>
                    <p className="text-slate-300 text-sm leading-relaxed">&quot;{req.userMessage}&quot;</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(req.sessionToken, "decline")}
                    disabled={actionLoading === req.sessionToken || counselor.inSession}
                    className="flex-1 py-2.5 rounded-xl border border-slate-700 hover:border-red-500/40 text-slate-300 hover:text-red-400 disabled:opacity-40 transition-all flex items-center justify-center gap-2 font-semibold text-sm"
                  >
                    <X className="w-4 h-4" />
                    Decline
                  </button>
                  <button
                    onClick={() => handleAction(req.sessionToken, "approve")}
                    disabled={actionLoading === req.sessionToken || counselor.inSession}
                    className="flex-2 flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-40 font-bold transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    {actionLoading === req.sessionToken ? (
                      <span className="animate-spin">⟳</span>
                    ) : (
                      <>
                        <Video className="w-4 h-4" />
                        Accept & Start Call
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
