"use client"

import { useEffect, useRef, useState, useCallback, Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageCircle, Send, X } from "lucide-react"
import io from "socket.io-client"

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
}

function CallInner() {
  const { roomId } = useParams()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "user" // "counselor" | "user"
  const sessionToken = searchParams.get("token") || ""
  const router = useRouter()

  // Refs
  const socketRef = useRef(null)
  const pcRef = useRef(null)        // RTCPeerConnection
  const localStreamRef = useRef(null)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  // State
  const [connected, setConnected] = useState(false)      // socket connected
  const [callActive, setCallActive] = useState(false)    // WebRTC stream active
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const [peerLeft, setPeerLeft] = useState(false)
  const [mediaError, setMediaError] = useState("")
  const chatBottomRef = useRef(null)

  // ── WebRTC helpers ────────────────────────────────────────────────────────

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS)

    // When we get a remote track, show it in the remote video element
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
        setCallActive(true)
      }
    }

    // Send ICE candidates to the peer via socket
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("webrtc-ice", { roomId, candidate: event.candidate })
      }
    }

    pcRef.current = pc
    return pc
  }, [roomId])

  const startLocalStream = useCallback(async () => {
    try {
      // Try to acquire both video and audio first
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      localStreamRef.current = stream
      if (localVideoRef.current) localVideoRef.current.srcObject = stream
      setMediaError("")
      setCameraOn(true)
      return stream
    } catch (err) {
      console.warn("Webcam in use or not found, falling back to audio-only...", err)
      try {
        // Try audio-only fallback
        const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
        localStreamRef.current = stream
        if (localVideoRef.current) localVideoRef.current.srcObject = null
        setMediaError("")
        setCameraOn(false)
        return stream
      } catch (audioErr) {
        console.error("Audio fallback failed:", audioErr)
        if (audioErr.name === "NotAllowedError" || audioErr.name === "PermissionDeniedError") {
          setMediaError("Camera or Microphone permission was denied. Please allow access in your browser settings to continue the call.")
        } else {
          setMediaError(`Access error: ${audioErr.message || audioErr.name}`)
        }
        throw audioErr
      }
    }
  }, [])

  // Called on the counselor side when both are in the room
  const initiateCall = useCallback(async () => {
    try {
      const pc = createPeerConnection()
      const stream = await startLocalStream()
      stream.getTracks().forEach((track) => pc.addTrack(track, stream))

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      socketRef.current.emit("webrtc-offer", { roomId, offer })
    } catch (err) {
      console.error("Could not initiate call due to camera error:", err)
    }
  }, [createPeerConnection, startLocalStream, roomId])

  // Called on the user side when they receive an offer
  const answerCall = useCallback(async (offer) => {
    try {
      const pc = createPeerConnection()
      const stream = await startLocalStream()
      stream.getTracks().forEach((track) => pc.addTrack(track, stream))

      await pc.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      socketRef.current.emit("webrtc-answer", { roomId, answer })
    } catch (err) {
      console.error("Could not answer call due to camera error:", err)
    }
  }, [createPeerConnection, startLocalStream, roomId])

  const hangUp = useCallback(async () => {
    if (socketRef.current) socketRef.current.emit("call-ended", roomId)

    // Clean up streams and peer connection
    localStreamRef.current?.getTracks().forEach((t) => t.stop())
    pcRef.current?.close()

    // If counselor, mark session closed in DB
    if (role === "counselor" && sessionToken) {
      await fetch("/api/sessionRequest", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: sessionToken }),
      })
    }

    router.push(role === "counselor" ? "/counselor" : "/")
  }, [roomId, role, sessionToken, router])

  // ── Socket setup ──────────────────────────────────────────────────────────

  useEffect(() => {
    const socket = io("http://localhost:3000")
    socketRef.current = socket

    socket.on("connect", () => {
      setConnected(true)
      socket.emit("join-call", roomId)
    })

    // Both parties are in the room — counselor makes the offer
    socket.on("peer-joined", () => {
      if (role === "counselor") {
        initiateCall()
      }
    })

    socket.on("webrtc-offer", async (offer) => {
      if (role === "user") {
        await answerCall(offer)
      }
    })

    socket.on("webrtc-answer", async (answer) => {
      if (pcRef.current) {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer))
      }
    })

    socket.on("webrtc-ice", async (candidate) => {
      if (pcRef.current && candidate) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate))
        } catch (e) {
          console.error("ICE candidate error:", e)
        }
      }
    })

    socket.on("call-ended", () => {
      setPeerLeft(true)
      localStreamRef.current?.getTracks().forEach((t) => t.stop())
      pcRef.current?.close()
    })

    // In-call text chat
    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      localStreamRef.current?.getTracks().forEach((t) => t.stop())
      pcRef.current?.close()
      socket.disconnect()
    }
  }, [roomId, role, initiateCall, answerCall])

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ── Controls ──────────────────────────────────────────────────────────────

  const toggleMic = () => {
    if (!localStreamRef.current) return
    localStreamRef.current.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled
    })
    setMicOn((prev) => !prev)
  }

  const toggleCamera = () => {
    if (!localStreamRef.current) return
    localStreamRef.current.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled
    })
    setCameraOn((prev) => !prev)
  }

  const sendChatMessage = () => {
    if (!text.trim() || !socketRef.current) return
    const msg = {
      roomId,
      senderId: role,
      receiverId: role === "counselor" ? "user" : "counselor",
      message: text.trim(),
    }
    socketRef.current.emit("send-message", msg)
    setText("")
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (peerLeft) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-6">
        <div className="text-6xl">📞</div>
        <h2 className="text-2xl font-bold">The session has ended</h2>
        <p className="text-slate-400 text-center max-w-md">
          {role === "user"
            ? "Your counselor has ended the session. Take care of yourself."
            : "The session has been closed."}
        </p>
        <button
          onClick={() => router.push(role === "counselor" ? "/counselor" : "/")}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:scale-105 transition-transform"
        >
          {role === "counselor" ? "Back to Dashboard" : "Back to Home"}
        </button>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-sm">
            {callActive ? "Session Active" : "Connecting…"}
          </span>
        </div>
        <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
          Private & Secure Session
        </div>
        <button
          onClick={() => setChatOpen((v) => !v)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-purple-500 text-slate-300 hover:text-white transition-all text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          Chat
        </button>
      </header>

      {/* Main area */}
      <div className="flex flex-1 min-h-0">

        {/* Video area */}
        <div className="flex-1 flex flex-col min-h-0 relative bg-black">

          {/* Remote video (full size) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {!callActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 px-6 text-center">
              {mediaError ? (
                <div className="max-w-md p-6 bg-red-950/40 border border-red-500/30 rounded-2xl flex flex-col items-center gap-4">
                  <div className="text-4xl text-red-400">⚠️</div>
                  <h3 className="font-bold text-lg text-white">Camera Access Required</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {mediaError}
                  </p>
                  <button
                    onClick={() => {
                      setMediaError("")
                      if (role === "counselor") {
                        initiateCall()
                      } else {
                        startLocalStream().catch(() => {})
                      }
                    }}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-5" />
                  <p className="text-slate-300 font-semibold animate-pulse">
                    {connected ? "Waiting for the other person to join…" : "Connecting to server…"}
                  </p>
                </>
              )}
            </div>
          )}

          {/* Local video (picture-in-picture) */}
          <div className="absolute bottom-24 right-5 w-44 h-32 rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-slate-900">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {!cameraOn && (
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                <VideoOff className="w-7 h-7 text-slate-500" />
              </div>
            )}
          </div>

          {/* Controls bar */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-5">
            <button
              onClick={toggleMic}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                micOn ? "bg-slate-700 hover:bg-slate-600" : "bg-red-600 hover:bg-red-700"
              }`}
              title={micOn ? "Mute" : "Unmute"}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={hangUp}
              className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-xl transition-all hover:scale-105"
              title="End call"
            >
              <PhoneOff className="w-6 h-6" />
            </button>

            <button
              onClick={toggleCamera}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                cameraOn ? "bg-slate-700 hover:bg-slate-600" : "bg-red-600 hover:bg-red-700"
              }`}
              title={cameraOn ? "Turn off camera" : "Turn on camera"}
            >
              {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Chat sidebar */}
        {chatOpen && (
          <div className="w-80 flex flex-col border-l border-slate-800 bg-slate-900 flex-shrink-0">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-purple-400" />
                In-session Chat
              </h3>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.length === 0 && (
                <p className="text-slate-500 text-xs text-center mt-8">
                  Chat messages are only visible during this session.
                </p>
              )}
              {messages.map((m, i) => {
                const isMine = m.senderId === role
                return (
                  <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                        isMine
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none"
                          : "bg-slate-800 text-slate-200 rounded-bl-none"
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                )
              })}
              <div ref={chatBottomRef} />
            </div>

            <div className="p-3 border-t border-slate-800 flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                placeholder="Type a message…"
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={sendChatMessage}
                disabled={!text.trim()}
                className="p-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CallPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CallInner />
    </Suspense>
  )
}
