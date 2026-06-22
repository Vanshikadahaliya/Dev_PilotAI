import { Router } from 'express';
import {
  githubAuth,
  githubCallback,
  githubAuthMobile,
  getMe,
  upgradePlan,
} from '../controllers/authController.js';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/github', githubAuth);
router.get('/github/callback', githubCallback);
router.post('/github', body('code').isString().notEmpty(), validateRequest, githubAuthMobile);
router.get('/me', protect, getMe);
router.post('/upgrade', protect, upgradePlan);

export default router;
