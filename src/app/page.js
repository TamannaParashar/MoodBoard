"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, X } from "lucide-react"

const features = [
  {
    title: "Capture Your Mood",
    description: "Take a photo of yourself and let AI understand your emotional state in that moment.",
  },
  {
    title: "AI Mood Detection",
    description: "Our machine learning model analyzes your photo to recognize your emotional expression.",
  },
  {
    title: "Personalized Recommendations",
    description: "Get music, quotes, and soundscapes perfectly suited to your detected mood.",
  },
  {
    title: "Mood Insights",
    description: "Track patterns in your emotions over time and understand yourself better.",
  },
  {
    title: "Ambient Soundscapes",
    description: "Choose from curated ambient sounds to enhance your emotional experience.",
  },
  {
    title: "Your Personal Sanctuary",
    description: "A safe, beautiful space to explore your emotions and find inner peace.",
  },
]

export default function Home() {
  const [showWebcam, setShowWebcam] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!showWebcam) return

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error("Webcam error:", err)
      }
    }

    startWebcam()

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [showWebcam])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const bars = 60
    const barData = Array(bars)
      .fill(0)
      .map(() => Math.random())

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "rgba(88, 28, 135, 0.08)")
      gradient.addColorStop(0.5, "rgba(236, 72, 153, 0.04)")
      gradient.addColorStop(1, "rgba(139, 0, 139, 0.08)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const barWidth = canvas.width / bars
      for (let i = 0; i < bars; i++) {
        barData[i] += (Math.random() - 0.5) * 0.2
        barData[i] = Math.max(0, Math.min(1, barData[i]))

        const barHeight = barData[i] * canvas.height * 0.6
        const x = i * barWidth
        const y = canvas.height - barHeight

        const barGradient = ctx.createLinearGradient(x, y, x, canvas.height)
        const hue = (i / bars) * 360
        barGradient.addColorStop(0, `hsl(${hue}, 100%, 60%)`)
        barGradient.addColorStop(1, `hsl(${hue}, 100%, 40%)`)

        ctx.fillStyle = barGradient
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight)

        ctx.shadowColor = `hsl(${hue}, 100%, 50%)`
        ctx.shadowBlur = 10
      }
      ctx.shadowColor = "transparent"

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        setCapturedImage(canvas.toDataURL("image/png"))
      }
    }
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Visualizer */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0" />

      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/50 z-10"></div>

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-wider mb-2">
            Mood
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-400">
              Board
            </span>
          </h1>
          <p className="text-gray-300 text-lg">Understand your emotions through AI</p>
        </div>

        {/* Webcam Section */}
        <div className="max-w-2xl mx-auto w-full mb-12">
          <button
            onClick={() => {
              setShowWebcam(!showWebcam)
              setCapturedImage(null)
            }}
            className={`w-full px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
              showWebcam
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            }`}
          >
            {showWebcam ? (
              <>
                <X className="w-6 h-6" />
                Close Webcam
              </>
            ) : (
              <>
                <Camera className="w-6 h-6" />
                Open Webcam
              </>
            )}
          </button>

          {/* Webcam Display */}
          {showWebcam && (
            <div className="mt-6 space-y-4">
              {capturedImage ? (
                <>
                  <img
                    src={capturedImage || "/placeholder.svg"}
                    alt="Captured"
                    className="w-full rounded-xl shadow-lg max-h-96 object-cover"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all"
                    >
                      Retake
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement("a")
                        link.href = capturedImage
                        link.download = `mood-${Date.now()}.png`
                        link.click()
                      }}
                      className="flex-1 px-4 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-semibold transition-all"
                    >
                      Download
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl bg-gray-900" />
                  <button
                    onClick={handleCapture}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Camera className="w-5 h-5" />
                    Capture Image
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="backdrop-blur-md bg-white/5 border border-purple-500/30 hover:border-purple-500/60 rounded-xl p-6 transition-all duration-300 hover:bg-white/10 hover:shadow-lg"
              >
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto text-center text-gray-400 text-sm">
          <p>Ready to understand your mood? Capture and explore.</p>
        </div>
      </div>
    </main>
  )
}
