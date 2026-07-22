import { Worker } from 'bullmq';
import connection from '../queue/connection.js';
import { projectQueueName } from '../queue/projectQueue.js';
import Project from '../models/Project.js';

// Simulated delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const worker = new Worker(
  projectQueueName,
  async (job) => {
    const { projectId } = job.data;

    try {
      // 1. Update status to PROCESSING
      await Project.findByIdAndUpdate(projectId, {
        status: 'PROCESSING',
      });
      console.log(`[Worker] Job ${job.id}: Processing project ${projectId}`);

      // 2. Simulate progress
      const progressSteps = [25, 50, 75, 100];
      for (const progress of progressSteps) {
        await delay(2000); // 2 second delay per step
        await Project.findByIdAndUpdate(projectId, { progress });
        console.log(`[Worker] Job ${job.id}: Project ${projectId} progress ${progress}%`);
      }

      // 3. Mark as COMPLETED
      await Project.findByIdAndUpdate(projectId, {
        status: 'COMPLETED',
      });
      console.log(`[Worker] Job ${job.id}: Completed project ${projectId}`);
    } catch (error) {
      console.error(`[Worker] Job ${job.id}: Error processing project ${projectId}`, error);
      // Mark as FAILED on error
      if (projectId) {
        await Project.findByIdAndUpdate(projectId, {
          status: 'FAILED',
        });
      }
      throw error;
    }
  },
  { connection }
);

worker.on('failed', (job, err) => {
  console.error(`[Worker] Failed for job ${job?.id}:`, err);
});

export default worker;
