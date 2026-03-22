import prisma from '../config/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { simulateRepo } from './pipelineSimulator.js';

export async function createRepo({ name, url }) {
  if (!name || !name.trim()) {
    throw new AppError('Repository name is required', 400);
  }
  if (!url || !url.trim()) {
    throw new AppError('Repository URL is required', 400);
  }

  const repo = await prisma.repo.create({
    data: {
      name: name.trim(),
      url: url.trim(),
    },
  });

  // Non-blocking — user gets response immediately
  // Simulator runs in the background
  simulateRepo(repo.id, repo.name).catch(err =>
    console.error('[SIMULATOR] Failed for repo', repo.id, err.message)
  );

  return repo;
}

export async function getAllRepos() {
  return prisma.repo.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteRepo(id) {
  await prisma.repo.delete({
    where: { id },
  });
}