import { Redis } from 'ioredis';
import 'dotenv/config';

const redisOptions = {
  maxRetriesPerRequest: null,
};

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const connection = new Redis(REDIS_URL, redisOptions);

connection.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export default connection;
