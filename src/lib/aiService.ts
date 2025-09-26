import { getRedisClient } from "./redisClient";
import {GoogleGenAI} from '@google/genai';
import { retryRequest } from "@/lib/utils"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

//provisional: e.g if it causes app to break
if(!GEMINI_API_KEY){
	throw new Error("Must Provide API Key")
}

const genAI = new GoogleGenAI({apiKey: GEMINI_API_KEY});

const GEMINI_MODEL = "gemini-2.0-flash";

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 2048,
    responseMimeType: "text/plain",
};

type ChatHistory = {
	role: string,
	content: string.
}

export async function generateAIResponse(sessionId: string, message: string) {
	
	//get cached chat history
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
	
	//initialize chat and get response
	const chat = genAI.chats.create({
		model: GEMINI_MODEL,
		history: formattedHistory,
	})

	const response = await retryRequest<>(()=>chat.sendMessage({ message: message }))
	const reply = response.text

	const updatedHistory = [
		...chatHistory,
		{ role: "user", content: message },
		{ role: "assistant", content: reply },
	];
	await redis.setEx(sessionId, 15, JSON.stringify(updatedHistory));

	return reply
}
