import "@/app/utils/db"
import Mood from "@/app/model/mood";

export async function POST(req){
    const {userId,code} = await req.json();
    if (!userId || !code) {
        return new Response(JSON.stringify({message:"Missing userId or code"}),{status: 400});
    }

    const user = await Mood.findOne({userId});
    user.lifeLongCode = code;
    await user.save();
    return new Response(JSON.stringify({message:"Lifelong code stored"}),{status:200});
}