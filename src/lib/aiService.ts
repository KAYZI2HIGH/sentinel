import { getRedisClient } from "./redisClient";
import {GoogleGenAI} from '@google/genai';
import { retryRequest } from "@/lib/utils"
import type { GenerateContentResponse } from "@google/genai";

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
	content: string
}

export async function generateAIResponse(sessionId: string, message: string) {
	
	//get cached chat history
	const redis = await getRedisClient()
	
	let chatHistory: ChatHistory[] = []
	
	if(redis.isReady){
		const res = await redis.get(sessionId)
		if(res){
			chatHistory = JSON.parse(res)
			//console.log(chatHistory)
			console.log("cache hit")
		} else{
			console.log("cache miss")
		}
		
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
		config: generationConfig,
	})

	const response = await retryRequest<GenerateContentResponse>(()=>chat.sendMessage({ message: message }))
	const reply = response.text

	const updatedHistory = [
		...chatHistory,
		{ role: "user", content: message },
		{ role: "model", content: reply },
	];
	//console.log(updatedHistory)
	await redis.setEx(sessionId, 60 * 30, JSON.stringify(updatedHistory));

	return reply
}
