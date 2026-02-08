import { io } from "socket.io-client"

export const socket = io("https://moodboard-9bc5.onrender.com", {
  autoConnect: false
})
