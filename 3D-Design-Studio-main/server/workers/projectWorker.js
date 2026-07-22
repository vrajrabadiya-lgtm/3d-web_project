import { Worker } from 'bullmq';
import connection from '../queue/connection.js';
import { projectQueueName } from '../queue/projectQueue.js';
import Project from '../models/Project.js';

// Simulated delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to log and append to MongoDB
const logToProject = async (projectId, stage, message) => {
  const logEntry = { stage, message, timestamp: new Date() };
  await Project.findByIdAndUpdate(projectId, {
    $push: { logs: logEntry }
  });
  console.log(`[Worker] Project ${projectId} - [${stage}] ${message}`);
};

const planningStage = async (projectId, job) => {
  await Project.findByIdAndUpdate(projectId, { status: 'PLANNING', progress: 10 });
  await logToProject(projectId, 'PLANNING', 'Starting planning phase...');
  await delay(2000); // Simulate processing

  const dummyPlanning = {
    theme: "Cyberpunk",
    primaryColor: "#00FFFF",
    font: "Inter"
  };

  await Project.findByIdAndUpdate(projectId, {
    planning: dummyPlanning,
    progress: 25
  });
  await logToProject(projectId, 'PLANNING', 'Planning completed successfully.');
};

const assetGenerationStage = async (projectId, job) => {
  await Project.findByIdAndUpdate(projectId, { status: 'ASSET_GENERATION', progress: 30 });
  await logToProject(projectId, 'ASSET_GENERATION', 'Generating 3D assets...');
  await delay(2000); // Simulate processing

  const dummyAssets = [
    "placeholder-model.glb"
  ];

  await Project.findByIdAndUpdate(projectId, {
    assets: dummyAssets,
    progress: 50
  });
  await logToProject(projectId, 'ASSET_GENERATION', 'Assets generated successfully.');
};
const codeGenerationStage = async (projectId, job) => {
  await Project.findByIdAndUpdate(projectId, {
    status: 'CODE_GENERATION',
    progress: 60
  });

  await logToProject(
    projectId,
    'CODE_GENERATION',
    'Generating application code...'
  );

  await delay(2000);

  const dummyCode = {
    framework: "React",
    styling: "Tailwind"
  };

  await Project.findByIdAndUpdate(projectId, {
    generatedCode: dummyCode,
    progress: 75
  });

  await logToProject(
    projectId,
    'CODE_GENERATION',
    'Code generation completed successfully.'
  );
};
const assemblyStage = async (projectId, job) => {
  await Project.findByIdAndUpdate(projectId, { status: 'ASSEMBLING', progress: 80 });
  await logToProject(projectId, 'ASSEMBLING', 'Assembling final project...');
  await delay(2000); // Simulate processing


  await Project.findByIdAndUpdate(projectId, {
    'metadata.buildStatus': 'SUCCESS',
    progress: 95
  });
  await logToProject(projectId, 'ASSEMBLING', 'Project assembled successfully.');
};

const worker = new Worker(
  projectQueueName,
  async (job) => {
    const { projectId } = job.data;

    try {
      console.log(`[Worker] Job ${job.id}: Starting AI pipeline for project ${projectId}`);

      await planningStage(projectId, job);
      await assetGenerationStage(projectId, job);
      await codeGenerationStage(projectId, job);
      await assemblyStage(projectId, job);

      // Mark as COMPLETED
      await Project.findByIdAndUpdate(projectId, {
        status: 'COMPLETED',
        progress: 100
      });
      await logToProject(projectId, 'COMPLETED', 'Pipeline finished successfully.');
      console.log(`[Worker] Job ${job.id}: Completed project ${projectId}`);
    } catch (error) {
      console.error(`[Worker] Job ${job.id}: Error processing project ${projectId}`, error);
      // Mark as FAILED on error
      if (projectId) {
        await Project.findByIdAndUpdate(projectId, {
          status: 'FAILED',
        });
        await logToProject(projectId, 'FAILED', `Pipeline failed: ${error.message}`);
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
