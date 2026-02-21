import { Request, Response } from 'express';
import { CodeforcesService } from '../services/codeforces.service';

export class CPTrackerController {
    static async getInsights(req: Request, res: Response) {
        const { handle } = req.params;

        if (!handle) {
            return res.status(400).json({ error: 'Codeforces handle is required' });
        }

        try {
            const submissions = await CodeforcesService.getUserSubmissions(handle);

            // Analyze weak topics based on failed submissions (non-OK verdict)
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

            // Filter for weak topics (e.g., failed > 30% and total > 5)
            const weakTopics = Object.entries(topicStats)
                .filter(([_, stats]) => stats.total > 5 && (stats.failed / stats.total) > 0.3)
                .map(([tag, stats]) => ({
                    tag,
                    failureRate: (stats.failed / stats.total).toFixed(2),
                    total: stats.total,
                }))
                .sort((a, b) => parseFloat(b.failureRate) - parseFloat(a.failureRate));

            res.status(200).json({
                handle,
                weakTopics,
                totalSubmissionsChecked: submissions.length,
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }

    static async getUserInfo(req: Request, res: Response) {
        const { handle } = req.params;

        try {
            const userInfo = await CodeforcesService.getUserInfo(handle);
            res.status(200).json(userInfo);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
}
