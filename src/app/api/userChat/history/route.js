import { connectDB } from "@/lib/mongodb"
import Message from "@/models/Message"
import { NextResponse } from "next/server"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const roomId = searchParams.get("roomId")

  if (!roomId) {
    return NextResponse.json({ message: "roomId required" }, { status: 400 })
  }

  await connectDB()

  const messages = await Message.find({ roomId }).sort({ createdAt: 1 })

  return NextResponse.json({ messages })
}
