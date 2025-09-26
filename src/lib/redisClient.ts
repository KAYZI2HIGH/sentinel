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
	console.log(process.env.REDIS_URL)
	if(!redisClient){
		if(!process.env.REDIS_URL){
			throw new Error("Must define Redis Url")
		}
		redisClient = createClient({
			username: 'default',
			password: 'Zv8TkvrzXEjG1rVJRRLmRDEiqk0WW3e4',
			socket: {
				host: 'redis-15002.c124.us-central1-1.gce.redns.redis-cloud.com',
				port: 15002
			}
		});
		redisClient.on('error', err => console.log('Redis Client Error', err));
		await redisClient.connect();
	}
	return redisClient
}