// /app/api/updateConnection/route.js
import "@/app/utils/db";
import Mood from "@/app/model/mood";

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerUserIdStr = searchParams.get("ownerUserId");
    const connectionUserIdStr = searchParams.get("connectionUserId");

    const body = await req.json();
    const newName = body.name;

    if (!ownerUserIdStr || !connectionUserIdStr || newName === undefined) {
      return new Response(JSON.stringify({ message: "Missing required parameters" }), { status: 400 });
    }

    const ownerUserId = Number(ownerUserIdStr);
    const connectionUserId = Number(connectionUserIdStr);

    // Update connection name in owner's document
    const result = await Mood.findOneAndUpdate(
      { userId: ownerUserId, "connections.userId": connectionUserId },
      { $set: { "connections.$.name": newName } }
    );

    if (!result) {
      return new Response(JSON.stringify({ message: "Connection not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Connection renamed successfully" }), { status: 200 });
  } catch (err) {
    console.error("Error renaming connection:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
