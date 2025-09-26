import type { NextRequest, NextResponse } from 'next/server'
import { generateAIResponse } from "@/lib/aiService"
 
export async function POST(request: NextRequest, { params }) {
	try{
		const { sessionId, message } = request.body
		
		const reply = await generateAIResponse(sessionId, message)
		
		return NextResponse.json({ reply }, { status: 200 })
	}catch(error){
		console.log(error)
		return NextResponse.json({ "error":error }, { status: 500 })
	}
}

/*
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  // Specifies the maximum allowed duration for this function to execute (in seconds)
  maxDuration: 7,
  */