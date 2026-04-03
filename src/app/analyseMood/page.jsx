"use client"

import { useState, useEffect, useRef } from "react"
import MoodGalaxy from "./MoodGalaxy"
import { toast, Toaster } from "sonner"
import { useRouter } from "next/navigation"
import { X, Heart, Users, Shield, TrendingUp, Send, ArrowRight, Trash2, Edit2, Check } from "lucide-react"


export default function AnalyseMood() {
  const [userId, setUserId] = useState("")
  const [moodData, setMoodData] = useState(null)
  const [rawHistory, setRawHistory] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [lifeLong, setLifeLong] = useState(false)
  const [lifeLine, setLifeLine] = useState(false)
  const [modalStep, setModalStep] = useState(0)
  const [modalUserId, setModalUserId] = useState("")
  const [lifeLineName, setLifeLineName] = useState("")
  const [lifeLongCode, setLifeLongCode] = useState("")
  const [showConnections, setShowConnections] = useState(false)
  const [connectionsUserId, setConnectionsUserId] = useState("")
  const [connections, setConnections] = useState([])
  const [connectionsLoading, setConnectionsLoading] = useState(false)
  const [hasSearchedConnections, setHasSearchedConnections] = useState(false)
  const [editingConnectionId, setEditingConnectionId] = useState(null)
  const [editName, setEditName] = useState("")

  const router = useRouter()

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
      setHasSearchedConnections(true)
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
      setRawHistory(data.rawHistory || [])
      const moodMessage = {
        happy: `You deserve to be happy 😇. Stay joyful!`,
        sad: `It seems you've had a heavy few days. You've shown strength by checking in.`,
        neutral: `Your emotional energy seems low. Let's rebuild it together.`,
        fear: `Fear is temporary. You've faced uncertainty before and can do it again.`,
        surprised: `Life can be unpredictable. You're handling new moments better than you think.`,
        anger: `Anger can be energy. Let's channel it into something constructive or soothing.`,
      }
      toast.success(moodMessage[data.maxMood] || "Keep going, you are doing your best.")
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
    const roomId = [userId, connectionUserId].sort().join("_")
    router.push(`/chat?roomId=${roomId}&from=${userId}&to=${connectionUserId}`)
  }

  const handleDeleteConnection = async (connectionUserId) => {
    try {
      setConnectionsLoading(true)
      const res = await fetch(`/api/deleteConnection?ownerUserId=${connectionsUserId}&connectionUserId=${connectionUserId}`, {
        method: "DELETE",
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || "Failed to delete connection")
        return
      }

      toast.success("Connection deleted successfully")
      setConnections((prev) => prev.filter((c) => c.userId !== connectionUserId))
    } catch {
      toast.error("Something went wrong while deleting")
    } finally {
      setConnectionsLoading(false)
    }
  }

  const handleEditConnection = (conn) => {
    setEditingConnectionId(conn.userId)
    setEditName(conn.name || "")
  }

  const handleSaveEdit = async (connectionUserId) => {
    try {
      setConnectionsLoading(true)
      const res = await fetch(`/api/updateConnection?ownerUserId=${connectionsUserId}&connectionUserId=${connectionUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName })
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || "Failed to rename connection")
        return
      }

      toast.success("Connection renamed successfully")
      setConnections((prev) =>
        prev.map((c) => (c.userId === connectionUserId ? { ...c, name: editName } : c))
      )
      setEditingConnectionId(null)
      setEditName("")
    } catch {
      toast.error("Something went wrong while renaming")
    } finally {
      setConnectionsLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!userId.trim()) {
      toast.error("Please enter a valid ID")
      return
    }
    localStorage.setItem("userId", userId)
    await fetchMoodData()
    await fetchConnectionsMoods()
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleAnalyze()
  }

  // Modal Handlers
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
        toast.success(`A Lifelong code already exists: ${codeToShow}`)
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

  const renderModal = () => {
    if (!lifeLong && !lifeLine) return null

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-white border border-slate-700">
          <div className="absolute -top-3 -right-3">
            <button
              onClick={() => {
                setLifeLong(false)
                setLifeLine(false)
                setModalStep(0)
              }}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {modalStep === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-3">
                  {lifeLong ? "Create a Lifelong Code" : "Join Lifeline"}
                </h3>
                <p className="text-slate-300">
                  {lifeLong
                    ? "Stay supported without giving away your identity. Create a Lifelong Code and share it with a trusted person—if your mood is consistently low, they will receive a safe, anonymous alert to help you."
                    : "Stay connected with a trusted person through Lifeline. When their mood signals distress, you'll get a notification so you can offer support—no personal info is shared."}
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                  onClick={() => {
                    setLifeLong(false)
                    setLifeLine(false)
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium transition-colors"
                  onClick={lifeLong ? handleLifeLongYes : handleLifeLineYes}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {modalStep === 1 && lifeLong && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Enter Your User ID</h3>
              <input
                type="text"
                value={modalUserId}
                onChange={(e) => setModalUserId(e.target.value)}
                placeholder="Your unique ID"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setLifeLong(false)
                    setModalStep(0)
                    setModalUserId("")
                  }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLifeLongSubmit}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  Generate <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {modalStep === 1 && lifeLine && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Connect with Lifeline</h3>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Your User ID</label>
                <input
                  type="text"
                  value={modalUserId}
                  onChange={(e) => setModalUserId(e.target.value)}
                  placeholder="Your ID"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Their Lifelong Code</label>
                <input
                  type="text"
                  placeholder="12-character code"
                  value={lifeLongCode}
                  onChange={(e) => setLifeLongCode(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Connection Name</label>
                <input
                  type="text"
                  placeholder="e.g., Best Friend"
                  value={lifeLineName}
                  onChange={(e) => setLifeLineName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setLifeLine(false)
                    setModalStep(0)
                    setModalUserId("")
                    setLifeLineName("")
                    setLifeLongCode("")
                  }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLifeLineSubmit}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  Connect <Users className="w-4 h-4" />
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-white border border-slate-700">
          {!hasSearchedConnections ? (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">My Connections</h3>
              <div>
                <label className="block text-sm font-medium mb-3 text-slate-300">Enter Your User ID</label>
                <input
                  type="text"
                  value={connectionsUserId}
                  onChange={(e) => setConnectionsUserId(e.target.value)}
                  placeholder="Your ID"
                  className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowConnections(false)
                    setHasSearchedConnections(false)
                  }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={fetchMyConnections}
                  disabled={connectionsLoading}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 rounded-lg font-medium transition-colors"
                >
                  {connectionsLoading ? "Loading..." : "View"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">My Connections</h3>
              {connections.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-slate-700 rounded-xl bg-slate-800/30">
                  <Users className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
                  <p className="text-slate-300 font-semibold mb-1">You don't have any connections yet.</p>
                  <p className="text-sm text-slate-500">Share your Lifelong code to start connecting!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {connections.map((conn) => (
                    <div
                      key={conn.userId}
                      className="flex items-center justify-between bg-slate-800/60 p-4 rounded-lg border border-slate-700 hover:border-purple-400/50 transition-colors"
                    >
                      {editingConnectionId === conn.userId ? (
                        <div className="flex items-center gap-2 flex-1 mr-4">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold">{conn.name || "Unnamed"}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        {editingConnectionId === conn.userId ? (
                          <>
                            <button
                              className="p-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center"
                              onClick={() => handleSaveEdit(conn.userId)}
                              title="Save name"
                              disabled={connectionsLoading}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center"
                              onClick={() => {
                                setEditingConnectionId(null)
                                setEditName("")
                              }}
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg text-sm font-semibold transition-colors"
                              onClick={() => handleConnect(conn.userId)}
                            >
                              Chat
                            </button>
                            <button
                              className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center"
                              onClick={() => handleEditConnection(conn)}
                              title="Edit name"
                            >
                              <Edit2 className="w-4 h-4 text-slate-300" />
                            </button>
                            <button
                              className="p-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center"
                              onClick={() => handleDeleteConnection(conn.userId)}
                              title="Delete connection"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => {
                  setShowConnections(false)
                  setConnections([])
                  setConnectionsUserId("")
                  setHasSearchedConnections(false)
                }}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const moodColors = ["#6366F1", "#EC4899", "#3B82F6", "#F59E0B", "#10B981", "#F43F5E"]
  const totalMoods = moodData ? Object.values(moodData).reduce((a, b) => a + b, 0) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-slate-800/50 bg-gradient-to-b from-slate-950/80 to-transparent backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-purple-400" />
            <h1 className="text-2xl font-bold">Mood Analysis</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConnections(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">My Connections</span>
            </button>
            <button
              onClick={() => setLifeLong(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Lifelong</span>
            </button>
            <button
              onClick={() => setLifeLine(true)}
              className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Lifeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Input Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
            <label className="block text-sm font-semibold text-slate-300 mb-4">Enter Your User ID</label>
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                type="text"
                placeholder="Enter your unique ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition"
              />
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-all transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-12 p-6 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <p>{error}</p>
          </div>
        )}

        {/* Charts & Stats */}
        {moodData && (
          <div className="space-y-8">
            {/* 3D Galaxy Chart */}
            <div className="w-full h-[500px] mb-8">
              <MoodGalaxy rawHistory={rawHistory} />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-2">Total Moods Tracked</p>
                    <p className="text-4xl font-bold">{totalMoods}</p>
                  </div>
                  <div className="text-5xl opacity-20">📊</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-400/30 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-2">Most Frequent Mood</p>
                    <p className="text-3xl font-bold capitalize">
                      {moodData && Object.keys(moodData).reduce((a, b) => moodData[a] > moodData[b] ? a : b)}
                    </p>
                  </div>
                  <div className="text-5xl opacity-20">✨</div>
                </div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Mood Breakdown</h3>
              <div className="space-y-4">
                {Object.entries(moodData).map(([mood, count], index) => (
                  <div key={mood}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{mood}</span>
                      <span className="text-slate-400">{count} times</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(count / totalMoods) * 100}%`,
                          backgroundColor: moodColors[index],
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!moodData && !loading && !error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-2xl font-bold mb-2">Ready to Analyze Your Moods?</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">Enter your user ID above to see your emotional journey and get insights about your mood patterns</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {renderModal()}
      {renderConnectionsModal()}
    </div>
  )
}
