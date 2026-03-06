import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        // Google Translate TTS endpoint relies on URL parameters. It does not enforce CORS on S2S (Server-to-Server) requests
        // We proxy it through Next.js to bypass the browser's CORS block!
        const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;

        // Some free APIs might require a User-Agent to prevent 403s
        const ttsResponse = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!ttsResponse.ok) {
            return NextResponse.json(
                { error: `TTS Provider responded with status: ${ttsResponse.status}` },
                { status: ttsResponse.status }
            );
        }

        // Capture the raw audio binary buffer
        const arrayBuffer = await ttsResponse.arrayBuffer();

        // Forward the binary buffer to the frontend with the audio/mpeg content type
        return new NextResponse(arrayBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'no-store'
            }
        });

    } catch (error) {
        console.error("TTS Proxy Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
