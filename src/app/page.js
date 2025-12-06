"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, X, Star } from "lucide-react"
import * as faceapi from "face-api.js"
import Top from "./Components/Top"
import "./style.css"
import { useRouter } from "next/navigation"

const features = [
  {
    title: "Capture Your Mood",
    description: "Take a photo of yourself and let AI understand your emotional state at that moment.",
  },
  {
    title: "AI Mood Detection",
    description: "Our machine learning model analyzes your photo to recognize your emotional expression.",
  },
  {
    title: "Personalized Recommendations",
    description: "Get music, quotes, AI agent to talk with, relax room, connect with people and many more...",
  },
]

const whyMoodboard = [
  {
    icon: "🎯",
    title: "Self-Discovery",
    description: "Understand your emotional patterns and triggers better over time.",
  },
  {
    icon: "🛡️",
    title: "Complete Privacy",
    description: "100% private and secure. Your emotions stay between you and MoodBoard.",
  },
  {
    icon: "💡",
    title: "Smart Insights",
    description: "Get actionable recommendations tailored to your emotional needs.",
  },
]

const reviews = [
  {
    name: "Sarah Johnson",
    role: "Mental Health Advocate",
    rating: 5,
    comment: "MoodBoard has transformed how I track and understand my emotions. Absolutely incredible!",
    avatar: "SJ",
  },
  {
    name: "Marcus Chen",
    role: "Wellness Coach",
    rating: 4.5,
    comment: "The AI detection is surprisingly accurate. My clients love the personalized recommendations.",
    avatar: "MC",
  },
  {
    name: "Emma Davis",
    role: "Therapist",
    rating: 4.5,
    comment: "A wonderful tool for emotional awareness. The privacy features are outstanding.",
    avatar: "ED",
  },
  {
    name: "Alex Rivera",
    role: "Fitness Trainer",
    rating: 5,
    comment: "Best app for understanding my mental state. The music recommendations are spot on!",
    avatar: "AR",
  },
]

