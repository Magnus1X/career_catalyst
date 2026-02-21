import { Router } from 'express';
import { InterviewController } from '../controllers/interview.controller';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/process-answer', upload.single('audio'), InterviewController.processInterviewAnswer);
router.get('/questions', InterviewController.getMockQuestions);

export default router;
