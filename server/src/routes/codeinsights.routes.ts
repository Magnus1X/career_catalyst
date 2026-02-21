import { Router } from 'express';
import { CodeInsightsController } from '../controllers/codeinsights.controller';

const router = Router();

router.post('/analyze-complexity', CodeInsightsController.analyzeComplexity);
router.post('/breakdown-logic', CodeInsightsController.breakdownLogic);

export default router;
