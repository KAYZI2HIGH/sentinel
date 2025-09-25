//import { redis } from "./redisClient";
import {GoogleGenAI} from '@google/genai';
import { retryRequest } from "@/lib/utils"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

//provisional: e.g if it causes app to break
if(!GEMINI_API_KEY){
	throw new Error("Must Provide API Key")
}

const genAI = new GoogleGenAI({apiKey: GEMINI_API_KEY});

const GEMINI_MODEL = "gemini-1.5-flash";

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export async function generateAIResponse(sessionId: string, message: string) {
  const history: any[] = (await redis.get(sessionId)) || [];

  // Format for Gemini
  const formattedHistory = history.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({ history: formattedHistory });

  const { response } = retryRequest<>(()=>chat.sendMessage(message))

  const updatedHistory = [
    ...history,
    { role: "user", content: message },
    { role: "assistant", content: reply },
  ];
  //await redis.set(sessionId, JSON.stringify(updatedHistory));

  return response.text()
}
