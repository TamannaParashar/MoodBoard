import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { mood } = await req.json();

    if (!mood) {
      return Response.json({ error: "Mood is required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const MOOD_HEROES = {
      happy: [
        { name: "MS Dhoni", image: "/assets/dhoni.webp" },
        { name: "Usain Bolt", image: "/assets/bolt.webp" },
        { name: "Albert Einstein", image: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Albert_Einstein_Head.jpg" }
      ],
      sad: [
        { name: "Nelson Mandela", image: "https://upload.wikimedia.org/wikipedia/commons/0/02/Nelson_Mandela_1994.jpg" },
        { name: "Abraham Lincoln", image: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg" },
        { name: "Helen Keller", image: "/assets/hellen.webp" }
      ],
      angry: [
        { name: "Mahatma Gandhi", image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg" },
        { name: "Mother Teresa", image: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Mother_Teresa_1.jpg" }
      ],
      fearful: [
        { name: "Malala Yousafzai", image: "/assets/malala.webp" },
        { name: "Rosa Parks", image: "/assets/rosa.webp" },
        { name: "Martin Luther King Jr.", image: "https://upload.wikimedia.org/wikipedia/commons/0/05/Martin_Luther_King%2C_Jr..jpg" }
      ],
      disgusted: [
        { name: "Florence Nightingale", image: "/assets/florence.webp" },
        { name: "Bhagat Singh", image: "/assets/bhagat_singh.webp" }
      ],
      surprised: [
        { name: "Steve Jobs", image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Steve_Jobs_Headshot_2010-CROP2.jpg" },
        { name: "Alexander Fleming", image: "/assets/alexander.webp" }
      ],
      neutral: [
        { name: "APJ Abdul Kalam", image: "/assets/kalam.webp" },
        { name: "Marie Curie", image: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Marie_Curie_c._1920s.jpg" }
      ]
    };

    // Fallback to 'neutral' if the mood is somehow unrecognized in the list
    const category = MOOD_HEROES[mood] || MOOD_HEROES.neutral;
    const hero = category[Math.floor(Math.random() * category.length)];

    const prompt = `
Write an inspiring, 5-part true story from the real world for someone who is feeling ${mood}. 
The story MUST be exactly about the famous figure: ${hero.name}.
Tell their actual true story of overcoming a massive struggle, failure, or setback to achieve greatness.
Keep the language simple, engaging, and highly relatable. The story must feel deeply motivating for real.
For each of the 5 parts, provide the text of the story (2-3 sentences max).
Respond EXACTLY in this JSON format without markdown code blocks:
{
  "heroName": "${hero.name}",
  "heroImage": "${hero.image}",
  "story": [
    { "text": "Part 1 text..." },
    { "text": "Part 2 text..." },
    { "text": "Part 3 text..." },
    { "text": "Part 4 text..." },
    { "text": "Part 5 text..." }
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
