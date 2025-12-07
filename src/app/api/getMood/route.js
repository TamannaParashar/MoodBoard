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

    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const lastThreeDaysData = await Mood.find({userId:id,date:{$gt:threeDaysAgo}});
    const mood3DayCounts = {};
    lastThreeDaysData.forEach((r) => {
        mood3DayCounts[r.mood] = (mood3DayCounts[r.mood] || 0) + 1;
    });
    let maxMood = null;
    let maxCount = 0;
    for(const [mood,cnt] of Object.entries(mood3DayCounts)){
      if(cnt > maxCount){
        maxCount = cnt;
        maxMood = mood;
      }
    }
    return new Response(JSON.stringify({moodCounts,maxMood,maxCount}),{status:200,headers:{"Content-Type":"application/json"}});
}