import { getPipelinesByRepo, getLogByPipeline } from '../services/pipelineService.js';

export const getPipelines = async (req, res, next) => {
  try {
    const { repoId } = req.params;
    const pipelines = await getPipelinesByRepo(repoId);
    res.json({ success: true, data: pipelines });
  } catch (err) {
    next(err);
  }
};

export const getLogs = async (req, res, next) => {
  try {
    const { pipelineId } = req.params;
    const log = await getLogByPipeline(pipelineId);
    res.json({ success: true, data: log });
  } catch (err) {
    next(err);
  }
};