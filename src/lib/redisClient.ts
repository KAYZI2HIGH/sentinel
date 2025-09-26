//TODO: Setup Redis
/*
import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});
*/

import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null

export const getRedisClient = async () => {
	if(!redisClient){
		if(!process.env.REDIS_URL){
			throw new Error("Must define Redis Url")
		}
		redisClient = createClient({
			url: process.env.REDIS_URL
		})
		redisClient.on('error', err => console.log('Redis Client Error', err));
		await redisClient.connect();
	}
	return redisClient
}