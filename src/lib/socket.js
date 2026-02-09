import { Server } from "socket.io"
import { connectDB } from "./mongodb.js"
import Message from "../models/Message.js"

let io

export function initSocket(server) {
  if (io) return io

  io = new Server(server, {
    cors: { origin: "*" },
  })

  io.on("connection", (socket) => {
    socket.on("join-room", (roomId) => {
      socket.join(roomId)
    })

    socket.on("send-message", async (data) => {
      await connectDB()

      const msg = await Message.create(data)
      io.to(data.roomId).emit("receive-message", msg)
    })
  })

  return io
}
