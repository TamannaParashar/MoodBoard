import '@/app/utils/db'
import Counselor from '@/app/model/counselor'

// Map moods to which specializations are most relevant
const MOOD_SPECIALIZATION_MAP = {
  sad: ['depression', 'grief', 'self-esteem', 'general'],
  disgusted: ['depression', 'self-esteem', 'anger', 'general'],
  fearful: ['anxiety', 'trauma', 'stress', 'general'],
  angry: ['anger', 'stress', 'conflict', 'general'],
  neutral: ['burnout', 'motivation', 'general'],
  surprised: ['trauma', 'life-transitions', 'general'],
  happy: ['general', 'motivation'],
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const mood = searchParams.get('mood')
  const counselorId = searchParams.get('id')

  try {
    // Single counselor detail
    if (counselorId) {
      const counselor = await Counselor.findById(counselorId)
        .select('-password')
        .lean()
      if (!counselor) return Response.json({ message: 'Not found' }, { status: 404 })
      return Response.json({ counselor })
    }

    // Counselor listing — filter by mood relevance
    const relevantSpecs = mood ? (MOOD_SPECIALIZATION_MAP[mood] || ['general']) : []

    // First get counselors matching the specialization
    const recommended = relevantSpecs.length
      ? await Counselor.find({
          available: true,
          inSession: false,
          specializations: { $in: relevantSpecs },
        }).select('-password').lean()
      : []

    // Also get all other available counselors not already in the list
    const recommendedIds = recommended.map((c) => c._id.toString())
    const others = await Counselor.find({
      available: true,
      inSession: false,
      _id: { $nin: recommendedIds },
    }).select('-password').lean()

    return Response.json({ recommended, others })
  } catch (err) {
    console.error(err)
    return Response.json({ message: 'Server error' }, { status: 500 })
  }
}
