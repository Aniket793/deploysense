import prisma from '../config/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getPipelinesByRepo(repoId) {
  // Verify repo exists first
  const repo = await prisma.repo.findUnique({ where: { id: repoId } });
  if (!repo) throw new AppError('Repository not found', 404);

  return prisma.pipeline.findMany({
    where: { repoId },
    orderBy: { timestamp: 'desc' },
  });
}

export async function getLogByPipeline(pipelineId) {
  const log = await prisma.log.findUnique({
    where: { pipelineId },
  });
  if (!log) throw new AppError('Log not found', 404);

  return log;
}