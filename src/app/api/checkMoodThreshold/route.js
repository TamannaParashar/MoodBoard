import '@/app/utils/db'
import Mood from '@/app/model/mood'

const DISTRESS_MOODS = new Set(['sad', 'fearful', 'angry', 'disgusted'])

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return Response.json({ message: 'Missing userId' }, { status: 400 })
  }

  try {
    // Get the last 5 mood entries for this user, newest first
    const recentEntries = await Mood.find({ userId })
      .sort({ date: -1 })
      .limit(5)
      .lean()

    if (!recentEntries.length) {
      return Response.json({ thresholdMet: false, recentPattern: [], distressCount: 0 })
    }

    const recentPattern = recentEntries.map((e) => e.mood)
    const distressCount = recentPattern.filter((m) => DISTRESS_MOODS.has(m)).length

    // Threshold: 4 out of last 5 (or all of last 3 if fewer than 5 entries)
    const total = recentPattern.length
    const thresholdMet = total >= 3 && distressCount >= Math.ceil(total * 0.7)

    return Response.json({ thresholdMet, recentPattern, distressCount, total })
  } catch (err) {
    console.error(err)
    return Response.json({ message: 'Server error' }, { status: 500 })
  }
}
