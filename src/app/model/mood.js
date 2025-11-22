import '@/app/utils/db'
import mongoose from "mongoose";
const detectedMood = new mongoose.Schema({
    userId:{
        type:Number,
        required:false
    },
    mood:{
        type:String,
        required:true
    }
})
const Mood = mongoose.models.Mood || mongoose.model("Mood",detectedMood);
export default Mood;