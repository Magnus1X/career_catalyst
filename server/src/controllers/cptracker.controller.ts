import { Request, Response } from 'express';
import { CodeforcesService } from '../services/codeforces.service';
import { AiService } from '../services/ai.service';

export class CPTrackerController {
    private static async analyzeWeakTopics(handle: string) {
        try {
            const submissions = await CodeforcesService.getUserSubmissions(handle);
            const topicStats: Record<string, { total: number; failed: number }> = {};

            submissions.forEach((sub) => {
                sub.problem.tags.forEach((tag) => {
                    if (!topicStats[tag]) {
                        topicStats[tag] = { total: 0, failed: 0 };
                    }
                    topicStats[tag].total++;
                    if (sub.verdict !== 'OK') {
                        topicStats[tag].failed++;
                    }
                });
            });

            return Object.entries(topicStats)
                .filter(([_, stats]) => stats.total > 5 && (stats.failed / stats.total) > 0.3)
                .map(([tag, stats]) => ({
                    tag,
                    failureRate: (stats.failed / stats.total).toFixed(2),
                    total: stats.total,
                }))
                .sort((a, b) => parseFloat(b.failureRate) - parseFloat(a.failureRate));
        } catch (error: any) {
            console.error('Error analyzing weak topics:', error.message);
            throw error;
        }
    }

    static async getInsights(req: Request, res: Response) {
        const handle = req.params.handle as string;
        if (!handle) return res.status(400).json({ error: 'Handle is required' });

        try {
            const weakTopics = await CPTrackerController.analyzeWeakTopics(handle);
            res.status(200).json({ handle, weakTopics });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }

    static async getRoadmap(req: Request, res: Response) {
        const handle = req.params.handle as string;
        if (!handle) return res.status(400).json({ error: 'Handle is required' });

        try {
            const weakTopics = await CPTrackerController.analyzeWeakTopics(handle);
            const roadmap = await AiService.generatePracticeRoadmap(handle, weakTopics);
            res.status(200).json({ handle, weakTopics, roadmap });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }

    static async getUserInfo(req: Request, res: Response) {
        const handle = req.params.handle as string;
        if (!handle) return res.status(400).json({ error: 'Handle is required' });

        try {
            const userInfo = await CodeforcesService.getUserInfo(handle);
            res.status(200).json(userInfo);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
}
