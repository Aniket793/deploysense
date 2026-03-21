import prisma from '../config/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export async function createRepo({ name, url }) {
  // Validate inputs
  if (!name || !name.trim()) {
    throw new AppError('Repository name is required', 400);
  }
  if (!url || !url.trim()) {
    throw new AppError('Repository URL is required', 400);
  }

  // Create repo — Prisma will throw P2002 if URL already exists
  const repo = await prisma.repo.create({
    data: {
      name: name.trim(),
      url: url.trim(),
    },
  });

  return repo;
}

export async function getAllRepos() {
  const repos = await prisma.repo.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return repos;
}

export async function deleteRepo(id) {
  // Prisma will throw P2025 if repo doesn't exist
  // onDelete: Cascade handles pipelines + logs automatically
  await prisma.repo.delete({
    where: { id },
  });
}