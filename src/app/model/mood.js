import '@/app/utils/db'
import mongoose from "mongoose";
const detectedMood = new mongoose.Schema({
    userId:{
        type:Number,
        required:false,
        unique:true
    },
    mood:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now,
        required:true
    },
    lifeLongCode:{
        type:String,
        required:false,
        default:null
    },
    connections:[
    {
        userId:{
            type:Number,
            required:false
        },
        name:{
            type:String,
            required:false
        }
    }
    ]
})
const Mood = mongoose.models.Mood || mongoose.model("Mood",detectedMood);
export default Mood;