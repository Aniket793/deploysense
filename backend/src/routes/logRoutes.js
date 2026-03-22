import { Router } from 'express';
import { getLogs } from '../controllers/pipelineController.js';

const router = Router();

router.get('/:pipelineId', getLogs);

export default router;