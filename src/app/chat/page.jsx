"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Send, MessageCircle, Loader2 } from "lucide-react"
import io from "socket.io-client"

function ChatContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roomId = searchParams.get("roomId")
  const to = searchParams.get("to")

  const [from, setFrom] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const socketRef = useRef(null)
  const bottomRef = useRef(null)

  // Get current user from localStorage
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (userId) {
      setFrom(userId)
    }
  }, [])

  // Socket connection
  useEffect(() => {
    if (!roomId || !from || !to) return

    const socket = io("http://localhost:3000")
    socketRef.current = socket

    socket.emit("join-room", roomId)

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    // Fetch chat history
    fetch(`/api/userChat/history?roomId=${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || [])
      })

    return () => {
      socket.disconnect()
    }
  }, [roomId, from, to])

  // Auto scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!text.trim() || !socketRef.current) return

    const messageData = {
      roomId,
      senderId: from,
      receiverId: to,
      message: text.trim(),
    }

    socketRef.current.emit("send-message", messageData)
    setText("")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-all text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-purple-400" />
              Secure Conversation
            </h2>
          </div>

          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
            End-to-End Chat
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col max-w-4xl w-full mx-auto relative z-10">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 py-20">
            <MessageCircle className="w-12 h-12 text-slate-500 mb-3" />
            <p className="font-semibold text-slate-300">Your chat is empty</p>
            <p className="text-xs text-slate-500">Send a message to start the conversation.</p>
          </div>
        ) : (
          messages.map((m, index) => {
            const isMine = m.senderId?.toString() === from?.toString()
            return (
              <div
                key={m._id || index}
                className={`flex ${isMine ? "justify-end" : "justify-start"} animate-fadeIn`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl text-sm shadow-md transition-all border ${
                    isMine
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-500/20 text-white rounded-br-none"
                      : "bg-slate-900 border-slate-800 text-slate-200 rounded-bl-none"
                  }`}
                >
                  <p className="leading-relaxed">{m.message}</p>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Section */}
      <footer className="p-4 border-t border-slate-800/60 bg-slate-950/40 backdrop-blur-md relative z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message safely and anonymously..."
            className="flex-1 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-white placeholder-slate-500 text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!from || !text.trim()}
            className="p-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center text-white"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center flex-col">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
        <p className="text-slate-400 font-semibold text-sm">Opening secure chat...</p>
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}