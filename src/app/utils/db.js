import mongoose from "mongoose"
const url = "mongodb://localhost:27017/moodboard"
mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const db = mongoose.connection
db.on("connected",()=>{
    console.log("Connected to MongoDB");
})
db.on("disconnected",()=>{
    console.log("Disconnected from MongoDB");
})