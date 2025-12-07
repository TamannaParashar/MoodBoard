import "@/app/utils/db";
import Mood from "@/app/model/mood";

export async function GET(req) {
  const code = req.nextUrl.searchParams.get("lifeLongCode");

  const user = await Mood.findOne({lifeLongCode:code});

  if (!user) {
    return new Response(JSON.stringify({exists:false}),{status:200});
  }

  return new Response(JSON.stringify({exists:true,ownerUserId:user.userId}),{status:200});
}