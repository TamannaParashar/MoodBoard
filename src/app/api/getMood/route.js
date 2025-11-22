import "@/app/utils/db"
import Mood from "@/app/model/mood";

export async function GET(req){
    const id = req.nextUrl.searchParams.get("userId");
    const data = await Mood.find({userId:id});
    if(!data || data.length==0){
        return new Response(JSON.stringify({message:'No data found for this id'}),{status:400,headers:{"Content-Type":"application/json"}});
    }
    const moodCounts = {};
    data.forEach((r) => {
      moodCounts[r.mood] = (moodCounts[r.mood] || 0) + 1;
    });
    return new Response(JSON.stringify({moodCounts}),{status:200,headers:{"Content-Type":"application/json"}});
}