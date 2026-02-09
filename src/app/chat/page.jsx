"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import io from "socket.io-client"

export default function ChatPage() {
  const searchParams = useSearchParams()
  const roomId = searchParams.get("roomId")
  const to = searchParams.get("to")

  const [from, setFrom] = useState(null)
  const socketRef = useRef(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const bottomRef = useRef(null)

  useEffect(() => {
  const userId = localStorage.getItem("userId")
  console.log("🧠 localStorage userId:", userId)
  setFrom(userId)
}, [])

  useEffect(() => {
    if (!roomId || !from || !to) return

    socketRef.current = io("http://localhost:3000")

    socketRef.current.emit("join-room", roomId)

    socketRef.current.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    fetch(`/api/userChat/history?roomId=${roomId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data.messages || []))

    return () => {
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [roomId, from, to])

  const sendMessage = () => {
    if (!text.trim() || !socketRef.current) return

    socketRef.current.emit("send-message", {
      roomId,
      senderId: from,      // ✅ auto-filled
      receiverId: to,
      message: text,
    })

    setText("")
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`max-w-xs p-3 rounded-lg ${
              m.senderId === from ? "bg-indigo-600 ml-auto" : "bg-slate-700"
            }`}
          >
            {m.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 flex gap-3 border-t border-slate-700">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-3 rounded bg-slate-800"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          disabled={!from}
          className="px-6 bg-indigo-600 rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}
