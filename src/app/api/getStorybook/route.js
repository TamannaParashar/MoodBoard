import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { mood } = await req.json();
    
    if (!mood) {
      return Response.json({ error: "Mood is required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Write an inspiring, 3-part empowering story for someone who is feeling ${mood}. 
Do NOT write vague poetry or generic motivational quotes.
Instead, tell a tangible, highly relatable story about a real person or a realistic everyday character overcoming a struggle. 
For example, if the mood is sad/down, tell a story about a relatable person (like 'Rahul') who faced a tough failure, a breakup, or a job loss and felt it was the end of the world, but slowly rebuilt his life. Or, use a real-life example like MS Dhoni or APJ Abdul Kalam overcoming massive setbacks.
Keep the language simple, engaging, and highly relatable to a normal person's everyday struggles.
For each of the 3 parts, provide the text of the story (2-3 sentences max) and a short 3-word image generation prompt describing the scene visually.
Respond EXACTLY in this JSON format without markdown code blocks:
{
  "story": [
    { "text": "Part 1 text...", "imagePrompt": "young man looking out window raining" },
    { "text": "Part 2 text...", "imagePrompt": "person working hard at desk" },
    { "text": "Part 3 text...", "imagePrompt": "person smiling looking at sunrise" }
  ]
}
`;

    const result = await model.generateContent(prompt);
    let reply = result.response.text().trim();
    
    // Clean up if it returned markdown codeblocks by accident
    if (reply.startsWith("\`\`\`json")) {
      reply = reply.replace(/^\`\`\`json/, "").replace(/\`\`\`$/, "").trim();
    } else if (reply.startsWith("\`\`\`")) {
      reply = reply.replace(/^\`\`\`/, "").replace(/\`\`\`$/, "").trim();
    }

    const jsonResponse = JSON.parse(reply);

    return Response.json(jsonResponse);
  } catch (error) {
    console.error("Storybook API Error:", error);
    return Response.json({ error: "Failed to generate storybook" }, { status: 500 });
  }
}
