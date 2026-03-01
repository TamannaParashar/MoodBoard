"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import io from "socket.io-client"

export default function ChatPage() {
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <h2 className="text-lg font-semibold">Chat</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
        {messages.map((m, index) => {
          const isMine =
            m.senderId?.toString() === from?.toString()

          return (
            <div
              key={m._id || index}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl text-sm shadow-md transition-all ${
                  isMine
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-slate-800 text-slate-200 rounded-bl-none"
                }`}
              >
                {m.message}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Section */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 p-3 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-indigo-500 transition"
          />
          <button
            onClick={sendMessage}
            disabled={!from}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}