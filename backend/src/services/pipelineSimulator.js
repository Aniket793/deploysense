import prisma from '../config/prisma.js';

const STATUS_POOL = ['success', 'success', 'success', 'failed', 'running', 'success'];

const FAILURE_MESSAGES = [
  `[ERROR] Test failed: Cannot find module 'react-router-dom'`,
  `[ERROR] TypeError: Cannot read properties of undefined (reading 'map')`,
  `[ERROR] Build failed: SyntaxError in src/components/Dashboard.jsx:42`,
  `[ERROR] Docker build failed: COPY failed: file not found in build context`,
];

function randomDuration() {
  return Math.floor(Math.random() * (180 - 45 + 1)) + 45;
}

function daysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function generateLog(repoName, status, duration) {
  const base = [
    `[INFO]  Pipeline started for: ${repoName}`,
    `[INFO]  Cloning repository...`,
    `[INFO]  Checkout branch: main`,
    `[INFO]  Installing dependencies... (npm ci)`,
    `[INFO]  Dependency installation complete.`,
    `[INFO]  Running ESLint checks...`,
    `[INFO]  No lint errors found.`,
    `[INFO]  Running test suite...`,
  ];

  if (status === 'failed') {
    const errorMsg = FAILURE_MESSAGES[Math.floor(Math.random() * FAILURE_MESSAGES.length)];
    return [
      ...base,
      errorMsg,
      `[ERROR] at Object.<anonymous> (/app/src/App.jsx:3:1)`,
      `[INFO]  Test suite: 12 passed, 1 failed`,
      `[ERROR] Pipeline failed after ${duration}s`,
    ].join('\n');
  }

  if (status === 'running') {
    return [
      ...base,
      `[INFO]  Test suite running... (12/14 complete)`,
      `[INFO]  Building Docker image...`,
      `[INFO]  Pipeline in progress...`,
    ].join('\n');
  }

  return [
    ...base,
    `[INFO]  Test suite: 14 passed, 0 failed`,
    `[INFO]  Building application...`,
    `[INFO]  Build output: dist/ (1.2MB)`,
    `[INFO]  Building Docker image...`,
    `[INFO]  Docker image tagged: deploysense-app:latest`,
    `[INFO]  Pushing image to registry...`,
    `[SUCCESS] Pipeline completed in ${duration}s`,
  ].join('\n');
}

export async function simulateRepo(repoId, repoName) {
  for (let i = 0; i < STATUS_POOL.length; i++) {
    const status = STATUS_POOL[i];
    const duration = status === 'running' ? null : randomDuration();
    const timestamp = daysAgo(Math.floor((i / STATUS_POOL.length) * 7));

    const pipeline = await prisma.pipeline.create({
      data: { repoId, status, timestamp, duration }
    });

    await prisma.log.create({
      data: {
        pipelineId: pipeline.id,
        content: generateLog(repoName, status, duration)
      }
    });
  }
}