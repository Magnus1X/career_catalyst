import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

export class AiService {
    private static genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    private static model = AiService.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    static async generatePracticeRoadmap(handle: string, weakTopics: any[]) {
        const topicsList = weakTopics.map((t) => `${t.tag} (Failure Rate: ${t.failureRate})`).join(', ');

        const prompt = `
      User ${handle} has the following weak topics in competitive programming (Codeforces): ${topicsList}.
      Generate a personalized practice roadmap with specific study resources, problem types to practice, and a 2-week plan to improve these areas.
      Format the response as a JSON object with the following structure:
      {
        "overview": "...",
        "plan": [
          { "day": 1, "topic": "...", "tasks": ["..."], "resources": ["..."] },
          ...
        ],
        "tips": ["..."]
      }
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();

            // Basic JSON extraction from markdown if necessary
            if (text.includes('```json')) {
                text = text.split('```json')[1].split('```')[0].trim();
            } else if (text.includes('```')) {
                text = text.split('```')[1].split('```')[0].trim();
            }

            return JSON.parse(text);
        } catch (error: any) {
            console.error('Gemini AI Error:', error.message);
            throw new Error('Failed to generate roadmap: ' + error.message);
        }
    }
}
