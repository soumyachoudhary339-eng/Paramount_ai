import express from 'express';
import {
  getRoadmap,
  updateMilestoneStatus,
  createOrUpdateRoadmap,
} from '../controllers/roadmap.controller.js';

import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();



router.get('/get',authMiddleware, getRoadmap);
router.post('/create', authMiddleware,createOrUpdateRoadmap);
router.patch('/milestones/:milestoneId/status',authMiddleware, updateMilestoneStatus);

export default router;