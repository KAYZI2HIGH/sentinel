import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null
let isConnecting: boolean = false

export const getRedisClient = async () => {
	if(redisClient){
		return redisClient
	}
		
	if(!process.env.REDIS_PASSWORD || !process.env.REDIS_HOST || !process.env.REDIS_PORT){
		throw new Error("Must define Redis credentials")
	}
	
	if(!redisClient){
		redisClient = createClient({
			username: 'default',
			password: process.env.REDIS_PASSWORD as string,
			socket: {
				host: process.env.REDIS_HOST as string,
				port: Number(process.env.REDIS_PORT),
			}
		});
		redisClient.on('error', err => console.log('Redis Client Error', err));
	}
	
	if(!redisClient.isOpen && !isConnecting){
		isConnecting = true
		await redisClient.connect()
		isConnecting = false
		console.log("🔗 Redis connected")
	}
	
		
	return redisClient
}