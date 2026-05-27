import { Server } from "socket.io"
import { connectDB } from "./mongodb.js"
import Message from "../models/Message.js"

let io

// Track how many participants are in each call room
const callRoomParticipants = {}

export function initSocket(server) {
  if (io) return io

  io = new Server(server, {
    cors: { origin: "*" },
  })

  io.on("connection", (socket) => {
    // ── Existing chat room join ──────────────────────────────────────────────
    socket.on("join-room", (roomId) => {
      socket.join(roomId)
    })

    socket.on("send-message", async (data) => {
      await connectDB()
      const msg = await Message.create(data)
      io.to(data.roomId).emit("receive-message", msg)
    })

    // ── Video call room join ─────────────────────────────────────────────────
    // Separate event so chat rooms and call rooms don't interfere
    socket.on("join-call", (roomId) => {
      socket.join(roomId)
      socket.data.callRoom = roomId

      if (!callRoomParticipants[roomId]) callRoomParticipants[roomId] = 0
      callRoomParticipants[roomId]++

      // When both participants are in the room, signal them to start WebRTC
      if (callRoomParticipants[roomId] === 2) {
        io.to(roomId).emit("peer-joined")
      }
    })

    // ── WebRTC Signaling ─────────────────────────────────────────────────────
    // Relay SDP offer from counselor to user
    socket.on("webrtc-offer", ({ roomId, offer }) => {
      socket.to(roomId).emit("webrtc-offer", offer)
    })

    // Relay SDP answer from user to counselor
    socket.on("webrtc-answer", ({ roomId, answer }) => {
      socket.to(roomId).emit("webrtc-answer", answer)
    })

    // Relay ICE candidates between both parties
    socket.on("webrtc-ice", ({ roomId, candidate }) => {
      socket.to(roomId).emit("webrtc-ice", candidate)
    })

    // Either party ended the call
    socket.on("call-ended", (roomId) => {
      io.to(roomId).emit("call-ended")
      delete callRoomParticipants[roomId]
    })

    // Clean up on disconnect
    socket.on("disconnect", () => {
      const room = socket.data.callRoom
      if (room && callRoomParticipants[room]) {
        callRoomParticipants[room]--
        if (callRoomParticipants[room] <= 0) {
          delete callRoomParticipants[room]
        }
        // Notify remaining participant that the other left
        socket.to(room).emit("call-ended")
      }
    })
  })

  return io
}
