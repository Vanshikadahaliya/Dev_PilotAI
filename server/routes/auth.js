import { Router } from 'express';
import {
  githubAuth,
  githubCallback,
  githubAuthMobile,
  getMe,
  upgradePlan,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/github', githubAuth);
router.get('/github/callback', githubCallback);
router.post('/github', githubAuthMobile);
router.get('/me', protect, getMe);
router.post('/upgrade', protect, upgradePlan);

export default router;
