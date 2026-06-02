import '@/app/utils/db'
import Counselor from '@/app/model/counselor'
import SessionRequest from '@/app/model/sessionRequest'
import { v4 as uuidv4 } from 'uuid'

// POST — user submits a session request
// GET  — user polls status (?token=) OR counselor fetches requests (?counselorId=)
// PATCH — counselor approves/declines (?action=approve|decline&token=&counselorId=)
// DELETE — close an active session (?token=)

export async function POST(req) {
  try {
    const { counselorId, moodPattern, userMessage } = await req.json()

    if (!counselorId || !moodPattern?.length) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Check counselor is actually available and not in a session
    const counselor = await Counselor.findById(counselorId)
    if (!counselor || !counselor.available || counselor.inSession) {
      return Response.json({ message: 'Counselor is not available right now' }, { status: 409 })
    }

    const sessionToken = uuidv4()
    const roomId = `room_${uuidv4().replace(/-/g, '').slice(0, 16)}`

    const sessionReq = await SessionRequest.create({
      sessionToken,
      counselorId,
      moodPattern,
      userMessage: userMessage || '',
      roomId, // pre-generate so it's ready when approved
    })

    return Response.json({ sessionToken, counselorName: counselor.name }, { status: 201 })
  } catch (err) {
    console.error(err)
    return Response.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  const counselorId = searchParams.get('counselorId')

  try {
    // User polls their own request status
    if (token) {
      const session = await SessionRequest.findOne({ sessionToken: token })
        .populate('counselorId', 'name photo title')
        .lean()

      if (!session) return Response.json({ message: 'Session not found' }, { status: 404 })

      return Response.json({
        status: session.status,
        roomId: session.roomId,
        counselor: session.counselorId,
      })
    }

    // Counselor fetches their pending requests
    if (counselorId) {
      const sessions = await SessionRequest.find({
        counselorId,
        status: 'pending',
      })
        .sort({ createdAt: 1 })
        .lean()

      return Response.json({ sessions })
    }

    return Response.json({ message: 'Provide token or counselorId' }, { status: 400 })
  } catch (err) {
    console.error(err)
    return Response.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const { token, action, counselorId } = await req.json()

    if (!token || !action || !counselorId) {
      return Response.json({ message: 'Missing fields' }, { status: 400 })
    }

    const session = await SessionRequest.findOne({ sessionToken: token })
    if (!session) return Response.json({ message: 'Session not found' }, { status: 404 })

    // Verify this counselor owns this request
    if (session.counselorId.toString() !== counselorId) {
      return Response.json({ message: 'Unauthorized' }, { status: 403 })
    }

    if (action === 'approve') {
      // Enforce one-at-a-time: check counselor not already in session
      const counselor = await Counselor.findById(counselorId)
      if (counselor.inSession) {
        return Response.json({ message: 'You are already in a session' }, { status: 409 })
      }

      session.status = 'approved'
      await session.save()

      // Lock counselor — they cannot approve another request until this one closes
      await Counselor.findByIdAndUpdate(counselorId, { inSession: true })

      return Response.json({ status: 'approved', roomId: session.roomId })
    }

    if (action === 'decline') {
      session.status = 'declined'
      await session.save()
      return Response.json({ status: 'declined' })
    }

    return Response.json({ message: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error(err)
    return Response.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { token } = await req.json()
    if (!token) return Response.json({ message: 'Missing token' }, { status: 400 })

    const session = await SessionRequest.findOne({ sessionToken: token })
    if (!session) return Response.json({ message: 'Not found' }, { status: 404 })

    session.status = 'closed'
    await session.save()

    // Unlock counselor — they can now accept new requests
    await Counselor.findByIdAndUpdate(session.counselorId, { inSession: false })

    return Response.json({ status: 'closed' })
  } catch (err) {
    console.error(err)
    return Response.json({ message: 'Server error' }, { status: 500 })
  }
}
