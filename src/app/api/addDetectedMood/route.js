import "@/app/utils/db"
import Mood from "@/app/model/mood";

export async function POST(req){
    try{
        const data = await req.json();
        const detectedMood = new Mood(data);
        detectedMood.save();
        return new Response(JSON.stringify({message:"Mood has been saved"}),{status:201});
    }catch{
        return new Response(JSON.stringify({message:"Some error occured"}),{status:400});
    }
}