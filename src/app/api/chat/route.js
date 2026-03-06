import { GoogleGenerativeAI } from "@google/generative-ai";
import lessons from "../chat/lessons.json" assert {type: "json"};

export async function POST(req) {
  const { text, conversation } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a warm, friendly, and empathetic human avatar talking to someone over a realtime video call.
Here is the conversation so far:
${conversation.map(m => `${m.sender}: ${m.text}`).join("\n")}
The user just said: "${text}".

Additionally, here is some context information about the user in JSON format:
${JSON.stringify(lessons)}

Write a response that sounds like a genuine friend speaking out loud over a video call. 
CRITICAL Rule: Since this is being read by a Text-to-Speech Avatar, keep your answers VERY short and conversational (1 to 3 sentences max). Do not use emojis, bullet points, or markdown formatting, as the text-to-speech engine cannot read them.

Adapt your tone according to the mood conveyed by the user:
- Sad/stressed: Show empathy and kindness. Example: "I really hear you. That must be tough."
- Happy/excited: Match their joy. Example: "That's fantastic! I'm really happy for you!"
- Angry/frustrated: Stay calm and understanding. Example: "I get why you're upset. It's totally natural to feel that way."

Always respond in a natural, human, conversational tone.
`;

  const result = await model.generateContent(prompt);
  const reply = await result.response.text();

  return Response.json({ responseText: reply });
}