// /app/api/getConnections/route.js
import "@/app/utils/db";
import Mood from "@/app/model/mood";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ message: "Missing userId" }), { status: 400 });
  }

  try {
    const user = await Mood.findOne({ userId });
    if (!user) return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });

    return new Response(JSON.stringify({ connections: user.connections || [] }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
