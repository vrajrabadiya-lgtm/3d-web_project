import { Queue } from 'bullmq';
import connection from './connection.js';

export const projectQueueName = 'ProjectQueue';

export const projectQueue = new Queue(projectQueueName, { connection });
