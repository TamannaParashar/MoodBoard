import { connectDB } from "@/lib/mongodb"
import Message from "@/models/Message"
import { NextResponse } from "next/server"

export async function POST(req) {
  const body = await req.json()
  const { roomId, senderId, receiverId, message } = body

  if (!roomId || !senderId || !receiverId || !message) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 })
  }

  await connectDB()

  const msg = await Message.create({
    roomId,
    senderId,
    receiverId,
    message,
  })

  return NextResponse.json({ msg })
}
