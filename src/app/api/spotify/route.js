import axios from "axios";

export async function GET(req) {
  const mood = req.nextUrl.searchParams.get("mood");
  const lang = req.nextUrl.searchParams.get("lang")||"english"
  if (!mood) {
    return new Response(JSON.stringify({error:"Mood is required" }),{status: 400,});
  }

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  try {
    const tokenResponse = await axios.post("https://accounts.spotify.com/api/token","grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;

    // 2. Search for tracks based on mood
    const query = `${mood} ${lang}`;
    const searchResponse = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // 3. Map tracks
    const tracks =
      searchResponse.data.tracks?.items.map((track) => ({
        name: track.name,
        artist: track.artists.map((a) => a.name).join(", "),
        url: track.external_urls.spotify,
        album: track.album.name,
        albumImageUrl: track.album.images[0]?.url || null,

      })) || [];

    return new Response(JSON.stringify({ tracks }), {
      status: 200,
      headers: {"Content-Type": "application/json"},
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({error:"Failed to fetch songs" }),{status: 500,});
  }
}