import { Request, Response } from 'express';
import { AiService } from '../services/ai.service';

export class CodeInsightsController {
    static async analyzeComplexity(req: Request, res: Response) {
        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({ error: 'Code and language are required' });
        }

        try {
            const analysis = await AiService.analyzeCodeComplexity(code, language);
            res.status(200).json(analysis);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }

    static async breakdownLogic(req: Request, res: Response) {
        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({ error: 'Code and language are required' });
        }

        try {
            const breakdown = await AiService.breakdownCodeLogic(code, language);
            res.status(200).json(breakdown);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
}
