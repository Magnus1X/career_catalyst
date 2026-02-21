import { Request, Response } from 'express';
import { TranscriptionService } from '../services/transcription.service';
import { AiService } from '../services/ai.service';

export class InterviewController {
    static async processInterviewAnswer(req: Request, res: Response) {
        const { question } = req.body;
        const file = req.file;

        if (!question || !file) {
            return res.status(400).json({ error: 'Question and audio file are required' });
        }

        try {
            // 1. Transcribe audio
            const transcription = await TranscriptionService.transcribeAudio(file.path);

            // 2. Evaluate answer
            const evaluation = await AiService.evaluateInterviewAnswer(question, transcription);

            res.status(200).json({
                transcription,
                evaluation,
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }

    static async getMockQuestions(req: Request, res: Response) {
        // Mock questions for now
        const questions = [
            'Explain the difference between a process and a thread.',
            'How does the Virtual DOM work in React?',
            'What is the time complexity of searching in a balanced binary search tree?',
            'Explain the concept of closures in JavaScript.',
        ];
        res.status(200).json(questions);
    }
}
