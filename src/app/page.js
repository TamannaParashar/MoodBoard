"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, X, Star, ArrowRight, Zap, Shield, Sparkles, Heart } from "lucide-react"
import * as faceapi from "face-api.js"
import "./style.css"
import { useRouter } from "next/navigation"

const features = [
  {
    icon: "📸",
    title: "Capture Your Mood",
    description: "Take a photo of yourself and let AI understand your emotional state at that moment.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: "🧠",
    title: "AI Mood Detection",
    description: "Our machine learning model analyzes your photo to recognize your emotional expression.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: "💎",
    title: "Personalized Recommendations",
    description: "Get music, quotes, AI agent to talk with, relax room, connect with people and many more...",
    gradient: "from-orange-500 to-red-500"
  },
]

const whyMoodboard = [
  {
    icon: "🎯",
    title: "Self-Discovery",
    description: "Understand your emotional patterns and triggers better over time.",
    highlight: "bg-gradient-to-br from-blue-500/20 to-blue-600/20"
  },
  {
    icon: "🛡️",
    title: "Complete Privacy",
    description: "100% private and secure. Your emotions stay between you and MoodBoard.",
    highlight: "bg-gradient-to-br from-green-500/20 to-emerald-600/20"
  },
  {
    icon: "💡",
    title: "Smart Insights",
    description: "Get actionable recommendations tailored to your emotional needs.",
    highlight: "bg-gradient-to-br from-amber-500/20 to-orange-600/20"
  },
]

const reviews = [
  {
    name: "Sarah Johnson",
    role: "Mental Health Advocate",
    rating: 5,
    comment: "MoodBoard has transformed how I track and understand my emotions. Absolutely incredible!",
    avatar: "SJ",
    color: "from-pink-500 to-rose-500"
  },
  {
    name: "Marcus Chen",
    role: "Wellness Coach",
    rating: 4.5,
    comment: "The AI detection is surprisingly accurate. My clients love the personalized recommendations.",
    avatar: "MC",
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "Emma Davis",
    role: "Therapist",
    rating: 4.5,
    comment: "A wonderful tool for emotional awareness. The privacy features are outstanding.",
    avatar: "ED",
    color: "from-purple-500 to-indigo-500"
  },
  {
    name: "Alex Rivera",
    role: "Fitness Trainer",
    rating: 5,
    comment: "Best app for understanding my mental state. The music recommendations are spot on!",
    avatar: "AR",
    color: "from-orange-500 to-amber-500"
  },
]

