import "@/app/utils/db"
import Mood from "@/app/model/mood"

export async function GET(req){
    const id = Number(req.nextUrl.searchParams.get("userId"));
    const user = await Mood.findOne({userId:id});
    if(!user){
        return new Response(JSON.stringify({exists:false}),{status:404});
    }
    return new Response(JSON.stringify({exists:true}),{status:200});
}