import { Router } from 'express';
import { getPipelines, getLogs } from '../controllers/pipelineController.js';

const router = Router();

router.get('/:repoId', getPipelines);
router.get('/logs/:pipelineId', getLogs);

export default router;