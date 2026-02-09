import '@/app/utils/db'
import Message from '@/models/Message'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const roomId = searchParams.get("roomId")
  if (!roomId) return new Response(JSON.stringify({ message: "roomId is required" }), { status: 400 })

  const messages = await Mess.find({ roomId }).sort({ createdAt: 1 })
  return new Response(JSON.stringify({ messages }), { status: 200 })
}

export async function POST(req) {
  const { roomId, fromUserId, toUserId, text } = await req.json()

  if (!roomId || !fromUserId || !toUserId || !text)
    return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 })

  const message = await Message.create({ roomId, fromUserId, toUserId, text })
  return new Response(JSON.stringify({ message }), { status: 201 })
}
