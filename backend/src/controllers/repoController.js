import * as repoService from '../services/repoService.js';

export const createRepo = async (req, res, next) => {
  try {
    const { name, url } = req.body;
    const repo = await repoService.createRepo({ name, url });
    res.status(201).json({ success: true, data: repo });
  } catch (err) {
    next(err);
  }
};

export const getAllRepos = async (req, res, next) => {
  try {
    const repos = await repoService.getAllRepos();
    res.json({ success: true, data: repos });
  } catch (err) {
    next(err);
  }
};

export const deleteRepo = async (req, res, next) => {
  try {
    const { id } = req.params;
    await repoService.deleteRepo(id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};