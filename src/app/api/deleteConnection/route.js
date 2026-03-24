// /app/api/deleteConnection/route.js
import "@/app/utils/db";
import Mood from "@/app/model/mood";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerUserIdStr = searchParams.get("ownerUserId");
    const connectionUserIdStr = searchParams.get("connectionUserId");

    if (!ownerUserIdStr || !connectionUserIdStr) {
      return new Response(JSON.stringify({ message: "Missing required parameters" }), { status: 400 });
    }

    const ownerUserId = Number(ownerUserIdStr);
    const connectionUserId = Number(connectionUserIdStr);

    // Remove from owner
    await Mood.findOneAndUpdate(
      { userId: ownerUserId },
      { $pull: { connections: { userId: connectionUserId } } }
    );

    // Remove from connection as well so it's a mutual delete
    await Mood.findOneAndUpdate(
      { userId: connectionUserId },
      { $pull: { connections: { userId: ownerUserId } } }
    );

    return new Response(JSON.stringify({ message: "Connection deleted successfully" }), { status: 200 });
  } catch (err) {
    console.error("Error deleting connection:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
