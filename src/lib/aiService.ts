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

//inspect analysis prop spread when migrating from lovable
//the JSON.stringify  is a hot fix to the object analysis being passed from lovable
const systemPrompt = (analysis: string): string => `
You are an expert crypto analyst assistant. 
Your role is to help the user analyze and understand details about a token. 
Here is the current analysis of the token they are viewing:

---
${analysis ? JSON.stringify(analysis) : "no analysis provided for current token"}
---

When answering:
- Always use the provided analysis as the main context. 
- If the user asks about the token, ground your answers in the analysis first before giving general market knowledge. 
- If something is not included in the analysis, state that clearly instead of making up information. 
- Keep responses clear, concise, and in a helpful explanatory tone. 
- Format your responses in Markdown for readability (lists, **bold**, *italics*, code blocks if needed).
`



type ChatHistory = {
	role: "model" | "user",
	content: string
}

export async function generateAIResponse(sessionId: string, message: string, analysis: string) {
	
	//get cached chat history
	const redis = await getRedisClient()
	
	
	let chatHistory: ChatHistory[] = [
		{
			role: "model",
			content: "Hello 👋 I can explain this token's trust analysis. Ask me anything about the security risks or patterns."
		}
	]
	
	console.log(sessionId)
	if(redis.isReady){
		//session id guard
		if(!sessionId){
			console.log("no session id. Investigate")
		}else if(sessionId){
			const res = await redis.get(sessionId)
				if(res){
					console.log(res)
					chatHistory = JSON.parse(res)
					console.log("cache hit")
				} else{
					console.log("cache miss")
				}
			}
	}
	
	//preparing for ai request
	console.log(systemPrompt(analysis))
	const generationConfig = {
		temperature: 1,
		topP: 0.95,
		topK: 64,
		maxOutputTokens: 2048,
		responseMimeType: "text/plain",
		systemInstruction: [systemPrompt(analysis)]
	};
	
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
	await redis.setEx(sessionId, 60 * 10, JSON.stringify(updatedHistory));

	return reply
}
