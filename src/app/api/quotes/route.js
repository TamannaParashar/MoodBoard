import quotes from "./quoteFile.json";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const moodParam = searchParams.get("mood");
  const limit = parseInt(searchParams.get("limit")) || 10;
  const offset = parseInt(searchParams.get("offset")) || 0;

  // Validate mood
  if (!moodParam) {
    return new Response(
      JSON.stringify({ message: "Mood parameter is required." }),
      { status: 400 }
    );
  }

  const mood = moodParam.toLowerCase();

  if (!quotes[mood]) {
    return new Response(
      JSON.stringify({
        message: `Invalid mood. Available moods: ${Object.keys(quotes).join(", ")}`
      }),
      { status: 400 }
    );
  }

  const moodQuotes = quotes[mood];

  // Safe pagination
  const paginatedQuotes = moodQuotes.slice(offset, offset + limit);

  return new Response(JSON.stringify({
    mood,
    total: moodQuotes.length,
    count: paginatedQuotes.length,
    data: paginatedQuotes
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}