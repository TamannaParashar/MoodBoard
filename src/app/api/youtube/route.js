import axios from "axios";

export async function GET(req) {
  const mood = req.nextUrl.searchParams.get("mood");
  const lang = req.nextUrl.searchParams.get("lang") || "english";
  const pageToken = req.nextUrl.searchParams.get("pageToken") || "";

  if (!mood) {
    return new Response(JSON.stringify({ error: "Mood is required" }), { status: 400 });
  }

  const ytApiKey = process.env.YT_API_KEY;
  if (!ytApiKey) {
    return new Response(JSON.stringify({ error: "YouTube API key not configured" }), { status: 500 });
  }

  try {
    const langToParams = (selectedLang) => {
      switch (selectedLang.toLowerCase()) {
        case "english": return { prefix: "English", code: "en", region: "US" };
        case "hindi": return { prefix: "Hindi", code: "hi", region: "IN" };
        case "haryanvi": return { prefix: "Haryanvi", code: "hi", region: "IN" };
        case "punjabi": return { prefix: "Punjabi", code: "pa", region: "IN" };
        case "bhojpuri": return { prefix: "Bhojpuri", code: "hi", region: "IN" }; // using hi for bhojpuri region relevance
        default: return { prefix: selectedLang, code: "en", region: "US" };
      }
    };
    
    const langOptions = langToParams(lang);
    
    // By quoting the language prefix, we force YouTube to heavily weight that exact word.
    const query = `"${langOptions.prefix}" ${mood} songs`;
    
    // Search for music videos based on mood and strict language parameters
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&maxResults=12&key=${ytApiKey}&regionCode=${langOptions.region}&relevanceLanguage=${langOptions.code}`;
    
    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }

    const searchResponse = await axios.get(url);

    // Map tracks
    const tracks = (searchResponse.data.items || []).map((item) => ({
      id: item.id.videoId,
      name: item.snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&"),
      artist: item.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      album: "YouTube",
      albumImageUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url || null,
    }));

    return new Response(JSON.stringify({ 
      tracks,
      nextPageToken: searchResponse.data.nextPageToken || ""
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("YouTube API Error:", error?.response?.data || error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch songs" }), { status: 500 });
  }
}
