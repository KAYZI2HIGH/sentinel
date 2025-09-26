import { getRedisClient } from "./redisClient";
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

type ChatHistory = {
	role: string,
	content: string.
}

export async function generateAIResponse(sessionId: string, message: string) {
	let redis = await getRedisClient()
	
	let chatHistory: ChatHistory[] | []
	
	if(redis.isReady){
		chatHistory = JSON.parse(redis.get(sessionId))
	}
	
	if(!chatHistory){
		chatHistory = []
		console.log("Cache miss")
	} else{
		console.log("Cache Hit")
	}
	
	const formattedHistory = chatHistory.map((message) => (
		{
			role: message.role,
			parts: [{ text: message.content }]
		}
	))
	
	const chat = model.startChat({ history: formattedHistory });

	const response = await retryRequest<>(()=>chat.sendMessage(message))
	const reply = response.response.text()

	const updatedHistory = [
		...chatHistory,
		{ role: "user", content: message },
		{ role: "assistant", content: reply },
	];
	await redis.setEx(sessionId, 15, JSON.stringify(updatedHistory));

	return reply
}
