import '@/app/utils/db'
import mongoose from 'mongoose'

const sessionRequestSchema = new mongoose.Schema({
  sessionToken: { type: String, required: true, unique: true }, // UUID given to user
  counselorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Counselor', required: true },
  moodPattern: [{ type: String }], // e.g. ["sad","sad","fearful","disgusted"]
  userMessage: { type: String, default: '' }, // optional message, no PII
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined', 'active', 'closed'],
    default: 'pending'
  },
  roomId: { type: String, default: null }, // generated on approval for the call
  createdAt: { type: Date, default: Date.now }
})

const SessionRequest =
  mongoose.models.SessionRequest ||
  mongoose.model('SessionRequest', sessionRequestSchema)

export default SessionRequest
