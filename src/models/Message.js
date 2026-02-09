import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, index: true },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema)
