import OpenAI from 'openai';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class TranscriptionService {
    static async transcribeAudio(filePath: string): Promise<string> {
        try {
            const transcription = await openai.audio.transcriptions.create({
                file: fs.createReadStream(filePath),
                model: 'whisper-1',
            });

            return transcription.text;
        } catch (error: any) {
            console.error('OpenAI Transcription Error:', error.message);
            throw new Error('Failed to transcribe audio: ' + error.message);
        } finally {
            // Clean up the temporary file
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
    }
}
