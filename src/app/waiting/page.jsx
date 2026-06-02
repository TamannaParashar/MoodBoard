"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { HeartHandshake } from "lucide-react"

function WaitingInner() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()

  const [status, setStatus] = useState("pending")
  const [counselor, setCounselor] = useState(null)
  const [dots, setDots] = useState(".")

  // Animated dots
  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d.length >= 3 ? "." : d + ".")), 600)
    return () => clearInterval(t)
  }, [])

  // Poll for approval every 6 seconds
  useEffect(() => {
    if (!token) return

    const poll = async () => {
      try {
        const res = await fetch(`/api/sessionRequest?token=${token}`)
        const data = await res.json()

        setCounselor(data.counselor)
        setStatus(data.status)

        if (data.status === "approved") {
          // Redirect to the video call room as the user
          router.push(`/call/${data.roomId}?role=user&token=${token}`)
        } else if (data.status === "declined") {
          setStatus("declined")
        }
      } catch (err) {
        console.error("Polling error:", err)
      }
    }

    poll() // immediate check
    const interval = setInterval(poll, 6000)
    return () => clearInterval(interval)
  }, [token, router])

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Invalid session link.</p>
      </div>
    )
  }

  if (status === "declined") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col items-center justify-center gap-6 p-6">
        <div className="text-5xl">💙</div>
        <h2 className="text-2xl font-bold text-center">Not available right now</h2>
        <p className="text-slate-400 text-center max-w-sm">
          {counselor?.name || "This counselor"} isn&apos;t able to take a session right now. Would
          you like to try another counselor?
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:scale-105 transition-transform"
        >
          See Other Counselors
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col items-center justify-center gap-8 p-6">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Counselor info */}
      {counselor && (
        <div className="flex flex-col items-center gap-3 relative z-10">
          <img
            src={counselor.photo}
            alt={counselor.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-purple-500/40 shadow-2xl"
          />
          <p className="font-bold text-lg">{counselor.name}</p>
          <p className="text-slate-400 text-sm">{counselor.title}</p>
        </div>
      )}

      {/* Spinner and message */}
      <div className="flex flex-col items-center gap-4 relative z-10">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-purple-500/20" />
          <div className="w-20 h-20 rounded-full border-4 border-t-purple-500 animate-spin absolute inset-0" />
          <HeartHandshake className="w-8 h-8 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h2 className="text-2xl font-bold">You&apos;re not alone{dots}</h2>
        <p className="text-slate-400 text-center max-w-sm text-sm leading-relaxed">
          Your request has been sent. A counselor will review it and accept shortly.
          This page will open the session automatically.
        </p>
      </div>

      <p className="text-xs text-slate-600 relative z-10">
        Your identity is completely private. No personal information is shared.
      </p>
    </div>
  )
}

export default function WaitingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <WaitingInner />
    </Suspense>
  )
}
