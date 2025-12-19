"use client"

import { useState, useEffect, useRef } from "react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { toast, Toaster } from "sonner"
import { socket } from "@/lib/socket"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function AnalyseMood() {
  const [userId, setUserId] = useState("")
  const [moodData, setMoodData] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [lifeLong, setLifeLong] = useState(false)
  const [lifeLine, setLifeLine] = useState(false)
  const [modalStep, setModalStep] = useState(0) // 0=Yes/No,1=Enter ID
  const [modalUserId, setModalUserId] = useState("")
  const [lifeLineName, setLifeLineName] = useState("")
  const [lifeLongCode, setLifeLongCode] = useState("");
  const [showConnections, setShowConnections] = useState(false)
  const [connectionsUserId, setConnectionsUserId] = useState("")
  const [connections, setConnections] = useState([])
  const [connectionsLoading, setConnectionsLoading] = useState(false)
  const [incomingCall, setIncomingCall] = useState(null);

  // Refs for media and connection (use ref to avoid stale closures)
  const peerConnectionRef = useRef(null)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const localStreamRef = useRef(null)

  // ---------- Socket & signalling setup ----------
  useEffect(() => {
    if (!userId) return

    socket.connect()
    socket.emit("register", userId)
    console.log("Socket connected as:", userId)

    // Incoming call request
    socket.on("incoming-call", ({ fromUserId }) => {
      setIncomingCall({ fromUserId })
    })

    // Call accepted by other user -> start as initiator (create offer)
    socket.on("call-accepted", async ({ fromUserId }) => {
      toast.success(`Call accepted by ${fromUserId}`)
      // start call as initiator (create offer)
      await startCallSession(fromUserId, true)
    })

    // Call rejected
    socket.on("call-rejected", ({ fromUserId }) => {
      toast.error(`Call rejected by ${fromUserId}`)
      cleanupCall()
    })

    // WebRTC offer received (we are callee)
    socket.on("webrtc-offer", async ({ fromUserId, offer }) => {
      try {
        await createPeerConnection(fromUserId, false)
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(offer)
          const answer = await peerConnectionRef.current.createAnswer()
          await peerConnectionRef.current.setLocalDescription(answer)
          socket.emit("webrtc-answer", { toUserId: fromUserId, answer })
        }
      } catch (err) {
        console.error("Error handling webrtc-offer:", err)
      }
    })

    // WebRTC answer received (we are initiator)
    socket.on("webrtc-answer", async ({ answer }) => {
      try {
        if (peerConnectionRef.current && answer) {
          await peerConnectionRef.current.setRemoteDescription(answer)
        }
      } catch (err) {
        console.error("Error handling webrtc-answer:", err)
      }
    })

    // ICE candidate from remote
    socket.on("webrtc-ice-candidate", async ({ candidate }) => {
      try {
        if (peerConnectionRef.current && candidate) {
          await peerConnectionRef.current.addIceCandidate(candidate)
        }
      } catch (err) {
        console.error("Error adding remote ICE candidate:", err)
      }
    })

    return () => {
      socket.off("incoming-call")
      socket.off("call-accepted")
      socket.off("call-rejected")
      socket.off("webrtc-offer")
      socket.off("webrtc-answer")
      socket.off("webrtc-ice-candidate")
      socket.disconnect()
    }
  }, [userId])

  // ---------- API / UI functions (unchanged behaviour) ----------
  const fetchMyConnections = async () => {
    if (!connectionsUserId.trim()) {
      toast.error("Please enter a valid ID")
      return
    }

    try {
      setConnectionsLoading(true)
      const res = await fetch(`/api/getConnections?userId=${connectionsUserId}`)
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || "Failed to fetch connections")
        return
      }

      setConnections(data.connections || [])
    } catch {
      toast.error("Something went wrong")
    } finally {
      setConnectionsLoading(false)
    }
  }

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
      const moodMessage = {
        happy: `You deserve to be happy😇. Stay joyful!`,
        sad: `It seems you've had a heavy few days. You've shown strength by checking in.`,
        neutral: `Your emotional energy seems low. Let's rebuild it together.`,
        fear: `Fear is temporary. You've faced uncertainty before and can do it again.`,
        surprised: `Life can be unpredictable. You're handling new moments better than you think.`,
        anger: `Anger can be energy. Let's channel it into something constructive or soothing.`,
      }
      toast(moodMessage[data.maxMood] || "Keep going, you are doing your best.")
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const fetchConnectionsMoods = async () => {
    if (!userId.trim()) {
      toast.error("Please enter a valid ID")
      return
    }

    try {
      const res = await fetch(`/api/getConnections?userId=${userId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to fetch connections")

      const connectionsList = data.connections || []
      if (!connectionsList.length) {
        toast.info("No connections found for this user.")
        return
      }

      const moodMessages = {
        happy: "They seem happy 😇",
        sad: "They are feeling sad. You can reach out!",
        neutral: "They feel neutral. Maybe check in?",
        fear: "They are fearful. Offer support!",
        surprised: "They had surprises. Be there for them!",
        anger: "They are angry. Stay calm and supportive."
      }

      await Promise.all(
        connectionsList.map(async (conn) => {
          try {
            const moodRes = await fetch(`/api/connectionMsg?userId=${conn.userId}`)
            const moodData = await moodRes.json()
            if (!moodRes.ok || !moodData.mood) return

            toast.info(`${conn.name || "Someone"}: ${moodMessages[moodData.mood] || "No mood info"}`)
          } catch (err) {
            console.error("Error fetching connection mood:", err)
          }
        })
      )
    } catch (err) {
      toast.error(err.message || "Something went wrong")
    }
  }

  const handleConnect = (connectionUserId) => {
    toast(`User clicked for ${connectionUserId}`)
    // caller emits with keys that the server expects
    socket.emit("call-request", { fromUserId: userId, toUserId: connectionUserId })
  }

  const handleAnalyze = async () => {
    await fetchMoodData()
    await fetchConnectionsMoods()
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleAnalyze()
  }

  // ---------------- Modal Handlers ----------------
  const handleLifeLongYes = () => setModalStep(1)
  const handleLifeLineYes = () => setModalStep(1)

  const handleLifeLongSubmit = async () => {
    if (!modalUserId.trim()) {
      toast.error("Please enter a valid ID")
      return
    }

    try {
      const checkRes = await fetch(`/api/checkLifeLongCodeInThisID?userId=${modalUserId}`)
      const checkData = await checkRes.json()

      if (!checkRes.ok) throw new Error(checkData.message || "Check failed")

      let codeToShow = ""

      if (checkData.exists) {
        codeToShow = checkData.code
        toast(`A Lifelong code already exists: ${codeToShow}`)
      } else {
        const generateLifeLongCode = () => {
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
          let code = ""
          for (let i = 0; i < 12; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length))
          }
          return code
        }

        codeToShow = generateLifeLongCode()

        const storeRes = await fetch(`/api/addLifeLongCode`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: modalUserId, code: codeToShow }),
        })
        const storeData = await storeRes.json()
        if (!storeRes.ok) throw new Error(storeData.message || "Failed to store code")

        toast.success(`Your Lifelong code: ${codeToShow}`)
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setLifeLong(false)
      setModalStep(0)
      setModalUserId("")
    }
  }

  const handleLifeLineSubmit = async () => {
    if (!modalUserId.trim()) {
      toast.error("Please enter a valid ID")
      return
    }

    try {
      const data = await fetch(`/api/checkUser?userId=${modalUserId}`)
      const res = await data.json()
      if (!data.ok || !res.exists) {
        toast.error("Invalid user id")
        return
      }
      const codeCheck = await fetch(`/api/checkLifeLongCodeInWhole?lifeLongCode=${lifeLongCode}`)
      const codeData = await codeCheck.json()

      if (!codeData.exists) {
        toast.error("Invalid Lifelong Code")
        return
      }

      const lifeLineRes = await fetch("/api/addLifeLineCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: codeData.ownerUserId,
          connection: {
            userId: modalUserId,
            name: lifeLineName || ""
          }
        })
      })
      if (lifeLineRes.ok) {
        toast.success(`You are now connected to ${lifeLineName}`)
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLifeLine(false)
      setModalStep(0)
      setModalUserId("")
      setLifeLineName("")
    }
  }

  // ---------------- WebRTC helpers (use refs)
  const createPeerConnection = async (otherUserId, isInitiator) => {
    // clean previous
    cleanupCall()

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
      ]
    })
    peerConnectionRef.current = pc

    // attach remote stream to remote video element
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        // event.streams[0] is usually available
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc-ice-candidate", { toUserId: otherUserId, candidate: event.candidate })
      }
    }

    try {
      const local = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      localStreamRef.current = local
      if (localVideoRef.current) localVideoRef.current.srcObject = local
      local.getTracks().forEach((track) => pc.addTrack(track, local))
    } catch (err) {
      console.error("getUserMedia error:", err)
      toast.error("Could not access camera/microphone")
      throw err
    }

    if (isInitiator) {
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      socket.emit("webrtc-offer", { toUserId: otherUserId, offer })
    }

    return pc
  }

  const startCallSession = async (otherUserId, isInitiator) => {
    await createPeerConnection(otherUserId, isInitiator)
  }

  const cleanupCall = () => {
    if (peerConnectionRef.current) {
      try {
        peerConnectionRef.current.close()
      } catch (err) {}
    }
    peerConnectionRef.current = null

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop())
    }
    localStreamRef.current = null

    if (localVideoRef.current) localVideoRef.current.srcObject = null
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
  }

  // handle accept/reject buttons — emit keys that match server expectation
  const acceptIncomingCall = () => {
    if (!incomingCall) return
    socket.emit("call-accept", { fromUserId: userId, toUserId: incomingCall.fromUserId })
    setIncomingCall(null)
  }

  const rejectIncomingCall = () => {
    if (!incomingCall) return
    socket.emit("call-reject", { fromUserId: userId, toUserId: incomingCall.fromUserId })
    setIncomingCall(null)
  }

  // ---------------- Modal renderers (unchanged, but rely on above handlers) ----------------
  const renderModal = () => {
    if (!lifeLong && !lifeLine) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl max-w-md w-full text-white">
          {modalStep === 0 && (
            <div className="space-y-4">
              <p>
                {lifeLong
                  ? "Stay supported without giving away your identity. Create a Lifelong Code and share it with a trusted person—if your mood is consistently low, they will receive a safe, anonymous alert to help you. Do you want to proceed?"
                  : "Stay connected with a trusted person through Lifeline. When their mood signals distress, you'll get a notification so you can offer support—no personal info is shared. Do you want to proceed?"}
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 bg-indigo-600 rounded-lg"
                  onClick={lifeLong ? handleLifeLongYes : handleLifeLineYes}
                >
                  Yes
                </button>
                <button
                  className="px-4 py-2 bg-red-600 rounded-lg"
                  onClick={() => {
                    setLifeLong(false)
                    setLifeLine(false)
                  }}
                >
                  No
                </button>
              </div>
            </div>
          )}

          {modalStep === 1 && lifeLong && (
            <div className="space-y-4">
              <p>Enter your user ID to generate a Lifelong code:</p>
              <input
                type="text"
                value={modalUserId}
                onChange={(e) => setModalUserId(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-700/50 text-white"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleLifeLongSubmit}
                  className="px-4 py-2 bg-indigo-600 rounded-lg"
                >
                  Generate Code
                </button>
                <button
                  onClick={() => {
                    setLifeLong(false)
                    setModalStep(0)
                    setModalUserId("")
                  }}
                  className="px-4 py-2 bg-red-600 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {modalStep === 1 && lifeLine && (
            <div className="space-y-4">
              <p>Enter your user ID:</p>
              <input
                type="text"
                value={modalUserId}
                onChange={(e) => setModalUserId(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-700/50 text-white"
              />
              <p>Enter THEIR Lifelong Code:</p>
              <input
                type="text"
                placeholder="Their 12-digit code"
                value={lifeLongCode}
                onChange={(e) => setLifeLongCode(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-700/50 text-white"
              />
              <input
                type="text"
                placeholder="Give a name for this connection"
                value={lifeLineName}
                onChange={(e) => setLifeLineName(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-700/50 text-white"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleLifeLineSubmit}
                  className="px-4 py-2 bg-indigo-600 rounded-lg"
                >
                  Connect
                </button>
                <button
                  onClick={() => {
                    setLifeLine(false)
                    setModalStep(0)
                    setModalUserId("")
                    setLifeLineName("")
                    setLifeLongCode("")
                  }}
                  className="px-4 py-2 bg-red-600 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderConnectionsModal = () => {
    if (!showConnections) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl max-w-md w-full text-white space-y-6">
          {connections.length === 0 && (
            <>
              <p className="text-lg font-semibold">Enter your User ID</p>

              <input
                type="text"
                value={connectionsUserId}
                onChange={(e) => setConnectionsUserId(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-700/50 text-white"
                placeholder="Your ID"
              />

              <div className="flex justify-end gap-4">
                <button
                  onClick={fetchMyConnections}
                  className="px-4 py-2 bg-indigo-600 rounded-lg"
                  disabled={connectionsLoading}
                >
                  {connectionsLoading ? "Loading..." : "OK"}
                </button>

                <button
                  onClick={() => {
                    setShowConnections(false)
                    setConnections([])
                    setConnectionsUserId("")
                  }}
                  className="px-4 py-2 bg-red-600 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          {connections.length > 0 && (
            <>
              <h3 className="text-xl font-bold mb-4">My Connections</h3>

              <div className="space-y-3">
                {connections.map((conn) => (
                  <div
                    key={conn.userId}
                    className="flex items-center justify-between bg-slate-800/60 p-3 rounded-lg"
                  >
                    <span className="font-medium">{conn.name || "Unnamed"}</span>

                    <button
                      className="px-4 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold"
                      onClick={() => handleConnect(conn.userId)}
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setShowConnections(false)
                    setConnections([])
                    setConnectionsUserId("")
                  }}
                  className="px-4 py-2 bg-red-600 rounded-lg"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // ---------------- Mood Data Colors & Total ----------------
  const moodColors = ["#6366F1", "#EC4899", "#3B82F6", "#F59E0B", "#10B981", "#F43F5E", "#A855F7"]
  const totalMoods = moodData ? Object.values(moodData).reduce((a, b) => a + b, 0) : 0

  // ---------------- Render ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
      <div className="flex justify-end">
        <div className="px-8 py-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition shadow-lg hover:shadow-xl m-3">
          <button onClick={() => setLifeLong(true)}>LifeLong code</button>
        </div>
        <div className="px-8 py-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition shadow-lg hover:shadow-xl m-3">
          <button onClick={() => setLifeLine(true)}>Get LifeLine</button>
        </div>
        <div className="px-8 py-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition shadow-lg hover:shadow-xl m-3">
          <button onClick={() => setShowConnections(true)}>My Connections</button>
        </div>
      </div>

      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Toaster position="top-right" richColors />

          {/* Input Card */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
            <label className="block text-sm font-semibold text-slate-300 mb-4">Enter Your ID</label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter your unique ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition"
              />
              <button
                onClick={handleAnalyze}
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

          {incomingCall && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-slate-900 p-6 rounded-xl text-white">
                <p>User {incomingCall.fromUserId} is calling you</p>
                <button
                  className="px-4 py-2 bg-green-600 rounded-lg mr-2"
                  onClick={acceptIncomingCall}
                >
                  Accept
                </button>
                <button
                  className="px-4 py-2 bg-red-600 rounded-lg"
                  onClick={rejectIncomingCall}
                >
                  Reject
                </button>
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

      <div className="flex gap-4 mt-6">
        <video ref={localVideoRef} autoPlay muted playsInline className="w-64 h-48 rounded-xl bg-black" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-64 h-48 rounded-xl bg-black" />
      </div>

      {/* Render Modals */}
      {renderModal()}
      {renderConnectionsModal()}
    </div>
  )
}