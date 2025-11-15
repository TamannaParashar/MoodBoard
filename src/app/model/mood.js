import '@/app/utils/db'
import mongoose from "mongoose";
const detectedMood = new mongoose.Schema({
    mood:{
        type:String,
        required:true
    }
})
const Mood = mongoose.model.Mood || mongoose.model("Mood",detectedMood);
export default Mood;