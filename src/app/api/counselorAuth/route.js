import '@/app/utils/db'
import Counselor from '@/app/model/counselor'
import bcrypt from 'bcryptjs'

export async function POST(req) {
  try {
    const { slug, password } = await req.json()

    if (!slug || !password) {
      return Response.json({ message: 'Missing credentials' }, { status: 400 })
    }

    const counselor = await Counselor.findOne({ slug })
    if (!counselor) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const match = await bcrypt.compare(password, counselor.password)
    if (!match) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    // Return safe profile — no password
    return Response.json({
      id: counselor._id,
      name: counselor.name,
      photo: counselor.photo,
      title: counselor.title,
      inSession: counselor.inSession,
    })
  } catch (err) {
    console.error(err)
    return Response.json({ message: 'Server error' }, { status: 500 })
  }
}
