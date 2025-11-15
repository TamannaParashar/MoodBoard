"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, X } from "lucide-react"
import * as faceapi from "face-api.js"
import Top from "./Components/Top"
import "./style.css"

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
  const [detectedMood, setDetectedMood] = useState(null)
  const [songs,setSongs] = useState([])
  const [showSongBtn,setShowSongBtn] = useState(false)
  const [songBar,setSongBar] = useState(false);
  const [quoteBar,setQuoteBar] = useState(false);

  const videoRef = useRef(null)
  const canvasRef = useRef(null)

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
  const data = await fetch("/api/addDetectedMood",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({mood})
  })
  const res = await data.json();
  console.log(res);
  return res;
};

const songClick=async()=>{
  const res = await fetch(`/api/spotify?mood=${detectedMood}`);
  const data = await res.json();
  setSongs(data.tracks);
  setSongBar(true);
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
          <p className="text-gray-300 text-lg">Understand your emotions through AI</p>
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

                        <button onClick={songClick} className="rounded-lg p-3 m-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 slide-right">Get Quotes</button>
                        </div>}

                      {songBar &&
                      <div>
                      <p className="font-semibold">Songs:</p>
                      <ul>
                        {songs.map((song, i) => (
                          <li key={i}>
                            <a href={song.url} target="_blank" className="underline hover:text-blue-300">
                              {song.name} - {song.artist}
                            </a>
                          </li>
                        ))}
                      </ul>
                      </div>}
                      {quoteBar &&
                      <div>
                      <p className="font-semibold mt-2">Quotes:</p>
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

        {/* Feature Cards */}
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="backdrop-blur-md bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 p-5 rounded-lg"
              >
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
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