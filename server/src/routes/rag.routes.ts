import { Router } from 'express';
import { RagController } from '../controllers/rag.controller';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/upload', upload.single('pdf'), RagController.uploadPdf);
router.post('/query', RagController.query);

export default router;
