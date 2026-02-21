import { Router } from 'express';
import { CPTrackerController } from '../controllers/cptracker.controller';

const router = Router();

router.get('/insights/:handle', CPTrackerController.getInsights);
router.get('/user/:handle', CPTrackerController.getUserInfo);

export default router;
