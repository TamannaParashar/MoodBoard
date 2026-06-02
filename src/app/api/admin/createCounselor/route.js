import '@/app/utils/db'
import Counselor from '@/app/model/counselor'

// Protected route — only you (admin) can call this
// Pass header: Authorization: Bearer <ADMIN_SECRET from .env>

export async function POST(req) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '').trim()

  if (token !== process.env.ADMIN_SECRET) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, slug, photo, title, bio, specializations, languages, sessionTypes, password } = body

    if (!name || !slug || !photo || !title || !bio || !password) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const counselor = new Counselor({
      name,
      slug,
      photo,
      title,
      bio,
      specializations: specializations || [],
      languages: languages || ['English'],
      sessionTypes: sessionTypes || ['video', 'chat'],
      password, // will be hashed by the pre-save hook in the model
    })

    await counselor.save()

    return Response.json({
      message: 'Counselor created successfully',
      id: counselor._id,
      slug: counselor.slug,
    }, { status: 201 })
  } catch (err) {
    if (err.code === 11000) {
      return Response.json({ message: 'A counselor with this slug already exists' }, { status: 409 })
    }
    console.error(err)
    return Response.json({ message: 'Server error' }, { status: 500 })
  }
}

// GET — list all counselors including unavailable ones (admin view)
export async function GET(req) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '').trim()

  if (token !== process.env.ADMIN_SECRET) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const counselors = await Counselor.find().select('-password').lean()
  return Response.json({ counselors })
}
