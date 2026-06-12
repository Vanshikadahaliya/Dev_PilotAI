import { Router } from 'express';
import {
  generateReadmeHandler,
  generateDescriptionHandler,
  generatePortfolioHandler,
  summarizePRHandler,
  explainBugHandler,
  getGenerations,
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.use(protect);
router.use(aiLimiter);

router.post('/generate-readme', generateReadmeHandler);
router.post('/generate-description', generateDescriptionHandler);
router.post('/generate-portfolio', generatePortfolioHandler);
router.post('/summarize-pr', summarizePRHandler);
router.post('/explain-bug', explainBugHandler);
router.get('/generations', getGenerations);

export default router;
