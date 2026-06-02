"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Send, ChevronRight, Clock, Globe, Video } from "lucide-react"

const MOOD_LABELS = {
  sad: { label: "Feeling Sad", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
  fearful: { label: "Feeling Anxious", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30" },
  angry: { label: "Feeling Angry", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
  disgusted: { label: "Feeling Low", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
  neutral: { label: "Feeling Numb", color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/30" },
}

function CounselorCard({ counselor, mood, onSelect }) {
  return (
    <div
      className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 hover:border-purple-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer"
      onClick={() => onSelect(counselor)}
    >
      <div className="flex items-start gap-4">
        <img
          src={counselor.photo}
          alt={counselor.name}
          className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-slate-700"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
            {counselor.name}
          </h3>
          <p className="text-slate-400 text-sm mb-3">{counselor.title}</p>
          <div className="flex flex-wrap gap-2">
            {counselor.specializations.slice(0, 3).map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-xs capitalize"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition-colors flex-shrink-0 mt-1" />
      </div>

      <p className="text-slate-400 text-sm mt-4 leading-relaxed line-clamp-2">{counselor.bio}</p>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700/50 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Globe className="w-3.5 h-3.5" />
          {counselor.languages?.join(", ")}
        </span>
        <span className="flex items-center gap-1">
          <Video className="w-3.5 h-3.5" />
          Video Call
        </span>
        <span className="ml-auto flex items-center gap-1 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Available
        </span>
      </div>
    </div>
  )
}

function RequestModal({ counselor, mood, moodPattern, onClose }) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/sessionRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          counselorId: counselor._id,
          moodPattern: moodPattern || [mood].filter(Boolean),
          userMessage: message,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Something went wrong")
        setLoading(false)
        return
      }

      // Store token in localStorage for the user to track their request
      localStorage.setItem("pendingSessionToken", data.sessionToken)
      router.push(`/waiting?token=${data.sessionToken}`)
    } catch (err) {
      setError("Could not send request. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={counselor.photo}
            alt={counselor.name}
            className="w-14 h-14 rounded-xl object-cover border border-slate-700"
          />
          <div>
            <h3 className="font-bold text-lg">{counselor.name}</h3>
            <p className="text-slate-400 text-sm">{counselor.title}</p>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Anything you&apos;d like the counselor to know?{" "}
            <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. I've been feeling overwhelmed for weeks and don't know who to talk to…"
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
          />
          <p className="text-xs text-slate-600 mt-1">{message.length}/500 — no personal information required</p>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 font-bold transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-spin">⟳</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Request
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-600 text-center mt-4">
          🔒 Your identity remains completely anonymous
        </p>
      </div>
    </div>
  )
}

function CounselorsInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mood = searchParams.get("mood") || ""
  const moodPatternRaw = searchParams.get("pattern") || ""
  const moodPattern = moodPatternRaw ? moodPatternRaw.split(",") : [mood].filter(Boolean)

  const [recommended, setRecommended] = useState([])
  const [others, setOthers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const moodMeta = MOOD_LABELS[mood] || null

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`/api/counselors?mood=${mood}`)
        const data = await res.json()
        setRecommended(data.recommended || [])
        setOthers(data.others || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [mood])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Ambient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-80 h-80 bg-purple-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-pink-600/8 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 sticky top-0 bg-slate-950/80 backdrop-blur border-b border-slate-800/60">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-bold text-lg">Talk to a Counselor</h1>
            <p className="text-xs text-slate-500">Anonymous • Secure • No sign-up needed</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 relative z-10">
        {/* Mood context banner */}
        {moodMeta && (
          <div className={`mb-8 px-5 py-4 rounded-xl border ${moodMeta.bg} flex items-center gap-3`}>
            <div className={`text-2xl`}>💙</div>
            <div>
              <p className={`font-semibold ${moodMeta.color}`}>{moodMeta.label}</p>
              <p className="text-slate-400 text-sm">
                We&apos;ve noticed your mood has been heavy lately. These counselors can help.
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400">Finding available counselors…</p>
          </div>
        ) : (
          <>
            {/* Recommended */}
            {recommended.length > 0 && (
              <section className="mb-10">
                <h2 className="text-sm font-bold uppercase tracking-widest text-purple-400 mb-4">
                  Recommended for You
                </h2>
                <div className="grid gap-4">
                  {recommended.map((c) => (
                    <CounselorCard key={c._id} counselor={c} mood={mood} onSelect={setSelected} />
                  ))}
                </div>
              </section>
            )}

            {/* Other available */}
            {others.length > 0 && (
              <section>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
                  Other Available Counselors
                </h2>
                <div className="grid gap-4">
                  {others.map((c) => (
                    <CounselorCard key={c._id} counselor={c} mood={mood} onSelect={setSelected} />
                  ))}
                </div>
              </section>
            )}

            {recommended.length === 0 && others.length === 0 && (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🕊️</div>
                <h3 className="text-xl font-bold mb-2">No counselors available right now</h3>
                <p className="text-slate-400 text-sm">Please check back in a little while.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Request modal */}
      {selected && (
        <RequestModal
          counselor={selected}
          mood={mood}
          moodPattern={moodPattern}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

export default function CounselorsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CounselorsInner />
    </Suspense>
  )
}
