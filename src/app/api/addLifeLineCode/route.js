import "@/app/utils/db";
import Mood from "@/app/model/mood";

export async function POST(req) {
  try {
    const {userId, connection} = await req.json();

    if (!userId || !connection?.userId) {
      return new Response(JSON.stringify({message:"Invalid data"}),{status:400});
    }
    const updatedOwner = await Mood.findOneAndUpdate(
      {userId:userId},
      {$push:{connections:connection}}, 
      {new:true,upsert:true}
    );
    const updatedConnection = await Mood.findOneAndUpdate(
      {userId:connection.userId},
      {$push:{connections: { userId: userId, name: connection.name || "" }}}, 
      {new:true,upsert:true}
    );

    return new Response(JSON.stringify({message:"LifeLine added successfully",updatedOwner,updatedConnection}),{status:200});
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({message:"Something went wrong"}),{status:500});
  }
}