export default function Home() {
  const [showWebcam, setShowWebcam] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [detectedMood, setDetectedMood] = useState(null)
  const [showSongBtn,setShowSongBtn] = useState(false)
  const [traceOption, setTraceOption] = useState("dontTrace");


  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const router = useRouter();

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models")
        await faceapi.nets.faceExpressionNet.loadFromUri("/models")
        console.log("Face-api models loaded")
      } catch (error) {
        console.error("Error loading face-api models", error)
      }
    }
    loadModels()
  }, [])

  // Start webcam
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

  // Capture image + detect mood
 const handleCapture = async () => {
  if (!videoRef.current) return;

  // Capture image for preview
  const canvas = document.createElement("canvas");
  canvas.width = videoRef.current.videoWidth;
  canvas.height = videoRef.current.videoHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  setCapturedImage(canvas.toDataURL("image/png"));
  
  // Run face-api detection
  const detection = await faceapi
    .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();

  let mood = "neutral";
  if (detection) {
    const expressions = detection.expressions;
    mood = Object.keys(expressions).reduce((a, b) =>
      expressions[a] > expressions[b] ? a : b
    );
    setDetectedMood(mood);
    setShowSongBtn(true);
  }
  let idToSend = null;
  if (traceOption === "trace") {
    const userInput = prompt(
      "Enter your unique ID (or leave empty for New User):"
    );

    if (userInput && userInput.trim() !== "") {
      idToSend = userInput.trim();
    } else {
      idToSend = Math.floor(10000 + Math.random() * 90000);
      alert(`Your new unique ID is: ${idToSend}`);
    }
  }
  const toSend = idToSend?{mood,userId:idToSend}:{mood};
  const data = await fetch("/api/addDetectedMood",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(toSend)
  })
  const res = await data.json();
  console.log(res);
  return res;
};

  const songClick=async()=>{
    router.push(`/song?mood=${detectedMood}`);
  }
  const quotesClick=async()=>{
    router.push(`/quotes?mood=${detectedMood}`);
  }
  const aiInteract=()=>{
    router.push(`/interact?mood=${detectedMood}`);
  }

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
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      <div>
        <Top/>
      </div>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0" />
      <div className="fixed inset-0 bg-black/50 z-10"></div>
      <div className="relative z-20 min-h-screen flex flex-col p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-wider mb-2">
            Mood
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-400">
              Board
            </span>
          </h1>
          <p className="text-gray-300 text-lg">We Understand You !</p>
        </div>

        {/* Webcam Section */}
        <div className="max-w-2xl mx-auto w-full mb-12">
          <button
            onClick={() => {
              setShowWebcam(!showWebcam)
              setCapturedImage(null)
              setDetectedMood(null)
              if(showWebcam){
                setShowSongBtn(false);
              }
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

        {showWebcam && (
          <div className="mt-6 space-y-4">
            <div className="mb-4">
              <label className="mr-2 font-semibold">Trace Mood?</label>
              <select
                value={traceOption}
                onChange={(e) => setTraceOption(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-800 text-white"
              >
                <option value="dontTrace">Don't Trace</option>
                <option value="trace">Trace</option>
              </select>
            </div>

            {capturedImage ? (
              <>
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full rounded-xl shadow-lg max-h-96 object-cover"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setCapturedImage(null)
                      setDetectedMood(null)
                      setShowWebcam(false)
                      setTimeout(()=>setShowWebcam(true),10);
                    }}
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

                {/* Mood Recommendations */}
                {detectedMood && (
                  <div className="mt-4 p-4 bg-white/10 rounded-lg">
                    <h3 className="text-xl font-bold mb-2 text-center" style={{textShadow:'3px 3px 3px gray'}}>Detected Mood: {detectedMood}</h3>

                    {showSongBtn && 
                    <div className="flex justify-center">
                      <button onClick={songClick} className="rounded-lg p-3 m-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 slide-left">Get Songs</button>

                      <button onClick={quotesClick} className="rounded-lg p-3 m-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 slide-right">Get Quotes</button>

                      <button onClick={aiInteract} className="rounded-lg p-3 m-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 slide-right">Wanna Talk?</button>

                      <button onClick={()=>router.push('/analyseMood')} className="rounded-lg p-3 m-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 slide-right">Analyse Mood</button>
                      </div>}
                  </div>
                )}
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

      <div className="relative w-full flex justify-center my-20 overflow-visible">
        <div className="relative flex flex-col w-full md:w-1/2 items-center space-y-6 z-10 overflow-visible">
          <img
            src="/p1.png"
            className="hidden md:block w-64 absolute -top-28 -left-32 z-20 animate-float"
            alt="Sticker Top"
          />

          {/* Feature Cards */}
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative w-full backdrop-blur-md bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 p-8 rounded-2xl shadow-2xl overflow-visible z-10"
            >
              <h3 className="text-xl font-bold mb-3 text-center">{feature.title}</h3>
              <p className="text-gray-900 text-sm leading-relaxed text-center">
                {feature.description}
              </p>

              {/* p2 only on LAST card */}
              {index === 2 && (
                <img
                  src="/p2.png"
                  className="hidden md:block w-64 absolute -bottom-28 -right-32 z-20 animate-float-delayed"
                  alt="Sticker Bottom"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Why MoodBoard?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyMoodboard.map((item, index) => (
            <div
              key={index}
              className="backdrop-blur-md bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 p-6 rounded-lg text-center"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full mb-16">
      <h2 className="text-3xl font-bold mb-8 text-center">What People Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="backdrop-blur-md bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-400/30 p-6 rounded-lg"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center font-bold">
                {review.avatar}
              </div>
              <div>
                <h4 className="font-bold text-lg">{review.name}</h4>
                <p className="text-gray-400 text-sm">{review.role}</p>
              </div>
            </div>
            <div className="mb-3">{renderStars(review.rating)}</div>
            <p className="text-gray-300 text-sm leading-relaxed">"{review.comment}"</p>
          </div>
        ))}
      </div>
    </div>

      </div>
      <footer>
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} MoodBoard | All Rights Reserved</p>
        </div>
      </footer>
    </main>
  )
}