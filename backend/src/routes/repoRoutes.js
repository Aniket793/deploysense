import { Router } from 'express';
import * as repoController from '../controllers/repoController.js';

const router = Router();

router.post('/',     repoController.createRepo);
router.get('/',      repoController.getAllRepos);
router.delete('/:id', repoController.deleteRepo);

export default router;