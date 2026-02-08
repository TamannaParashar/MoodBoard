import mongoose from "mongoose"
const url = process.env.MONGO_URL
mongoose.connect(url);
const db = mongoose.connection
db.on("connected",()=>{
    console.log("Connected to MongoDB");
})
db.on("disconnected",()=>{
    console.log("Disconnected from MongoDB");
})