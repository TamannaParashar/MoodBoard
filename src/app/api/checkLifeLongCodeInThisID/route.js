import Mood from "@/app/model/mood";
import "@/app/utils/db"

export async function GET(req){
    const id = req.nextUrl.searchParams.get("userId");
    if (!id) {
        return new Response(JSON.stringify({message:"Missing userId"}),{status:400});
    }
    const data = await Mood.findOne({userId:id})
    if(!data){
        return new Response(JSON.stringify({message:'User not found'}),{status:404});
    }
    if(data.lifeLongCode){
        return new Response(JSON.stringify({exists:true,code:data.lifeLongCode}),{status:200});
    }
    return new Response(JSON.stringify({exists:false}),{status:200});
}