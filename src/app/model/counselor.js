import '@/app/utils/db'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const counselorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // e.g. "priya-sharma"
  photo: { type: String, required: true },              // e.g. "/counselors/priya.jpg"
  title: { type: String, required: true },              // "Clinical Psychologist, 8 yrs exp"
  bio: { type: String, required: true },
  specializations: [{ type: String }],                  // ["depression","anxiety","grief"]
  languages: [{ type: String }],                        // ["English","Hindi"]
  sessionTypes: [{ type: String, default: ['video', 'chat'] }],
  available: { type: Boolean, default: true },          // admin toggle
  inSession: { type: Boolean, default: false },         // true when actively in a call
  password: { type: String, required: true },           // bcrypt hashed
})

// Hash password before saving if modified
counselorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

const Counselor = mongoose.models.Counselor || mongoose.model('Counselor', counselorSchema)
export default Counselor
