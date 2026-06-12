import { Router } from 'express';
import {
  syncRepositories,
  getRepositories,
  getRepository,
  analyzeRepo,
} from '../controllers/repoController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/sync', syncRepositories);
router.get('/', getRepositories);
router.get('/:id', getRepository);
router.get('/:id/analyze', analyzeRepo);

export default router;