export default function Home() {
  const [showWebcam, setShowWebcam] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [detectedMood, setDetectedMood] = useState(null)
  const [showSongBtn, setShowSongBtn] = useState(false)
  const [traceOption, setTraceOption] = useState("dontTrace")
  const [hoveredCard, setHoveredCard] = useState(null)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models")
        await faceapi.nets.faceExpressionNet.loadFromUri("/models")
      } catch (error) {
        console.error("Error loading face-api models", error)
      }
    }
    loadModels()
  }, [])

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

  const handleCapture = async () => {
    if (!videoRef.current) return

    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    setCapturedImage(canvas.toDataURL("image/png"))

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions()

    let mood = "neutral"
    if (detection) {
      const expressions = detection.expressions
      mood = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      )
      setDetectedMood(mood)
      setShowSongBtn(true)
    }

    let idToSend = null
    if (traceOption === "trace") {
      const userInput = prompt("Enter your unique ID (or leave empty for New User):")
      if (userInput && userInput.trim() !== "") {
        idToSend = userInput.trim()
      } else {
        idToSend = Math.floor(10000 + Math.random() * 90000)
        alert(`Your new unique ID is: ${idToSend}`)
      }
    }
    const toSend = idToSend ? { mood, userId: idToSend } : { mood }
    const data = await fetch("/api/addDetectedMood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toSend)
    })
    const res = await data.json()
  }

  const songClick = () => router.push(`/song?mood=${detectedMood}`)
  const quotesClick = () => router.push(`/quotes?mood=${detectedMood}`)
  const aiInteract = () => router.push(`/interact?mood=${detectedMood}`)

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : star - rating < 1
                  ? "fill-yellow-400 text-yellow-400 opacity-50"
                  : "text-gray-400"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-gradient-to-b from-slate-950/80 to-transparent backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              MoodBoard
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-20 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-40 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          </div>

          <div className="relative z-10 text-center mb-16">
            <div className="mb-6 inline-block">
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-sm font-semibold">
                ✨ Understand Your Emotions Like Never Before
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
              Your Emotional
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                Companion
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Capture your mood, understand your emotions, and get personalized recommendations for your mental wellbeing
            </p>
            <button
              onClick={() => setShowWebcam(!showWebcam)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Camera className="w-6 h-6" />
              {showWebcam ? "Close Webcam" : "Start Analysis"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Webcam Section */}
          {showWebcam && (
            <div className="relative z-10 max-w-3xl mx-auto mb-20">
              <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-300 mb-3">Trace Your Mood Journey?</label>
                  <select
                    value={traceOption}
                    onChange={(e) => setTraceOption(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  >
                    <option value="dontTrace">Don't Trace</option>
                    <option value="trace">Yes, Track My Moods</option>
                  </select>
                </div>

                {capturedImage ? (
                  <div className="space-y-6">
                    <div className="relative rounded-xl overflow-hidden shadow-xl">
                      <img
                        src={capturedImage}
                        alt="Captured"
                        className="w-full object-cover max-h-96"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setCapturedImage(null)
                          setDetectedMood(null)
                          setShowWebcam(false)
                          setTimeout(() => setShowWebcam(true), 10)
                        }}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg font-semibold transition-all"
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
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 rounded-lg font-semibold transition-all"
                      >
                        Download
                      </button>
                    </div>

                    {detectedMood && (
                      <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl">
                        <div className="text-center mb-6">
                          <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-3">
                            <p className="text-slate-900 font-bold text-lg capitalize">{detectedMood}</p>
                          </div>
                          <p className="text-slate-300 text-sm">Your current emotional state</p>
                        </div>

                        {showSongBtn && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <button
                              onClick={songClick}
                              className="group px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                              <span>🎵</span> Get Songs
                            </button>
                            <button
                              onClick={quotesClick}
                              className="group px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                              <span>✨</span> Get Quotes
                            </button>
                            <button
                              onClick={aiInteract}
                              className="group px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                              <span>💬</span> Talk with AI
                            </button>
                            <button
                              onClick={() => router.push("/analyseMood")}
                              className="group px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                              <span>📊</span> Analyse Mood
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative rounded-xl overflow-hidden bg-slate-900/50">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded-lg"
                      />
                      <div className="absolute inset-0 border-2 border-purple-400/20 rounded-lg"></div>
                    </div>
                    <button
                      onClick={handleCapture}
                      className="w-full px-4 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                    >
                      <Camera className="w-5 h-5" />
                      Capture Image
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-20 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg">Simple, secure, and scientifically designed</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative p-8 rounded-2xl transition-all duration-300 cursor-pointer ${
                  hoveredCard === index ? "transform scale-105" : ""
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}></div>
                <div className={`absolute inset-0 border rounded-2xl transition-colors ${
                  hoveredCard === index ? `border-gradient-to-r ${feature.gradient}` : "border-slate-700/50"
                }`}></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why MoodBoard Section */}
      <div className="relative py-20 px-6 md:px-8 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose MoodBoard?</h2>
            <p className="text-slate-400 text-lg">Built with care for your mental wellbeing</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyMoodboard.map((item, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl border border-slate-700/50 backdrop-blur-xl transition-all duration-300 hover:border-slate-600 hover:shadow-lg ${item.highlight}`}
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="relative py-20 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What People Love About MoodBoard</h2>
            <p className="text-slate-400 text-lg">Trusted by thousands</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl backdrop-blur-xl hover:border-slate-600 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${review.color} flex items-center justify-center font-bold text-lg text-white shadow-lg`}>
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{review.name}</h4>
                    <p className="text-slate-400 text-sm">{review.role}</p>
                  </div>
                </div>
                <div className="mb-4">{renderStars(review.rating)}</div>
                <p className="text-slate-300 leading-relaxed italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-80"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50"></div>
            <div className="relative z-10 p-12 md:p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Understand Your Emotions?</h2>
              <p className="text-lg text-slate-100 mb-8 max-w-2xl mx-auto">Start your emotional journey today with MoodBoard</p>
              <button
                onClick={() => setShowWebcam(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-12 px-6 md:px-8 text-center text-slate-400">
        <p>&copy; {new Date().getFullYear()} MoodBoard | Understand Your Emotions</p>
      </footer>
    </main>
  )
}
