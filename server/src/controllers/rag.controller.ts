import { Request, Response } from 'express';
import { RagService } from '../services/rag.service';

export class RagController {
    static async uploadPdf(req: Request, res: Response) {
        const { userId } = req.body;
        const file = req.file;

        if (!userId || !file) {
            return res.status(400).json({ error: 'User ID and PDF file are required' });
        }

        try {
            const document = await RagService.processPdf(userId, file.originalname, file.path);
            res.status(200).json({ message: 'PDF processed successfully', document });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }

    static async query(req: Request, res: Response) {
        const { userId, query } = req.body;

        if (!userId || !query) {
            return res.status(400).json({ error: 'User ID and query are required' });
        }

        try {
            const result = await RagService.queryDocuments(userId, query);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
}
